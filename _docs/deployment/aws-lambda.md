---
title: Deploy a Koop app to AWS Lambda
permalink: /docs/deployment/aws-lambda
---

[AWS Lambda](https://aws.amazon.com/lambda/) is a serverless compute service offered by [Amazon Web Service](https://aws.amazon.com/) that comes with

* free usage of 1 million requests per month
* fully managed server with auto scaling
* easy integration with other AWS services

These features make the AWS Lambda very suitable for hosting a Koop application with little cost or limitted management resources. Use cases can include

* A free experiemental ETL service that only serves a small amount traffic
* A data service that handles very dynmac requests in events like natural disaster
* A data service built on the existing AWS infrastructure

This guide will discuss how to deploy a Koop application to [AWS Lambda](https://aws.amazon.com/lambda/) and expose the APIs using [AWS API Gateway](https://aws.amazon.com/api-gateway/). Since a Koop application is essentially an [Expressjs](https://expressjs.com/) server, this guide utilize the [serverless](https://www.serverless.com/) framework and its [serverless-http](https://github.com/dougmoscrop/serverless-http) plugin to manage the deployment.

## Serverless framework

The serverless framework is a CLI tool to manage the development and deployment of appliaction to cloud services, including AWS. It uses the configuration-as-code approach and stores the configuration in [YAML](https://en.wikipedia.org/wiki/YAML) format.

![config-example](data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNTI5cHgiIGhlaWdodD0iMjcycHgiIHZpZXdCb3g9IjAgMCA1MjkgMjcyIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCA2MS4yICg4OTY1MykgLSBodHRwczovL3NrZXRjaC5jb20gLS0+CiAgICA8dGl0bGU+aW1hZ2UgLyB0ZXh0IGVkaXRvcjwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxnIGlkPSJmaW5hbCIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9ImhvbWVwYWdlLS8tZGVza3RvcCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEyNC4wMDAwMDAsIC04OTMuMDAwMDAwKSI+CiAgICAgICAgICAgIDxnIGlkPSJpbWFnZS0vLXRleHQtZWRpdG9yIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMjUuMDAwMDAwLCA4OTQuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8cmVjdCBpZD0iUmVjdGFuZ2xlIiBzdHJva2U9IiM0MDNFM0UiIGZpbGw9IiMwMDAwMDAiIHN0cm9rZS1saW5lY2FwPSJzcXVhcmUiIHg9IjAiIHk9IjAiIHdpZHRoPSI1MjciIGhlaWdodD0iMjcwIiByeD0iNiI+PC9yZWN0PgogICAgICAgICAgICAgICAgPHRleHQgaWQ9ImluZGV4LnN1Ym1pdCIgZm9udC1mYW1pbHk9IlBUTW9uby1SZWd1bGFyLCBQVCBNb25vIiBmb250LXNpemU9IjE0IiBmb250LXdlaWdodD0ibm9ybWFsIiBsaW5lLXNwYWNpbmc9IjE1IiBmaWxsPSIjRURFREVEIj4KICAgICAgICAgICAgICAgICAgICA8dHNwYW4geD0iMTg2IiB5PSIxMTIuODMzMzMzIj5pbmRleC5zdWJtaXQ8L3RzcGFuPgogICAgICAgICAgICAgICAgPC90ZXh0PgogICAgICAgICAgICAgICAgPHRleHQgaWQ9Im5vZGVqczEwLngiIGZvbnQtZmFtaWx5PSJQVE1vbm8tUmVndWxhciwgUFQgTW9ubyIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9Im5vcm1hbCIgbGluZS1zcGFjaW5nPSIxNSIgZmlsbD0iI0VERURFRCI+CiAgICAgICAgICAgICAgICAgICAgPHRzcGFuIHg9IjE4NiIgeT0iMTM5LjQ0NDQ0NCI+bm9kZWpzMTAueDwvdHNwYW4+CiAgICAgICAgICAgICAgICA8L3RleHQ+CiAgICAgICAgICAgICAgICA8dGV4dCBpZD0iL3N1Ym1pdCIgZm9udC1mYW1pbHk9IlBUTW9uby1SZWd1bGFyLCBQVCBNb25vIiBmb250LXNpemU9IjE0IiBmb250LXdlaWdodD0ibm9ybWFsIiBsaW5lLXNwYWNpbmc9IjE1IiBmaWxsPSIjRURFREVEIj4KICAgICAgICAgICAgICAgICAgICA8dHNwYW4geD0iMjAwIiB5PSIyMTkuMjgiPi9zdWJtaXQ8L3RzcGFuPgogICAgICAgICAgICAgICAgPC90ZXh0PgogICAgICAgICAgICAgICAgPHRleHQgaWQ9InBvc3QiIGZvbnQtZmFtaWx5PSJQVE1vbm8tUmVndWxhciwgUFQgTW9ubyIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9Im5vcm1hbCIgbGluZS1zcGFjaW5nPSIxNSIgZmlsbD0iI0VERURFRCI+CiAgICAgICAgICAgICAgICAgICAgPHRzcGFuIHg9IjIxOCIgeT0iMjQ2Ij5wb3N0PC90c3Bhbj4KICAgICAgICAgICAgICAgIDwvdGV4dD4KICAgICAgICAgICAgICAgIDx0ZXh0IGlkPSIxLTItMy00LTUtNi03LTgtOSIgZm9udC1mYW1pbHk9IlNGTW9uby1NZWRpdW0sIFNGIE1vbm8iIGZvbnQtc2l6ZT0iMTQiIGZvbnQtd2VpZ2h0PSI0MDAiIGxpbmUtc3BhY2luZz0iMjYuNSIgbGV0dGVyLXNwYWNpbmc9IjAuNzc3Nzc3Nzc4IiBmaWxsPSIjNTc1NzU3Ij4KICAgICAgICAgICAgICAgICAgICA8dHNwYW4geD0iMjQuNjA3ODQ5MyIgeT0iMzAiPjE8L3RzcGFuPgogICAgICAgICAgICAgICAgICAgIDx0c3BhbiB4PSIyNC42MDc4NDkzIiB5PSI1Ni41Ij4yPC90c3Bhbj4KICAgICAgICAgICAgICAgICAgICA8dHNwYW4geD0iMjQuNjA3ODQ5MyIgeT0iODMiPjM8L3RzcGFuPgogICAgICAgICAgICAgICAgICAgIDx0c3BhbiB4PSIyNC42MDc4NDkzIiB5PSIxMDkuNSI+NDwvdHNwYW4+CiAgICAgICAgICAgICAgICAgICAgPHRzcGFuIHg9IjI0LjYwNzg0OTMiIHk9IjEzNiI+NTwvdHNwYW4+CiAgICAgICAgICAgICAgICAgICAgPHRzcGFuIHg9IjI0LjYwNzg0OTMiIHk9IjE2Mi41Ij42PC90c3Bhbj4KICAgICAgICAgICAgICAgICAgICA8dHNwYW4geD0iMjQuNjA3ODQ5MyIgeT0iMTg5Ij43PC90c3Bhbj4KICAgICAgICAgICAgICAgICAgICA8dHNwYW4geD0iMjQuNjA3ODQ5MyIgeT0iMjE1LjUiPjg8L3RzcGFuPgogICAgICAgICAgICAgICAgICAgIDx0c3BhbiB4PSIyNC42MDc4NDkzIiB5PSIyNDIiPjk8L3RzcGFuPgogICAgICAgICAgICAgICAgPC90ZXh0PgogICAgICAgICAgICAgICAgPHRleHQgaWQ9Im15LXJlc3QtYXBpIiBmb250LWZhbWlseT0iUFRNb25vLVJlZ3VsYXIsIFBUIE1vbm8iIGZvbnQtc2l6ZT0iMTQiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIGxpbmUtc3BhY2luZz0iMTUiIGZpbGw9IiNFREVERUQiPgogICAgICAgICAgICAgICAgICAgIDx0c3BhbiB4PSIxMzIuMjg1MTcxIiB5PSIzMy4wNzYzODg5Ij5teS1yZXN0LWFwaTwvdHNwYW4+CiAgICAgICAgICAgICAgICA8L3RleHQ+CiAgICAgICAgICAgICAgICA8dGV4dCBpZD0ibmFtZToiIGZvbnQtZmFtaWx5PSJQVE1vbm8tUmVndWxhciwgUFQgTW9ubyIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9Im5vcm1hbCIgbGluZS1zcGFjaW5nPSIxNSIgZmlsbD0iIzk0OTQ5NCI+CiAgICAgICAgICAgICAgICAgICAgPHRzcGFuIHg9IjgzIiB5PSIzMyI+bmFtZTo8L3RzcGFuPgogICAgICAgICAgICAgICAgPC90ZXh0PgogICAgICAgICAgICAgICAgPHRleHQgaWQ9Ii1odHRwOiIgZm9udC1mYW1pbHk9IlBUTW9uby1SZWd1bGFyLCBQVCBNb25vIiBmb250LXNpemU9IjE0IiBmb250LXdlaWdodD0ibm9ybWFsIiBsaW5lLXNwYWNpbmc9IjE1IiBmaWxsPSIjOTQ5NDk0Ij4KICAgICAgICAgICAgICAgICAgICA8dHNwYW4geD0iMTI3IiB5PSIxOTIuNjY2NjY3Ij4taHR0cDo8L3RzcGFuPgogICAgICAgICAgICAgICAgPC90ZXh0PgogICAgICAgICAgICAgICAgPHRleHQgaWQ9Im1ldGhvZDoiIGZvbnQtZmFtaWx5PSJQVE1vbm8tUmVndWxhciwgUFQgTW9ubyIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9Im5vcm1hbCIgbGluZS1zcGFjaW5nPSIxNSIgZmlsbD0iIzk0OTQ5NCI+CiAgICAgICAgICAgICAgICAgICAgPHRzcGFuIHg9IjE1NSIgeT0iMjQ2Ij5tZXRob2Q6PC90c3Bhbj4KICAgICAgICAgICAgICAgIDwvdGV4dD4KICAgICAgICAgICAgICAgIDx0ZXh0IGlkPSJwYXRoOiIgZm9udC1mYW1pbHk9IlBUTW9uby1SZWd1bGFyLCBQVCBNb25vIiBmb250LXNpemU9IjE0IiBmb250LXdlaWdodD0ibm9ybWFsIiBsaW5lLXNwYWNpbmc9IjE1IiBmaWxsPSIjOTQ5NDk0Ij4KICAgICAgICAgICAgICAgICAgICA8dHNwYW4geD0iMTU1IiB5PSIyMTkuMjc3Nzc4Ij5wYXRoOjwvdHNwYW4+CiAgICAgICAgICAgICAgICA8L3RleHQ+CiAgICAgICAgICAgICAgICA8dGV4dCBpZD0iZXZlbnRzOiIgZm9udC1mYW1pbHk9IlBUTW9uby1SZWd1bGFyLCBQVCBNb25vIiBmb250LXNpemU9IjE0IiBmb250LXdlaWdodD0ibm9ybWFsIiBsaW5lLXNwYWNpbmc9IjE1IiBmaWxsPSIjOTQ5NDk0Ij4KICAgICAgICAgICAgICAgICAgICA8dHNwYW4geD0iMTEzLjAwMTkwMSIgeT0iMTY2LjA1NTU1NiI+ZXZlbnRzOjwvdHNwYW4+CiAgICAgICAgICAgICAgICA8L3RleHQ+CiAgICAgICAgICAgICAgICA8dGV4dCBpZD0icnVudGltZToiIGZvbnQtZmFtaWx5PSJQVE1vbm8tUmVndWxhciwgUFQgTW9ubyIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9Im5vcm1hbCIgbGluZS1zcGFjaW5nPSIxNSIgZmlsbD0iIzk0OTQ5NCI+CiAgICAgICAgICAgICAgICAgICAgPHRzcGFuIHg9IjExMiIgeT0iMTM5LjQ0NDQ0NCI+cnVudGltZTo8L3RzcGFuPgogICAgICAgICAgICAgICAgPC90ZXh0PgogICAgICAgICAgICAgICAgPHRleHQgaWQ9ImZ1bmN0aW9uczoiIGZvbnQtZmFtaWx5PSJQVE1vbm8tUmVndWxhciwgUFQgTW9ubyIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9Im5vcm1hbCIgbGluZS1zcGFjaW5nPSIxNSIgZmlsbD0iIzk0OTQ5NCI+CiAgICAgICAgICAgICAgICAgICAgPHRzcGFuIHg9IjgzIiB5PSI1OS42MTExMTExIj5mdW5jdGlvbnM6PC90c3Bhbj4KICAgICAgICAgICAgICAgIDwvdGV4dD4KICAgICAgICAgICAgICAgIDx0ZXh0IGlkPSJzdWJtaXQ6IiBmb250LWZhbWlseT0iUFRNb25vLVJlZ3VsYXIsIFBUIE1vbm8iIGZvbnQtc2l6ZT0iMTQiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIGxpbmUtc3BhY2luZz0iMTUiIGZpbGw9IiM5NDk0OTQiPgogICAgICAgICAgICAgICAgICAgIDx0c3BhbiB4PSI5NSIgeT0iODYuMjIyMjIyMiI+c3VibWl0OjwvdHNwYW4+CiAgICAgICAgICAgICAgICA8L3RleHQ+CiAgICAgICAgICAgICAgICA8dGV4dCBpZD0iaGFuZGxlcjoiIGZvbnQtZmFtaWx5PSJQVE1vbm8tUmVndWxhciwgUFQgTW9ubyIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9Im5vcm1hbCIgbGluZS1zcGFjaW5nPSIxNSIgZmlsbD0iIzk0OTQ5NCI+CiAgICAgICAgICAgICAgICAgICAgPHRzcGFuIHg9IjExMiIgeT0iMTEyLjgzMzMzMyI+aGFuZGxlcjo8L3RzcGFuPgogICAgICAgICAgICAgICAgPC90ZXh0PgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4K)

The framework also has a rich plugin ecosystem to cover the full lifecycle of the application development. Despite the framework's core capability of AWS Lambda deployment, the [serverless-http](https://github.com/dougmoscrop/serverless-http) plugin is capable of wrapping a server into serverless APIs and creating endpoints at API Gateway.

## Preparation

An AWS credential with privileges is required for the deployment process:

*  read/write S3
*  manage Lambda
*  manage API Gateway

## Code update

This guide is based on the Koop application created by the [Koop CLI](https://github.com/koopjs/koop-cli). It needs a few updates on the code generated by the CLI.

### Installing dependencies

First the serverless framework can be installed into the project:

```
npm install serverless serverless-http serverless-offline
```

and create a command in the `package.json` file

``` javascript
{
  "scripts": {
    "deploy": "sls deploy",
    "start": "sls offline start"
  }
}
```

The serverless framework documentation provides a guide on how to setup the credential for the CLI. See this [link](https://serverless.com/framework/docs/providers/aws/guide/credentials/) for details.

### Creating lambda function handlers

Instead of running the Koop server, the project should export the lambda function handlers in the `src/index.js` file.

``` javascript
const Koop = require("koop");
const serverless = require("serverless-http");

// initiate a Koop app
const koop = new Koop();

// configure the Koop app

// NOTE: this line is the real change
// wrap the Koop server with the serverless framework
module.exports.handler = serverless(koop.server);
```

### Creating serverless configuration

The Lambda function is configured with the file `servless.yml` in the project's root directory.

The following example configuration shows how to set up a HTTP service exposing a Feature Service endpoint from a Koop application. All endpoints and parameteres in use should be explicitely defined in the configuration so that they can be properly created in API Gateway.

``` yaml
# Lambda function service name
service: koop-serverless-example

provider:
  name: aws
  runtime: nodejs10.x

functions:
  # The Koop-app lambda function handles HTTP requests
  koop-app:
    handler: src/index.handler
    events:
      # The "http" event defines an API at the API Gateway
      - http:
          path: /my-provider/{id}/FeatureServer/0
          method: get
          request:
            # Each parameter and query string need to be explicitly specified
            parameters:
              paths:
                id: true
```

You can start working on your configuration by updating and adding HTTP events in the example.

For details and options, check the [Serverless AWS Guide](https://serverless.com/framework/docs/providers/aws/).

## Development and deployment

Once the framework and the code is done, testing and deployment the lambda functions is just a few commands.

The `start` command runs a local instance of the lambda function and expose the endpoint. It is completely the same as the clould version.

```
npm run start
```
The `deploy` command runs the fully automatic deployment to the cloud service.

```
npm run deploy
```

Beyond these two basic commands, the serverless framework provides a variety of CLI commands to manage the project. See the [documentation](https://www.serverless.com/framework/docs/providers/aws/) for details.

## Putting together

In summary, a few steps are needed to deploy your Koop application on the AWS Lambda:

* Prepare an AWS credential
* Install the serverless framework and setup your credential
* Update Koop code to export the function handler
* Create the serverless configuration
* Read to deploy!

The [koop-serverless-example](https://github.com/koopjs/koop-serverless-example) repo provides a fully functional example to demonstrate the above content. You can try to deploy the example and learn how to modify your application for AWS Lambda.