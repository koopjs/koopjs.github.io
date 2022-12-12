---
title: Cache
permalink: /docs/usage/cache
---

## Overview

A Koop cache plugin stores data requested from the provider for use in followup requests. The cache key is a combination of request parameters. If caching is implemented, Koop will use request parameters to generate a key and check the cache for data. If found and not expired, it is returned to the output plugin without needing to go through the provider and the external data source.  If not found, the provider gets the data, but upserts it to the cache with an expiration time. Koop-core ships with a default cache plugin [koop-cache-memory](https://github.com/koopjs/koop-cache-memory), so many koop implementations will register no cache plugin.

## Usage

To be used by Koop, the cache must be registered with the Koop object before the server begins listening as in the example below.

```js
const Koop = require('@koopjs/koop-core')
const koop = new Koop()
const cache = require('koop-cache-redis')
koop.register(cache)
koop.server.listen(80)
```
