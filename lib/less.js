/**
  * Module dependencies
  */

var fs = require('fs');
var path = require('path');
var less = require('less');
var Style = require('styl');
var Batch = require('batch');
var addConfProperty = require('./utils').addConfProperty
var vendors = 'o,ms,moz,webkit'.split(',').map(function(v){
  return '-' + v + '-';
});


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

        less.render(lesscss, function (err, css) {

            if (err) return done(err)

            // i use less when using bootstrap, 
            // so no need to use styl
            
            // var style = new Style(css);
            // style.vendors(vendors);
            // css = style.toString();

            pkg.addFile('styles', cssfile, css);
            done();

        });
        
      });

    });


    batch.end(fn);

  });

}