/**
  * Module dependencies
  */

var fs = require('fs')
  , path = require('path')
  , component = require('component')
  , utils = component.utils
  , buildAliases = require('./utils').buildAliases
  , jade = require('./jade')
  , styl = require('./styl')
  , coffee = require('./coffeec')
  , mkdir = require('component/node_modules/mkdirp')
  , Builder = require('component/node_modules/component-builder')
  , write = fs.writeFileSync;

/**
  * Redefine Builder#buildAliases
  */

Builder.prototype.buildAliases = buildAliases;

/**
  * Middleware that performs the build, and then
  * invokes `next`
  */

module.exports = function(req, res, next){

  if (!req) req = {}
  if (!req.program) req.program = {}
  if (!req.program.out) req.program.out = 'public'
  if (!req.program.name) req.program.name = 'public'

  mkdir.sync(req.program.out);
  
  var cwd = process.cwd()
    , builder = new Builder(cwd)
    , conf = require(cwd + '/component.json')
    , jsPath = path.join(req.program.out, req.program.name + '.js')
    , cssPath = path.join(req.program.out, req.program.name + '.css');


  builder.addLookup(conf.paths);
  builder.copyAssetsTo(req.program.out);

  if (req.program.dev){
    builder.prefixUrls('./');
    builder.development();
    builder.addSourceURLs();
  }

  builder.use(styl);
  builder.use(jade);
  builder.use(coffee);

  builder.build(function(err, res){
    if (err) utils.fatal(err.message)
    write(jsPath, (res.require + res.js));
    write(cssPath, res.css.trim());
    next()
  });

}