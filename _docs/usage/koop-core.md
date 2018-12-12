---
title: Koop Core
permalink: /docs/usage/koop-core
redirect_from: /docs/usage/index.html
---

Koop-core and its implementation in the main `server.js` file is where all providers, output-services, caches, and authorization plugins are registered. It exposes an [Express](https://expressjs.com) server which can be instructed to listen on port 80 or any port of your choosing. This doc walks through the steps for creating this file from scratch.

## Create the package.json
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
<br>

## Create the server.js

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
<br>
## Running a Koop instance

Run the `server.js` file like an Node.js script.

```bash
> node server.js

provider=github fullRoute:/github/rest/info GET
provider=github fullRoute:/github/rest/info POST
provider=github fullRoute:/github/tokens/:method GET
provider=github fullRoute:/github/tokens/:method POST
provider=github fullRoute:/github/tokens/ GET
provider=github fullRoute:/github/tokens/ POST
provider=github fullRoute:/github/rest/services/:id/FeatureServer/:layer/:method GET
provider=github fullRoute:/github/rest/services/:id/FeatureServer/:layer/:method POST
provider=github fullRoute:/github/rest/services/:id/FeatureServer/layers GET
provider=github fullRoute:/github/rest/services/:id/FeatureServer/layers POST
provider=github fullRoute:/github/rest/services/:id/FeatureServer/:layer GET
provider=github fullRoute:/github/rest/services/:id/FeatureServer/:layer POST
provider=github fullRoute:/github/rest/services/:id/FeatureServer GET
provider=github fullRoute:/github/rest/services/:id/FeatureServer POST
provider=github fullRoute:/github/:id/FeatureServer/:layer/:method GET
provider=github fullRoute:/github/:id/FeatureServer/:layer/:method POST
provider=github fullRoute:/github/:id/FeatureServer/layers GET
provider=github fullRoute:/github/:id/FeatureServer/layers POST
provider=github fullRoute:/github/:id/FeatureServer/:layer GET
provider=github fullRoute:/github/:id/FeatureServer/:layer POST
provider=github fullRoute:/github/:id/FeatureServer GET
provider=github fullRoute:/github/:id/FeatureServer POST
provider=github fullRoute:/github/rest/services/:id/FeatureServer* GET
provider=github fullRoute:/github/rest/services/:id/FeatureServer* POST
provider=github fullRoute:/github/:id/FeatureServer* GET
provider=github fullRoute:/github/:id/FeatureServer* POST
provider=github fullRoute:/github/rest/services/:id/MapServer* GET
provider=github fullRoute:/github/rest/services/:id/MapServer* POST
provider=github fullRoute:/github/:id/MapServer* GET
provider=github fullRoute:/github/:id/MapServer* POST
{"level":"info","message":"registered provider: github 3.0.0"}
Koop listening on port 8080!
```

### Interpreting the console output
You will notice a list of routes printed to the console. They are a concatenation of the provider name and the routes defined in the default output-service plugin, [koop-output-geoservices](https://github.com/koopjs/koop-output-geoservices). If you register more than one provider, you will see additional sets of these routes printed.You can use the listed routes by appending them to the `host:port` of your running Koop instance and replace any parameters with values. For example:

`provider=github fullRoute:/github/rest/services/:id/FeatureServer/:layer/:method GET`  

becomes:

`http://localhost:3000/github/koopjs::geodata::north-america/FeatureServer/0/query`

Note that there are `GET` and `POST` versions of all koop-output-geoservices routes. Output-services define an array of methods for each of their routes, and in this case every route has been [assigned both `GET` and `POST` methods](https://github.com/koopjs/koop-output-geoservices/blob/master/index.js#L94).

<hr>
<br>

## Koop setup options

#### Route prefixing
If needed, you can add a prefix to all of a registered provider's routes.  For example, if you wanted the fragment `/api/v1` prepended to you github provider routes you could register the provider like this:

```js
const provider = require('@koopjs/provider-github')
koop.register(provider, { routePrefix: '/api/v1'})
```

which results in routes like:

```bash
provider=github fullRoute:/api/v1/github/rest/info GET
provider=github fullRoute:/api/v1/github/rest/info POST
provider=github fullRoute:/api/v1/github/tokens/:method GET
provider=github fullRoute:/api/v1/github/tokens/:method POST
provider=github fullRoute:/api/v1/github/tokens/ GET
provider=github fullRoute:/api/v1/github/tokens/ POST
provider=github fullRoute:/api/v1/github/rest/services/:id/FeatureServer/:layer/:method GET
provider=github fullRoute:/api/v1/github/rest/services/:id/FeatureServer/:layer/:method POST
provider=github fullRoute:/api/v1/github/rest/services/:id/FeatureServer/layers GET
provider=github fullRoute:/api/v1/github/rest/services/:id/FeatureServer/layers POST
provider=github fullRoute:/api/v1/github/rest/services/:id/FeatureServer/:layer GET
provider=github fullRoute:/api/v1/github/rest/services/:id/FeatureServer/:layer POST
provider=github fullRoute:/api/v1/github/rest/services/:id/FeatureServer GET
provider=github fullRoute:/api/v1/github/rest/services/:id/FeatureServer POST
provider=github fullRoute:/api/v1/github/:id/FeatureServer/:layer/:method GET
provider=github fullRoute:/api/v1/github/:id/FeatureServer/:layer/:method POST
provider=github fullRoute:/api/v1/github/:id/FeatureServer/layers GET
provider=github fullRoute:/api/v1/github/:id/FeatureServer/layers POST
provider=github fullRoute:/api/v1/github/:id/FeatureServer/:layer GET
provider=github fullRoute:/api/v1/github/:id/FeatureServer/:layer POST
provider=github fullRoute:/api/v1/github/:id/FeatureServer GET
provider=github fullRoute:/api/v1/github/:id/FeatureServer POST
provider=github fullRoute:/api/v1/github/rest/services/:id/FeatureServer* GET
provider=github fullRoute:/api/v1/github/rest/services/:id/FeatureServer* POST
provider=github fullRoute:/api/v1/github/:id/FeatureServer* GET
provider=github fullRoute:/api/v1/github/:id/FeatureServer* POST
provider=github fullRoute:/api/v1/github/rest/services/:id/MapServer* GET
provider=github fullRoute:/api/v1/github/rest/services/:id/MapServer* POST
provider=github fullRoute:/api/v1/github/:id/MapServer* GET
provider=github fullRoute:/api/v1/github/:id/MapServer* POST
```

#### Koop as middleware

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
