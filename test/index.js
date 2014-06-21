var fs = require('fs');
var should = require('should');
var request = require('supertest');
var exec = require('child_process').exec;
var app = require('../example/server');

describe('hooks', function() {
  it('should compile coffee', function(done) {
    request(app)
      .get('/')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err)
        fs.readFile('example/public/public.js', 'utf8', function(err, js) {
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
        fs.readFile('example/public/public.js', 'utf8', function(err, js) {
          if (err) return done(err)
          js.should.include('require.alias("local/index.js", "boot/deps/local/index.js")');
          js.should.include('require.alias("local/index.js", "boot/deps/local/index.js")');
          done();
        });
      });
  });
  it('should add html templates', function(done) {
    request(app)
      .get('/')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err)
        fs.readFile('example/public/public.js', 'utf8', function(err, js) {
          if (err) return done(err)
          js.should.include('local/html.js');
          done();
        });
    });
  });
  it('should compile jade templates', function(done) {
    request(app)
      .get('/')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err)
        fs.readFile('example/public/public.js', 'utf8', function(err, js) {
          if (err) return done(err)
          js.should.include('local/jade.js');
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
        fs.readFile('example/public/public.css', 'utf8', function(err, css) {
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
        fs.readFile('example/public/public.css', 'utf8', function(err, css) {
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
        fs.readFile('example/public/public.css', 'utf8', function(err, css) {
          if (err) return done(err)
          //css.should.include('-o-linear-gradient(top, #000000, #000300)');
          css.should.include('linear-gradient(top, #000000, #000300)');
          done();
        });
    });
  });
  it('should add css url prefix', function(done) {
    request(app)
      .get('/')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err)
        fs.readFile('example/public/public.css', 'utf8', function(err, css) {
          if (err) return done(err)
          css.should.include('.css-thumb {\n  background-image: url("/public/local/pic.jpg");');
          css.should.include('.less-thumb {\n  background-image: url("/public/local/pic.jpg");');
          css.should.include('.styl-thumb {\n  background-image: url("/public/local/pic.jpg");');
          done();
        });
    });
  });
});
