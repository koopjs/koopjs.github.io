/* global RunKit L $ */
const source = `
const Koop = require('koop')
const request = require('request').defaults({gzip: true, json: true})
let express = require("@runkit/runkit/express-endpoint/1.0.0")
// app must be declared at the top for the runkit endpoint to be picked up
let app = express(exports)

function Model () {
  this.getData = function (req, callback) {
    // Call the remote API with our developer key
    const key = '8A0EBB788E8205888807BAC97'

    request(\`https://developer.trimet.org/ws/v2/vehicles/onRouteOnly/false/appid/\${key}\`, (err, res, body) => {
      if (err) return callback(err)
      // translate the response into geojson
      const geojson = translate(body)
      // Cache data for 10 seconds at a time by setting the ttl or "Time to Live"
      geojson.ttl = 10
      // hand off the data to Koop
      callback(null, geojson)
    })
  }
}

function translate (input) {
  return {
    type: 'FeatureCollection',
    features: input.resultSet.vehicle.map(formatFeature)
  }
}

function formatFeature (vehicle) {
  // Most of what we need to do here is extract the longitude and latitude
  const feature = {
    type: 'Feature',
    properties: vehicle,
    geometry: {
      type: 'Point',
      coordinates: [vehicle.longitude, vehicle.latitude]
    }
  }
  // But we also want to translate a few of the date fields so they are easier to use downstream
  const dateFields = ['expires', 'serviceDate', 'time']
  dateFields.forEach(field => {
    feature.properties[field] = new Date(feature.properties[field]).toISOString()
  })
  return feature
}

const koop = new Koop()

koop.register({
  name: 'trimet',
  hosts: false,
  disableIdParam: true,
  Model,
  version: '1.0',
  type: 'provider'
})

app.use(koop.server)
/* Enter the pattern for the provider FeatureServer URL
   so that it can be added to the map.
   e.g. with a hosts param and id param: /craigslist/atlanta/apartments/FeatureServer/0
   e.g. with only an id param: /zillow/atlanta/FeatureServer/0
*/
'/trimet/FeatureServer/0'`

document.addEventListener('DOMContentLoaded', function (event) {
  let base
  let added = false
  const map = L.map('map').setView([45.5231, -122.6765], 12)

  L.esri.basemapLayer('Streets').addTo(map)
  const notebook = RunKit.createNotebook({
    element: document.getElementById('notebook'),
    onURLChanged: nb => { base = nb.URL.replace(/runkit.com/, 'runkit.io') },
    onEvaluate,
    nodeVersion: '> 6.0.0',
    source,
    env: [
      'SUPPRESS_NO_CONFIG_WARNING=true'
    ]
  })

  function onEvaluate (nb) {
    notebook.getSource(source => {
      const fragment = source.split(/\s/).reverse()[0]
      const url = `${base}/branches/master${fragment}`.replace(/'/g, '').replace(/"/g, '')
      if (added) map.removeLayer(points)
      const points = L.esri.featureLayer({url}).addTo(map)
      added = true
      points.bindPopup(createPopup, {maxHeight: 500, maxWidth: 500})
    })
  }

  $('#myTabs a').click(function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

  $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    e.target // newly activated tab
    e.relatedTarget // previous active tab
    map.invalidateSize(false)
  })
})

function createPopup (layer) {
  const rows = Object.keys(layer.feature.properties).reduce((html, p) => {
    return `${html}<tr><td>${p}</td><td>${layer.feature.properties[p]}</td></tr>`
  }, '')
  const table = `
    <div class="table-responsive">
      <table class="table">
        ${rows}
      </table>
    </div>
  `
  return table
}
