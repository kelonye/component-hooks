/**
  * Module dependencies
  */
var fs = require('fs');
var path = require('path');
var component = require('component');
var utils = component.utils;
var minify = require('./utils').minify;
var jade = require('./jade');
var html = require('./html');
var styl = require('./styl');
var css = require('./css');
var less = require('./less');
var Batch = require('batch');
var coffee = require('./coffeec');
var mkdir = require('component/node_modules/mkdirp');
var Builder = require('./builder');
var write = fs.writeFileSync;


/**
  * Expose `Program`
  */
module.exports = Program;


/**
  * Program
  *
  * @param {String} cwd - abs path to component base dir 
  */
function Program(cwd){

  if (!(this instanceof Program)) return new Program(cwd);

  this._cwd = cwd || process.cwd();
  this._name = 'public';
  this._dev = false;
  this._copy = false;
  this._log = false;
  this._minify = minify;
  this._standalone = false;
  this._prefix = './';

}


/**
  * Build to `out`
  *
  * @param {String} out - path
  */
Program.prototype.out = function(out) {
  this._out = out;
  return this;
};


/**
  * Name build files as `name.*`
  *
  * @param {String} name
  */
Program.prototype.name = function(name) {
  this._name = name;
  return this;
};


/**
  * Turn development build on
  */
Program.prototype.dev = function() {
  this._dev = true;
  return this;
};


/**
  * Prefix urls in css with `prefix`.
  */
Program.prototype.prefix = function(prefix) {
  this._prefix = prefix;
  return this;
};


/**
  * Autorequire
  *
  * @param {String} name
  */
Program.prototype.autorequire =
Program.prototype.standalone = function() {
  this._standalone = true;
  return this;
};


/**
  * Copy files instead of symlinking
  */
Program.prototype.copy = function() {
  this._copy = true;
  return this;
};


/**
  * Log build progress
  */
Program.prototype.log = function() {
  this._log = true;
  return this;
};


/**
  * Use `fn` minification func for `type`
  *
  * @param {String} type - js|css
  * @param {Function} fn
  */
Program.prototype.minify = function(type, fn) {
  this._minify[type] = fn;
  return this;
};


/**
  * Build
  *
  * @param {Function} done - callback
  */
Program.prototype.end = function(done) {

  var self = this;
  var conf = require(self._cwd + '/component.json');
  if (!self._out) self._out = path.join(self._cwd, '/public');
  var jsPath = path.join(self._out, self._name + '.js');
  var cssPath = path.join(self._out, self._name + '.css');

  // create dist dir

  mkdir.sync(self._out);

  // builder

  var builder = new Builder(self._cwd);
  builder.addLookup(conf.paths);

  // copy

  if (self._copy) builder.copyFiles();

  // copy assets

  builder.copyAssetsTo(self._out);

  // dev

  if (self._dev){
    builder.prefixUrls(self._prefix);
    builder.development();
    builder.addSourceURLs();
  }

  builder.use(css);
  builder.use(less);
  builder.use(styl);
  builder.use(jade);
  builder.use(html);
  builder.use(coffee);

  if (self._log) var start = new Date;

  builder.build(function(err, res){
    
    // if (err) utils.fatal(err.message);
    if (err) return done(err);

    if (self._dev){
      function fn(code, cb){
        cb(err, code);
      };
      self.minify('js', fn);
      self.minify('css', fn);
    }

    var batch = new Batch;

    batch.push(function(next){

      var js = '';

      if (self._standalone) js += ';(function(){\n';
      
      js += (res.require + res.js);

      if (self._standalone) {
        js += 'require("' + conf.name + '");';
        js += '})();';
      }

      self._minify.js(js, function(err, code){
        if (err) return next(err);
        write(jsPath, code);
        next();
      });

    });

    batch.push(function(next){
      self._minify.css(res.css.trim(), function(err, code){
        if (err) return next(err);
        write(cssPath, code);
        next();
      });
    });

    batch.end(function(err){

      if (err) return done(err);

      if (self._log){
        var duration = new Date - start;
        console.log('duration', duration + 'ms');
        console.log();
      }

      done();

    });
  
  });

}