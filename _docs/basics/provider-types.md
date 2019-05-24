---
title: Provider Types
permalink: /docs/basics/provider-types
---

All Koop providers do one essential thing: fetch data from a remote API and convert it to GeoJSON. There are two basic patterns for implemention : *cached*  or *pass-through*. The difference is how much data is fetched from the remote API. Cached providers fetch all dataset records from the remote API. Pass-through providers request only a subset of the data based on a request's query parameters.

Note that a Cached provider is not the same thing as a Koop cache-plugin. A cache-plugin allows data fetched from the remote API to be stored (in memory or Redis) so that similiar requests do not result in repeated fetches to the remote API.  You may still want to use a cache-plugin even if your provider follows the pass-through pattern.

### Cached Providers

As noted above, Cached providers request entire datasets from the remote API. The `getData` function of the provider does not pass on any additional parameters to the remote API that allow it to narrow the dataset.  For example, consider this request to the [Craigslist provider](https://github.com/dmfenton/koop-provider-craigslist):

```
http://localhost:8080/craigslist/houston/apartments/FeatureServer/0/query?where=price<=1000
```

The Craigslist provider handles this request by fetching *all* the apartment records for Houston, regardless of price.  It then passes the full dataset on to Koop which uses Winnow to filter the records down to only those with `price < 1000`. This pattern is termed "cached" because the full dataset is cached in memory for Winnow to operate on.

It makes sense to use a cache-provider strategy if at least one of the following is true:

- The remote dataset is very small
- The entire remote dataset can be fetched
- The remote API does not support filters or geographic queries
- The remote API is slow to respond

### Pass-Through

Pass-through providers act as a proxy/translator between the client and the remote API.  More specifically, they convert GeoServices API query parameters to the analogous query parameters on the remote API. As a result, pass-through providers only fetch a targeted subset of the remote dataset. As an example, consider this request to the [Google Analytics provider](https://github.com/koopjs/koop-provider-google-analytics):

```
http://localhost:8080/metrics/sessions::views/eventCategory/FeatureServer/0/query?where=country='United States'
```

The Google Analytics provider handles this request by converting the GeoServices API `where` parameter to the Google Analytics API equivalent. It then fetches *only* the subset of data with `country` equal to 'United States'. This partial dataset is then passed on to Koop and then back to the client.  (Pro tip: Koop/Winnow will attempt to apply the `where` filter to the partial dataset a second time unless you flag the dataset as already having the `where` applied).

It's important to note that the pass-through pattern can be partially applied, i.e., you don't have to provide a translation for every GeoService API query parameter.  For example, you might author a translation for the `where` parameter, but not the `time` or `geometry` parameters.  Partial support for query parameters is still useful, because it reduces the size of the dataset the Koop/Winnow has to loop through to apply other filters or sorts.

It makes sense to use a pass-through strategy if at least one of the following is true:

- The remote dataset is too large to be fetched as a whole
- The remote API does not allow fetching the entire dataset
- The remote API supports filters and geographic queries
- The remote API is quick to respond

