var hooks = require('../../lib')
  , express = require('express')
  , app = module.exports = express();

app.use(express.favicon());
app.use(express.cookieParser());
app.use(express.static(__dirname + '/../public'));
app.engine('jade', require('../../node_modules/jade').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use('/', function(req, res, next) {
  req.program = {};
  req.program.dev = true;
  next();
});

app.use('/', hooks);

app.get('/', function(req, res) {
  res.render('index');
});

if (!module.parent) {
  port = process.env.PORT || 3000;
  app.listen(port, function() {
    console.log("http://dev:" + port);
  });
}