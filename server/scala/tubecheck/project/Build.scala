import sbt._
import Keys._
import cc.spray.revolver.RevolverPlugin._

object Build extends sbt.Build {
  import Dependencies._

  lazy val myProject = Project("spray-template", file("."))
    .settings(Revolver.settings: _*)
    .settings(
      organization  := "com.example",
      version       := "1.0",
      scalaVersion  := "2.9.1",
      scalacOptions := Seq("-deprecation", "-encoding", "utf8"),
      resolvers     ++= Dependencies.resolutionRepos,
      libraryDependencies ++=
        compile(akkaActor, sprayCan, sprayClient, sprayServer) ++
        test(specs2) ++
        runtime(akkaSlf4j, slf4j, logback)
    )
}

