---
title: Cache Specification
permalink: /docs/development/cache
---

Any backend can be used as a Koop cache (e.g. PostGIS, Elasticsearch, Redis etc.). All it must do is follow the specification in this document (i.e., expose the noted methods).

## API
The cache stores data from a provider for a set period of time.  All cache implementation should use a ttl (time-to-live) in seconds as an expiry period.  If the data in the cache has been there longer than the expiry period it should not be returned and should be evicted from the cached.

### `insert`
Insert geojson into the cache


```js
const geojson = {
  type: 'FeatureCollection',
  features: [],
  metadata: { // Metadata is an arbitrary object that will be stored in the catalog under the same key as the geojson
    name: 'Example GeoJSON',
    description: 'This is geojson that will be stored in the cache'
  }
}

const options = {
  ttl: 1000 // The TTL option is measured in seconds, it will be used to set the `expires` field in the catalog entry
}

cache.insert('key', geojson, options, err => {
  // This function will call back with an error if there is already data in the cache using the same key
})
```


### `retrieve`
Retrieve a cached feature collection, optionally applying a query or aggregation to the data

```js
const options = {} // This options object may be a query compatible with the GeoServices spec or as is used in Winnow
cache.retrieve('key', options, (err, geojson) => {
  /* This function will call back with an error if there is no geojson in the cache
  The geojson returned will contain the metadata document from the catalog
  {
    type: 'FeatureCollection',
    features: [],
    metadata: {}
  }
  */
})
```

### `delete`
Remove a feature collection from the cache

```js
cache.delete('key', err => {
  // This function will call back with an error if there was nothing to delete
})
```
