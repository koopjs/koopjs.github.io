# [Koop](https://github.com/koopjs/koop)

> An Open Geospatial ETL Engine

[![npm](https://img.shields.io/npm/v/koop.svg?style=flat-square)](https://www.npmjs.com/package/koop)
[![build status](https://img.shields.io/travis/koopjs/koop.svg?style=flat-square)](https://travis-ci.org/koopjs/koop)

Leave geospatial data where it lives and transform it into GeoJSON, CSV, KML, a Shapefile, or a Feature Service dynamically.

```
ArcGIS Online                   GeoJSON
Socrata                         CSV
CKAN             => Koop =>     KML
Github                          Shapefile
OpenStreetMap                   Feature Service
```

## Core Concepts

**Koop** is, first and foremost, a **web server**. It is written in **JavaScript** and runs in the [**Node.js**](https://nodejs.org/) runtime environment. It acts as **middleware** for the [**Express**](http://expressjs.com/) web framework. Koop extracts data from third party **providers**, transforms that data into [**GeoJSON**](http://geojson.org/) and loads it into a **cache** database. From that point a user can query the data as a feature service or download it in various formats.

### Providers

Koop uses **providers** to transform data from different sources -- most often open data providers that serve geospatial data on the web.

| name | version | build status |
| :--- | :------ | :----------- |
| [ArcGIS Online](https://github.com/koopjs/koop-agol) | [![npm](https://img.shields.io/npm/v/koop-agol.svg?style=flat-square)](https://www.npmjs.com/package/koop-agol) | [![travis](https://img.shields.io/travis/koopjs/koop-agol.svg?style=flat-square)](https://travis-ci.org/koopjs/koop-agol) |
| [Socrata](https://github.com/koopjs/koop-socrata) | [![npm](https://img.shields.io/npm/v/koop-socrata.svg?style=flat-square)](https://www.npmjs.com/package/koop-socrata) | [![travis](https://img.shields.io/travis/koopjs/koop-socrata.svg?style=flat-square)](https://travis-ci.org/koopjs/koop-socrata) |
| [GitHub](https://github.com/koopjs/koop-github) | [![npm](https://img.shields.io/npm/v/koop-github.svg?style=flat-square)](https://www.npmjs.com/package/koop-github) | [![travis](https://img.shields.io/travis/koopjs/koop-github.svg?style=flat-square)](https://travis-ci.org/koopjs/koop-github) |
| [Gist](https://github.com/koopjs/koop-gist) | [![npm](https://img.shields.io/npm/v/koop-gist.svg?style=flat-square)](https://www.npmjs.com/package/koop-gist) | [![travis](https://img.shields.io/travis/koopjs/koop-gist.svg?style=flat-square)](https://travis-ci.org/koopjs/koop-gist) |

[Read more about providers](docs/providers.md)

### Caches

Koop uses a **cache** to store data from third party providers. This helps reduce requests to other servers, bypass rate limiting issues, and speed up response times.

| name | version | build status |
| :--- | :------ | :----------- |
| [PostGIS](https://github.com/koopjs/koop-pgcache) | [![npm](https://img.shields.io/npm/v/koop-pgcache.svg?style=flat-square)](https://www.npmjs.com/package/koop-pgcache) | [![travis](https://img.shields.io/travis/koopjs/koop-pgcache.svg?style=flat-square)](https://travis-ci.org/koopjs/koop-pgcache) |

[Read more about caches](docs/caches.md)

### Plugins

Koop has **plugins** that add extra functionality not covered by providers and caches.

| name | version | build status |
| :--- | :------ | :----------- |
| [Koop Tile Plugin](https://github.com/koopjs/koop-tile-plugin) | [![npm](https://img.shields.io/npm/v/koop-tile-plugin.svg?style=flat-square)](https://www.npmjs.com/package/koop-tile-plugin) | [![travis](https://img.shields.io/travis/koopjs/koop-tile-plugin.svg?style=flat-square)](https://travis-ci.org/koopjs/koop-tile-plugin) |

[Read more about plugins](docs/plugins.md)

## Contributions welcome

Koop is entirely open source. Check us out, file an issue, open a pull request, and help grow the project to make it as useful as possible to the geospatial community.

[github.com/koopjs](http://github.com/koopjs)
