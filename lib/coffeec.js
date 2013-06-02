/**
  * Module dependencies
  */

var fs = require('fs')
  , path = require('path')
  , Batch = require('batch')
  , addConfProperty = require('./utils').addConfProperty
  , coffeescript = require('coffee-script');

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

        var coffeefile = pkg.path(file) + '.coffee'
        , jsfile = file + '.js'
        , coffee = fs.readFileSync(coffeefile, 'utf8')
        , js = coffeescript.compile(coffee, {bare: true});

        pkg.addFile('scripts', jsfile, js);
        done();

      });
    
    });

    batch.end(fn);

  });
}