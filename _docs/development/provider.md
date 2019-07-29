---
title: Provider Specification
permalink: /docs/development/provider
redirect_from: /docs/development/index.html
---

#### Contents
1. [The `index.js` file](#indexjs)  
2. [The `model.js` file](#modeljs)  
3. [Routes and Controllers](#routes-and-controllers)  

Note: the discussion of Cached vs Pass-through providers has moved [here](../basics/provider-types).
<hr>

## index.js

Every provider must have a file called `index.js`. Its purpose is to tell Koop how to load and use the provider. The keys and values are enumerated in the example below.

```js
module.exports = {
  name: 'agol', // Required, the name of this provider and the start of all its URLS
  type: 'provider', // Required, the type of Koop Plugin this is
  version: require('./package.json').version, // Required, the version of this provider
  Model: require('./agol'), // Required contains getData and other functions called by controller
  hosts: true, // Optional, whether or not routes should include a `host` parameter
  disableIdParam: false, // Optional, whether or not routes should include an `id` parameter
  routes: require('./routes'), // Optional, any additional routes to be handled by this provider
  Controller: require('./controller'), // Optional, a controller to support unique routes
}
```
<br>
_[back to top](#contents)_
<hr>

## model.js
Every provider must have a `Model`. This is where almost all of the business logic of the provider will occur. Its primary job is to fetch data from a remote source like an API or database and return GeoJSON to Koop for further processing.  `Model` has a set of prototype functions that allow Koop to interact with it.  Some of these functions are optional, others are required.  The table below lists the `Model` function that Koop currently uses.

### `Model` class methods overview

| Name   |      Required?     |  Summary |
|----------|:-------------:|------|
| `getData` | Yes | Fetches data and translates it to GeoJSON.  See below. |
| `createKey` | No   | Generates a string to use as a key for the data-cache. See below. |
| `getAuthenticationSpecification` | No | Delivers an object for use in configuring authentication in output-services. See [authorization spec](http://koopjs.github.io/docs/usage/authorization).|
| `authenticate` | No | Validates credentials and issues a token. See [authorization spec](http://koopjs.github.io/docs/usage/authorization). |
| `authorize` | No | Verifies request is made by an authenticated user. See [authorization spec](http://koopjs.github.io/docs/usage/authorization). |

_[back to top](#contents)_

### `getData` function

Models are required to implement a function called `getData`.  It should fetch data from the remote API, translate the data into GeoJSON (if necessary) and call the `callback` function with the GeoJSON as the second parameter. If there is an error in fetching or processing data from the remote API it should call the `callback` function with an error as the first parameter and stop processing.

GeoJSON passed to the callback should be valid with respect to the [GeoJSON specification](https://tools.ietf.org/html/rfc7946).  Some operations in output-services expect standard GeoJSON properties and / or values. In some cases, having data that conforms to the [GeoJSON spec's righthand rule](https://tools.ietf.org/html/rfc7946#section-3.1.6) is esstential for generating expected results (e.g., features crossing the antimeridian).  Koop includes a GeoJSON validation that is suitable for non-production environments and can be activated by setting `NODE_ENV` to anything **except** `production`.  In this mode, invalid GeoJSON from `getData` will trigger informative console warnings.

```js
/*
Example request: http://koop.com/craigslist/washingtondc/apartments/FeatureServer/0/query?where=price>20&f=geojson
Req is the express request object: https://expressjs.com/en/4x/api.html#req
  req.params = {
    host: 'washingtondc',
    id: 'apartments'
  }
 req.query = {
   where: 'price > 20',
   f: geojson
 }
*/
function getData(req, callback) {
  // pull pieces we need to form a request to Craigslist from the req.params object.
  const city = req.params.host
  const type = req.params.id
  // using the npm package `request` fetch geojson from craigslist
  request(`https://${city}.craigslist.org/jsonsearch/type/${type}`, (err, res, body) => {
    // if the http request fails stop processing and return and call back with an error
    if (err) return callback(err)
    // translate the raw response from Craigslist into GeoJSON
    const geojson = translate(res.body, type)
    // add a little bit of metadata to enrich the geojson
    // metadata is handled by the output plugin that is responding to the request. 
    // e.g. https://github.com/koopjs/koop-output-geoservices
    geojson.metadata = {
      name: `${city} ${type}`,
      description: `Craigslist ${type} listings proxied by https://github.com/dmfenton/koop-provider-craigslist`
    }
    // hand the geojson back to Koop
    callback(null, geojson)
  })
}
```

_[back to top](#contents)_

#### Setting provider `metadata` in `getData`

You can add a `metadata` property to the GeoJSON returned from `getData` and assign it an object for use in Koop output services. In addtion to `name` and `description` noted in the example above, the following fields may be useful:

```js
metadata: {
    name: String, // The name of the layer
    description: String, // The description of the layer
    extent: Array, // valid extent array e.g. [[180,90],[-180,-90]]
    displayField: String, // The display field to be used by a client
    geometryType: String // REQUIRED if no features are returned with this object Point || MultiPoint || LineString || MultiLineString || Polygon || MultiPolygon
    idField: Integer || String, // unique identifier field,
    maxRecordCount: Number, // the maximum number of features a provider can return at once
    limitExceeded: Boolean, // whether or not the server has limited the features returned
    timeInfo: Object // describes the time extent and capabilities of the layer,
    transform: Object // describes a quantization transformation
    fields: [
     { // Subkeys are optional
       name: String,
       type: String, // 'Date' || 'Double' || 'Integer' || 'String'
       alias: String, // how should clients display this field name
       length: Number // max length for a String or Date field (optional)
     }
    ]
  }
```

The data type and values used for `idField` can affect the output of the [koop-output-geoservices](https://github.com/koopjs/koop-output-geoservices) and behavior of some consumer clients. [FeatureServer](https://github.com/koopjs/FeatureServer) and [winnow](https://github.com/koopjs/winnow) (dependencies of [koop-output-geoservices](https://github.com/koopjs/koop-output-geoservices)) will create a separate OBJECTID field and set its value to the value of the attribute referenced by `idField`. OBJECTIDs that are not integers or outside the range of 0 - 2,147,483,647 can break features in some ArcGIS clients.

_[back to top](#contents)_

#### Request parameters in `getData`

Recall the `getData` function receives `req`, an Express.js [request](https://expressjs.com/en/4x/api.html#req) object. `req` includes a set of [route parameters](https://expressjs.com/en/4x/api.html#req.params) accessible with `req.params`, as well as a set of [query-parameters](https://expressjs.com/en/4x/api.html#req.query) accessible with `req.query`. Parameters can be used by `getData` to specify the particulars of data fetching.  

##### Provider route parameters
Providers can enable the `:host` and `:id` route parameters with settings in [`index.js`](#index.js) and then leverage these parameters in `getData`.  For example, the Craigslist Provider's [`getData` function](https://github.com/dmfenton/koop-provider-craigslist/blob/master/model.js#L12-L14) uses the `:host` and `:id` parameter to transmit the city and and posting category to the `getData` function where they are used to generate URLs for requests to the Craigslist API. 

| parameter | `getData` accessor | enabled by default | `index.js` setting |
| --- | --- | --- | --- |
| `:id` | `req.params.id` | yes | `disableIdParam` |
|`:host`| `req.params.host` | no | `hosts` |

##### Output-services route parameters

By default, Koop includes the [koop-output-geoservices](https://github.com/koopjs/koop-output-geoservices) output-service. It adds a set of `FeatureServer` routes (e.g., `/provider/:host/:id/FeatureServer/:layer` and `/provider/:host/:id/FeatureServer/:layer/:method`), which include addtional route parameters that can be used in your Model's `getData` function. 

| parameter | `getData` accessor | notes|
| --- | --- | --- | 
| `:layer` | `req.params.layer` | |
|`:method`| `req.params.method` | `query` and `generateRenderer` are the only values currently supported by [koop-output-geoservices](https://github.com/koopjs/koop-output-geoservices) dependency.  All other values will produce a `400, Method not supported` error.  |

##### Query parameters
As noted above, any query-parameters added to the request URL can accessed within `getData` and leveraged for data fetching purposes.  For example, a request `/provider/:id/FeatureServer/0?foo=bar` would supply `getData` with `req.query.foo` equal to `bar`. With the proper logic, it could then be used to limit fetched data to records that had an attribute `foo` with a value of `bar`.

#### Generation of provider-specific output-routes
The position of the provider-specific fragment of a route path can vary depending on the `path` assignment in the `routes` array object of your output-services plugin.  By default, Koop will construct the route with the provider's parameters first, and subsequently add the route fragment defined by an output-services plugin.  However, if you need the route path configured differently, you can add the `$namespace` and `$providerParams` placholders anywhere in the output-services path. Koop will replace these placeholders with the provider-specific route fragments (i.e, namespace and `:host/:id`). For example, an output path defined as `$namespace/rest/services/$providerParams/FeatureServer/0` would translate to `provider/rest/services/:host/:id/FeatureServer/0`.

#### Output-routes without provider parameters
You may need routes that skip the addition of provider-specific parameters altogether.  This can be accomplished by adding an `absolutePath: true` key-value to the `routes` array object in your output-services plugin. On such routes, Koop will define the route without any additional provider namespace or parameters.

_[back to top](#contents)_

### `createKey` function
Koop uses a an internal `createKey` function to generate a string for use as a key for the data-cache's key-value store. Koop's `createKey` uses the provider name and route parameters to define a key.  This allows all requests with the same provider name and route parameters to leverage cached data.  

Models can optionally implement a function called `createKey`.  If defined, the Model's `createKey` overrides Koop's internal function.  This can be useful if the cache key should be composed with parameters in addition to those found in the internal function.  For example, the `createKey` below uses query parameters `startdate` and `enddate` to construct the key (if they are defined):

```js
Model.prototype.createKey = function (req) {
  let key = req.url.split('/')[1]
  if (req.params.host) key = `${key}::${req.params.host}`
  if (req.params.id) key = `${key}::${req.params.id}`
  key = (req.query.startdate && req.query.enddate) ? `${key}::${req.params.startdate}::${req.params.enddate}` : ''
  return key
}
```
_[back to top](#contents)_

## Routes and Controllers

### Routes.js

This file is simply an array of routes that should be handled in the namespace of the provider e.g. http://adapters.koopernetes.com/agol/arcgis/datasets/e5255b1f69944bcd9cf701025b68f411_0

In the example above, the provider namespace is `agol`, and `arcgis` and `e5255b1f69944bcd9cf701025b68f411_0` are parameters. Anything that matches `/agol/*/datasets/*` will be be handled by the model.

Each route has:
- path: an express.js style route that includes optional parameters
  - see https://www.npmjs.com/package/path-to-regexp for details
- methods: the http methods that should be handled at this route
  - e.g. `get`, `post`, `put`, `delete`, `patch`
- handler: the Controller function that should handle requests at this route

Example:

```js
module.exports = [
{
    path: '/agol/:id/datasets',
    methods: ['get'],
    handler: 'get'
  },
  {
    path: '/agol/:id/datasets/:dataset.:format',
    methods: ['get'],
    handler: 'get'
  },
  {
    path: '/agol/:id/datasets/:dataset',
    methods: ['get'],
    handler: 'get'
  },
  {
    path: '/agol/:id/datasets/:dataset/:method',
    methods: ['delete'],
    handler: 'post'
  },
      {
    path: '/agol/:id/datasets/:dataset/:method',
    methods: ['delete'],
    handler: 'delete'
  }
]
```

### Controller.js

Providers can do more than simply implement `getData` and hand GeoJSON back to Koop's core. In fact, they can extend the API space in an arbitrary fashion by adding routes that map to controller functions. Those controller functions call functions on the model to fetch or process data from the remote API.

The purpose of the Controller file is to handle additional routes that are specified in `route.js`. It is a class that is instantiated with access to the model. Most processing should happen in the model, while the controller acts as a traffic director.

As of Koop 3.0, you **do not** need to create a controller. If you want to add additional functionality to Koop that is not supported by an output plugin, you can add additional functions to the controller.

Example:

```js
module.exports = function (model) {
  this.model = model
  /**
   * returns a list of the registered hosts and their ids
   */
  this.get = function (req, res) {
    this.model.log.debug({route: 'dataset:get', params: req.params, query: req.query})
    if (req.params.dataset) this._getDataset(req, res)
    else this._getDatasets(req, res)
  }

  /**
   * Put a specific dataset on the queue
   */
  this.post = function (req, res) {
    this.model.log.debug({route: 'POST', params: req.params, query: req.query})
    if (req.params.method === 'import') this.model.enqueue('import', req, res)
    else if (req.params.method === 'export') this.model.enqueue('export', req, res)
    else return res.status(400).json({error: 'Unsupported method'})
  }

  /**
   * Deletes a dataset from the cache
   */
  this.delete = function (req, res) {
    this.model.log.debug(JSON.stringify({route: 'dataset:delete', params: req.params, query: req.query}))
    var ids = this.model.decomposeId(req.params.dataset)
    this.model.dropResource(ids.item, ids.layer, {}, function (err) {
      if (err) return res.status(500).send({error: err.message})
      res.status(200).json({status: 'Deleted'})
    })
  }

  this._getDataset = function (req, res) {
    this.findRecord(req.params, function (err, dataset) {
      if (err) return res.status(404).json({error: err.message})
      res.status(200).json({dataset: dataset})
    })
  }

  this._getDatasets = function (req, res) {
    this.model.findRecords(req.query, function (err, datasets) {
      if (err) return res.status(500).json({error: err.message})
      res.status(200).json({datasets: datasets})
    })
  }
}
```
_[back to top](#contents)_
