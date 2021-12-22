---
title: Frequently Asked Questions
permalink: /docs/basics/faqs
---

### Can Koop fetch more than 1000 records?
**Yes**. The Geoservices output plugin defines a default limit of 1000 records, but this can be overridden by using the `resultRecordCount` query parameter. For example:

```
http://localhost:8080/github/rest/services/koopjs::geodata::trees/FeatureServer/0/query?resultRecordCount=1005
```

You can also access records beyond the first default 1000 by using the pagination parameters:

```
http://localhost:8080/github/rest/services/koopjs::geodata::trees/FeatureServer/0/query?resultRecordCount=1000&resultOffset=1000
```

### Can Koop reproject data to different coordinate systems?
Koop's default output-plugin, Geoservices (i.e., FeatureServer), supports the transformation of data into different coordinate systems with the use of the `outSR` query parameter. `outSR` should be the well-known ID or well-known-text of a coordinate-reference-system (CRS).  Make sure that your Koop instance is using Geoservices > 2.2.1 if you want to use WKIDs in your `outSR` parameter

Other output plugins may or may not support coordinate system transforms to other CRSs.  You should check the plugin documentation.  Output-plugin developers can leverage the [Winnow](https://github.com/koopjs/winnow) to implement the same transformations found in the Geoservices/FeatureServer output.

### Does GeoJSON produced by providers need to use the WGS84 CRS?
It depends on the output-plugins you are leveraging. The Geoservices/FeatureServer output plugin can work with data in non-WGS84 coordinate-reference-systems (CRS), but the CRS needs to be noted either in the GeoJSON's `crs` property or by adding an `inputCrs` query parameter. To set with the GeoJSON `crs` property, you should have something like this attached to the GeoJSON produced by the provider's `getData` method:

```js
geojson.crs = {
  type: 'name',
  properties: {
    name: "urn:ogc:def:crs:OGC:1.3:EPSG::2285"
  }
}
```
where `2285` is an example of a well-known identifier for a CRS.

Alternatively, you can modify the request's `query` object in the `getData` method so that it includes an `inputCrs`:

```
request.query.inputCrs = 2285
```

Note that the GeoJSON `crs` or query parameter `inputCrs` can be set in the provider's `getData` method _OR_ by using a provider `after` function.  See the usage for [after](../usage/provider#after) for examples on setting [crs](../usage/provider#figure-5) and [inputCrs](../usage/provider#figure-6). Also note that your Koop instance should be using Geoservices > 2.2.1.

### How can I disable Koop warnings from the console/logs?
You may see Koop related warnings in the console output.  Most often these are related to an unset `idField`, an `idField` that has an invalid value, or invalid GeoJSON.  Note that invalid GeoJSON warnings may occur for any GeoJSON that does not conform to the specification noted by [IEFT](https://tools.ietf.org/html/rfc7946).  Koop can work with non-standard GeoJSON (e.g., polygons with reversed winding are okay), so in many or most cases these warnings can be ignored.  The warnings can be disabled by setting the `KOOP_WARNINGS` environment variable prior to start-up:

```bash
> KOOP_WARNINGS=suppress node server.js
```

### How should I write my provider to hanlde `timestamp`-style date queries?

Some clients that use Feature Services may format date queries in the `timestamp` style, for example `where=my_date >= timestamp '2021-01-01 06:00:00'` ([more information on querying dates](https://www.esri.com/arcgis-blog/products/api-rest/data-management/querying-feature-services-date-time-queries/)). To ensure Koop filters the data properly, you should use the `metadata.fields` property to designate that field (in this case, `my_date`) as `type: "Date"` and also return the data from your provider using the JavaScript [Date.toISOString() function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString). For example, `properties.my_date = (new Date(year, month, date)).toISOString();`.

### Does Koop support HTTPS?

Koop is a dedicated ET(L) server and doesn't include HTTPS support by default. You should use a proxy server (like nginx) or the service from you cloud provider to add the HTTPS layer in production.

If you just need the HTTPS for local development, the Koop CLI (v1.1+) allows to start a HTTPS dev server for Koop plugins. You can read the [CLI documentation](https://github.com/koopjs/koop-cli/blob/master/docs/commands/serve.md) for more details.

### How to enable the capability to cache data from a provider?

You can easily make the provider cached or pass-through by adding a TTL property. 
For this you need to add a property ttl for model.js file of a provider, as shown bellow:

```
geojson.ttl = 60 // will cache for 60 seconds and you can specify the time in seconds by changing this parameter as you need.
callback(null, geojson)
```
 
 If your data is cached, then during the ttl period Koop will not execute the getData method of your provider. Once the ttl period has expired, Koop will again go to the getData method to acquire the data. If you add some logging to getData you should be able to confirm this.
 
