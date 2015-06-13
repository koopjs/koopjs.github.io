# Caches

In Koop, the **cache** stores data from third party providers to reduce redundant requests and speed up response time. Koop's data caching is by default a local, in-memory object. We strongly recommend using the PostGIS cache for production deployments. Other options are in development and available for experimentation.

| cache | version | build status |
| ----- | ------- | ------------ |
| [PostGIS](https://github.com/koopjs/koop-pgcache) *recommended* | [![npm](https://img.shields.io/npm/v/koop-pgcache.svg?style=flat-square)](https://www.npmjs.com/package/koop-pgcache) | [![travis](https://img.shields.io/travis/koopjs/koop-pgcache.svg?style=flat-square)](https://travis-ci.org/koopjs/koop-pgcache) |
| [ElasticSearch](https://github.com/koopjs/koop-escache) | [![npm](https://img.shields.io/npm/v/koop-escache.svg?style=flat-square)](https://www.npmjs.com/package/koop-escache) | [![travis](https://img.shields.io/travis/koopjs/koop-escache.svg?style=flat-square)](https://travis-ci.org/koopjs/koop-escache) |
