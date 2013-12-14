package info.tubecheck.server

import com.twitter.finatra._
import com.twitter.finagle._
import com.twitter.finagle.builder._
import com.twitter.finagle.http._
import org.jboss.netty.handler.codec.http._
import com.twitter.util._
import java.util.concurrent.TimeUnit
import java.io.InputStream
import java.nio.ByteBuffer

object App {

  class ExampleApp extends Controller {

    get("/status") { request =>

      val client: Service[HttpRequest, HttpResponse] = ClientBuilder()
        .codec(Http())
        .hosts("cloud.tfl.gov.uk:80")
        .tcpConnectTimeout(Duration(10, TimeUnit.SECONDS))
        .hostConnectionLimit(1)
        .build()

      val req = new DefaultHttpRequest(
        HttpVersion.HTTP_1_1,
        HttpMethod.GET,
        "/TrackerNet/LineStatus")

      req.setHeader(HttpHeaders.Names.HOST, "cloud.tfl.gov.uk")

      client(req).map {
        sr =>
          val chars = sr.getContent().toByteBuffer()
          val is = newInputStream(chars)
          val elem = scala.xml.XML.load(is)
          val etag = elem.toString.hashCode.toString
          val resp = request.headers.get("if-none-match") match {            
            case Some(value) if value == etag => render.nothing.status(304)
            case _ => render.json(xform(elem))              
          }
          resp.header("etag", etag)
              .header("Content-Type", "application/json; charset=utf-8")
      }
    }

    def xform(xml: scala.xml.Elem) = {
      (xml \ "LineStatus").map { line =>
        val id = (line \ "Line" \ "@ID").head.text
        val longDescription = (line \ "@StatusDetails").headOption.map(_.text).getOrElse("")
        val shortDescription = (line \ "Status" \ "@Description").headOption.map(_.text).getOrElse("")
        (id, Map(
          "id" -> id,
          "longDescription" -> longDescription,
          "shortDescription" -> shortDescription))
      }.toMap
    }
  }

  def newInputStream(buf: ByteBuffer): InputStream = {
    new InputStream {
      override def read() = if (buf.hasRemaining()) buf.get() else -1

      override def read(bytes: Array[Byte], off: Int, len: Int) = {
        val rv = java.lang.Math.min(len, buf.remaining())
        buf.get(bytes, off, rv)
        if (rv == 0) -1 else rv
      }
    }
  }

  val app = new ExampleApp

  def main(args: Array[String]) = {
    FinatraServer.register(app)
    FinatraServer.start()
  }
}
