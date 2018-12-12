---
title: System requirements
permalink: /docs/basics/system-requirements
---

#### Operating system
Koop has been tested on:
- Ubuntu: 12.04 - 18.04
- OS X: 10.9 (Mavericks) - 10.13 (High Sierra)
- Windows: 7 - 10, Server 2008R2 - 2012R2

#### Node.js (required)

All you need to have installed before Koop will run is a [Node.js](https://nodejs.org/) environment and an internet connection. We recommend using version 10, which is the long term stability release.

#### Cache dependencies (optional)
Koop uses an in-memory cache by default. An alternative is to use [koop-pgcache](https://github.com/koopjs/koop-pgcache), an Postgresql/PostGIS based cached.  It stores data independent of the Koop server processes and speed up queries (see [Caches](./caches) for more details).  If you plan to use [koop-pgcache](https://github.com/koopjs/koop-pgcache) you will need to install [Postgres](https://wiki.postgresql.org/wiki/Detailed_installation_guides) and [PostGIS](http://postgis.net/install).
