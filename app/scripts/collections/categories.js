define([
    'backbone',
    'models/category',
    'backboneLocalStorage'
],
function(Backbone, Category, Store) {
    var Categories = Backbone.Collection.extend({
        model: Category,
        localStorage: new Store('tasks-manager')
    });
    return Categories;
});
