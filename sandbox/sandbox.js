/* global RunKit L */

document.addEventListener('DOMContentLoaded', function (event) {
  const map = L.map('map').setView([33.7490, -84.3880], 13)
  L.esri.basemapLayer('Streets').addTo(map)
  RunKit.createNotebook({
    element: document.getElementById('notebook'),
    onURLChanged: urlCB,
    nodeVersion: '> 6.0.0',
    source: `
  const Koop = require('koop')
  const koop = new Koop()
  const craigslist = require('koop-provider-craigslist')
  koop.register(craigslist)
  const express = require("@runkit/runkit/express-endpoint/1.0.0")
  const app = express(exports)
  app.use(koop.server)`
  })

  function urlCB (nb) {
    const baseURL = nb.URL.replace(/runkit.com/, 'runkit.io')
    const url = `${baseURL}/branches/master/craigslist/atlanta/apartments/FeatureServer/0`
    console.log(url)
    L.esri.featureLayer({url}).addTo(map)
  }
})
