# Setup

## 1. Development Environment

> Setting up a development environment for Koop

All you need to have installed before Koop will run is a [Node.js](https://nodejs.org/) environment and an internet connection. We recommend using version 6, which is the long term stability release.

Once Node is installed run:

1. npm init
2. npm install -S koop
3. npm install (any koop provider)

### Required

- [Node.js](https://nodejs.org/download/)

### Advanced

- [Postgres](https://wiki.postgresql.org/wiki/Detailed_installation_guides) and [PostGIS](http://postgis.net/install)

Koop uses an in-memory cache by default. A PostGIS cache [koop-pgcache](https://github.com/koopjs/koop-pgcache) will store data independent of the Koop server processes and speed up queries, but it is optional. See [Caches](../caches.md) for more details.

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

Koop exposes an [Express](https://expressjs.com) server at `koop.server` which can be instructed to listen on port 80 (or any port of your choosing) as in the example below.

<script src="https://gist.github.com/dmfenton/fb27fafcc82089cf6099d22f443a18ba.js"></script>

You can also run Koop as [middleware](https://expressjs.com/en/guide/using-middleware.html) in an existing Express server.

<script src="https://gist.github.com/dmfenton/d457518ab46790d7af136589bb7258d6.js"></script>

If you want to mount Koop at a route other than `/` e.g. `/koop` you can use Koop as middleware and mount it wherever you like.

<script src="https://gist.github.com/dmfenton/1f252732bfa66bca4ff0a21628fb7ec1.js"></script>

## 3. Providers

Once you've got a development environment, an Express server, and a database, all you need to do is configure your providers! See the complete [list of providers](../docs/providers.md) for further instructions.

`koop.register(provider)`

## 4. Start the server!

If you've got everything set up properly, you should be able to start the server! Add a script to you package.json like the example below that points to your server file and type `npm start`.

<script src="https://gist.github.com/dmfenton/114c09b3befd8e60b3a30ff5f65d8c82.js"></script>

Happy Kooping!
