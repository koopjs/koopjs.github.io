---
layout: post
title:  "Support for alternate input and output coordinate systems"
date:   2020-12-11 17:00:00
author: Rich Gwozdz
---

With the recent release of Koop Geoservices v2.2.1, the default FeatureServer query route now supports alternate coordinate reference systems (CRS) for input and output data. Specifically:

### Provider's can supply the Geoservices output-plugin with non-WGS84 geospatial data
Prior to this release, the Geoservices output-plugin expected provider's to supply any geospatial data with WGS84 coordinates.  Data using non-WGS84 CRSs had to either (1) convert their data in advance to WGS84, or (2) convert their data to WGS84 on the fly in their provider or in a provider `after` function. Converting on the fly introduces inefficiencies unless clients request data be output in the WGS84 CRS, because the data has to be reprojected twice; first, in the provider, to WGS84, and second, in the Geoservices output-plugin, to the target CRS.

The Geoservices output-plugin uses the [Winnow](https://github.com/koopjs/winnow) library for post-processing provider GeoJSON, including reprojection. It now supports source data GeoJSON in non-WGS84 CRS.  A provider simply has to either (1) set the GeoJSON `crs` property for the data's CRS, or (2) modify the request's `query` property so that it includes an `inputCrs` property. See the ["Does GeoJSON produced by providers need to use the WGS84 CRS?"](../../../../../docs/basics/faqs#does-geojson-produced-by-providers-need-to-use-the-wgs84-crs) in the FAQs for additional details and references to examples.


It's important to reiterate that support for GeoJSON in non-WGS84 CRSs depends on the output-plugin.  While Koop's default output-plugin, Geoservices (FeatureServer) now supports it, other output plugins (e.g., Vector Tiles) still expect geospatial data that uses WGS84.  These output plugins could be updated to use Winnow to reproject data as necessary - PRs are welcome.

### Reprojection can be requested with CRS WKID
The Geoservices output-plugin has long supported reprojection of geospatial data by way of the `outSR` query parameter. Koop's limitation however, was that the value of `outSR` had to be the WKT representation of the CRS for all but the most common systems (WGS84 or Web Mercator). This was problematic because many clients would use a WKID as the value of `outSR` and Koop would not recognize it. With the release of Geoservices 2.2.1, the output-plugin is able to use the WKID reference for most CRSs. In the event that the WKID is not found, clients can still send a [WKT string](https://spatialreference.org/ref/epsg/2285/ogcwkt/).