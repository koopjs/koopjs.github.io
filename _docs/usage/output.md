---
title: Output Specification
permalink: /docs/usage/output
---

## Usage

To be used by Koop, the output-plugin must be registered with the Koop instance before the it begins listening.

```js
const Koop = require('koop')
const koop = new Koop()
const output = require('<output-plugin-package-or-path>')
koop.register(output)
koop.server.listen(80)
```

## API

The documentation for an output plugin is not yet ready.  See the [koop-output-flat](https://github.com/koopjs/koop-output-flat) source files for an example of a simple output-plugin.