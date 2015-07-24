# Setup

> Setting up a development environment for Koop

All you need to have installed before Koop will run is a [Node.js](https://nodejs.org/) environment and an internet connection. We recommend using version `0.10` until the [Node.js Foundation](https://www.joyent.com/blog/introducing-the-nodejs-foundation) stabilizes differences between `0.12` and `iojs`.

## Required

- [Node.js](https://nodejs.org/download/)

## Recommended

- [Postgres](https://wiki.postgresql.org/wiki/Detailed_installation_guides) and [PostGIS](http://postgis.net/install)

Koop uses an in-memory cache by default. This is not recommended when running in production. A PostGIS cache using [koop-pgcache](https://github.com/koopjs/koop-pgcache) is recommended for all production deployments. See [caches](caches.md) for more details.

## Using Docker

There is an example of how to get Koop running with PostGIS inside a docker container [here](https://github.com/kpettijohn/koop-docker-example).

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

## Next Steps

Once you have a development environment set up, Koop works best in combination with [providers](providers.md).
