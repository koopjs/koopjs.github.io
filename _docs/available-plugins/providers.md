---
title: Providers
permalink: /docs/available-plugins/providers
redirect_from: /docs/available-plugins/index.html
---

Koop uses **providers** to transform data from different sources to GeoJSON. Once data is formatted to GeoJSON it can be cached, queried and transformed to various outputs.

<br>

#### Officially Supported

| name &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; | version | build status | koop compatibility |
| :--- | :------ | :----------- | :----------- |
| [ArcGIS Online](https://github.com/koopjs/koop-provider-agol) | [![npm](https://img.shields.io/npm/v/koop-agol.svg?style=flat-square)](https://www.npmjs.com/package/koop-agol) | [![travis](https://img.shields.io/travis/koopjs/koop-provider-agol/master.svg?style=flat-square)](https://travis-ci.org/koopjs/koop-provider-agol) | 3.0.0-alpha.29 |
| [File GeoJSON](https://github.com/koopjs/koop-provider-file-geojson) | [![npm](https://img.shields.io/npm/v/@koopjs/provider-file-geojson.svg?style=flat-square)](https://www.npmjs.com/package/@koopjs/provider-file-geojson) | [![travis](https://travis-ci.com/koopjs/koop-provider-file-geojson.svg?branch=master)](https://travis-ci.org/koopjs/koop-provider-file-geojson) | 3.x |
| [Gist](https://github.com/koopjs/koop-gist) | [![npm](https://img.shields.io/npm/v/koop-gist.svg?style=flat-square)](https://www.npmjs.com/package/koop-gist) | [![travis](https://img.shields.io/travis/koopjs/koop-provider-gist/master.svg?style=flat-square)](https://travis-ci.org/koopjs/koop-provider-gist) | 2.x |
| [GitHub](https://github.com/koopjs/koop-provider-github) | [![npm](https://img.shields.io/npm/v/koop-github.svg?style=flat-square)](https://www.npmjs.com/package/koop-github) | [![travis](https://img.shields.io/travis/koopjs/koop-provider-github/master.svg?style=flat-square)](https://travis-ci.org/koopjs/koop-provider-github) | 3.x |
| [Google Fusion Tables](https://github.com/koopjs/koop-provider-google-fusion-tables) | [![npm](https://img.shields.io/npm/v/@koopjs/provider-google-fusion-tables.svg?style=flat-square)](https://www.npmjs.com/package/@koopjs/provider-google-fusion-tables) | NA | 3.x |
| [Google Sheets](https://github.com/koopjs/koop-provider-google-sheets) | [![npm](https://img.shields.io/npm/v/@koopjs/provider-google-sheets.svg?style=flat-square)](https://www.npmjs.com/package/@koopjs/provider-google-sheets) | [![travis](https://img.shields.io/travis/koopjs/koop-provider-google-sheets/master.svg?style=flat-square)](https://travis-ci.org/koopjs/koop-provider-google-sheets) | 3.x |
| [Marklogic](https://github.com/koopjs/koop-provider-marklogic) | [![npm](https://img.shields.io/npm/v/@koopjs/provider-marklogic.svg?style=flat-square)](https://www.npmjs.com/package/@koopjs/provider-marklogic) | NA | 3.x|
| [Socrata](https://github.com/koopjs/koop-provider-socrata) | [![npm](https://img.shields.io/npm/v/koop-socrata.svg?style=flat-square)](https://www.npmjs.com/package/koop-socrata) | [![travis](https://img.shields.io/travis/koopjs/koop-provider-socrata/master.svg?style=flat-square)](https://travis-ci.org/koopjs/koop-provider-socrata) | 2.x |

<br>
#### Experimental

| name &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;| version | build status | koop compatibility |
| :--- | :------ | :----------- | :----------- |
| [American Community Survey](https://github.com/koopjs/koop-acs) | [![npm](https://img.shields.io/npm/v/koop-acs.svg?style=flat-square)](https://www.npmjs.com/package/koop-acs) | NA |  |
| [CKAN](https://github.com/koopjs/koop-provider-ckan) | [![npm](https://img.shields.io/npm/v/koop-ckan.svg?style=flat-square)](https://www.npmjs.com/package/koop-ckan) | [![travis](https://img.shields.io/travis/koopjs/koop-provider-ckan/master.svg?style=flat-square)](https://travis-ci.org/koopjs/koop-provider-ckan) | 2.x |
| [Decennial Census Data](https://github.com/koopjs/koop-census) | [![npm](https://img.shields.io/npm/v/koop-census.svg?style=flat-square)](https://www.npmjs.com/package/koop-census) | NA |  |
| [GeoCommons](https://github.com/koopjs/koop-geocommons) | [![npm](https://img.shields.io/npm/v/koop-geocommons.svg?style=flat-square)](https://www.npmjs.com/package/koop-geocommons) | NA |  |
| [MongoDB](https://github.com/koopjs/koop-provider-mongo) | NA | NA | |
| [OpenStreetMap](https://github.com/koopjs/koop-osm) | [![npm](https://img.shields.io/npm/v/koop-osm.svg?style=flat-square)](https://www.npmjs.com/package/koop-osm) | NA | |
| [VRBO](https://github.com/koopjs/koop-vrbo) | [![npm](https://img.shields.io/npm/v/koop-vrbo.svg?style=flat-square)](https://www.npmjs.com/package/koop-vrbo) | NA | |
| [Yelp](https://github.com/koopjs/koop-provider-yelp) | [![npm](https://img.shields.io/npm/v/koop-yelp.svg?style=flat-square)](https://www.npmjs.com/package/koop-yelp) | NA | 3.x |

<br>
#### Third Party

| name &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; | version | build status | koop compatibility |
| :--- | :------ | :----------- |:----------- |
| [Citybikes](https://github.com/nixta/koop-citybikes) | NA | NA | |
| [Cloudant](https://github.com/cloudant/koop-cloudant) | [![npm](https://img.shields.io/npm/v/koop-cloudant.svg?style=flat-square)](https://www.npmjs.com/package/koop-cloudant) | NA | |
| [CSV](https://github.com/haoliangyu/koop-provider-csv) | [![npm](https://img.shields.io/npm/v/koop-provider-csv.svg?style=flat-square)](https://www.npmjs.com/package/koop-provider-csv) | [![travis](https://travis-ci.org/haoliangyu/koop-provider-csv.svg?branch=master)](https://github.com/haoliangyu/koop-provider-csv) | 3.x |
| [Strava](https://github.com/Jking-GIS/koop-provider-Strava) | [![npm](https://img.shields.io/npm/v/koop-strava.svg?style=flat-square)](https://www.npmjs.com/package/koop-strava) | [![travis](https://img.shields.io/travis/Jking-GIS/koop-provider-Strava.svg?style=flat-square)](https://travis-ci.org/Jking-GIS/koop-provider-Strava) | 3.x |
| [Zillow](https://github.com/dmfenton/koop-provider-zillow) | [![npm](https://img.shields.io/npm/v/koop-zillow.svg?style=flat-square)](https://www.npmjs.com/package/koop-zillow) | NA | 3.x |

<br>
Know of any providers that aren't listed below? Please let us know by [submitting an issue](https://github.com/koopjs/koop/issues/new)!  

<br>
### Create a Provider
We encourage you to create your own provider using the [Provider](../usage/provider.md) specification.
