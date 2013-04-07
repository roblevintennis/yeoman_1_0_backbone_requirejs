define([
    'backbone',
    'collections/tasks',
    'backboneLocalStorage'
],
function(Backbone, Tasks, Store) {
    var Category = Backbone.Model.extend({
        initialize: function() {
            var self = this;
            this.tasks = new Tasks(this.get('tasks'));
            this.tasks.url = function () {
                return self.url() + '/tasks';
            };
        },
        parse: function(resp) {
            if (resp.tasks) {
                if (this.tasks) {
                    this.tasks.reset(resp.tasks);
                } else {
                    this.tasks = new Tasks(resp.tasks);
                }
                resp.tasks = this.tasks;
            }
            return resp;
        },
        urlRoot: '/categories/'
    });
    return Category;
});
