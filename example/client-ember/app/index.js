require('ember');

App = Em.Application.create();

Em.TEMPLATES.index = Em.Handlebars.template(eval(require('./template')));

App.IndexRoute = Em.Route.extend({
  model: function(){
    return 'Hello';
  }
});