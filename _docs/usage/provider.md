---
title: Provider
permalink: /docs/usage/provider
---

In your Koop server file, the provider must be registered with the Koop instance before the it begins listening.

```js
const Koop = require('koop')
const koop = new Koop()
const provider = require('<provider-npm-package or local-path>')
koop.register(output)
koop.server.listen(80)
```

## Plugin registration order
The order in which you register plugins can affect functionality.  The key points are:  
* Provider data will only be accessible from output-plugin routes if the provider is registered _after_ the output-plugin
* Provider data will only be secured by an authorization plugin if the provider is registered _after_ the authorization-plugin.

You can therefore micro-manage provider accessibility by adjusting the registration order of various plugins.

## Route prefixing
If needed, you can add a prefix to all of a registered provider's routes.  For example, if you wanted the fragment `/api/v1` prepended to you github provider routes you could register the provider like this:

```js
const provider = require('@koopjs/provider-github')
koop.register(provider, { routePrefix: '/api/v1'})
```

which results in routes like:

`/api/v1/github/:id/FeatureServer`

## Koop CLI

If you are using the Koop CLI, adding a new provider to you Koop application is easy:

```bash
> koop add provider <provider-plugin-package-or-path>
```

See the Koop CLI [documentation](https://github.com/koopjs/koop-cli#add) for additional options and details.
