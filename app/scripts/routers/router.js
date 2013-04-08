define([
    'jquery',
    'backbone',
    'collections/tasks',
    'collections/categories',
], function ($, Backbone, Tasks, Categories) {

    var Router = Backbone.Router.extend({
        routes: {
            '': 'index',
            'categories': 'categories',
            'categories/:id': 'categories'
        },
        index: function () {
            if (_app) {
                _app.Collections.categories.trigger('categories:selected:changed');
            }
        },
        categories: function (param) {
            if (_app) {
                _app.Collections.categories.trigger('categories:selected:changed', param.trim() || '');
            }
        }
    });

    return Router ;
});
