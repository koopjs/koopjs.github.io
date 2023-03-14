---
title: Provider Specification - registration object
permalink: /docs/development/provider/registration
redirect_from: /docs/development/provider/index.html
---

Every provider must have a file called `index.js` that exports an object literal. Its purpose is to tell Koop how to load and use the provider. Below is an example for the Koop 3.x specification:

```js
module.exports = {
  name: 'new-provider-name',
  type: 'provider',
  version: require('<path-to-package.json>').version,
  Model: require('<path-to-model-class-module>'),
  hosts: true,
  disableIdParam: false,
  routes: require('<path-to-routes-array-module>'),
  Controller: require('<path-to-controller-module>'),
}
```

The table below  describes the keys in more detail:

| Key | Required? | Type | Description |
| :--- | :--- | :--- | :--- |
| type | Yes | `string` | Identifies the plugin type; should have value `'provider'`
| name | Yes | `string` | A URL safe string that identifies the provider; used as part of the routes to provider data |
| version | Yes | `string` | version number of the provider|
| Model | Yes | `class` | The Model class or `require` for the Model class module |
| hosts | No | `Boolean` | Adds a `:host` parameter in routes|
| disableIdParam | No | `Boolean` | Removes the default `:id` parameter from routes|
| routes | No | `object[]` | An array of route objects that expose routes specific to this provider |
| Controller | No | `class` | The Controller class that supports handling for provider routes |


As an alternative to exporting an object literal, you can instead have `index.js` export an initialization function that returns the registration object. This is useful if you need to dynamically set registration properties:

```js
module.exports = function(options = {}) {
  // Allow name to be set by options
  const name = options.name ? options.name : 'example-provider'

  return {
    type: 'provider',
    name,
    hosts: true
    disableIdParam: false
    Model: require('./model'),
    version: require('../package.json').version
  }
}
```

Note that you would need to execute the above initialization function during registration:

```js
const provider = require('<npm-or-path-to-provider>')({ name: 'my-provider' })
koop.register(provider)
```
