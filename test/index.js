var log = console.log
  , fs = require('fs')
  , should = require('should')
  , request = require('supertest')
  , exec = require('child_process').exec
  , app = require('../example/server');

describe('hooks', function() {
  beforeEach(function(done) {
    process.chdir('example/');
    exec('rm -rf build', done);
  });
  afterEach(function(done) {
    process.chdir('../');
    done();
  });
  it('should compile coffee', function(done) {
    request(app)
      .get('/')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err)
        fs.readFile('public/public.js', 'utf8', function(err, js) {
          if (err) return done(err)
          js.should.include('boot/index.js');
          js.should.include('local/index.js');
          done();
        });
    });
  });
  it('should add aliases', function(done) {
    request(app)
      .get('/')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err)
        fs.readFile('public/public.js', 'utf8', function(err, js) {
          if (err) return done(err)
          js.should.include('require.alias("local/index.js", "boot/deps/local/index.js")');
          js.should.include('require.alias("local/index.js", "boot/deps/local/index.js")');
          done();
        });
      });
  });
  it('should compile templates', function(done) {
    request(app)
      .get('/')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err)
        fs.readFile('public/public.js', 'utf8', function(err, js) {
          if (err) return done(err)
          js.should.include('local/template.js');
          done();
        });
    });
  });
  it('should work on css', function(done) {
    request(app)
      .get('/')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err)
        fs.readFile('public/public.css', 'utf8', function(err, css) {
          if (err) return done(err)
          css.should.include('-o-linear-gradient(top, #000000, #000100)');
          done();
        });
    });
  });
  it('should compile styl', function(done) {
    request(app)
      .get('/')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err)
        fs.readFile('public/public.css', 'utf8', function(err, css) {
          if (err) return done(err)
          css.should.include('-o-linear-gradient(top, #000000, #000200)');
          done();
        });
    });
  });
  it('should compile less', function(done) {
    request(app)
      .get('/')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err)
        fs.readFile('public/public.css', 'utf8', function(err, css) {
          if (err) return done(err)
          //css.should.include('-o-linear-gradient(top, #000000, #000300)');
          css.should.include('linear-gradient(top, #000000, #000300)');
          done();
        });
    });
  });
});
