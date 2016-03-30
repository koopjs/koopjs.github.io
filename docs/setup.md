# Setup

## 1. Development Environment

> Setting up a development environment for Koop

All you need to have installed before Koop will run is a [Node.js](https://nodejs.org/) environment and an internet connection. We recommend using version 4, which is the long term stability release.

### Required

- [Node.js](https://nodejs.org/download/)

### Recommended

- [Postgres](https://wiki.postgresql.org/wiki/Detailed_installation_guides) and [PostGIS](http://postgis.net/install)

Koop uses an in-memory cache by default. This is not recommended when running in production. A PostGIS cache using [koop-pgcache](https://github.com/koopjs/koop-pgcache) is recommended for all production deployments. See [caches](caches.md) for more details.

### Supported Operating Systems

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

## 2. Express server

Once you have a development environment set up, you need a basic Express server to get started with Koop. You can use the [sample app](https://github.com/koopjs/koop-sample-app) as a starting point.

## 3. Cache

By default, Koop uses a local in-memory object to cache requests. We highly recommend using a database as a cache. PostGIS is currently the only officially supported database. The [`koop-pgcache`](https://github.com/koopjs/koop-pgcache) module takes care of establishing a connection between Koop and a PostGIS database.

## 4. Providers

Once you've got a development environment, an Express server, and a database, all you need to do is configure your providers! See the complete [list of providers](providers.md) for further instructions.

## 5. Start the server!

If you've got everything set up properly, you should be able to start the server! This is usually done by running `node index.js`, `node server.js`, or simply `npm start`, depending on how you set up your Express server.
