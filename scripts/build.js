var fs = require('fs')
var glob = require('glob')
var md = require('markdown-it')({
  html: true,
  linkify: true,
  typographer: true
})
var opts = { encoding: 'utf8' }
var header = fs.readFileSync('./partials/_header.html', opts)
var footer = fs.readFileSync('./partials/_footer.html', opts)

// add root README as index
var pages = [{
  path: 'index.html',
  body: md.render(fs.readFileSync('./README.md', opts))
}]

// add all markdown docs
glob.sync('docs/**/*.md').forEach(function (file) {
  var path = file.split('/').slice(0, -1).join('/')
  var name = file.split('.')[0].split('/').pop()

  // treat README as directory index
  if (name === 'README') name = 'index'

  pages.push({
    path: path + '/' + name + '.html',
    body: md.render(fs.readFileSync('./' + file, opts))
  })
})

// take all pages and convert from markdown to html
pages.forEach(function (page) {
  // rewrite all relative links to markdown files to point to html equivalents
  var content = page.body.replace(/\.md"/g, '.html"')

  // stitch together header, content, and footer
  fs.writeFile(page.path, header + content + footer, function (err) {
    if (err) return console.error(err)
    console.log('built', page.path)
  })
})
