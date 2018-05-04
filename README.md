# [Koop](https://github.com/koopjs/koop)

> An Open Geospatial ETL Engine

[![npm](https://img.shields.io/npm/v/koop.svg?style=flat-square)](https://www.npmjs.com/package/koop) [![build status](https://img.shields.io/travis/koopjs/koop-core/master.svg?style=flat-square)](https://travis-ci.org/koopjs/koop-core)

Leave geospatial data where it lives and transform it into GeoJSON, CSV, KML, a Shapefile, or a Feature Service dynamically.

```
ArcGIS Online                   GeoJSON
Socrata                         CSV
CKAN             => Koop =>     KML
Github                          Shapefile
OpenStreetMap                   Feature Service

```

## Quickstart

If you want to develop on Koop, it's usually best to start by creating a Provider. You can read more about that below or check out:

- [Koop Provider Guide](/docs/specs/provider)
- [Koop Provider Sample](https://github.com/koopjs/koop-provider-sample)

## Core Concepts

Koop is a highly-extensible Javascript toolkit for connecting incompatible spatial APIs. Out of the box it exposes a Node.js server that can translate [GeoJSON](http://geojson.org/) into the [Geoservices specification](https://geoservices.github.io) supported by the [ArcGIS](http://www.esri.com/arcgis/about-arcgis) family of products. Koop can be extended to translate data from any source to any API specification. Don't let API incompatiblity get in your way, start using one of Koop's data providers or [write your own](/docs/specs/provider/).

### [Providers](docs/providers/)

Koop uses **providers** to transform data from different sources – most often open data providers that serve geospatial data on the web.

| name | version | build status |
| --- | --- | --- |
| [ArcGIS Online](https://github.com/koopjs/koop-provider-agol) | [![npm](https://img.shields.io/npm/v/koop-agol.svg?style=flat-square)](https://www.npmjs.com/package/koop-agol) | [![travis](https://img.shields.io/travis/koopjs/koop-provider-agol/master.svg?style=flat-square)](https://travis-ci.org/koopjs/koop-provider-agol) |
| [Socrata](https://github.com/koopjs/koop-provider-socrata) | [![npm](https://img.shields.io/npm/v/koop-socrata.svg?style=flat-square)](https://www.npmjs.com/package/koop-socrata) | [![travis](https://img.shields.io/travis/koopjs/koop-provider-socrata/master.svg?style=flat-square)](https://travis-ci.org/koopjs/koop-provider-socrata) |
| [GitHub](https://github.com/koopjs/koop-provider-github) | [![npm](https://img.shields.io/npm/v/koop-github.svg?style=flat-square)](https://www.npmjs.com/package/koop-github) | [![travis](https://img.shields.io/travis/koopjs/koop-provider-github/master.svg?style=flat-square)](https://travis-ci.org/koopjs/koop-provider-github) |
| [Gist](https://github.com/koopjs/koop-gist) | [![npm](https://img.shields.io/npm/v/koop-gist.svg?style=flat-square)](https://www.npmjs.com/package/koop-gist) | [![travis](https://img.shields.io/travis/koopjs/koop-provider-gist/master.svg?style=flat-square)](https://travis-ci.org/koopjs/koop-provider-gist) |
| [Google Sheets](https://github.com/koopjs/koop-provider-google-sheets) | [![npm](https://img.shields.io/npm/v/@koopjs/provider-google-sheets.svg?style=flat-square)](https://www.npmjs.com/package/@koopjs/provider-google-sheets) | [![travis](https://img.shields.io/travis/koopjs/koop-provider-google-sheets/master.svg?style=flat-square)](https://travis-ci.org/koopjs/koop-provider-google-sheets) |
| [Google Fusion Tables](https://github.com/koopjs/koop-provider-google-fusion-tables) | [![npm](https://img.shields.io/npm/v/@koopjs/provider-google-fusion-tables.svg?style=flat-square)](https://www.npmjs.com/package/@koopjs/provider-google-fusion-tables) | [![travis](https://img.shields.io/travis/koopjs/koop-provider-google-fusion-tables/master.svg?style=flat-square)](https://travis-ci.org/koopjs/koop-provider-google-fusion-tables) |
| [Marklogic](https://github.com/koopjs/koop-provider-marklogic) | [![npm](https://img.shields.io/npm/v/@koopjs/provider-marklogic.svg?style=flat-square)](https://www.npmjs.com/package/@koopjs/provider-marklogic) | [![travis](https://img.shields.io/travis/koopjs/koop-provider-marklogic/master.svg?style=flat-square)](https://travis-ci.org/koopjs/koop-provider-marklogic) |



### [Outputs](docs/outputs/)

Koop uses **outputs** to serve data in open specifications like [Geoservices](https://geoservices.github.io) so data can be used in clients that support them.

| name | version | build status |
| --- | --- | --- |
| [Geoservices](https://github.com/koopjs/koop-output-geoservices) | [![npm](https://img.shields.io/npm/v/koop-output-geoservices.svg?style=flat-square)](https://www.npmjs.com/package/koop-output-geoservices) | [![travis](https://img.shields.io/travis/koopjs/koop-output-geoservices/master.svg?style=flat-square)](https://travis-ci.org/koopjs/koop-output-geoservices) |

### [Caches](docs/caches/)

Koop uses a **cache** to store data from third party providers. This helps reduce requests to other servers, bypass rate limiting issues, and speed up response times.

| name | version | build status |
| --- | --- | --- |
| [Memory](https://github.com/koopjs/koop-cache-memory) | [![npm](https://img.shields.io/npm/v/koop-cache-memory.svg?style=flat-square)](https://www.npmjs.com/package/koop-cache-memory) | [![travis](https://img.shields.io/travis/koopjs/koop-cache-memory/master.svg?style=flat-square)](https://travis-ci.org/koopjs/koop-cache-memory) |
| [PostGIS](https://github.com/koopjs/koop-pgcache) | [![npm](https://img.shields.io/npm/v/koop-pgcache.svg?style=flat-square)](https://www.npmjs.com/package/koop-pgcache) | [![travis](https://img.shields.io/travis/koopjs/koop-pgcache/master.svg?style=flat-square)](https://travis-ci.org/koopjs/koop-pgcache) |

### [Plugins](docs/plugins/)

Koop uses **plugins** to add extra functionality not supported by other plugin types.

| name | version | build status |
| --- | --- | --- |
| [File Exporter](https://github.com/koopjs/koop-exporter) | [![npm](https://img.shields.io/npm/v/koop-exporter.svg?style=flat-square)](https://www.npmjs.com/package/koop-exporter) | [![travis](https://img.shields.io/travis/koopjs/koop-exporter/master.svg?style=flat-square)](https://travis-ci.org/koopjs/koop-exporter) |
| [Tile Generator](https://github.com/koopjs/koop-tile-plugin) | [![npm](https://img.shields.io/npm/v/koop-tile-plugin.svg?style=flat-square)](https://www.npmjs.com/package/koop-tile-plugin) | [![travis](https://img.shields.io/travis/koopjs/koop-tile-plugin/master.svg?style=flat-square)](https://travis-ci.org/koopjs/koop-tile-plugin) |
| [Queue](https://github.com/koopjs/koop-queue) | [![npm](https://img.shields.io/npm/v/koop-queue.svg?style=flat-square)](https://www.npmjs.com/package/koop-queue) | [![travis](https://img.shields.io/travis/koopjs/koop-queue/master.svg?style=flat-square)](https://travis-ci.org/koopjs/koop-queue) |
| [Logger](https://github.com/koopjs/koop-logger) | [![npm](https://img.shields.io/npm/v/koop-logger.svg?style=flat-square)](https://www.npmjs.com/package/koop-logger) | [![travis](https://img.shields.io/travis/koopjs/koop-logger/master.svg?style=flat-square)](https://travis-ci.org/koopjs/koop-logger) |
| [Worker](https://github.com/koopjs/koop-worker) | [![npm](https://img.shields.io/npm/v/koop-worker.svg?style=flat-square)](https://www.npmjs.com/package/koop-worker) | [![travis](https://img.shields.io/travis/koopjs/koop-worker/master.svg?style=flat-square)](https://travis-ci.org/koopjs/koop-worker) |

## Contributions welcome

Koop is entirely open source. Check us out, file an issue, open a pull request, and help grow the project to make it as useful as possible to the geospatial community.

[github.com/koopjs](https://github.com/koopjs)
