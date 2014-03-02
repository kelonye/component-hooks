/**
  * Module dependencies
  */

var fs = require('fs')
  , path = require('path')
  , component = require('component')
  , utils = component.utils
  , buildAliases = require('./utils').buildAliases
  , minify = require('./utils').minify
  , jade = require('./jade')
  , html = require('./html')
  , styl = require('./styl')
  , css = require('./css')
  , less = require('./less')
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

  if (!req) req = {};
  if (!res) res = {};
  if (!next) next = function (){};
  if (!req.program) req.program = {};
  if (!req.program.out) req.program.out = 'public';
  if (!req.program.name) req.program.name = 'public';
  if (!req.program.cwd) req.program.cwd = process.cwd();

  var out = path.join(req.program.cwd, req.program.out);
  mkdir.sync(out);

  var builder = new Builder(req.program.cwd);
  var conf = require(req.program.cwd + '/component.json');
  var jsPath = path.join(out, req.program.name + '.js');
  var cssPath = path.join(out, req.program.name + '.css');

  builder.addLookup(conf.paths);
  if (req.program.copy) builder.copyFiles();
  builder.copyAssetsTo(out);

  if (req.program.dev){
    builder.prefixUrls('./');
    builder.development();
    builder.addSourceURLs();
  }

  builder.use(css);
  builder.use(less);
  builder.use(styl);
  builder.use(jade);
  builder.use(html);
  builder.use(coffee);

  //var start = new Date;

  builder.build(function(err, res){
    if (err) utils.fatal(err.message)
    if (req.program.dev){
      minify = function(type, code){return code;};
    }
    write(jsPath, minify('js', res.require + res.js));
    write(cssPath, minify('css', res.css.trim()));

    // var duration = new Date - start;
    // log('duration', duration + 'ms');
    // console.log();

    next();
  });

}