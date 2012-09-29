package com.example

import akka.actor.Props
import cc.spray.Directives
import cc.spray.can.client.HttpClient
import cc.spray.http.StatusCodes._
import cc.spray.io.IoWorker
import java.util.concurrent.TimeUnit
import cc.spray.caching._
import akka.util.Duration
import java.util.Date
import cc.spray.client.HttpConduit
import cc.spray.http.HttpRequest
import cc.spray.http.HttpMethods
import cc.spray.http.HttpResponse
import scala.xml.XML
import java.io.ByteArrayInputStream
import scala.util.parsing.json.JSONObject
import cc.spray.http.HttpContent
import cc.spray.http.HttpHeader
import cc.spray.Rejection
import cc.spray.http.HttpHeaders._
import cc.spray.http.CacheDirectives._
import cc.spray.http.FormData
import scala.xml.NodeSeq

trait HelloService extends Directives {

  // create and start a spray-can HttpClient
  val httpClient = {
    // every spray-can HttpServer (and HttpClient) needs an IoWorker for low-level network IO
    // (but several servers and/or clients can share one)
    val ioWorker = new IoWorker(actorSystem).start()

    actorSystem.actorOf(
      props = Props(new HttpClient(ioWorker)),
      name = "http-client")

  }

  //ExpiringLruCache

  override lazy val cache = cacheResults2(LruCache(timeToLive = Duration(30, TimeUnit.SECONDS)))

  /**
   * Wraps its inner Route with caching support using the given [[cc.spray.caching.Cache]] implementation and
   * keyer function.
   */
  def cacheResults2(cache: Cache[Either[Set[Rejection], HttpResponse]],
    keyer: cc.spray.CacheKeyer = CacheKeyers.UriGetCacheKeyer) = {
    transformRoute { route =>
      ctx =>
        val noCachePresent = ctx.request.headers.exists {
          case x: `Cache-Control` => x.directives.exists {
            case `no-cache` => true
            case `max-age`(0) => true
            case _ => false
          }
          case _ => false
        }
        if (!noCachePresent) {
          keyer(ctx) match {
            case Some(key) => {
              cache(key) { promise =>
                route {
                  ctx.withResponderTransformed { responder =>
                    responder
                      .withComplete { response =>
                        val etag = response.content.map(_.hashCode).getOrElse(System.currentTimeMillis()).toString
                        val resp = response.withHeaders(HttpHeader("etag", etag) :: response.headers)
                        promise.success(Right(resp))
                      }
                      .withReject { rejections => promise.success(Left(rejections)) }
                  }
                }
              } onSuccess {
                case Right(response) =>
                  val finalResponseOption = for {
                    reqETag <- ctx.request.headers.find(_.name == "if-none-match")
                    respETag <- response.headers.find(_.name == "etag")
                    if (reqETag.value == respETag.value)
                  } yield (response.copy(status = NotModified, content = None))

                  ctx.responder.complete(finalResponseOption.getOrElse(response))
                case Left(rejections) => ctx.responder.reject(rejections)
              }
            }
            case _ => route(ctx)
          }
        } else route(ctx)
    }
  }

  def headByGet =
    transformRoute {
      route =>
        ctx =>
          route {
            if (ctx.request.method == HttpMethods.HEAD)
              ctx
                .withRequestTransformed { _.copy(method = HttpMethods.GET) }
                .withResponseTransformed {
                  response =>
                    if (response.status == OK)
                      response.copy(status = NoContent, content = None)
                    else
                      response
                }
            else
              ctx
          }
    }

  val helloService = {
    headByGet {
      cache {
        path("test") {
          get { request =>
            println("request: " + new Date())
            val conduit = new HttpConduit(httpClient, "cloud.tfl.gov.uk")
            val responseFuture = conduit.sendReceive(HttpRequest(method = HttpMethods.GET, uri = "/TrackerNet/LineStatus"))
            val mapped = responseFuture.map(response => {
              response.status match {
                case OK => {
                  response.content match {
                    case None => HttpResponse(InternalServerError)
                    case Some(content) => {
                      content.as[NodeSeq].fold(error => HttpResponse(InternalServerError),
                        doc => {
                          val lines = doc \ "LineStatus"
                          val extracted = lines.map(line => {
                            val id = (line \ "@ID").text
                            val longDescription = (line \ "@StatusDetails").text
                            val shortDescription = (line \ "Status" \ "@Description").text

                            (id, JSONObject(Map("id" -> id, "longDescription" -> longDescription, "shortDescription" -> shortDescription)))
                          }).toMap
                          val asJson = JSONObject(extracted)
                          println(asJson.hashCode)
                          HttpResponse(OK, HttpContent(asJson.toString))
                        })
                    }
                  }
                }
                case _ => HttpResponse(InternalServerError)
              }
            })
            request.complete(mapped)
          }
        }
      }
    }
  }

}