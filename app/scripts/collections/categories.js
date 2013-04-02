define([
    'backbone',
    'models/category'
],
function(Backbone, Category) {
    var Categories = Backbone.Collection.extend({
        model: Category
    });
    return Categories;
});
