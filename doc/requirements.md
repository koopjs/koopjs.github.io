# Requirements

What you need to have installed before Koop will run.

## Prerequesites

- [Node.js](https://nodejs.org/download/)

## Recommended

- [Postgres](https://wiki.postgresql.org/wiki/Detailed_installation_guides)
- [PostGIS](http://postgis.net/install)

Koop uses an in-memory cache by default. This is not recommended when running in production. The most common cache used is PostGIS using [koop-pgcache](https://github.com/Esri/koop-pgcache). Read the [PostGIS Cache](postgis-cache.md) article to find out more about using PostGIS as a persistent cache for Koop.

## Using Docker

There is an example of how to get Koop running with PostGIS inside a docker container at https://github.com/kpettijohn/koop-docker-example.

## Supported Operating Systems

Koop has been tested on:

- Ubuntu
  - 12.04
  - 14.04
- OS X
  - 10.9 (Mavericks)
  - 10.10 (Yosemite)
- Windows
  - 7
  - 8.1
  - Server 2008R2
  - Server 2012R2
