# koopjs.github.io

This is the repository for Koop documentation.  We are always looking to expand and improve our documentation - please open a pull request if you have something to add!



## Running locally

The site is built with Jekyll and the [Jekyll Doc Theme](https://github.com/aksakalli/jekyll-doc-theme). To get started, make sure you have Ruby and gem and clone this repo. Then:

```bash
# install bundler
gem install bundler

# install packages
bundle install

# run jekyll with dependencies
bundle exec jekyll serve
```

## Blog
Any new blog post should be added to the `_posts` directory and prefixed with a `YYYY-MM-DD-` timestamp.  There is a link to the blog in the navigation bar that is currently commented out in the `_includes/topnav.html` file. Upon the addition of blog posts, that should be uncommented and made visible.
