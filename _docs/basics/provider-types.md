---
title: Provider Types
permalink: /docs/basics/provider-types
---

All Koop providers do one essential thing: fetch data from a remote API and convert it to GeoJSON. There are two basic patterns for implemention: *full-fetch*  or *pass-through*. The difference is how much data is fetched from the remote API. *full-fetch* providers fetch all dataset records from the remote API and passes that full dataset on to Koop's internal libraries for any futher post-processing(filtering, transformations, or sorting). *pass-through* providers ask the remote API to do at least some of any post-processing defined by request parameters.

### Full-fetch Providers

As noted above, *full-fetch* providers request entire datasets from the remote API. The `getData` function of the provider does not pass on any additional parameters to the remote API that allow it to narrow the dataset.  For example, consider this request to the [Craigslist provider](https://github.com/dmfenton/koop-provider-craigslist):

```
http://localhost:8080/craigslist/houston/apartments/FeatureServer/0/query?where=price<=1000
```

The Craigslist provider handles this request by fetching *all* the apartment records for Houston, regardless of price.  It then passes the full dataset on to Koop which uses Winnow to filter the records down to only those with `price < 1000`. This pattern is termed "full-fetch" because the full dataset is stored in memory for Winnow to operate on.

It makes sense to use a *full-fetch* pattern if at least one of the following is true:

- The remote dataset is very small
- The entire remote dataset can be fetched
- The remote API does not support filters or geographic queries
- The remote API is slow to respond

### Pass-Through

Pass-through providers act as a proxy/translator between the client and the remote API.  More specifically, they convert GeoServices API query parameters to the analogous query parameters on the remote API. As a result, pass-through providers only fetch a targeted subset of the remote dataset. As an example, consider this request to the [Google Analytics provider](https://github.com/koopjs/koop-provider-google-analytics):

```
http://localhost:8080/metrics/sessions::views/eventCategory/FeatureServer/0/query?where=country='United States'
```

The Google Analytics provider handles this request by converting the GeoServices API `where` parameter to the Google Analytics API equivalent. It then fetches *only* the subset of data with `country` equal to 'United States'. This partial dataset is then passed on to Koop and then back to the client.  

It's important to note that the pass-through pattern can be partially applied, i.e., you don't have to provide a translation for every GeoService API query parameter.  For example, you might author a translation for the `where` parameter, but not the `time` or `geometry` parameters.  Partial support for query parameters is still useful, because it reduces the size of the dataset the Koop/Winnow has to loop through to apply other filters or sorts.

If you do use the pass-through pattern, it is important that you add the `filtersApplied` object to the GeoJSON delivered by your provider. The object should have a boolean flag for any Geoservices operation that has already been executed on the GeoJSON.

```js
  filtersApplied: {
    all: Boolean // true if all post processing should be skipped
    geometry: Boolean, // true if a geometric filter has already been applied to the data
    where: Boolean, // true if a sql-like where filter has already been applied to the data
    offset: Boolean // true if the result offset has already been applied to the data,
    limit: Boolean // true if the result count has already been limited,
    projection: Boolean // true if the result data has already been projected
  }
```

It makes sense to use a pass-through strategy if at least one of the following is true:

- The remote dataset is too large to be fetched as a whole
- The remote API does not allow fetching the entire dataset
- The remote API supports filters and geographic queries
- The remote API is quick to respond

