# Koop

> An Open Geospatial ETL Engine

Leave geospatial data where it lives and transform it into GeoJSON, CSV, KML, a Shapefile, or a Feature Service dynamically.

```
ArcGIS Online                   GeoJSON
Socrata                         CSV
CKAN             => Koop =>     KML
Github                          Shapefile
OpenStreetMap                   Feature Service
```

## Core Concepts

**Koop** is, first and foremost, a **server**. It is written in **JavaScript** and runs in the [**Node.js**](https://nodejs.org/) runtime environment. It acts as **middleware** for the [**Express**](http://expressjs.com/) web framework. It uses **provider** node modules to *extract* data from third party providers, *transform* that data into [**GeoJSON**](http://geojson.org/) and *load* it into the **cache**, then serve it on the web in various formats.

### Providers

Koop uses **providers** to transform data from different sources -- most often open data providers that serve geospatial data on the web.

| provider | version | build status |
| -------- | ------- | ------------ |
| [ArcGIS Online](https://github.com/koopjs/koop-agol) | [![npm](https://img.shields.io/npm/v/koop-agol.svg?style=flat-square)](https://www.npmjs.com/package/koop-agol) | [![travis](https://img.shields.io/travis/koopjs/koop-agol.svg?style=flat-square)](https://travis-ci.org/koopjs/koop-agol) |
| [GitHub](https://github.com/koopjs/koop-github) | [![npm](https://img.shields.io/npm/v/koop-github.svg?style=flat-square)](https://www.npmjs.com/package/koop-github) | [![travis](https://img.shields.io/travis/koopjs/koop-github.svg?style=flat-square)](https://travis-ci.org/koopjs/koop-github) |
| [GitHub Gist](https://github.com/koopjs/koop-gist) | [![npm](https://img.shields.io/npm/v/koop-gist.svg?style=flat-square)](https://www.npmjs.com/package/koop-gist) | [![travis](https://img.shields.io/travis/koopjs/koop-gist.svg?style=flat-square)](https://travis-ci.org/koopjs/koop-gist) |
| [Socrata](https://github.com/koopjs/koop-socrata) | [![npm](https://img.shields.io/npm/v/koop-socrata.svg?style=flat-square)](https://www.npmjs.com/package/koop-socrata) | [![travis](https://img.shields.io/travis/koopjs/koop-socrata.svg?style=flat-square)](https://travis-ci.org/koopjs/koop-socrata) |
| [CKAN](https://github.com/koopjs/koop-ckan) | [![npm](https://img.shields.io/npm/v/koop-ckan.svg?style=flat-square)](https://www.npmjs.com/package/koop-ckan) | [![travis](https://img.shields.io/travis/koopjs/koop-ckan.svg?style=flat-square)](https://travis-ci.org/koopjs/koop-ckan) |
| [American Community Survey](https://github.com/koopjs/koop-acs) | [![npm](https://img.shields.io/npm/v/koop-acs.svg?style=flat-square)](https://www.npmjs.com/package/koop-acs) | [![travis](https://img.shields.io/travis/koopjs/koop-acs.svg?style=flat-square)](https://travis-ci.org/koopjs/koop-acs) |
| [OpenStreetMap](https://github.com/koopjs/koop-osm) | [![npm](https://img.shields.io/npm/v/koop-osm.svg?style=flat-square)](https://www.npmjs.com/package/koop-osm) | [![travis](https://img.shields.io/travis/koopjs/koop-osm.svg?style=flat-square)](https://travis-ci.org/koopjs/koop-osm) |
| [GeoCommons](https://github.com/koopjs/koop-geocommons) | [![npm](https://img.shields.io/npm/v/koop-geocommons.svg?style=flat-square)](https://www.npmjs.com/package/koop-geocommons) | [![travis](https://img.shields.io/travis/koopjs/koop-geocommons.svg?style=flat-square)](https://travis-ci.org/koopjs/koop-geocommons) |
| [VRBO](https://github.com/koopjs/koop-vrbo) | [![npm](https://img.shields.io/npm/v/koop-vrbo.svg?style=flat-square)](https://www.npmjs.com/package/koop-vrbo) | [![travis](https://img.shields.io/travis/koopjs/koop-vrbo.svg?style=flat-square)](https://travis-ci.org/koopjs/koop-vrbo) |
| [Cloudant](https://github.com/cloudant/koop-cloudant) | [![npm](https://img.shields.io/npm/v/koop-cloudant.svg?style=flat-square)](https://www.npmjs.com/package/koop-cloudant) | [![travis](https://img.shields.io/travis/cloudant/koop-cloudant.svg?style=flat-square)](https://travis-ci.org/cloudant/koop-cloudant) |
| [GeoJSON file](https://github.com/jseppi/koop-geojson-file) | [![npm](https://img.shields.io/npm/v/koop-geojson-file.svg?style=flat-square)](https://www.npmjs.com/package/koop-geojson-file) | [![travis](https://img.shields.io/travis/jseppi/koop-geojson-file.svg?style=flat-square)](https://travis-ci.org/jseppi/koop-geojson-file) |
| [MongoDB](https://github.com/chelm/koop-mongo) | [![npm](https://img.shields.io/npm/v/koop-mongo.svg?style=flat-square)](https://www.npmjs.com/package/koop-mongo) | [![travis](https://img.shields.io/travis/chelm/koop-mongo.svg?style=flat-square)](https://travis-ci.org/chelm/koop-mongo) |
| [Citybikes](https://github.com/nixta/koop-citybikes) | [![npm](https://img.shields.io/npm/v/koop-citybikes.svg?style=flat-square)](https://www.npmjs.com/package/koop-citybikes) | [![travis](https://img.shields.io/travis/nixta/koop-citybikes.svg?style=flat-square)](https://travis-ci.org/nixta/koop-citybikes) |
| [Decennial Census Data](https://github.com/koopjs/koop-census) [(info)](http://www.census.gov/data/developers/data-sets/decennial-census-data.html) | [![npm](https://img.shields.io/npm/v/koop-census.svg?style=flat-square)](https://www.npmjs.com/package/koop-census) | [![travis](https://img.shields.io/travis/koopjs/koop-census.svg?style=flat-square)](https://travis-ci.org/koopjs/koop-census) |
| [Yelp](https://github.com/koopjs/koop-yelp) | [![npm](https://img.shields.io/npm/v/koop-yelp.svg?style=flat-square)](https://www.npmjs.com/package/koop-yelp) | [![travis](https://img.shields.io/travis/koopjs/koop-yelp.svg?style=flat-square)](https://travis-ci.org/koopjs/koop-yelp) |
| [Zillow](https://github.com/dmfenton/koop-zillow) | [![npm](https://img.shields.io/npm/v/koop-zillow.svg?style=flat-square)](https://www.npmjs.com/package/koop-zillow) | [![travis](https://img.shields.io/travis/dmfenton/koop-zillow.svg?style=flat-square)](https://travis-ci.org/dmfenton/koop-zillow) |

[Read more about providers](docs/providers.md)

### Caches

Koop uses a **cache** to store data from third party providers. This helps reduce requests to other servers, bypass rate limiting issues, and speed up response times.

| cache | version | build status |
| ----- | ------- | ------------ |
| [PostGIS](https://github.com/koopjs/koop-pgcache) *recommended* | [![npm](https://img.shields.io/npm/v/koop-pgcache.svg?style=flat-square)](https://www.npmjs.com/package/koop-pgcache) | [![travis](https://img.shields.io/travis/koopjs/koop-pgcache.svg?style=flat-square)](https://travis-ci.org/koopjs/koop-pgcache) |
| [ElasticSearch](https://github.com/koopjs/koop-escache) | [![npm](https://img.shields.io/npm/v/koop-escache.svg?style=flat-square)](https://www.npmjs.com/package/koop-escache) | [![travis](https://img.shields.io/travis/koopjs/koop-escache.svg?style=flat-square)](https://travis-ci.org/koopjs/koop-escache) |

[Read more about caches](docs/caches.md)

### Plugins

Koop has **plugins** that add extra functionality not covered by providers and caches.

| plugin | version | build status |
| ------ | ------- | ------------ |
| [Koop Tile Plugin](https://github.com/koopjs/koop-tile-plugin) | [![npm](https://img.shields.io/npm/v/koop-tile-plugin.svg?style=flat-square)](https://www.npmjs.com/package/koop-tile-plugin) | [![travis](https://img.shields.io/travis/koopjs/koop-tile-plugin.svg?style=flat-square)](https://travis-ci.org/koopjs/koop-tile-plugin) |

[Read more about plugins](docs/plugins.md)

## Contributions welcome

Koop is entirely open source. Check us out, file an issue, open a pull request, and help grow the project to make it as useful as possible to the geospatial community.

[github.com/koopjs](http://github.com/koopjs)
