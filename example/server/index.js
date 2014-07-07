/**
  * Module dependencies
  */
var builder = require('../../lib');
var express = require('express');
var path = require('path');

// app

var app = module.exports = express();

// settings

app.engine('jade', require('../../node_modules/jade').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// middleware

app.use(express.favicon());
app.use(express.cookieParser());
app.use('/public', express.static(__dirname + '/../public'));
app.get('/', function(req, res) {
  builder(path.join(__dirname+'/../'))
    .dev()
    .log()
    .prefix('/public')
    .styl('css')
    .styl('less')
    .end(function(err){
      if (err) return res.send(500, err.stack);
      res.render('index');
    });
});

// bind

if (!module.parent) {
  port = process.env.PORT || 3000;
  app.listen(port, function() {
    console.log("http://dev:" + port);
  });
}
