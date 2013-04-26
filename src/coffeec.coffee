fs = require 'fs'
path = require 'path'
Batch = require 'batch'
addConfProperty = require('./utils').addConfProperty
coffeescript = require 'coffee-script'

module.exports = (builder)->

  builder.hook 'before scripts', (pkg, fn) ->

    scripts = pkg.config.coffee
    return fn() unless scripts

    batch = new Batch()

    if not pkg.config.scripts
      batch.push (done) ->
        addConfProperty pkg, 'scripts'
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
