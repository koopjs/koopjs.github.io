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

## Provider and authorization plugins
The exported code in `index.js` varies by plugin-type.  Providers and authorization plugins should return an object literal or an initialization function that in turn returns an object literal.  An example of an object literal exported from `index.js`:

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

Alternatively, an initialization function that returns a registration object.

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

## Output, cache, filesystem, and generic plugins

These `index.js` of these types of plugins should define a constructor function with plugin specific properties:

```js
function VectorTilePlugin () {}
VectorTilePlugin.version = require('../package.json').version
VectorTilePlugin.type = 'output'
VectorTilePlugin.routes = []
module.exports = VectorTilePlugin
```

Check the documentation for each plugin type for details about registration requirements or see examples at [KoopJS](https://github.com/koopjs).