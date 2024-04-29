---
title: Provider Types
permalink: /docs/basics/provider-types
---

All Koop providers do one essential thing: fetch data from a remote API and convert it to GeoJSON. There are two basic patterns for implemention: *full-fetch*  or *pass-through*. *full-fetch* providers fetch **all** dataset records from the remote API and passes that full dataset on to Koop's internal libraries for any futher post-processing (filtering, transformations, or sorting). *pass-through* providers ask the remote API to do at least some of any post-processing defined by request parameters. This often results in a subset of the full dataset being fetched from the remote API.

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

Pass-through providers act as a proxy/translator between the client and the remote API.  More specifically, they convert GeoServices API query parameters to the analogous query parameters on the remote API. As a result, pass-through providers only fetch a targeted subset of the remote dataset. As an example, consider this request to the [Mongo DB provider](https://github.com/koopjs/koop-provider-mongo):

```
http://localhost:8080/mongo/rest/services/fires/FeatureServer/0/query?where=country='United States'
```

The MongoDB provider handles this request by converting the GeoServices API `where` parameter to the MongoDB equivalent. It then fetches *only* the subset of data with `country` equal to 'United States'. This partial dataset is then passed on to Koop and then back to the client.  

It's important to note that the pass-through pattern can be partially applied, i.e., you don't have to provide a translation for every GeoService API query parameter.  For example, you might author a translation for the `where` parameter, but not the `time` or `geometry` parameters.  Partial support for query parameters is still useful, because it reduces the size of the dataset fetched from the remote.  

Developers need to be careful when passing on pagination or limit parameters to the remote API.  If _all_ of the parameters cannot be passed through, developers should exclude limits from any query against the remote API (i.e., don't tranlate `resultRecordCount` to it's remote API equivalent). This is because a limit parameter might truncate the result set _before_ all the filters are applied.  As an illustration, consider this scenario.

1. A request arrives with the following parameters `where=country='USA'`, `geometry={"xmin":-120,"ymin":48,"xmax":-119,"ymax":49}`, and `resultRecordCount=100`.
2. The remote API supports filtering by attribute, but not by geometry.
3. The remote API supports truncating the result set with a `limit` parameter
4. The code is the provider sends the request on to the remote API, translating the `where` and the `resultRecordCount` parameters.
5.  The remote API returns the first 100 results where attribute `country` is "USA", but only some of these records lie inside the geometry envelope noted above.  There are more records that do exist inside this envelope, but the remote has no way to filter or ensure they are included in the first 100 records returned.
6. The results are passed on to Koop, which then applies the geometry filter; this removes 70 records that lie outside the requested geometry envelope.
7. Koop responds to the client with a result set of only 30 records, even though many more exist that fit the requested attribute and geometry parameters.

As you can see, the response is missing important features, because the result set was truncated _before_ all filters were applied.  Developers should be mindful of this anti-pattern when create providers that pass off filtering/sorting to their remote APIs.

#### `filtersApplied`
If you do use the pass-through pattern, it is important that you add the `filtersApplied` object to the GeoJSON delivered by your provider. The object should have a boolean flag for any Geoservices operation that has already been executed on the GeoJSON.

```js
  filtersApplied: {
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

