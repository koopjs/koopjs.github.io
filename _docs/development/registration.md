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
  "description": "Clever example description",
  "main": "index.js"
}
```

The code in `index.js` could simply export a Koop registration object (detail differ based on plugin type):

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

Note that when registering a plugin that exposes a function instead of an object, you must execute the function when it is required so that it returns an object. Continuing on from the exported function example above:

```js
const output = register('koop-output-example')({ prefix: 'hello' })
koop.register(output)
```
