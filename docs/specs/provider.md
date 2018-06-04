# Provider

Add support for any remote API or datasource to Koop. Dive into the docs below or check out a working sample [here](https://github.com/koopjs/koop-provider-sample).

## Index.js

Every provider must have a file called `index.js`. Its purpose is to tell Koop how to load and use the provider. The keys and values are enumerated in the example below.
<script src="https://gist.github.com/dmfenton/93379d71f4412716b3e508e1c8612cfa.js"></script>

## Model.js

Every provider must have a Model. This is where almost all of the business logic of the provider will occur. Its primary job is to fetch data from a remote source like an API or database and return GeoJSON to Koop for further processing.

### Function: getData

Models are required to implement a function called `getData`.  It should fetch data from the remote API, translate the data into GeoJSON (if necessary) and call the `callback` function with the GeoJSON as the second parameter. If there is an error in fetching or processing data from the remote API it should call the `callback` function with an error as the first parameter and stop processing.

<script src="https://gist.github.com/dmfenton/066061daa62b53c60f1fcbf94ade9567.js"></script>

#### Metadata
You can add a `metadata` property to the GeoJSON returned from `getData` and assign it an object for use in Koop output services. In addtion to `name` and `description` noted in the example above, the following fields may be useful:

<script src="https://gist.github.com/rgwozdz/5080e5e66ee1b3452bdb300602150247.js"></script>

The data type and values used for `idField` can affect the output of the [koop-output-geoservices](https://github.com/koopjs/koop-output-geoservices) and behavior of some consumer clients. [FeatureServer](https://github.com/koopjs/FeatureServer) and [winnow](https://github.com/koopjs/winnow) (dependencies of [koop-output-geoservices](https://github.com/koopjs/koop-output-geoservices)) will create a separate OBJECTID field and set its value to the value of the attribute referenced by `idField`. OBJECTIDs that are not integers or outside the range of 0 - 2,147,483,647 can break features in some ArcGIS clients.

## Cached vs Pass-Through

Providers typically fall into two categories: cached and pass-through.

### Pass-Through

Pass-through providers do not store any data, they act as a proxy/translator between the client and the remote API.

[Koop-Provider-Yelp](https://github.com/koopjs/Koop-Provider-Yelp) is a good example. The Yelp API supports filters and geographic queries, but it only returns 20 results at a time and there is no way to download the entire Yelp dataset.

It makes sense to use a pass-through strategy if at least one of the following is true:
- The remote dataset changes frequently
- The remote dataset is very small
- The remote dataset is too large to be fetched as a whole
- The remote API does not allow fetching the entire dataset
- The remote API supports filters and geographic queries
- The remote API is quick to respond

The request below fetches data from yelp and translates it into Geoservices JSON

```
http://localhost:8080/yelp/FeatureServer/0?where=term=pizza
```
GeoJSON can be retrieved as well
```
http://localhost:8080/yelp/FeatureServer/0?where=term=pizza&f=geojson
```

### Cached

Cached providers periodically request entire datasets from the remote API.

[Koop-Provider-Craigslist](https://github.com/dmfenton/koop-provider-craigslist) is a good example. The Craigslist API returns the entire set of postings for a given city and type in one call (e.g. Atlanta apartments). The data also does not change that frequently. Therefore the Craigslist provider uses the Koop cache with a TTL of 1 hour, guaranteeing that data will never be more than an hour out of date.

It makes sense to use a cache strategy if at least one of the following is true:
- The remote dataset does not change often
- The remote dataset is large
- The entire remote dataset can be fetched
- The remote API does not support filters or geographic queries
- The remote API is slow to respond

## Advanced

Providers can do more than simply implement `getData` and hand GeoJSON back to Koop's core. In fact, they can extend the API space in an arbitrary fashion by adding routes that map to controller functions. Those controller functions call functions on the model to fetch or process data from the remote API.

### Request parameters in `getData` 

Recall the `getData` function receives `req`, an Express.js [request](https://expressjs.com/en/4x/api.html#req) object. `req` includes a set of [route parameters](https://expressjs.com/en/4x/api.html#req.params) accessible with `req.params`, as well as a set of [query-parameters](https://expressjs.com/en/4x/api.html#req.query) accessible with `req.query`. Parameters can be used by `getData` to specify the particulars of data fetching.  For example, route parameters `:host` and `:id` provide the [Craiglist `getData` function](https://github.com/dmfenton/koop-provider-craigslist/blob/master/model.js#L12-L14) with information necessary to generate URLs for requests to the Craigslist API. 

- `:id`  
Koop includes the `:id` parameter on all service endpoints created with output-services plugins by default. So requests like `/provider/:id/FeatureServer/0` will work. You can remove the `:id` parameter from your routes by editing `index.js` and setting `disableIdParam: true`. Then requests like `/provider/FeatureServer/0` will work. It will be accessible in `getData` with `req.params.id`.

- `:host`  
The provider specification allows for another route parameter, `:host`, that precedes `:id`. By default, the `:host` parameter is disabled.  You can configure your provider to add it by editing the `index.js` file and setting `hosts: true`. Then requests like `/provider/:host/:id/FeatureServer/0` will work. It will be accessible in `getData` with `req.params.host`.

##### Output-services route parameters
By default, Koop includes the [koop-output-geoservices](https://github.com/koopjs/koop-output-geoservices) output-service. It adds a set of `FeatureServer` routes, some of which include addtional route parameters that can be used in your Model's `getData` function. 

- `:layer`  
The `:layer` parameter is defined on all FeatureServer requests of form `/provider/:host/:id/FeatureServer/:layer`. It will be accessible in `getData` with `req.params.layer`.

- `:method`  
The `:method` parameter is defined on all FeatureServer requests of form `/provider/:host/:id/FeatureServer/:layer/:method`. It will be accessible in `getData` with `req.params.method`.  Note that `query` and `generateRenderer` are the only values currently supported by [FeatureServer](https://github.com/koopjs/FeatureServer), a [koop-output-geoservices](https://github.com/koopjs/koop-output-geoservices) dependency.  All other values will produce a `400, Method not supported` error.  

##### Query parameters
As noted above, any query-parameters added to the request URL can accessed within `getData` and leveraged for data fetching purposes.  For example, a request `/provider/:id/FeatureServer/0?foo=bar` would supply `getData` with `req.query.foo` equal to `bar`. With the proper logid, it could then be used to limit fetched data to records that had an attribute `foo` with a value of `bar`.

### Generation of provider-specific output-routes
The position of the provider-specific fragment of a route path can vary depending on the `path` assignment in the `routes` array object of your output-services plugin.  By default, Koop will construct the route with the provider's parameters first, and subsequently add the route fragment defined by an output-services plugin.  However, if you need the route path configured differently, you can add the `$namespace` and `$providerParams` placholders anywhere in the output-services path. Koop will replace these placeholders with the provider-specific route fragments (i.e, namespace and `:host/:id`). For example, an output path defined as `$namespace/rest/services/$providerParams/FeatureServer/0` would translate to `provider/rest/services/:host/:id/FeatureServer/0`.

### Output-routes without provider parameters
You may need routes that skip the addition of provider-specific parameters altogether.  This can be accomplished by adding an `absolutePath: true` key-value to the `routes` array object in your output-services plugin. On such routes, Koop will define the route without any additional provider namespace or parameters.

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

<script src="https://gist.github.com/dmfenton/a8eacc31afeb460cbc919e7e2095f4ce.js"></script>

### Controller.js

The purpose of the Controller file is to handle additional routes that are specified in `route.js`. It is a class that is instantiated with access to the model. Most processing should happen in the model, while the controller acts as a traffic director.

As of Koop 3.0, you **do not** need to create a controller. If you want to add additional functionality to Koop that is not supported by an output plugin, you can add additional functions to the controller.

Example:

<script src="https://gist.github.com/dmfenton/0a0f5d287b4cc2a7f3fbf9616b004198.js"></script>


### Model.js
In addition to implementing `getData`, the model exists to interact with the remote API and to serve the controller. Any function the controller would need to call to handle a request should be implemented as a public function on the model.

Example:

<script src="https://gist.github.com/dmfenton/ab9ce1deea644c176092a44010b0ede3.js"></script>
