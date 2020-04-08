---
title: System requirements
permalink: /docs/basics/system-requirements
---

### Operating system
Koop has been tested on:
- Ubuntu: 12.04 - 18.04
- OS X: 10.9 (Mavericks) - 10.13 (High Sierra)
- Windows: 7 - 10, Server 2008R2 - 2012R2

### Node.js (required)

We recommend using version [Node.js](https://nodejs.org/) 10, which is the long term stability release.

### Node Package Manager
You will need to install either [npm](https://www.npmjs.com/get-npm) or [yarn](https://yarnpkg.com/en/) in order to acquire the necessary Koop packages.

### Git (optional)
To follow along in the [Koop Quick Start](./quickstart) you will need to have the [git](https://git-scm.com/) distributed version control system installed.

### Cache dependencies (optional)
Koop uses an in-memory cache by default. An alternative is to use [koop-pgcache](https://github.com/koopjs/koop-pgcache), an Postgresql/PostGIS based cached.  It stores data independent of the Koop server processes and speed up queries (see [Caches](../available-plugins/caches) for more details).  If you plan to use [koop-pgcache](https://github.com/koopjs/koop-pgcache) you will need to install [Postgres](https://wiki.postgresql.org/wiki/Detailed_installation_guides) and [PostGIS](http://postgis.net/install).
