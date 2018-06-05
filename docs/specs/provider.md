# Provider

Add support for any remote API or datasource to Koop. Dive into the docs below or check out a working sample [here](https://github.com/koopjs/koop-provider-sample).

## Index.js

Every provider must have a file called `index.js`. Its purpose is to tell Koop how to load and use the provider. The keys and values are enumerated in the example below.
<script src="https://gist.github.com/dmfenton/93379d71f4412716b3e508e1c8612cfa.js"></script>

## Model.js

Every provider must have a Model. This is where almost all of the business logic of the provider will occur. Its primary job is to fetch data from a remote source like an API or database and return GeoJSON to Koop for further processing.

### Function: getData

Models are required to implement a function called `getData`.  It should fetch data from the remote API, translate the data into GeoJSON (if necessary) and call the `callback` function with the GeoJSON as the second parameter. If there is an error in fetching or processing data from the remote API it should call the `callback` function with an error as the first parameter and stop processing.

GeoJSON passed to the callback should be valid with respect to the [GeoJSON specification](https://tools.ietf.org/html/rfc7946).  Some operations in output-services expect standard GeoJSON properties and / or values. In some cases, having data that conforms to the [GeoJSON spec's righthand rule](https://tools.ietf.org/html/rfc7946#section-3.1.6) is esstential for generating expected results (e.g., features crossing the antimeridian).  Koop includes a GeoJSON validation that is suitable for non-production environments and can be activated by setting `NODE_ENV` to anything **except** `production`.  In this mode, invalid GeoJSON from `getData` will trigger informative console warnings.

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

### Enable/Disable parameters

Recall the `getData` function takes in a `req` that has a set of `params`:
- host
- id

By default the host parameter is disabled and the id parameter is enabled. So requests like the following would work:

`/provider/:id/FeatureServer/0`

To enable the `host` parameter, edit the `index.js` file and set `hosts` to `true`. Then requests like the following will work:

`/provider/:host/:id/FeatureServer/0`

Sometimes, your provider may need no parameters at all. To disable the `id` parameter, edit `index.js` and set `disableIdParam` to `true`. Then requests like the following will work:

`/provider/FeatureServer/0`

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
