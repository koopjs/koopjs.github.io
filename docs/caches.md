# Caches

In Koop, the **cache** stores data from third party providers to reduce redundant requests and speed up response time. Koop's data caching is by default a local, in-memory object. We strongly recommend using the PostGIS cache for production deployments. Other options are in development and available for experimentation.

- [PostGIS](https://github.com/koopjs/koop-pgcache) *recommended*
- [ElasticSearch](https://github.com/koopjs/koop-escache) *experimental*
