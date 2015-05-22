# PostGIS Cache

**Implementing Persistent Caching with PostGIS**

without a backing PostGIS instance, koop isn't able to share cached datasets between clusters and registered providers won't survive a server restart.  Because of this, its essential that a PostGIS database be utilized in a production scenario.

## Prerequisites

- [Postgres](https://wiki.postgresql.org/wiki/Detailed_installation_guides)
- [PostGIS](http://postgis.net/install)

A simple install from EnterpriseDB is fine. If you get any warnings during install, add the `PostgreSQL/bin` directory to your `PATH`.

Update `config/default.json` to reference your local postgres database (if named other than koopdev). You may need to specify a syntax like `postgres://user:pw@localhost/koopdev`.

Once this is done, all you need to do is `npm install koop-pgcache` and register it with Koop in the server initialization file. Your PostGIS instance will then be used by Koop as a cache.

```js
var pgCache = require('koop-pgcache')
koop.registerCache(pgCache)
```
