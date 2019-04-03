---
title: Conceptual Overview
permalink: /docs/basics/overview
---

A Koop instance usually includes the following components: [core](#koop-core), [provider](#provider), [output](output), and [cache](#cache), connected as illustrated below.  
 


<br>  
### Koop-core
Koop-core is a wrapper around an Express.js server instance. Like Express it listens for incoming requests on a given port and includes some limited middleware for parsing request parameters. It also handles registration of other Koop plugins/components, allowing data and requests to flow through the system.  Note that Koop-core ships with a default cache plugin and a default output plugin.  As a result

### Provider  
A Koop provider is an interface for connecting with a data source (e.g. Google sheets, Github, local files). It properly formats requests to that data source, and converts the data received from that source to GeoJSON, the common format used by Koop.

### Output  
A Koop plugin that transforms the GeoJSON provider by a Koop provider to a specific output format (e.g., GeoServices response, vector-tiles, WMS, etc).  It defines service routes and handlers that interpret incoming requests, acquires data from a provider, and post-processes that data before sending it back to the client.  Koop-core ships with a default output plugin [koop-output-geoservices](https://github.com/koopjs/koop-output-geoservices), so some koop implementation will register no additional output plugins.

### Cache
A Koop cache plugin stores data intially requested from the provider. The cache key is a combination of request parameters. If caching is implemented, Koop will use request parameters to generate a key and check the cache for data. If found and not expired, it is returned to the output plugin without needing to go through the provider and the external data source.  If not found, the provider gets the data, but upserts it to the cache with an expiration time. Koop-core ships with a default cache plugin [koop-cache-memory](https://github.com/koopjs/koop-cache-memory), so many some koop implementation will register no cache plugin.