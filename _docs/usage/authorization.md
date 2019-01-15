---
title: Authorization Specification
permalink: /docs/usage/authorization
---

Add authorization and authentication to Koop services. Dive into the docs below or check out a working example [here](https://github.com/koopjs/koop-auth-direct-file).

## index.js

Each authorization plugin must have a file called `index.js`.  Its purpose is to return a registration object that defines the type of Koop module and provides a set of configured functions that Koop will attach to each provider's Model prototype.  For example, the koop-auth-file-direct plugin exports a function that configures and returns a registration object that includes three functions, `getAuthenticateSpecification`, `authenticate`, and `authorize`.

```js
{
    type: 'auth',
    getAuthenticationSpecification: Function,
    authenticate: Function,
    authorize: Function
}
```

### `authenticationSpecification` function 

Authorization plugins are required to return a function called "authenticationSpecification".  Its purpose is delivery of an object for use in configuring authentication in output-services (e.g., koop-output-geoservices). It should have the following signature:

##### authenticationSpecification() ⇒ object

As noted, `authenticationSpecification` returns an object configured with a provider's namespace. The configured function should return an object with the following specification, though it can be extended: 

```js
{
  useHttp: Boolean // boolean flag indicating if HTTP (rather than HTTPS) should be used for the authentication endpoint 
}
```

An example of `authenticationSpecification` is available [here](https://github.com/koopjs/koop-auth-direct-file/blob/master/src/index.js#L44-L56).


### `authenticate` function 

Authorization plugins are required to return a function called `authenticate`.  Its purpose is to validate credentials and, if successful, issue a token for authorizing subsequent resource requests.  The `authenticate` function should have the following signature:

##### authenticate(req) ⇒ Promise

| Param | Type | Description |
| --- | --- | --- |
| req | <code>object</code> | Express request object. Credentials for authentication should be found in the `query` object. |


As noted above, the `authenticate` function should return a promise. If the authentication is unsuccessful the promise should reject with an error object.  The error should have a `code` property with value `401`. If the authentication is successful, the promise should resolve an object with the following properties:

```js
{
  token: String, // token that can be added to resource requests, and decoded and verified by the "authorization" function
  expires: Number, // number seconds until token expires
}
```

Authorization plugins are free to validate credentials in any manner.  For example, you might check a database for a match of the submitted username and password, or forward the credentials on to a third-party identity-store. [koop-auth-direct-file](https://github.com/koopjs/koop-auth-direct-file) provides an [example](https://github.com/koopjs/koop-auth-direct-file/blob/master/src/index.js#L59-L88) of a very basic credential validation using a simple JSON file-store. 

### `authorize` function

Authorization plugins are required to implement a function called `authorize`.  It should accept an argument that can be used to verify the request is being made by an authenticated user (e.g., a token granted after successful authentication).  It should have the following function signature:

##### authorize(input) ⇒ Promise

| Param | Type | Description |
| --- | --- | --- |
| input | <code>object</code> | Express request object. Query parameter or header should include input (e.g., token) that can be used to prove previously successful authentication |

As noted above, the `authorize` function should return a promise. If the authorization is unsuccessful, the promise should reject with an error object.  Successful authorization should allow the promise to resolve. An example of an `authorize` function can be viewed [here](https://github.com/koopjs/koop-auth-direct-file/blob/master/src/index.js#L90-L108).

### Usage

Usage of an authorization-plugin can be conceptually divided into three parts: (1) configuration, (2) registration with Koop, and (3) use in output-services.  Configuration will be dependent on how the plugin is authored.  For example, with [koop-auth-direct-file](https://github.com/koopjs/koop-auth-direct-file), configuration includes supplying required and or optional arguments and getting a configured response back:

    let auth = require('@koopjs/auth-direct-file')('pass-in-your-secret', `${__dirname}/user-store.json`)

Registration is simply the code that registers the auth-plugin with Koop.  

    koop.register(auth)

**During registration, Koop stores a reference to the authorization plugin's functions, and then later adds them to `Model` prototypes during provider registration.  It is therefore essential that authorization plugins get configured and registered prior to all providers.**

Successfully securing your services depends on support from any output-services you may be using. Koop ships with [koop-output-geoservices](https://github.com/koopjs/koop-output-geoservices), and as of version 1.5.1, it supports securing services with authorization plugins that implement the API documented here.  For example, the following snippet demostrates how [koop-output-geoservices](https://github.com/koopjs/koop-output-geoservices) uses the `authorize` function:

```js
/**
 * Handler for service, layer, and query routes
 * @param {object} req request object
 * @param {object} res response object
 */
Geoservices.prototype.featureServer = function (req, res) {
  // Is model configured for token-authorization?
  if (typeof this.model.authorize === 'function') {
    this.model.authorize(req.query.token)
      .then(valid => {
        // model will be available when this is instantiated with the Koop controller
        pullDataAndRoute(this.model, req, res)
      })
      .catch(err => {
        if (err.code === 401) FeatureServer.error.authorization(req, res)
        else res.status(err.code || 500).json({error: err.message})
      })
  } else {
    pullDataAndRoute(this.model, req, res)
  }
}
```

In the above example, the model is inspected for an `authorize` function and if found, executed.  Successful authorization allows the fetching of data to proceed.  Failure leads to a rejection of the request.