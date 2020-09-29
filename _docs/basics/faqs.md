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

<br>
### Can Koop reproject data to different coordinate systems?
By default, Koop has limited support for reprojection. The Geoservices output plugin includes an `outSR` query parameter that allows for data requests in a non-WGS84 coordinate system. The value of `outSR` can be a spatial reference ID or WKT. If a valid WKT is used as the request's `outSR`, Koop will use it to reproject the data. However, if the request's `outSR` is a spatial reference ID, only a few values will lead to successful reprojection - 4326, 4269, and 3857. This is because Koop uses the [proj4 library](https://github.com/proj4js/proj4js) which only includes default support for those three projections.

If you need to support other values of `outSR`, you have a couple of options.  If authoring your own provider, you can check incoming values of `outSR` in the `getData` method. If an unsupported value arrives, you lookup it's WKT in something like [proj-codes](https://www.npmjs.com/package/@esri/proj-codes) or a remote API like [spatialreference.org](https://spatialreference.org), then assign the WKT as the value of `outSR`.  If you are using an already published provider, you can use the `before` or `after` transformation functions to apply the same strategy. The usage section of [provider transformation functions](../usage/provider#figure-5) has a code example.

<br>
### How can I disable Koop warnings from the console/logs?
You may see Koop related warnings in the console output.  Most often these are related to an unset `idField`, an `idField` that has an invalid value, or invalid GeoJSON.  Note that invalid GeoJSON warnings may occur for any GeoJSON that does not conform to the specification noted by [IEFT](https://tools.ietf.org/html/rfc7946).  Koop can work with non-standard GeoJSON (e.g., polygons with reversed winding are okay), so in many or most cases these warnings can be ignored.  The warnings can be disabled by setting the `KOOP_WARNINGS` environment variable prior to start-up:

```bash
> KOOP_WARNINGS=suppress node server.js
```