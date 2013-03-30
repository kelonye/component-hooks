fs = require 'fs'
path = require 'path'
component = require 'component'
utils = component.utils

jade = require './jade'
styl = require './styl'
coffee = require './coffeec'

mkdir = require 'component/node_modules/mkdirp'
Builder = require 'component/node_modules/component-builder'

write = fs.writeFileSync

Builder::buildAliases = require('./utils').buildAliases

module.exports = (req, res, next)->

  out = 'build'

  mkdir.sync out

  cwd = process.cwd()
  builder = new Builder(cwd)

  conf = require(cwd + '/component.json')
  builder.addLookup conf.paths

  builder.copyFiles()
  builder.copyAssetsTo out

  builder.use styl
  builder.use jade
  builder.use coffee

  builder.build (err, res)->
    utils.fatal err.message if err
    write 'build/build.js', (res.require + res.js)
    write 'build/build.css', res.css.trim()
    next()
