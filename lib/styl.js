/**
  * Module dependencies
  */

var fs = require('fs');
var path = require('path');
var Style = require('styl');
var Batch = require('batch');
var variant = require('rework-variant');
var utils = require('./utils');
var addConfProperty = utils.addConfProperty
var vendors = utils.vendors;


/**
  * Styl hook for `builder`
  */

module.exports = function(builder){

  builder.hook('before styles', function(pkg, fn){

    var styles = pkg.config.styl;
    if (!styles) return fn()

    var batch = new Batch;

    if (!pkg.config.styles){
      batch.push(function(done){
        addConfProperty(pkg, 'styles', done);
      });
    }

    styles.forEach(function(file){

      batch.push(function(done){

        var stylfile = pkg.path(file) + '.styl';
        var cssfile =  file + '.css';
        var styl = fs.readFileSync(stylfile, 'utf8');
        var opts = { whitespace: true };
        var style = new Style(styl, opts);
        style.use(variant());

        style.vendors(vendors);
        pkg.addFile('styles', cssfile, style.toString());
        done();
        
      });

    });

    batch.end(fn);

  });

}