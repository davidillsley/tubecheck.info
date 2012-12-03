package info.tubecheck.server

import org.scalatest.FlatSpec
import org.scalatest.matchers.ShouldMatchers
import com.twitter.finatra.test._
import info.tubecheck.server._

class AppSpec extends SpecHelper {

  val app = new App.ExampleApp

  "GET /notfound" should "respond 404" in {
    get("/notfound")
    response.body should equal("Not Found")
    response.code should equal(404)
  }

  "transform a response" should "succeed" in {
    val xx = Map(
      "12" -> Map("id" -> "12", "longDescription" -> "Train service resumes on Monday at 06:15 hrs.", "shortDescription" -> "Planned Closure"),
      "8" -> Map("id" -> "8", "longDescription" -> "", "shortDescription" -> "Good Service"),
      "4" -> Map("id" -> "4", "longDescription" -> "", "shortDescription" -> "Good Service"),
      "11" -> Map("id" -> "11", "longDescription" -> "", "shortDescription" -> "Good Service"),
      "9" -> Map("id" -> "9", "longDescription" -> "", "shortDescription" -> "Good Service"),
      "5" -> Map("id" -> "5", "longDescription" -> "", "shortDescription" -> "Good Service"),
      "82" -> Map("id" -> "82", "longDescription" -> "No service between Sydenham and West Croydon due to planned engineering work. GOOD SERVICE on all other routes.", "shortDescription" -> "Part Closure"),
      "6" -> Map("id" -> "6", "longDescription" -> "", "shortDescription" -> "Good Service"),
      "1" -> Map("id" -> "1", "longDescription" -> "", "shortDescription" -> "Good Service"),
      "2" -> Map("id" -> "2", "longDescription" -> "", "shortDescription" -> "Good Service"),
      "81" -> Map("id" -> "81", "longDescription" -> "No service between Bank and Shadwell due to planned engineering work. GOOD SERVICE on all other routes.", "shortDescription" -> "Part Closure"),
      "7" -> Map("id" -> "7", "longDescription" -> "", "shortDescription" -> "Good Service"),
      "3" -> Map("id" -> "3", "longDescription" -> "", "shortDescription" -> "Good Service"))

    app.xform(sampleMessage) should equal(xx)
  }

  val sampleMessage = <ArrayOfLineStatus xmlns="http://webservices.lul.co.uk/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
                        <LineStatus StatusDetails="" ID="0">
                          <BranchDisruptions></BranchDisruptions>
                          <Line Name="Bakerloo" ID="1"></Line>
                          <Status IsActive="true" Description="Good Service" CssClass="GoodService" ID="GS">
                            <StatusType Description="Line" ID="1"></StatusType>
                          </Status>
                        </LineStatus>
                        <LineStatus StatusDetails="" ID="1">
                          <BranchDisruptions></BranchDisruptions>
                          <Line Name="Central" ID="2"></Line>
                          <Status IsActive="true" Description="Good Service" CssClass="GoodService" ID="GS">
                            <StatusType Description="Line" ID="1"></StatusType>
                          </Status>
                        </LineStatus>
                        <LineStatus StatusDetails="" ID="10">
                          <BranchDisruptions></BranchDisruptions>
                          <Line Name="Circle" ID="7"></Line>
                          <Status IsActive="true" Description="Good Service" CssClass="GoodService" ID="GS">
                            <StatusType Description="Line" ID="1"></StatusType>
                          </Status>
                        </LineStatus>
                        <LineStatus StatusDetails="" ID="2">
                          <BranchDisruptions></BranchDisruptions>
                          <Line Name="District" ID="9"></Line>
                          <Status IsActive="true" Description="Good Service" CssClass="GoodService" ID="GS">
                            <StatusType Description="Line" ID="1"></StatusType>
                          </Status>
                        </LineStatus>
                        <LineStatus StatusDetails="" ID="8">
                          <BranchDisruptions></BranchDisruptions>
                          <Line Name="Hammersmith and City" ID="8"></Line>
                          <Status IsActive="true" Description="Good Service" CssClass="GoodService" ID="GS">
                            <StatusType Description="Line" ID="1"></StatusType>
                          </Status>
                        </LineStatus>
                        <LineStatus StatusDetails="" ID="4">
                          <BranchDisruptions></BranchDisruptions>
                          <Line Name="Jubilee" ID="4"></Line>
                          <Status IsActive="true" Description="Good Service" CssClass="GoodService" ID="GS">
                            <StatusType Description="Line" ID="1"></StatusType>
                          </Status>
                        </LineStatus>
                        <LineStatus StatusDetails="" ID="9">
                          <BranchDisruptions></BranchDisruptions>
                          <Line Name="Metropolitan" ID="11"></Line>
                          <Status IsActive="true" Description="Good Service" CssClass="GoodService" ID="GS">
                            <StatusType Description="Line" ID="1"></StatusType>
                          </Status>
                        </LineStatus>
                        <LineStatus StatusDetails="" ID="5">
                          <BranchDisruptions></BranchDisruptions>
                          <Line Name="Northern" ID="5"></Line>
                          <Status IsActive="true" Description="Good Service" CssClass="GoodService" ID="GS">
                            <StatusType Description="Line" ID="1"></StatusType>
                          </Status>
                        </LineStatus>
                        <LineStatus StatusDetails="" ID="6">
                          <BranchDisruptions></BranchDisruptions>
                          <Line Name="Piccadilly" ID="6"></Line>
                          <Status IsActive="true" Description="Good Service" CssClass="GoodService" ID="GS">
                            <StatusType Description="Line" ID="1"></StatusType>
                          </Status>
                        </LineStatus>
                        <LineStatus StatusDetails="" ID="7">
                          <BranchDisruptions></BranchDisruptions>
                          <Line Name="Victoria" ID="3"></Line>
                          <Status IsActive="true" Description="Good Service" CssClass="GoodService" ID="GS">
                            <StatusType Description="Line" ID="1"></StatusType>
                          </Status>
                        </LineStatus>
                        <LineStatus StatusDetails="Train service resumes on Monday at 06:15 hrs." ID="11">
                          <BranchDisruptions></BranchDisruptions>
                          <Line Name="Waterloo and City" ID="12"></Line>
                          <Status IsActive="true" Description="Planned Closure" CssClass="DisruptedService" ID="CS">
                            <StatusType Description="Line" ID="1"></StatusType>
                          </Status>
                        </LineStatus>
                        <LineStatus StatusDetails="No service between Sydenham and West Croydon due to planned engineering work. GOOD SERVICE on all other routes." ID="82">
                          <BranchDisruptions>
                            <BranchDisruption>
                              <StationTo Name="West Croydon" ID="366"></StationTo>
                              <StationFrom Name="Sydenham" ID="359"></StationFrom>
                            </BranchDisruption>
                          </BranchDisruptions>
                          <Line Name="Overground" ID="82"></Line>
                          <Status IsActive="true" Description="Part Closure" CssClass="DisruptedService" ID="PC">
                            <StatusType Description="Line" ID="1"></StatusType>
                          </Status>
                        </LineStatus>
                        <LineStatus StatusDetails="No service between Bank and Shadwell due to planned engineering work. GOOD SERVICE on all other routes." ID="81">
                          <BranchDisruptions>
                            <BranchDisruption>
                              <StationTo Name="Shadwell" ID="200"></StationTo>
                              <StationFrom Name="Bank" ID="12"></StationFrom>
                            </BranchDisruption>
                          </BranchDisruptions>
                          <Line Name="DLR" ID="81"></Line>
                          <Status IsActive="true" Description="Part Closure" CssClass="DisruptedService" ID="PC">
                            <StatusType Description="Line" ID="1"></StatusType>
                          </Status>
                        </LineStatus>
                      </ArrayOfLineStatus>
}
