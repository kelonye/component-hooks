/**
  * Module dependencies
  */

var fs = require('fs');
var path = require('path');
var sass = require('node-sass');
var Style = require('styl');
var Batch = require('batch');
var utils = require('./utils');
var addConfProperty = utils.addConfProperty
var vendors = utils.vendors;

/**
  * Less hook for `builder`
  */

module.exports = function(builder){

  builder.hook('before styles', function(pkg, fn){

    var styles = pkg.config.scss;
    if (!styles) return fn()

    var batch = new Batch;

    if (!pkg.config.styles){
      batch.push(function(done){
        addConfProperty(pkg, 'styles', done);
      });
    }

    styles.forEach(function(file){

      batch.push(function(done){

        var sassfile = pkg.path(file) + '.scss';
        var cssfile =  file + '.css';
        var sasscss = fs.readFileSync(sassfile, 'utf8');

        sass.render({
          file: sassfile,
          includePaths: ['.', __dirname],
        }, function(err, result){
          if (err) return done(err);

          var css = result.css.toString('utf8');

          if (builder._styl.scss){
            var style = new Style(css);
            style.vendors(vendors);
            css = style.toString();
          }

          pkg.addFile('styles', cssfile, css);
          
          done();

        });
        
      });

    });


    batch.end(fn);

  });

}