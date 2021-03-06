/**
  * Module dependencies
  */

var fs = require('fs');
var path = require('path');
var less = require('less');
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

    var styles = pkg.config.less;
    if (!styles) return fn()

    var batch = new Batch;

    if (!pkg.config.styles){
      batch.push(function(done){
        addConfProperty(pkg, 'styles', done);
      });
    }

    styles.forEach(function(file){

      batch.push(function(done){

        var lessfile = pkg.path(file) + '.less';
        var cssfile =  file + '.css';
        var lesscss = fs.readFileSync(lessfile, 'utf8');

        var parser = new(less.Parser)({
          paths: ['.', __dirname],
          filename: lessfile
        });

        parser.parse(lesscss, function (err, tree) {

          if (err) return done(err);

          try{
            var css = tree.toCSS();
          } catch (e){
            return done(e);          
          }

          if (builder._styl.less){
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