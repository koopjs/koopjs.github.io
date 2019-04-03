---
title: What is Koop?
permalink: /docs/basics/what-is-koop
redirect_from: /docs/basics/index.html
---
Koop is a Node.js web-server for on-the-fly transformation of geospatial data.  The underlying principle of Koop is that your data remains in its native format and location but can be transformed and served to make it consumable by a multitude of clients.  Koop makes this work with a plugin architecture built of *Providers* (plugins that request data from remote sources and transform it to GeoJSON) and *Outputs* (plugins that transform GeoJSON to other formats for client consumption).
The figure below illustrates the flow of data from remote sources through Koop and to clients.

![koop overview](/img/koop-conceptual-overview.png "Koop Overview")  
*An example of a Koop instance tranforming data from remote sources to different output formats for clients.*

## What data sources are supported?
The current version of Koop (3.x.x) supports many different data sources, including: AWS S3, Github, ElasticSearch, Google Analytics, Marklogic, CSVs, GeoJSON files, and more. See the list of [available provider plugins](../available-plugins/providers).

Provider plugins are easy to build, so if your data source is not currently supported you can author your own. [Koop-CLI](https://github.com/koopjs/koop-cli) automates the generation of provider boilerplate.  The [provider specification](../usage/provider) gives additional details to aid development.

## What output formats are available?
#### GeoServices
By default, Koop includes the GeoServices output plugin which formats JSON according to its specification and conforms to the [GeoServices Query API](http://geoservices.github.io/query.html). This means you can use GeoServices API query parameters to filter and format the data served by Koop.  It also means that Koop can be used with clients leveraging the GeoServices API (e.g. ArcGIS clients). In addition to GeoServices JSON, standard GeoJSON can be requested with a simple `f=geojson` query parameter.

#### Other formats
There are a number of other output plugins available, including vector-tiles, WMS, WFS, and flat JSON. See the complete list of [output plugins](../available-plugins/outputs).  

<br>
## Quick facts
* Opensource and Apache-licensed  
* Built on the [Express.js](https://expressjs.com/) framework for [Node.js](https://nodejs.org)  
* Official supported components are published and installable with [NPM](https://www.npmjs.com/)
* [Koop-CLI](https://github.com/koopjs/koop-cli) can easily and quickly setup of new Koop server instances
* Koop services can be secured using [authorization plugins](../available-plugins/authorizations)
* Koop [cache-plugins](../available-plugins/caches) can improve performance
