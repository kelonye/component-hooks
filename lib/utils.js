var fs = require('fs')
, path = require('path')
, Batch = require('batch')
, uglify = require('uglify-js')
, cleancss =  require('clean-css')
, Builder = require('component/node_modules/component-builder');

exports.minify = function(type, code){
  switch (type){
    case 'js':
      return uglify.minify(code, {fromString: true}).code;
      break;
    case 'css':
      return cleancss.process(code);
      break;
}

exports.addConfProperty = function(pkg, type, done) {
  if (!done) done = function(){}
  pkg.config[type] = [];
  fs.writeFileSync(
    path.resolve(pkg.dir + '/component.json'),
    JSON.stringify(pkg.config, null, 2)
  );
  done();
};

var normalize = function(name) {
  return name.replace('/', '-');
};

exports.buildAliases = function(fn){
  var self = this;
  var aliases = [];
  var batch = new Batch;

  if (self.hasDependencies()) {
    Object.keys(self.dependencies()).forEach(function(dep){
      batch.push(function(done){
        dep = normalize(dep);
        self.lookup(dep, function(err, dir){
          if (err) return done(err);
          var builder = new Builder(dir, self);
          var conf = builder.config;
          self.emit('dependency', builder);
          if (!conf.scripts) return done(null, '');
          var main = conf.main;
          var name = conf.name;



          //
          self.scriptTypes = [];
          self.scriptTypes.push('coffee');
          self.scriptTypes.push('scripts');

          var aliases = [];

          self.scriptTypes.forEach(function(type){
            var scripts = conf[type];
            if (scripts){
              var typeAliases = scripts.map(function(script){
                if (type != 'scripts'){
                  script = script + '.js';
                }
                var alias = self.root
                  ? self.config.name + '/deps/' + name + '/' + script
                  : self.basename + '/deps/' + name + '/' + script;

                return builder.alias(alias, script);
              });

              typeAliases.forEach(function(alias){
                aliases.push(alias);
              });
            }

          });
          //



          if (main) {
            var alias = self.root
              ? self.config.name + '/deps/' + name + '/index.js'
              : self.basename + '/deps/' + name + '/index.js';

            aliases.push(builder.alias(alias, main));
          }

          if (self.root) {
            aliases.push(builder.alias(name + '/index.js', main || 'index.js'));
          }

          aliases = aliases.join('');

          builder.buildAliases(function(err, str){
            if (err) return done(err);
            done(null, aliases + str);
          });
        });
      });
    });
  }

  batch.end(function(err, res){
    if (err) return fn(err);
    var name = self.root
      ? self.config.name
      : self.basename;

    if (self.config.main) {
      res.push(self.alias(name + '/index.js', self.config.main));
    }

    fn(null, res.join('\n'));
  });
};
