# Koop provider module specification

**documentation incomplete: work in progress**

Koop is designed to expose 3rd party services as Feature Services that are consumable within Esri products and services. See the [Providers](https://github.com/koopjs/koopjs.github.io/blob/master/docs/providers.md) section of the documentation for a complete list of providers.

## Development

To modify [Koop](https://github.com/koopjs/koop) or develop new koop providers, install them to the `node_modules` directory in the koop application folder:

### Defining a new provider

Check out providers such as [koop-agol](https://github.com/koopjs/koop-agol) and link in `node_modules/`

```
git clone git@github.com:koopjs/koop-agol.git
cd koop-agol && npm install
cd node_modules && ln -s ../koop-agol
```

Each provider defines custom routes, a controller, and a model. Each of these uses `module.exports` to export an object (CommonJS modules).  Each is then consumed by Koop at start up time and made available by the server.

**Note**: The name of the provider directory is used to define the name of the provider and its controller within Koop.

#### Routes

Define custom routes in the `routes/index.js` file:

```javascript
// defined in api/providers/sample/routes/index.js

module.exports = {
  'get /sample': {
    controller: 'sample',
    action: 'index'
  }
}
```

The above creates a `/sample` route that calls the `index` method on the sample controller (defined in `/api/providers/sample/controller/index.js`).

#### Controller

Defines the handlers used to respond to routes.

```javascript
module.exports = {
  // this tells koop to treat this provider like AGS service and show up at the root data provider endpoint
  provider: false,

  // our index method to simple print text
  index: function(req, res){
    res.send('Sample Providers, to make this a real one set provider true');
  }
};
```

Each method takes in a request and response property and needs to send something to the reponse.

#### Models

Models are used to interact directly with 3rd party services and databases. They make the HTTP requests to the 3rd party API and should hand back raw data to the controllers.

#### Example URL Structure 1: Gists as a Feature Service

  * [http://koop.dc.esri.com/gist/6021269](http://koop.dc.esri.com/gist/6021269)
  * [http://koop.dc.esri.com/gist/6021269/FeatureServer](http://koop.dc.esri.com/gist/6021269/FeatureServer)
  * [http://koop.dc.esri.com/gist/6021269/FeatureServer/0](http://koop.dc.esri.com/gist/6021269/FeatureServer/0)
  * [http://koop.dc.esri.com/gist/6021269/FeatureServer/0/query](http://koop.dc.esri.com/gist/6021269/FeatureServer/0/query)

#### Example URL Structure 2: Github Repo as a Feature Service

  * [http://koop.dc.esri.com/github/colemanm/hurricanes/fl_2004_hurricanes](http://koop.dc.esri.com/github/colemanm/hurricanes/fl_2004_hurricanes)
  * [http://koop.dc.esri.com/github/colemanm/hurricanes/fl_2004_hurricanes/FeatureServer](http://koop.dc.esri.com/github/colemanm/hurricanes/fl_2004_hurricanes/FeatureServer/)
  * [http://koop.dc.esri.com/github/colemanm/hurricanes/fl_2004_hurricanes/FeatureServer/0/query](http://koop.dc.esri.com/github/colemanm/hurricanes/fl_2004_hurricanes/FeatureServer/0/query)
  * Note: Repos can of course have directories, and this presents an issue with creating dynamic routes that match arbitrary paths in github. To solve this Koop will replace dashes with slashes in its github routes:
    * [http://koop.dc.esri.com/github/geobabbler/geodata/geojson-border_crossings/FeatureServer/0/query](http://koop.dc.esri.com/github/geobabbler/geodata/geojson-border_crossings/FeatureServer/0/query)
    * The above url would pull down this geojson file: [https://github.com/geobabbler/geodata/blob/master/geojson/border_crossings.geojson](https://github.com/geobabbler/geodata/blob/master/geojson/border_crossings.geojson)

