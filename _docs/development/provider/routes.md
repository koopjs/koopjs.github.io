---
title: Provider Specification - Routes and Controllers
permalink: /docs/development/provider/routes
---

## Provider-specific routes
In addition to routes defined by output-plugins, a provider may extend the Koop API by defining their ownvroutes and associated controllers.  These routes are defined in a file that is referenced in the [registration object](./registration). This file should export an array of route definition objects. Each object must have:

| property name | type | description | example |
| - | - | - | - |
| path | string | An Express.js style route that includes optional parameters | `/provider-name/:id/metadata` |
| methods | string[] | HTTP methods that should be handled at this route | [`get`, `post`] |
| handler | string | Name of the controller function in controller file that should handle requests at this route | `metadataHandler`

<codeanchor id="figure-1"></codeanchor>
```js
module.exports = [
{
    path: `/provider-name/:id/metadata`,
    methods: ['get'],
    handler: 'metadataHandler'
  }
]
```
<figcaption><i>Figure 1. Contents of a <code class='highlighter-rouge'>routes.js</code> file that defines a single provider-specific route.</i></figcaption>

## Controllers

Each route defintion has a `handler` property that should name a method to be used for route handling. You can define these methods on a `Controller` class in a file that must be properly referenced in the [registration object](./registration).

<codeanchor id="figure-2"></codeanchor>

```js
function Controller (model) {
  this.model = model
}

Controller.prototype.test = function (req, res) {
  res.status(200).json({ version: '1.0.0' })
}

module.exports = Controller
<figcaption><i>Figure 2. Contents of a <code class='highlighter-rouge'>controllers.js</code> file that defines a `Controller` class with methods that act as handler for provider-specific routes.</i></figcaption>
