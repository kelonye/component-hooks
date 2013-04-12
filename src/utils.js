var fs = require('fs')
, path = require('path')
, Batch = require('batch')
, Builder = require('component/node_modules/component-builder');

exports.addConfProperty = function(pkg, type) {
  pkg.conf[type] = [];
  fs.writeFileSync(
    path.resolve(pkg.dir + '/component.json'),
    JSON.stringify(pkg.conf, null, 2)
  );
};

var normalize = function(name) {
  return name.replace('/', '-');
};

exports.buildAliases = function(fn){

  var self = this;
  this.json(function(err, conf){
    if (err) return fn(err);
    var aliases = [];
    var batch = new Batch;

    if (self.hasDependencies()) {
      Object.keys(self.dependencies()).forEach(function(dep){
        batch.push(function(done){
          dep = normalize(dep);
          self.lookup(dep, function(err, dir){
            if (err) return done(err);
            var builder = new Builder(dir, self);
            self.emit('dependency', builder);
            builder.json(function(err, conf){
              if (err) return done(err);
              if (!conf.scripts) return done(null, '');
              var main = builder.conf.main;
              var name = builder.conf.name;

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
                      ? self.conf.name + '/deps/' + name + '/' + script
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
                  ? self.conf.name + '/deps/' + name + '/index.js'
                  : self.basename + '/deps/' + name + '/index.js';

                aliases.push(builder.alias(alias, main));
              }

              aliases = aliases.join('');

              builder.buildAliases(function(err, str){
                if (err) return done(err);
                done(null, aliases + str);
              });
            });
          });
        });
      });
    }

    batch.end(function(err, res){
      if (err) return fn(err);
      var conf = self.conf;
      var name = self.root
        ? conf.name
        : self.basename;

      if (conf.main) {
        res.push(self.alias(name + '/index.js', conf.main));
      }

      fn(null, res.join('\n'));
    });
  });
};