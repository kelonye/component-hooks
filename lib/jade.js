/**
  * Module dependencies
  */

var fs = require('fs')
  , jade = require('jade')
  , path = require('path')
  , Batch = require('batch')
  , addConfProperty = require('./utils').addConfProperty
  , str2js = require('string-to-js');

/**
  * Jade hook for `builder`
  */

module.exports = function(builder){

  builder.hook('before scripts', function(pkg, fn){

    var templates = pkg.config.jade;
    if (!templates) return fn()

    batch = new Batch;

    if (!pkg.config.scripts){
      batch.push(function(done){
        addConfProperty(pkg, 'scripts', done);
      });
    }

    templates.forEach(function(file){

      batch.push(function(done){

        var jadefile = pkg.path(file) + '.jade'
          , jsfile = file + '.js'
          , str = fs.readFileSync(jadefile, 'utf8')
          , js = jade.compile(str, { filename: jadefile });

        pkg.addFile('scripts', jsfile, str2js(js()));
        done();

      });
    
    });

    batch.end(fn);

  });
}
