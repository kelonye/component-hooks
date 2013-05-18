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

module.exports = (req, rez, next)->

  # exec = require('child_process').exec
  # exec('component build', next)

  req.program = {} if not req.program
  req.program.out ?= 'public'
  req.program.name ?= 'public'

  mkdir.sync req.program.out

  cwd = process.cwd()
  builder = new Builder(cwd)

  conf = require(cwd + '/component.json')
  builder.addLookup conf.paths

  builder.copyAssetsTo req.program.out

  if req.program.dev
    builder.prefixUrls('./')
    builder.development()
    builder.addSourceURLs()

  builder.use styl
  builder.use jade
  builder.use coffee

  req.program.name ?= 'build'

  jsPath = path.join(req.program.out, req.program.name + '.js')
  cssPath = path.join(req.program.out, req.program.name + '.css')

  builder.build (err, res)->
    utils.fatal err.message if err
    write jsPath, (res.require + res.js)
    write cssPath, res.css.trim()
    next()