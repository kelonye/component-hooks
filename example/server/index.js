/**
  * Module dependencies
  */
var builder = require('../../lib');
var express = require('express');
var path = require('path');
var debug = require('debug')('app:server');
var out = path.join(__dirname, '..', 'public');

// app

var app = module.exports = express();

// settings

app.engine('jade', require('../../node_modules/jade').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// middleware

app.use(express.favicon());
app.use(express.cookieParser());
app.use('/public', express.static(out));
app.get('/', build('vanilla'), function(req, res){
  res.render('vanilla');
});
app.get('/ember', build('ember'), function(req, res){
  res.render('ember');
});

// 404

app.use(function(req, res, next){
  var err = new Error('404');
  err.status = 404;
  next(err);
});

// error

app.use(function(err, req, res, next){
  console.error(err.message);
  res.send(err.message, err.status || 500);
});

// bind

if (!module.parent) {
  port = process.env.PORT || 3000;
  app.listen(port, function() {
    debug("listening on port " + port);
  });
}

function build(app){
  return function(req, res, next){
    builder(path.join(__dirname, '..', 'client-'+app, 'app'))
      .dev()
      .log()
      .name(app)
      .out(out)
      .prefix('/public')
      .styl('css')
      .styl('less')
      .end(next);
  }
}