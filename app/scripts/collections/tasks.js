define([
    'backbone',
    'models/task',
    'backboneLocalStorage'
],
function(Backbone, Task, Store) {
    var Tasks = Backbone.Collection.extend({
        model:Task,
        localStorage: new Store('task-manager')
    });
    return Tasks;
});
