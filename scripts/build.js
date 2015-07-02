var fs = require('fs')
var md = require('markdown-it')({
  html: true,
  linkify: true,
  typographer: true
})
var opts = { encoding: 'utf8' }
var header = fs.readFileSync('./partials/_header.html', opts)
var footer = fs.readFileSync('./partials/_footer.html', opts)
var pages = []

pages.push({
  path: 'index.html',
  body: md.render(fs.readFileSync('./README.md', opts))
}, {
  path: 'docs/index.html',
  body: md.render(fs.readFileSync('./docs/README.md', opts))
}, {
  path: 'docs/setup.html',
  body: md.render(fs.readFileSync('./docs/setup.md', opts))
})

pages.forEach(function (page) {
  var rewrite = page.body.replace(/\.md"/g, '.html"')
  fs.writeFile(page.path, header + rewrite + footer, function (err) {
    if (err) return console.error(err)
    console.log('built', page.path)
  })
})
