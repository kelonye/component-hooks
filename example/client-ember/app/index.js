require('ember');

App = Em.Application.create();

var t = eval(require('./template'));

Em.TEMPLATES.index = Em.Handlebars.template(t);

App.IndexRoute = Em.Route.extend({
  model: function(){
    return 'Hello';
  }
});