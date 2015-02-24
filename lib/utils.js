/**
  * Module dependencies
  */
var fs = require('fs');
var path = require('path');
var uglify = require('uglify-js');
var CleanCSS =  require('clean-css');


// minify

exports.minify = {
  js: function(code, done){
    var copy = JSON.parse(JSON.stringify({code: code})).code;
    try{
      done(null, uglify.minify(code, {fromString: true}).code);
    } catch (e){
      done(null, copy);
    }
  },
  css: function(code, done){
    done(null, new CleanCSS().minify(code));
  }
};


exports.addConfProperty = function(pkg, type, done) {
  if (!done) done = function(){}
  pkg.config[type] = [];
  fs.writeFileSync(
    path.resolve(pkg.dir + '/component.json'),
    JSON.stringify(pkg.config, null, 2)
  );
  done();
};
