fs = require 'fs'
jade = require 'jade'
path = require 'path'
Batch = require 'batch'
init = require('./utils').init
str2js = require 'string-to-js'

module.exports = (builder)->

  builder.hook 'before scripts', (pkg, fn) ->

    templates = pkg.conf.jade
    return fn() unless templates

    batch = new Batch()

    if not pkg.conf.scripts
      batch.push (done) ->
        init pkg, 'scripts'
        done()

    templates.forEach (file) ->

      batch.push (done) ->

        jadefile = pkg.path(file) + '.jade'
        jsfile =  "#{file}.js"

        str = fs.readFileSync jadefile, 'utf8'
        js = jade.compile str

        pkg.addFile 'scripts', jsfile, str2js(js())

        done()

    batch.end fn
