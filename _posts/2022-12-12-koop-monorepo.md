---
layout: post
title:  "New Koop Monorepo"
date:   2022-12-12
author: Rich Gwozdz
---

We have migrated Koop and it's core dependencies to a monorepo at [https://github.com/koopjs/koop](https://github.com/koopjs/koop). The monorepo includes the following packages:
- koop-core (the main koop module)
- output-geoservices
- featureserver
- winnow
- koop-logger
- cache-memory

This move will ease development, testing, and publishing. The diagram below illustrates the dependency relationships between the monorepo packages:
![Screen Shot 2022-11-30 at 1 03 46 PM](https://user-images.githubusercontent.com/4369192/204908289-82659cfe-fcf3-404a-aa70-79baf540f1b8.png)


## Migrating
It's important to note that the latest Koop has been published under the `@koopjs` NPM organization. You will need to update your koop applications by:

```bash
> npm uninstall koop

> npm install @koopjs/koop-core

```
Then replace any imports in your code-base.  For example:

```diff
- const Koop = require('koop')
+ const Koop = require('@koopjs/koop-core')
```

FeatureServer and Winnow have also moved to the `@koopjs` NPM organization. If you happen to be using those repositories outside of Koop you'll need to update to `@koopjs/featureserver` and `@koopjs/winnow`. Note that the older repositories have been marked as deprecated and have no explicit maintenance plan.

## Contributing
The new monorepo includes tooling to help standardize contributions and make semantic releases to NPM. This includes the requirement of (1) conventional commit messages, (2) code coverage, and (3) semantice release control with [changesets](https://github.com/changesets/changesets). Take a look at the [contribution guidelines](https://github.com/koopjs/koop/blob/master/README.md#contributing) for more information.

