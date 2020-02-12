---
title: Provider
permalink: /docs/usage/provider
---

In your Koop server file, the provider must be registered with the Koop instance before the it begins listening.

<div class='codeanchor' id="figure-1"></div>
```js
const Koop = require('koop')
const koop = new Koop()
const provider = require('<provider-npm-package or local-path>')
koop.register(provider, { /* provider options */ })
koop.server.listen(80)
```
<figcaption><i>Figure 1. Example of a Koop instance registering a provider.</i></figcaption>

## Options

### `name`
Use the `name` option to change the namespace of the provider. For example, registering the Github provider with a `name` option of `my-provider` will generating routes using that custom name:

<div class='codeanchor' id="figure-2"></div>
```js
const koop = new Koop()
const socrata = require('@koopjs/provider-socrata')
koop.register(socrata)
koop.register(socrata, { name: 'my-provider' })
```
<figcaption><i>Figure 2. Use the <code class='highlighter-rouge'>name</code> option to change the namespace of a registered provider. It will allow registration of the same provider more than once, but with differently namespaced routes.</i></figcaption>

In [figure 2](#figure-2), we are able to use the `name` option to register the same Socrata provider more than once, but with distinct route namespacing. The first registration produces routes like `/koop-provider-socrata/:host/:id/FeatureServer/:layer/:method` while the second generates routes like `/my-provider/:host/:id/FeatureServer/:layer/:method` this can be useful if you want to register multiple providers with different transformation functions.

### `before`
The `before` option allows you to add a "transformation" function to the provider call stack. It is useful if you want to use an existing provider but execute a block of code _before_ the provider's `getData` method. It can be used to modify the Express `request` object.

#### Arguments  

| name | type | description |
| - | - | - |
|request| Object | An Express `request` object. Contains route and query parameters for use in building the URL to the remote API. See the [Express documentation](https://expressjs.com/en/4x/api.html#req) for more details. |
|callback| Function| An error-only callback function. It function similiar to the Express `next` function. If no error, fire the callback with no arguments. |

An example of using the `before` transform might be to reject requests for certain resources:

<div class='codeanchor' id="figure-3"></div>
```js
const koop = new Koop()
const socrata = require('@koopjs/provider-socrata')
koop.register(socrata, {
  before: (request, callback) => {
    const { params: { id } } = request

    // Reject any requests with id 'xyz'
    if (id === 'xyz') {
      const error = new Error('Forbidden')
      error.code = 403
      return callback(error)
    }
    callback()
  }
})
```
<figcaption><i>Figure 3. Example of using a <code class='highlighter-rouge'>before</code> function to reject specific requests.</i></figcaption>

The before function can also be used to modify the `request` objects.  In the example below, query parameter `outSR` is replace with a WKT when it arrives with a value of 2285:

```js
const koop = new Koop()
const socrata = require('@koopjs/provider-socrata')
koop.register(socrata, {
  before: (request, callback) => {
    const { query: { outSR } } = request

    if (outSR === 2285) req.query.outSR = `PROJCS["NAD83/WashingtonNorth(ftUS)",GEOGCS["NAD83",DATUM["North_American_Datum_1983",SPHEROID["GRS1980",6378137,298.257222101,AUTHORITY["EPSG","7019"]],TOWGS84[0,0,0,0,0,0,0],AUTHORITY["EPSG","6269"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4269"]],PROJECTION["Lambert_Conformal_Conic_2SP"],PARAMETER["standard_parallel_1",48.73333333333333],PARAMETER["standard_parallel_2",47.5],PARAMETER["latitude_of_origin",47],PARAMETER["central_meridian",-120.8333333333333],PARAMETER["false_easting",1640416.667],PARAMETER["false_northing",0],UNIT["USsurveyfoot",0.3048006096012192,AUTHORITY["EPSG","9003"]],AXIS["X",EAST],AXIS["Y",NORTH],AUTHORITY["EPSG","2285"]]`

    callback()
  }
})
```
<figcaption><i>Figure 4. Example of using a <code class='highlighter-rouge'>before</code> function to modify a request object's query parameter.</i></figcaption>

### `after function(request, geojson, callback)`
The `after` option allows you to add a "transformation" function to the provider call stack that executes custom code _after_ the provider's `getData` method. It can be used to modify the Express `request` object and / or the provider-generated GeoJSON object.

#### Arguments  

| name | type | description |
| - | - | - |
|request| Object | An Express `request` object. Contains route and query parameters for use in building the URL to the remote API. See the [Express documentation](https://expressjs.com/en/4x/api.html#req) for more details. |
|geojson| Object | The GeoJSON generated by the provider's `getData` method |
|callback| Function| An error-first callback function. If no error, the second argument should be the `geojson` object. |


## Plugin registration order
The order in which you register plugins can affect functionality.  The key points are:  
* Provider data will only be accessible from output-plugin routes if the provider is registered _after_ the output-plugin
* Provider data will only be secured by an authorization plugin if the provider is registered _after_ the authorization-plugin.

You can therefore micro-manage provider accessibility by adjusting the registration order of various plugins.

## Route prefixing
If needed, you can add a prefix to all of a registered provider's routes.  For example, if you wanted the fragment `/api/v1` prepended to you github provider routes you could register the provider like this:

```js
const provider = require('@koopjs/provider-github')
koop.register(provider, { routePrefix: '/api/v1'})
```

which results in routes like:

`/api/v1/github/:id/FeatureServer`

## Koop CLI

If you are using the Koop CLI, adding a new provider to you Koop application is easy:

```bash
> koop add provider <provider-plugin-package-or-path>
```

See the Koop CLI [documentation](https://github.com/koopjs/koop-cli#add) for additional options and details.
