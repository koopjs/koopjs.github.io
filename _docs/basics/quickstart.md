---
title: Quick start with Koop CLI
permalink: /docs/basics/quickstart
---
The [Koop CLI](https://github.com/koopjs/koop-cli) provides a rapid and easy way to launch a Koop instance.  To get going, install the Koop CLI:

Using npm:

```
npm install -g @koopjs/cli
```

Using yarn:

```
yarn global add @koopjs/cli
```

Once installed the `koop` command is available at the console. You can create a new Koop application with the name `demo-app` with:

``` bash
# create a project folder and initialize it
koop new app demo-app
✓ created project
✓ initialized Git
✓ installed dependencies
✓ done

# cd into the folder
cd demo-app
```

Add at least one Koop provider that is published with NPM.  Here we add the Koop Github provider [Koop Github provider](https://github.com/koopjs/koop-provider-github):

``` bash
# install the provider and register it to the koop app
koop add provider @koopjs/provider-github
```

Now start your Koop instance:

``` bash
koop serve
```

You should see the following console logging:

```bash
WARNING: "/MapServer" routes will be registered, but only for specialized 404 handling in FeatureServer.
[github provider] No github access token configured. Github API requests may be rate limited.
{"level":"info","message":"registered output: Geoservices 2.0.0"}
No root directory was specified, defaulting to:  /Users/rich9620/Projects/demo-app
{"level":"info","message":"registered filesystem: localfs 1.1.2"}

"Geoservices" output routes for the "datasets" provider   Methods
--------------------------------------------------------  ---------
/datasets/rest/info                                       GET, POST
/datasets/tokens/:method                                  GET, POST
/datasets/tokens/                                         GET, POST
/datasets/rest/services/:id/FeatureServer/:layer/:method  GET, POST
/datasets/rest/services/:id/FeatureServer/layers          GET, POST
/datasets/rest/services/:id/FeatureServer/:layer          GET, POST
/datasets/rest/services/:id/FeatureServer                 GET, POST
/datasets/:id/FeatureServer/:layer/:method                GET, POST
/datasets/:id/FeatureServer/layers                        GET, POST
/datasets/:id/FeatureServer/:layer                        GET, POST
/datasets/:id/FeatureServer                               GET, POST
/datasets/rest/services/:id/FeatureServer*                GET, POST
/datasets/:id/FeatureServer*                              GET, POST
/datasets/rest/services/:id/MapServer*                    GET, POST
/datasets/:id/MapServer*                                  GET, POST

"datasets" provider routes  Methods
--------------------------  ----------------
/datasets/:id               GET, PUT, DELETE
/datasets/:id/metadata      GET, PUT, DELETE

"Geoservices" output routes for the "github" provider   Methods
------------------------------------------------------  ---------
/github/rest/info                                       GET, POST
/github/tokens/:method                                  GET, POST
/github/tokens/                                         GET, POST
/github/rest/services/:id/FeatureServer/:layer/:method  GET, POST
/github/rest/services/:id/FeatureServer/layers          GET, POST
/github/rest/services/:id/FeatureServer/:layer          GET, POST
/github/rest/services/:id/FeatureServer                 GET, POST
/github/:id/FeatureServer/:layer/:method                GET, POST
/github/:id/FeatureServer/layers                        GET, POST
/github/:id/FeatureServer/:layer                        GET, POST
/github/:id/FeatureServer                               GET, POST
/github/rest/services/:id/FeatureServer*                GET, POST
/github/:id/FeatureServer*                              GET, POST
/github/rest/services/:id/MapServer*                    GET, POST
/github/:id/MapServer*                                  GET, POST

{"level":"info","message":"registered provider: github 3.0.0"}
{"level":"info","message":"Koop server listening at 8080"}
```


You can get started with Koop right away by cloning and running the [Koop Sample App](https://github.com/koopjs/koop-sample-app) with one or more Koop providers.

Clone the [koop-sample-app](https://github.com/koopjs/koop-sample-app) repository on your machine.

```
git clone git@github.com:koopjs/koop-sample-app.git
```

Change the working directory to the newly created `koop-sample-app` folder.

```
cd koop-sample-app
```

Install dependencies.

```
npm install
```

Start the server.

```
npm start
```

The Koop sample app includes the following providers:

* [`github`](https://github.com/koopjs/koop-provider-github)
* [`craigslist`](https://github.com/dmfenton/koop-provider-craigslist)

Once Koop is running, you can test these sample requests:

* [http://localhost:8080/github/koopjs::geodata::north-america/FeatureServer/0/query](http://localhost:8080/github/koopjs::geodata::north-america/FeatureServer/0/query)
* [http://localhost:8080/craigslist/seattle/apartments/FeatureServer/0/query](http://localhost:8080/craigslist/seattle/apartments/FeatureServer/0/query)

<br>
### Developing with Koop
If you want to develop on Koop, it’s usually best to start by creating a Provider. You can read more about that in [provider docs](/documentation/provider) or check out the [Koop Provider Sample](https://github.com/koopjs/koop-provider-sample)

