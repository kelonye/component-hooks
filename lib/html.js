/**
  * Module dependencies
  */

var fs = require('fs');
var path = require('path');
var Batch = require('batch');
var str2js = require('string-to-js');
var addConfProperty = require('./utils').addConfProperty;


/**
  * Html templates hook for `builder`
  */

module.exports = function(builder){

  builder.hook('before scripts', function(pkg, fn){

    var templates = pkg.config.html;
    if (!templates) return fn()

    batch = new Batch;

    if (!pkg.config.scripts){
      batch.push(function(done){
        addConfProperty(pkg, 'scripts', done);
      });
    }

    templates.forEach(function(file){

      batch.push(function(done){

        var htmlfile = pkg.path(file) + '.html';
        var jsfile = file + '.js';
        var str = fs.readFileSync(htmlfile, 'utf8');

        pkg.addFile('scripts', jsfile, str2js(str));
        done();

      });
    
    });

    batch.end(fn);

  });
}
