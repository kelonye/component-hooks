/**
  * Module dependencies
  */

var fs = require('fs');
var path = require('path');
var Batch = require('batch');
var coffeescript = require('coffee-script');
var addConfProperty = require('./utils').addConfProperty;

/**
  * Coffee-script hook for `builder`
  */

module.exports = function(builder){

  builder.hook('before scripts', function(pkg, fn){

    var scripts = pkg.config.coffee;
    if (!scripts) return fn()

    var batch = new Batch;

    if (!pkg.config.scripts){
      batch.push(function(done){
        addConfProperty(pkg, 'scripts', done);
      });
    }

    scripts.forEach(function(file){

      batch.push(function(done){

        var coffeefile = pkg.path(file) + '.coffee';
        var jsfile = file + '.js';
        var coffee = fs.readFileSync(coffeefile, 'utf8');
        var js = coffeescript.compile(coffee, {bare: true});

        pkg.addFile('scripts', jsfile, js);
        done();

      });
    
    });

    batch.end(fn);

  });
}