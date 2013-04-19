define([
    'backbone',
    'backboneLocalStorage'
],
function(Backbone, Store) {
    var Task = Backbone.Model.extend({
        defaults: {
            title: '',
            completed: false
        }
        // url: '/tasks'
    });
    return Task;
});
