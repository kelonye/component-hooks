require('ember');

App = Em.Application.create();

var t = require('./template');

Em.TEMPLATES.index = Em.HTMLBars.template(t);

App.IndexRoute = Em.Route.extend({
  model: function(){
    return 'Hello';
  }
});