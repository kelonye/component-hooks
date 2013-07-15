/**
  * Module dependencies
  */

var fs = require('fs');
var path = require('path');
var Style = require('styl');
var Batch = require('batch');
var addConfProperty = require('./utils').addConfProperty
var vendors = 'o,ms,moz,webkit'.split(',').map(function(v){
  return '-' + v + '-';
});


/**
  * Css hook for `builder`
  */

module.exports = function(builder){

  builder.hook('before styles', function(pkg, fn){

    var styles = pkg.config.styles;
    if (!styles) return fn()

    var batch = new Batch;
    
    styles.forEach(function(file){

      batch.push(function(done){

        var cssfile = pkg.path(file);
        var styl = fs.readFileSync(cssfile, 'utf8');
        var style = new Style(styl);
        
        style.vendors(vendors);
        pkg.removeFile('styles', file);
        pkg.addFile('styles', cssfile, style.toString());
        done();

      });
    });

    batch.end(fn);

  });

}