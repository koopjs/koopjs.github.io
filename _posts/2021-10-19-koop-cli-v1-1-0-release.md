---
layout: post
title:  "Koop CLI v1.1 release: add HTTPS support to the dev server"
date:   2021-01-19
author: Haoliang Yu
---

HTTPS support is one of the mostly asked features for Koop. In the recent release of Koop CLI v1.1, we have added the support of HTTPS to the dev server, which allows to create a local HTTPS server with simple command options. In this blog, we will discuss this new feature.

## New serve options

After updating the CLI version to v1.1 and checking the documentation for the `serve` command, you will see two new options `--ssl-cert` and `--ssl-key`.

```
$ koop serve [path]

run a koop server for the current project

Positionals:
  path  server file path                                                [string]

Options:
  --port      port number of the server                 [number] [default: 8080]
  --data      path to a GeoJSON data file for testing Koop plugin
                                         [string] [default: "test/data.geojson"]
  --debug     enable nodejs inspector for debugging                    [boolean]
  --watch     enable auto-restart on file change                       [boolean]
  --ssl-cert  path to the SSL certificate file                          [string]
  --ssl-key   path to the SSL key file                                  [string]
```

These options is used to provide the path to the SSL certificate and key files. If both paths are provided, the command will starts a HTTPS server, instead of a HTTP one.

For example, if I have the certificate file `cert.pem` and the key file `key.pem` in the project directory, I can run the `server` command

```
$ koop serve --ssl-cert cert.pem --ssl-key key.pem
```

and the server will start with the following message

```
Server listening at https://localhost:3000
```

Note that the URL protocol now is `https`, instead of `http`. Such URL is ready to be used in the client that requires HTTPS links.

## Under the hood

The `server` command uses the native node moudle [https](https://nodejs.org/api/https.html) to create the HTTPS server. You can see the exact implementation in the office guideline [How to create an https server?](https://nodejs.org/en/knowledge/HTTP/servers/how-to-create-a-HTTPS-server/).

## What about production?

As the whole blog post is talking about the dev server, you may ask what about the production. Since Koop is a dedicated ET(L) server, it does not incldue the HTTPS feature. The implementation for the HTTPS dev server is not scalable and is not a good way for production use.

The common industrial practice is to use a proxy server (like nginx) or the service from your cloud provider.