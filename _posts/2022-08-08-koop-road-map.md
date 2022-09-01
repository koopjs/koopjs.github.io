---
layout: post
title:  "Koop Road Map 2022 - 2023"
date:   2022-08-08
author: Rich Gwozdz
---

Hello Koop User Community!  I'd like to shared some proposed changes with you.  They are listed below in order of expected implementation.  Please comment on this [issue](https://github.com/koopjs/koop/issues/386) with any feedback or suggestions.  It's our hope to start implementing these changes soon.


1) Move Koop's core-dependencies to a monorepo

Packages will include:

koop-core
koop-logger
koop-cache-memory
koop-output-geoservices
feature-server
winnow

The monorepo approach helps alleviate existing pain points that include:

- Deployment of dependency's version bumps
- e2e tests for Koop that integrate lastest versions of all packages
- location for FeatureServer conformance testing
- easier tracking/tagging of versions

Note: Package versions will use individually-based version numbers, continuous with version numbers they currently use in independent repos.  However, we plan to npm publish all packages under the `@koopjs` npm org.

2) Support use of the koop logger in Feature-Server and Winnow

These dependencies currently use console.log while other Koop core-dependencies and many plugins leverage the Koop logger.  Using koop logger will allow better management of log messages (debug, warn, info, error), help ensure log visibility, and provide formatting required by some deployments.

3) Remove legacy output-geoservices routes (routes without `rest/services`)

Early versions of output-geoservices did not include routes with the `rest/services`  fragment of the URL path. However, some ArcGIS clients require service URLs to include it to work properly.  An additional set of routes with `rest/services` were added to address this issue, but the old routes without that fragment were maintained to avoid a breaking change.  While we avoided a breaking change, it has lead to confusion on which routes to use and question about why some routes won't work with clients like AGO.

Note: This change will break any existing implementations that leverage routes without the `rest/services` fragment.

4) Add code coverage tooling to all monorepo packages

5) Remove generic `datasets` provider and ship in separate plugin

Koop ships with a set of generic "datasets" provider with custom endpoints that allow users to add and retrieve ad hoc JSON to the koop-cache.  It's likely not used very often, and could be a source of memory problems if abused. This provider should be separated and moved to its own plugin repository and therefore installed only when needed by Koop developers.

6) Stretch goal: Remove "hosts" parameter from the provider specification and output-geoservices routes

The existing Koop-provider specification allows for the configuration of two route parameters, hosts and id. In the early development of Koop, hosts was meant to contain information to help target a remote API (maybe a service hostname or route), while id  was meant to contain information the help target a specific resource on a remote API.  However, such definitions are not always applicable to a given provider, so in reality these are just two optional and generic route parameters. In summary, having two generic route parameters is often unnecessary, creates route-building complications, and adds usage confusion (e.g., what do I use hosts for?). A single generic parameter is sufficient, as it can be a delimited string that hold multiple pieces of information.

We will:

- remove support for providers with an enabled hosts  parameter from koop-core
- reject the registration of providers that enable the hosts parameter and log messages that provide a link to migration documents
- update the Koop documentation so that the provider spec no longer includes hosts, and includes steps to migrate old provider to the new specification.