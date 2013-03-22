fs = require 'fs'
path = require 'path'
Batch = require 'batch'
init = require('./utils').init
coffeescript = require 'coffee-script'

module.exports = (builder)->

  builder.hook 'before scripts', (pkg, fn) ->

    scripts = pkg.conf.coffee
    return fn() unless scripts

    batch = new Batch()

    if not pkg.conf.scripts
      batch.push (done) ->
        init pkg, 'scripts'
        done()

    scripts.forEach (file) ->

      batch.push (done) ->

        coffeefile = pkg.path(file) + '.coffee'
        jsfile = "#{file}.js"

        coffee = fs.readFileSync coffeefile, 'utf8'
        js = coffeescript.compile coffee, bare: yes

        pkg.addFile 'scripts', jsfile, js

        done()

    batch.end fn
