## _spray_ Template Project

This projects provides a starting point for your own _spray-server_ endeavors.
There are two branches:

* The `master` branch provides a template for a _spray on Jetty_ application.
* The `spray-can` branch provides a template for a _spray on spray-can_ application.

You are currently on the `spray-can-1.0-M1` branch.
The template application here uses the following dependencies:

- Scala 2.9.1
- Akka 2.0
- _spray-server_ 1.0-M1
- _spray-can_ 1.0-M1
- SBT 0.11.2
- sbt-revolver 0.6.0


Follow these steps to get started:

1. Git-clone this repository.

        $ git clone git://github.com/spray/spray-template.git my-project

2. Change directory into your clone:

        $ cd my-project

3. Launch [SBT]:

        $ sbt

4. Compile everything and run all tests:

        > test

5. Start the application:

        > re-start

6. Browse to http://localhost:8080/

7. Start the application:

        > re-stop

8. Learn more at http://www.spray.cc/

9. Start hacking on `src/main/scala/com/example/HelloService.scala`


Apart from the Scala sources in the `src/main/scala` tree the following non-Scala configuration files are important:

* `src/main/resources/application.conf`, the combined Akka and _spray_ configuration file
* `src/main/resources/logback.xml`, the config file for the [SLF4J] logging backend "logback" (not required but recommended)

  [SBT]: https://github.com/harrah/xsbt/wiki
  [SLF4J]: http://www.slf4j.org