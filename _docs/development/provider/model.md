---
title: Provider Specification - Model class
permalink: /docs/development/provider/model
---
Every provider must implement a `Model` class. Its primary job is to fetch data from a remote source like an API or database and return GeoJSON to Koop for further processing. This class is usually placed in a file called `model.js` and then referenced in the registration object. The follow snippet shows an example implementation:

<div class='codeanchor' id="figure-1"></div>

```js
// Example Model class
function Model () {}

Model.prototype.getData(request, callback) {

  // use the npm package `request` fetch geojson from Socrata API
  request('https://data.ct.gov/resource/y6p2-px98.geojson', (err, res, geojson) => {

    // if the http request fails, return and callback with error
    if (err) return callback(err)

    // Set metadata used by Koop
    geojson.metadata = { geometryType: 'Point' }

    callback(null, geojson)
  })
}

module.exports = Model
```
<figcaption><i>Figure 1. Basic Model class with a <code class='highlighter-rouge'>getData</code> method that fetches GeoJSON from the Socrata API.</i></figcaption>
<hr>

## Method: `getData(request, callback)`

The `getData` method is a requirement of *all* providers. It will fetch data from a remote API and convert it to GeoJSON. It may also add a `metadata` property to the GeoJSON object and populate it appropriately. Using the callback argument, it should handle any errors, or pass the GeoJSON object as its second argument.

### Arguments

| name | type | description |
| - | - | - |
|`request`| Object | An Express `request` object. Contains route and query parameters for use in building the URL to the remote API. See the [Express documentation](https://expressjs.com/en/4x/api.html#req) for more details. |
|`callback`| Function| The Koop error-first callback function. GeoJSON should be passed as the second parameter to this callback. |

### Fetching data from the remote API

#### Route parameters
The details of how you fetch data from the remote API depends on how responsive you want the provider to be. The example in [figure 1](#figure-1) is extremely simple, but also not very responsive; it will only fetch data for the resource at `https://data.ct.gov/resource/y6p2-px98.geojson`. Instead, we can use Koop's route parameters, found in the `request` object, to build the URL to the remote API.

<div class='codeanchor' id="figure-2"></div>

```js
Model.prototype.getData(request, callback) {

  // Get 'host' and 'id' params from request object
  const { params: { host, id } } = request

  // Use 'host' and 'id' to build URL to remote API
  request(`https://${host}/resource/${id}.geojson`, (err, res, geojson) => {

    if (err) return callback(err)

    callback(null, geojson)
  })
}
```
<figcaption><i>Figure 2. Using Koop's <code class='highlighter-rouge'>host</code> and <code class='highlighter-rouge'>id</code> parameters to build the remote API URL.</i></figcaption>

In [figure 2](#figure-2), we take the `host` and `id` parameters from the incoming Koop request, and use them to dynamically build the remote API request.  Thus, parameters in the Koop request determine which resource is returned.  Using the code example in [figure 2](#figure-2), a Koop request like `http://localhost:8080/koop-provider-socrata/my-host/my-id/FeatureServer/0/query` would construct a remote API URL like `https://my-host/resource/my-id.geojson`.  

Note that you need to configure the provider to use the `host` and`id` parameters using the `hosts` and `disableIdParam` settings, otherwise routes will be built without them and they will be undefined in `getData`. See [provider registion docs](./registration) for more details.

In addition to `host` and `id`, there may be other route parameters available in `getData`. It all depends on how the output-plugin defines its routes. For example, the Geoservices output defines the following route `/FeatureServer/:layer/:method`. On a request like `http://localhost:8080/koop-provider-socrata/my-host/my-id/FeatureServer/0/query`, `getData` could also access the `layer` and `method` parameters, which would have values of `0` and `query`, respectively.

#### Query parameters
Any query parameters that are part of the Koop request can be accessed in the `getData` function and may be useful for building the request to the remote API.

<div class='codeanchor' id="figure-3"></div>

```js
Model.prototype.getData(request, callback) {

  // Get 'host', 'id', 'where' params from request object
  const { params: { host, id }, query: { where } } = request

  // Use 'host' and 'id' to build URL to remote API
  request(`https://${host}/resource/${id}.geojson?where=${where}`, (err, res, geojson) => {

    if (err) return callback(err)

    geojson.filtersApplied = { where: true }

    callback(null, geojson)
  })
}
```
<figcaption><i>Figure 3. Using Koop's route and query parameters to build the remote API URL.</i></figcaption>

In figure 3, we attach the `where` query parameter from the Koop request to the remote URL. This allows the remote API to executing some of the data filtering, which reduces the amount of data coming over the wire and the amount of post-processing for Koop.  Provider that pass on such instructions to remote API are termed *pass-through* providers.

If you do end up using query parameters to offload operations, you can add a `filtersApplied` object to your GeoJSON. The object should have a boolean flag for any Geoservices operation that has already been executed on the GeoJSON. See the example in figure 3, and the [FeatureServer documentation](https://github.com/koopjs/FeatureServer#featureserverroute) for addition information on `filtersApplied` flags.

### Translating fetched data to GeoJSON
In the code snippets above, the remote API returned GeoJSON, so no translation was necessary. Your remote data source may not offer GeoJSON as a format. In such a case, there must be a translation function to convert the fetch data to GeoJSON.

GeoJSON passed to the callback function should be valid with respect to the [GeoJSON specification](https://tools.ietf.org/html/rfc7946).  Operations in some output-plugins may expect standard GeoJSON properties and / or values. In some cases, having data that conforms to the [GeoJSON spec's righthand rule](https://tools.ietf.org/html/rfc7946#section-3.1.6) is esstential for generating expected results (e.g., features crossing the antimeridian).  Koop includes a GeoJSON validation that is suitable for non-production environments and is active when `NODE_ENV` is *not* `production` and `KOOP_WARNINGS` is *not* set to `suppress`.  In this mode, invalid GeoJSON from `getData` will trigger informative console warnings.

### Adding provider `metadata` to the GeoJSON

You should add a `metadata` object to the GeoJSON returned from `getData` (see Figure 1). Many Koop output plugins will expect `metadata` to be defined and use certain properties therein. For example, Koop's default Geoservices output-plugin uses `metadata.geometry` to determine if the data is spatial or tabular. There are many other optional metadata settings (shown below) that may be useful for customizing your Geoservices output.

| key | type | description | example |
| - | - | - | - |
| `name` | String | Name of the layer | `'Test layer'` |
| `description` | String | Description of the layer | `'Description of the dataset's` |
| `extent` | Array | Valid extent array | `[[180,90],[-180,-90]]` |
| `displayField` | String | Feature attribute name to be used for display by a client |
| `geometryType` | String | Geometry type of the features. If not set, Geoservice plugin will use first feature to determine type. If first feature has no geometry, it will assume tabular data. Possible values: `Point`, `MultiPoint`, `LineString`, `MultiLineString`, `Polygon`, `MultiPolygon` | `'Point'`
| `idField` | String | Key of feature attribute that should be used as the unique identifier field. Should point to an integer attribute with a range of 0 - 2,147,483,647 | `'id'` |
| `maxRecordCount` | Number | Maximum number of features a provider can return at once | `1000` |
| `limitExceeded` | Boolean | Whether total number of features in data source is greater than number being returned | `true` |
| `timeInfo` | Object | Describes the time extent and capabilities of the layer | |
| `transform` | Object | Describes a quantization transformation | |
| `fields` | Object[] | An array of objects that describe feature attribute details.  There should be one object for each feature attribute. | `{ name: 'state', type: 'String', alias: 'State', length: 2 }` |
| `fields[0].name` | String | Key used in the GeoJSON `properties` | `'state'`|
| `fields[0].type` | String | Data type. valid types include: `'Date'`, `'Double'`, `'Integer'`, `'String'` | `String` |
| `fields[0].alias` | String | How should clients display this attribute name (optional) | `'State'` |
| `fields[0].length` | Number | Max length for a String or Date field (optional) | 2 |

#### Special considerations for `idField`
As noted above `idField` designates which feature attribute should be used as the feature's unique identifier.  For ArcGIS clients, having a unique identifier is required, and it must be of type integer and in the range of 0 - 2,147,483,647, otherwise some functionality cannot be supported. If you chose not to set `idField` or don't have a feature attribute that fits its requirements, Koop will create an OBJECTID field in its Geoservices output by default which can be used as a unique identifier.  Its value is calculated as the numeric hash of each feature. While you can let Koop handle this, define an `idField` in your metadata is overall more reliable.

## Method: `createKey(request)`
Koop uses a an internal `createKey` function to generate a string for use as a key in the cache-plugin's key-value store. Koop's `createKey` uses the provider name and route parameters to define a key.  This allows all requests with the same provider name and route parameters to leverage cached data.  

Models can optionally implement a function called `createKey`.  If defined, the Model's `createKey` overrides Koop's internal function.  This can be useful if the cache key should be composed with additional parameters.

### Arguments

| name | type | description |
| - | - | - |
| `request` | Object | An Express `request` object. Contains route and query parameters for use in building the URL to the remote API. See the [Express documentation](https://expressjs.com/en/4x/api.html#req) for more details. |

In the example below, the `createKey` method uses the query parameter `start` to make a more specific cache key:

<div class='codeanchor' id="figure-4"></div>

```js
Model.prototype.createKey = function (request) {

  const { url, params: { host, id }, query: { start } } = request

  const keyFragments = []

  // Add provider name
  keyFragments.push(url.split('/')[1])

  if (host) keyFragments.push(host)

  if (id) keyFragments.push(id)

  if (start) keyFragments.push(start)

  return keyFragments.join('::')
}
```
<figcaption><i>Figure 4. Defining a custom <code class='highlighter-rouge'>createKey</code> method for generating cache keys.</i></figcaption>
