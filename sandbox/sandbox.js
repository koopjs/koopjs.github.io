/* global RunKit L $ */
const source = `
const Koop = require('koop')
const request = require('request').defaults({gzip: true})
let express = require("@runkit/runkit/express-endpoint/1.0.0")
// app must be declared at the top for the runkit endpoint to be picked up
let app = express(exports)

function Model () {
  // This is our one public function it's job its to fetch data from craigslist and return as a feature collection
  this.getData = function (req, callback) {
    const city = req.params.host
    const type = req.params.id
    request(\`https://\${city}.craigslist.org/jsonsearch/apa/\`, (err, res, body) => {
      if (err) return callback(err)
      const apartments = translate(res.body)
      apartments.ttl = 60 * 60 * 60 // cache for 1 hour
      apartments.metadata = {
        name: \`\${city} \${type}\`,
        description: \`Craigslist \${type} listings proxied by https://github.com/dmfenton/koop-provider-craigslist\`
      }
      callback(null, apartments)
    })
  }
}

// Map accross all elements from a Craigslist respsonse and translate it into a feature collection
function translate (data) {
  const list = JSON.parse(data)
  const featureCollection = {
    type: 'FeatureCollection',
    features: []
  }
  if (list && list[0]) {
    const apartments = list[0].filter(node => { return node.Ask })
    featureCollection.features = apartments.map(formatFeature)
  }
  return featureCollection
}

// This function takes a single element from the craigslist response and translates it to GeoJSON
function formatFeature (apt) {
  const feature =  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [apt.Longitude, apt.Latitude]
    },
    properties: {
      title: apt.PostingTitle,
      price: parseFloat(apt.Ask),
      bedrooms: parseFloat(apt.Bedrooms),
      postDate: new Date(parseInt(apt.PostedDate, 10) * 1000).toISOString(),
      posting: 'https:' + apt.PostingURL,
      thumbnail: apt.ImageThumb
    }
  }
  return feature
}

const koop = new Koop()

koop.register({
  name: 'craigslist',
  hosts: true,
  Model,
  version: '1.0',
  type: 'provider'
})

app.use(koop.server)
`

document.addEventListener('DOMContentLoaded', function (event) {
  const map = L.map('map').setView([38.9072, -77.0369], 12)
  $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    e.target // newly activated tab
    e.relatedTarget // previous active tab
    map.invalidateSize(false)
  })
  L.esri.basemapLayer('Streets').addTo(map)
  RunKit.createNotebook({
    element: document.getElementById('notebook'),
    onURLChanged: urlCB,
    nodeVersion: '> 6.0.0',
    source
  })

  function urlCB (nb) {
    const baseURL = nb.URL.replace(/runkit.com/, 'runkit.io')
    const url = `${baseURL}/branches/master/craigslist/washingtondc/apartments/FeatureServer/0`
    console.log(url)
    const points = L.esri.featureLayer({url}).addTo(map)
    points.bindPopup(function (layer) {
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
    }, {maxWidth: 500})
  }
  $('#myTabs a').click(function (e) {
    e.preventDefault()
    $(this).tab('show')
  })
})
