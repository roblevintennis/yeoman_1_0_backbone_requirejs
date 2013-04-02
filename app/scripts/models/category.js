define([
    'backbone',
    'collections/tasks'
],
function(Backbone, Tasks) {
    var TaskCategory = Backbone.Model.extend({
        tasks: [],
        initialize: function() {
            var self = this;
            this.tasks = new Tasks(this.get('tasks'));
            this.tasks.url = function () {
                return self.url() + '/tasks';
            };
        },
        urlRoot: '/category/'
    });
    return TaskCategory;
});
