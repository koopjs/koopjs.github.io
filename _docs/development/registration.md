---
title: Plugin registration
permalink: /docs/development/registration
redirect_from: /docs/development/index.html
---

Koop plugins use their package.json's `main` property to point to a file that exposes an object used to register the plugin. For example:

```json
{
  "name": "koop-plugin",
  "version": "0.1.0",
  "main": "index.js"
}
```

The exported code in `index.js` can be an object literal.  For example, providers export an object literal as from `index.js`.

```js
module.exports = {
  type: 'provider',
  name: 'example-provider',
  hosts: true
  disableIdParam: false
  Model: require('./model'),
  version: require('../package.json').version
}
```

Alternatively, `module.exports` may be assigned an initialization function that returns a registration object.

```js
module.exports = function(options = {}) {
  // Do something with options that configures plugin options prior to registration
  const route = options.prefix ? `${options.prefix}/world`|| 'world'

  return {
    version: require('../package.json').version
    type: 'output',
    routes: [route]
}
```

Lastly, some plugin types define constructor function with specific properties:

```js
function VectorTilePlugin () {}
VectorTilePlugin.version = require('../package.json').version
VectorTilePlugin.type = 'output'
VectorTilePlugin.routes = []
module.exports = VectorTilePlugin
```

Check the documentation for each plugin type for details about registration requirements or see examples at [KoopJS](https://github.com/koopjs).