define([
    'backbone',
    'backboneLocalStorage'
],
function(Backbone, Store) {
    var Task = Backbone.Model.extend({
        // url: '/tasks'
    });
    return Task;
});
