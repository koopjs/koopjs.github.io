---
layout: post
title:  "Koop CLI v0.6.0 release: enhanced development experience"
date:   2019-12-12 15:00:00
author: Haoliang Yu
---

We are excited to introduce a new minor release v0.6.0 for Koop CLI. Multiple new features are added in this release to enhance the development experience.

## Watch mode

One annoying thing of using the `serve` command for an app under development is that it doesn't know code change. If you want to test your new code, the app has to be restarted manually.

With the new `watch` option, the `serve` command can watch any file change in the local directory and restart the app automatically on change. The feature leverages the [nodemon](https://www.npmjs.com/package/nodemon) module for file monitoring and app restarting.

Try it with

``` bash
koop serve --watch
```

## Debug mode

In previous releases, console message is the only way to debug an app running with `serve` command. This creates a lot of inconvenience when developing a complex project.

With the new `debug`, the `server` command can also invoke the [Node.js inspector](https://nodejs.org/en/docs/guides/debugging-getting-started/) for the running app. The inspector listens at the default hostname and port (127.0.0.1:9229).

Try it with

``` bash
koop serve --debug
```

## Yarn support

`npm` is the default npm package manager used by the CLI. In this release, the support to [yarn](https://yarnpkg.com/lang/en/) is added.

To start a new project using `yarn`, you can use the `--npm-client` option in `new` command.

``` bash
koop new app my-test-app --npm-client=yarn
```

To change the package manager of an existing project, you can update the `koop.json` file and update the `npmClient` value.

``` json
{
  "npmClient": "yarn"
}
```

## More

Alongside these new features, we continue to refine Koop project templates by removing unnecessary code and adding more tests. The project created by the new CLI will include more robust code and a cleaner structure.

We hope you will find this release useful. Happy coding :)
