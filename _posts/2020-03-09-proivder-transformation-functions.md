---
layout: post
title:  "Introduction to provider transformation functions"
date:   2020-03-09 15:00:00
author: Rich
---

Koop 3.17.0 supports a new feature we call *provider transformation functions*. These functions are registration options that allow you customize the behavior and response of a provider's `getData` method **without** having to fork and alter a provider's code.  

## The `before` function
A `before` function registered with a provider will execute prior to the provider's `getData` method and can be used to gate access or modify the Express request object.  In the example below, we use the `before` to reject the request for a given `id`:

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

Another example use case of provider transformation functions is adding support for additonal output spatial references.  While Koop's default output supports the `outSR` parameter, it only does so for spatial references that the `proj4` library keeps in memory.  To get output in any other spatial reference, `outSR` must be a valid WKT.  However, many clients only send `outSR` as a WKID.  You can use either transformation function to convert WKIDs to their WKT equivalent and assign that value to the `outSR` parameter..

```js
const koop = new Koop()
const socrata = require('@koopjs/provider-socrata')

koop.register(socrata, {
  before: (request, callback) => {

    const { query: { outSR } } = request

    if (outSR === 2285) request.query.outSR = `PROJCS["NAD83/WashingtonNorth(ftUS)",GEOGCS["NAD83",DATUM["North_American_Datum_1983",SPHEROID["GRS1980",6378137,298.257222101,AUTHORITY["EPSG","7019"]],TOWGS84[0,0,0,0,0,0,0],AUTHORITY["EPSG","6269"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4269"]],PROJECTION["Lambert_Conformal_Conic_2SP"],PARAMETER["standard_parallel_1",48.73333333333333],PARAMETER["standard_parallel_2",47.5],PARAMETER["latitude_of_origin",47],PARAMETER["central_meridian",-120.8333333333333],PARAMETER["false_easting",1640416.667],PARAMETER["false_northing",0],UNIT["USsurveyfoot",0.3048006096012192,AUTHORITY["EPSG","9003"]],AXIS["X",EAST],AXIS["Y",NORTH],AUTHORITY["EPSG","2285"]]`

    callback()
  }
})
```

Note that in the examples above, we were able to effectively modify the functionality of the Socrata provider without having to edit the provider code base.

## The `after` function

An `after` function registered with a provider will execute after the provider's `getData` method and can be used modify the provider-generated GeoJSON or the Express.js request object.  The `after` function can be extremely helpful if your source data is not WGS84.  Since Koop currently expects all data coming out of `getData` to have spatial reference WGS84, you can use the `after` function to reproject it before it gets passed on to Koop outputs:

```js
const koop = new Koop()
const reproject = require('reproject')
const proj4 = require('proj4')
const github = require('@koopjs/provider-github')

koop.register(github, {
  after: (request, geojson, callback) => {

    const fromSR = `PROJCS["NAD83/WashingtonNorth(ftUS)",GEOGCS["NAD83",DATUM["North_American_Datum_1983",SPHEROID["GRS1980",6378137,298.257222101,AUTHORITY["EPSG","7019"]],TOWGS84[0,0,0,0,0,0,0],AUTHORITY["EPSG","6269"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4269"]],PROJECTION["Lambert_Conformal_Conic_2SP"],PARAMETER["standard_parallel_1",48.73333333333333],PARAMETER["standard_parallel_2",47.5],PARAMETER["latitude_of_origin",47],PARAMETER["central_meridian",-120.8333333333333],PARAMETER["false_easting",1640416.667],PARAMETER["false_northing",0],UNIT["USsurveyfoot",0.3048006096012192,AUTHORITY["EPSG","9003"]],AXIS["X",EAST],AXIS["Y",NORTH],AUTHORITY["EPSG","2285"]]`

    try {
      const wgs84Data = reproject(fromSR, proj4.wgs84, geojson)
      callback(null, wg484Data)
    } catch (err) {
      callback(err)
    }
  }
})
```

In the `after` function above, we use the `reproject` library to convert geojson arriving with geometry in the EPSG:2285 coordinate system to WGS84, then pass it onto to the callback.

To learn more about modify provider behavior with transformation functions, see the [usage docs](docs/usage/provider).
