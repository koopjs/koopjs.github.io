---
title: Authorization Specification
permalink: /docs/development/authorization
---

## API

Each authorization plugin must have a file called `index.js`.  `index.js` must be able to deliver a a Koop registration object.  This object should have the following minimum content:

```js
{
    type: 'auth',
    authenticate: Function,
    authorize: Function,
    name: 'my-auth-plugin',
    version: require('../path/to/package.json').version
}
```

The object above may be assigned to `module.exports` directly; alternatively, `module.exports` may be assigned an initialization function that returns the registration object on execution.  This approach is useful if you need to pass options into the authentication plugin ([see an example](https://github.com/koopjs/koop-auth-direct-file/blob/master/src/index.js#L10-L17)).  

The table below contains a brief description of the registration object. Note that the listed functions make up authorization plugin's API. Koop adds these functions to each provider's `Model` prototype, which makes them available in output plugins.

| property | type | description |
| --- | --- | --- |
|`type`| String | Must be set to `auth`; identifies the plugin as an authorization plugin during registration |
|`authorize`| Function | Verfies a user has authorization to make a requests (e.g., a token is validated) |
|`authenticate`|Function| Authenticates a user's requests based on submitted input (credentials, key, etc)|
|`name`|String| Name of the plugin |
|`version`|String| Plugin version number |

Details about each of the API functions are found below.

### `authenticate` **authenticate(req) ⇒ Promise**

| Param | Type | Description |
| --- | --- | --- |
| req | <code>object</code> | Express request object. Credentials for authentication should be found in the `query` object. |

Authorization plugins must include a function called `authenticate` that returns a promise.  Its purpose is to validate credentials and, if successful, issue a token for authorizing subsequent resource requests. If the authentication is unsuccessful the promise should reject with an error object.  The error should have a `code` property with value `401`. If the authentication is successful, the promise should resolve an object with the following properties:

```js
{
  token: String, // token that can be added to resource requests, and decoded and verified by the "authorization" function
  expires: Number, // number seconds until token expires
}
```

Authorization plugins are free to validate credentials in any manner.  For example, you might check a database for a match of the submitted username and password, or forward the credentials on to a third-party identity-store. [koop-auth-direct-file](https://github.com/koopjs/koop-auth-direct-file) provides an [example](https://github.com/koopjs/koop-auth-direct-file/blob/master/src/index.js#L59-L88) of a very basic credential validation using a simple JSON file-store.

### `authorize` function **authorize(req) ⇒ Promise**

| Param | Type | Description |
| --- | --- | --- |
| req | <code>object</code> | Express request object. Query parameter or header should include input (e.g., token) that can be used to prove previously successful authentication |

Authorization plugins are required to implement a function called `authorize`.  It should accept the Express request object as an argument, which that can be used to verify the request is being made by an authenticated user (e.g., validate a token in the authorization header). If the identity of the request user is unknown or can't be determined (e.g., due to a missing or invalid token) the promise should reject with an error object that contains a `401` code. If the token is valid, but the user is not authorized to access the requested resource, the promise should be rejected with an error that contains a `403` code. Successful authorization should allow the promise to resolve. An example of an `authorize` function can be viewed [here](https://github.com/koopjs/koop-auth-direct-file/blob/master/src/index.js#L90-L108).
