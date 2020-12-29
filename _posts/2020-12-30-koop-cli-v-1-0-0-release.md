---
layout: post
title:  "Koop CLI v1.0 release: new commands for every stage of development"
date:   2020-12-30
author: Haoliang Yu
---

The Koop CLI v1.0 release adds several new features that takes care of your needs in different stages of Koop app development. In this new blog post, we are going to explore these new features and see how they can reduce the development toil.

## Listing existing plugins

Sometimes you would like to know the plugins already registered in the Koop app. In the past, this could only be done by manually checking the dependency list in the `package.json` file and the code in `src/plugins.js`. Now you can simple use the new `list` command to print a list of all existing plugins:

``` bash
$ koop list
```

and the output is a nicely formatted table:

```
2 plugins are found.

#  Name           Type      Is local plugin?
-  -------------  --------  ----------------
1  test-output    output    true
2  test-provider  provider  true
```

You can also further filter the list by adding a specific plugin type:

``` bash
$ koop list provider
```

and it will result in a filtered table:


```
1 plugin is found.

#  Name           Type      Is local plugin?
-  -------------  --------  ----------------
1  test-provider  provider  true
```

Under the hood, a plugin list is maintained within the `koop.json` file and will be updated when a plugin is added or removed using the CLI. It keeps track of the state of the Koop app and make it easier to get the current statistics of plugins.

## Removing a plugin

Remvoing an existing plugin from the Koop app used to be a tedious and error-prone task. It was needed to remove the plugin code and configuration from multiple files, which could be confusing for those who were not familiary with the project structure.

Since the Koop app boileplate is stable, we have automated the plugin removal with the new `remove` command. It reverses the operation done by the `add` command and works for the plugin from both the npm or a local directory.

For example, if the plugin is added from npm with

```
$ koop add provider koop-provider-csv
```

then the plugin can be removed with

```
$ koop remove koop-provider-csv
```

If the plugin is added from a local directory with

```
$ koop add provider my-private-provider --local
```

then the plugin can be removed with

```
$ koop remove my-private-provider
```

The command will attempt to do the following things for you:

* remove plugin source code
* remove plugin test code
* remove plugin configuration
* update koop configuration
* remove dependencies

## Validating a plugin

Each Koop plugin type has a specification on the module exports. The new command `validate` can be used to verify whether the current Koop plugin project follows the specification. By running the command,

``` bash
$ koop validate
```

it will load the module and checks the existence of all necessary export properties. The command will print the result of validation. If the validation passes,

``` bash
The plugin is valid.
```

or if there is any problem,

```
The plugin is not valid.

#  Property       Error
-  -------------  -----------------------------------
1  type           the value is empty
2  Model          the "getData" function is not added
```

## Compatibility

The Koop CLI v1.0 is compatible with a Koop project (app or plugin) created with v0.x. But if you are creating a project, it is recommaned to use the latest version to reduce chance of error.

## More

We hope that these commands will save you time in the development. For more information, please check the details in the [command documentation](https://github.com/koopjs/koop-cli/tree/master/docs/commands). If you have any question about Koop CLI, please feel free to [submit an issue](https://github.com/koopjs/koop-cli/issues/new).
