/**
  * Module dependencies
  */

var fs = require('fs')
  , path = require('path')
  , Style = require('styl')
  , Batch = require('batch')
  , addConfProperty = require('./utils').addConfProperty
  , vendors = 'o,ms,moz,webkit'.split(',').map(function(v){
    return '-' + v + '-';
  });


/**
  * Styl hook for `builder`
  */

module.exports = function(builder){


  // css
  builder.hook('before styles', function(pkg, fn){

    var styles = pkg.config.styles;
    if (!styles) return fn()

    var batch = new Batch;
    
    styles.forEach(function(file){

      batch.push(function(done){

        var cssfile = pkg.path(file)
        , styl = fs.readFileSync(cssfile, 'utf8')
        , style = new Style(styl);
        
        style.vendors(vendors);
        pkg.addFile('styles', cssfile, style.toString());
        done()

      });
    });

    batch.end(fn);

  });

  // styl
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

        var stylfile = pkg.path(file) + '.styl'
          , cssfile =  file + '.css'
          , styl = fs.readFileSync(stylfile, 'utf8')
          , opts = { whitespace: true }
          , style = new Style(styl, opts);

        style.vendors(vendors);
        pkg.addFile('styles', cssfile, style.toString());
        done();
        
      });

    });

    batch.end(fn);

  });

}