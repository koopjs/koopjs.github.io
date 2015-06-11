# Deploying to Heroku

You can deploy an instance of Koop to your [Heroku](https://www.heroku.com/) account right away using this button:

[![deploy][deploy-button]][deploy-url]

[deploy-button]: https://www.herokucdn.com/deploy/button.png
[deploy-url]: https://heroku.com/deploy?template=https://github.com/koopjs/koop-sample-app

If you like doing things manually, feel free to check out out the information in the [Heroku Dev Center](https://devcenter.heroku.com/articles/getting-started-with-nodejs#deploy-the-app).

# Using PostGIS on Heroku

Heroku has beta support for [PostGIS](http://postgis.net/). Read more about it [here](https://devcenter.heroku.com/articles/heroku-postgres-extensions-postgis-full-text-search#postgis).

Check out [`koop-pgcache`](https://github.com/koopjs/koop-pgcache) to find out more about configuring PostGIS as a persistent cache for Koop.
