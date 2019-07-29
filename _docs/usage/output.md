---
title: Output Specification
permalink: /docs/usage/output
---

## Usage

By default, Koop registers the [Geoservices output-plugin](https://github.com/koopjs/koop-output-geoservices) by default.  If you want to use additional output-plugins you will have to register them with you Koop instance. In your Koop server file:

To be used by Koop, the output-plugin must be registered with the Koop instance before the it begins listening.

```js
const Koop = require('koop')
const koop = new Koop()
const output = require('<output-plugin-package-or-path>')
koop.register(output)
koop.server.listen(80)
```

## Plugin registration order
The order in which you register plugins can affect functionality.  The key points are:  

* An output-plugin must be registered with the Koop instance before the it begins listening.
* To secure output-plugin routes, it must be registered before an authorization plugin
* To pair and output-plugin with a provider, it must be registered before the provider

### Using Koop CLI

If you are using Koop CLI, you can add an output plugin with the `add` command:

```bash
koop add output <output-plugin-package-or-path>
```

See the Koop CLI [documentation](https://github.com/koopjs/koop-cli#add) for additional options and details.