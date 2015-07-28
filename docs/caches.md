# Caches

In Koop, the **cache** stores data from third party providers to reduce redundant requests and speed up response time. Koop's data caching is by default a local, in-memory object. We strongly recommend using the PostGIS cache for production deployments.

## Officially Supported

| name | version | build status |
| :--- | :------ | :----------- |
| [PostGIS](https://github.com/koopjs/koop-pgcache) *recommended* | [![npm](https://img.shields.io/npm/v/koop-pgcache.svg?style=flat-square)](https://www.npmjs.com/package/koop-pgcache) | [![travis](https://img.shields.io/travis/koopjs/koop-pgcache.svg?style=flat-square)](https://travis-ci.org/koopjs/koop-pgcache) |

## Experimental

| name | version | build status |
| :--- | :------ | :----------- |
| [ElasticSearch](https://github.com/koopjs/koop-escache) | [![npm](https://img.shields.io/npm/v/koop-escache.svg?style=flat-square)](https://www.npmjs.com/package/koop-escache) | [![travis](https://img.shields.io/travis/koopjs/koop-escache.svg?style=flat-square)](https://travis-ci.org/koopjs/koop-escache) |

Know of any caches that aren't listed above? Please let us know by [submitting an issue](https://github.com/koopjs/koop/issues/new)!
