/**
  * Module dependencies
  */

var fs = require('fs');
var jade = require('jade');
var path = require('path');
var Batch = require('batch');
var compiler = require('./ember-template-compiler');
var addConfProperty = require('./utils').addConfProperty;

/**
  * Jade hook for `builder`
  */

module.exports = function(builder){

  builder.hook('before scripts', function(pkg, fn){

    var templates = pkg.config.jhbs;
    if (!templates) return fn()

    batch = new Batch;

    if (!pkg.config.scripts){
      batch.push(function(done){
        addConfProperty(pkg, 'scripts', done);
      });
    }

    templates.forEach(function(file){

      batch.push(function(done){

        var jadefile = pkg.path(file) + '.jade';
        var jsfile = file + '.js';
        var str = fs.readFileSync(jadefile, 'utf8');
        var js = jade.compile(str, { filename: jadefile });
        var hbs = compiler.precompile(js(), false);

        pkg.addFile('scripts', jsfile, 'module.exports = ' + hbs + ';');

        done();

      });

    });

    batch.end(fn);

  });
}
