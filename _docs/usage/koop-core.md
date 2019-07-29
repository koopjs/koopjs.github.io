---
title: Koop Core
permalink: /docs/usage/koop-core
redirect_from: /docs/usage/index.html
---

Koop-core and its implementation in the main `server.js` file is where all providers, output-services, caches, and authorization plugins are registered. It exposes an [Express](https://expressjs.com) server which can be instructed to listen on port 80 or any port of your choosing. This doc walks through the steps for creating this file from scratch.

## package.json
Since you need the Koop `npm` dependency, you should start by creating a `package.json` file. With Node.js installed, run:

```bash
# Create a package.json
npm init

# Install Koop npm and save to package.json
npm install --save koop

# Install a Koop provider, for example, the koop-provider-github
npm install --save @koopjs/provider-github
```
<hr>

## server.js

Create a new file named `server.js`.  The typical content of the Koop server file look like the snippet below:

```js

// Initialize Koop
const Koop = require('koop')
const koop = new Koop()

/* Optional - register additional output-services */
// var tiles = require('@koopjs/output-vector-tiles')
// koop.register(tiles)

/* Optional - register any authorization plugins */
// const koopAuth = require('@koopjs/auth-direct-file')('foo', './user-store.json')
// koop.register(koopAuth)

/* Register providers */
const provider = require('@koopjs/provider-github')
koop.register(provider)


// Start listening on port 8080
koop.server.listen(8080, () => console.log(`Koop listening on port 8080!`))

```
<hr>

## Configuration settings

Koop leverages the [config](https://www.npmjs.com/package/config) package to configuration settings.  To faciliate this module, you should add a `config` directory to your Koop instance with a `default.json` file.  See the [config](https://www.npmjs.com/package/config) documentation for details on using different JSON files and environment variables to vary configuration.

Many Koop plugins will require settings in your config file. See each plugin's documentation for specifics. Configuration settings for the Koop server are noted below.

### disableCompression
As of v3.12.0, Koop adds Express compression by default.  If you do not want Express compression (e.g., perhaps you are using Nginx for compression), you can disable it by adding a `disableCompression` boolean to your Koop config file:

```json
{
  "disableCompression": true
}
```

## Running a Koop instance

Run the `server.js` file like any Node.js script.

```bash
> node server.js

Custom Routes for provider: datasets  Methods         
------------------------------------  ----------------
/datasets/:id                         GET, PUT, DELETE
/datasets/:id/metadata                GET, PUT, DELETE

Routes for provider: datasets, Output: Geoservices        Methods  
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

Routes for Provider: github, Output: Geoservices        Methods  
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
Koop listening on port 8080!
```

### Interpreting the console output
You will notice a list of routes printed to the console. These include routes for the built-in `datasets` provider, as well as any providers you have registered (here, the Github provider). Each provider will have a list of any custom routes and a list of routes defined by registered output plugins. You can use the listed routes by appending them to the `host:port` of your running Koop instance and replace any parameters with values. For example:

`/github/rest/services/:id/FeatureServer/:layer/:method`  

becomes:

`http://localhost:8080/github/koopjs::geodata::north-america/FeatureServer/0/query`

Note that there are `GET` and `POST` versions of all koop-output-geoservices routes. Output-services define an array of methods for each of their routes, and in this case every route has been [assigned both `GET` and `POST` methods](https://github.com/koopjs/koop-output-geoservices/blob/master/index.js#L94).

<hr>

## Koop as middleware

You can also run Koop as [middleware](https://expressjs.com/en/guide/using-middleware.html) in an existing Express server.

```js
const express = require('express')
const app = express()
const koop = new Koop()


/* Register providers */
const provider = require('@koopjs/provider-github')
koop.register(provider)

/* Use Koop as middleware */
app.use('/koop', koop.server)

app.listen(8080)
```
