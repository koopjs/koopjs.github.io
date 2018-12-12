---
title: Quickstart
permalink: /docs/basics/quickstart
---

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

