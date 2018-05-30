# Authorization Plugin

Add authorization and authentication to Koop services. Dive into the docs below or check out a working example [here](https://github.com/koopjs/koop-auth-direct-file).

## Index.js
Each authorization plugin must have a file called `index.js`.  Its purpose is to return a registration object that defines the type of Koop module and provides a set of configured functions that Koop will attach to each provider's Model prototype.  For example, the koop-auth-file-direct plugin exports a function that configures and returns a registration object that includes three functions, `getAuthenticateSpecification`, `authenticate`, and `authorize`.
<script src="https://gist.github.com/rgwozdz/4098e0e18cc85299f4444a3e64a7c68b.js"></script>


### Function: getAuthenticationSpecification

Authorization plugins are required to return a function called "getAuthenticationSpecification".  Its purpose is to configure a function that is used to describe the authentication specification. It should have the following signature:

 ##### getAuthenticationSpecification(providerNamespace) ⇒ function
 
 Param | Type | Description |
| --- | --- | --- |
| providerNamespace | <code>string</code> | a provider's namespace |

As noted, `getAuthenticationSpecification` returns a function configured with a provider's namespace. The configured function should return an object with the following specification: 

<script src="https://gist.github.com/rgwozdz/194106328acd4d32fbbdb2b88c1c866d.js"></script>

An example of `getAuthenticationSpecification` is available [here](https://github.com/koopjs/koop-auth-direct-file/blob/master/src/index.js#L44-L56).


### Function: authenticate

Authorization plugins are required to return a function called `authenticate`.  Its purpose is to validate credentials and, if successful, issue a token for authorizing subsequent resource requests.  The `authenticate` function should have the following signature:

##### authenticate(username, password) ⇒ Promise

| Param | Type | Description |
| --- | --- | --- |
| username | <code>string</code> | requester's username |
| password | <code>string</code> | requester's password |


As noted above, the `authenticate` function should return a promise. If the authentication is unsuccessful the promise should reject with an error object.  The error should have a `code` property with value `401`. If the authentication is successful, the promise should resolve an object with the following properties:

<script src="https://gist.github.com/rgwozdz/283d8604676acd972fb72aef9a228033.js"></script>  

Authorization plugins are free to validate credentials in any manner.  For example, you might check a database for a match of the submitted username and password, or forward the credentials on to a third-party identity-store. [koop-auth-direct-file](https://github.com/koopjs/koop-auth-direct-file) provides an [example](https://github.com/koopjs/koop-auth-direct-file/blob/master/src/index.js#L59-L88) of a very basic credential validation using a simple JSON file-store. 

### Function: authorize

Authorization plugins are required to return a function called `authorize`.  Its purpose is to validate a token submitted with a resource request.  It should have the following function signature:

##### authorize(token) ⇒ Promise

| Param | Type | Description |
| --- | --- | --- |
| token | <code>string</code> | token that can be used to prove previously successful authentication |

As noted above, the `authorize` function should return a promise. If the authorization is unsuccessful, the promise should reject with an error object.  Successful authorization should allow the promise to resolve. An example of an `authorize` function can be viewed [here](https://github.com/koopjs/koop-auth-direct-file/blob/master/src/index.js#L90-L108).

### Usage

Usage of an authorization-plugin can be conceptually divided into three parts: (1) configuration, (2) registration with Koop, and (3) use in output-services.  Configuration will be dependent on how the plugin is authored.  For example, with [koop-auth-direct-file](https://github.com/koopjs/koop-auth-direct-file), configuration includes supplying required and or optional arguments and getting a configured response back:

    let auth = require('@koopjs/auth-direct-file')('pass-in-your-secret', `${__dirname}/user-store.json`)

Registration is simply the code that registers the auth-plugin with Koop.  

    koop.register(auth)

During registration, Koop stores a reference to the authorization plugin's functions, and then later adds them to `Model` prototypes during provider registration.  It is therefore essential that authorization plugins get configured and registered prior to all providers.

Successfully securing your services depends on support from any output-services you may be using. Koop ships with [koop-output-geoservices](https://github.com/koopjs/koop-output-geoservices), and as of version 1.5.1, it supports securing services with authorization plugins that implement the API documentent here.  For example, the following snippet demostrates how [koop-output-geoservices](https://github.com/koopjs/koop-output-geoservices) uses the `authorize` function:

<script src="https://gist.github.com/rgwozdz/0926c83f83f81f31f738d6aa9692abc8.js"></script>

In the above example, the model is inspected for the prescene of an `authorize` function and if found, executed.  Successful authorization allows the fetching of data to proceed.  Failure leads to a rejection of the request.