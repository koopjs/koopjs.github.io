---
title: Output Specification
permalink: /docs/development/output
---

Koop output plugins are used to transform data coming from a Koop provider to any specific output format (e.g GeoServices response, vector-tiles, WMS, RSS, CSV _etc_). Generally, Output plugin class defines service routes and handlers that accept incoming requests, handle errors and filters or transforms provider data before sending it back to the client. `Koop-core` ships with a default output plugin [koop-output-geoservices](https://github.com/koopjs/koop-output-geoservices).

An output plugin directory must contain `index.js` file that exports a class with following properties:

- `version` – Version for your output plugin
- `type` – Value of this property must be '`output'` 
- `routes` - An array of objects with `path`, `methods` and `handler`. `path` defines the output plugin routes, `methods` contain valid HTTP methods and `handler` is the class method name for handling the request.

A basic example is below:
```
const version = require('../package.json');

class OutputPlugin {
    static type = 'output';

    static version = version;

    static routes = [{
        path: '/define/your/route/path',
        methods: ['get'], // HTTP methods recoginized by Express.js
        handler: 'serve', // Class method that will handle the request
    }, ];

    async serve(req, res, next) {
        try {
            const geojson = await this.model.pull(req); // pull geojson from provider
            const outputData = this.#filterTransform(geojson); // filter/transform
            res.status(200).json(outputData); // send response
        } catch (err) {
            next(err);
        }
    }

    #filterTransform(geojson) {
        // filter/transform geojson here
        return transformedGeojson
    }
}

module.exports = Output
```

Inside the request handler `serve`, we have access to Express `request` and `response` object. `request` is passed to Koop provider using any of `pull` methods specified below to retrieve geoJSON data from the provider:
- `pull (request)` - _Mostly used_
- `pullLayer (request)`
- `pullCatalog (request)`
- `pullStream (request)` - _Only used if provider implements Node.js streams to send response_

Depending upon what the provider you are using supports for sending response, call the appropriate pull method by `this.model._pullMethod_` . Once data is received, we can pass it through our custom transform or filter function. In the example above, we have a class method called `#filterTransform` which takes `geojson` from the provider then filters the geoJSON which could implement any sort of custom data manipulation. Then, we finally return the transformed output data to the client. We also wrap all the operations of data retrieval and transformation in `try...catch` block so handle any errors.

See the [koop-output-flat](https://github.com/koopjs/koop-output-flat) source files for an example of a simple output-plugin.
