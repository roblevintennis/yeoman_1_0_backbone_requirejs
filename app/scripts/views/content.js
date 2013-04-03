define([
    'backbone',
    'underscore',
    'text!templates/content.html'
],
function(Backbone, _, contentTpl) {
    var ContentView = Backbone.View.extend({
        template: _.template(contentTpl),
        tasks: [],
        /**
         * Renders the content view
         * @param  {Object} $el A jQuery object pointing to the this view's
         * container. This should only be passed on bootstrap.
         * @param  {Object} app The main application's context.
         * @return {Backbone.View} This view.
         */
        render: function($el) {
            this.$containerEl = $el || this.$containerEl;
            this.tableTitle = this.tableTitle || 'All';
            var renderedSidebar =  this.$el.html(this.template());
            this.$containerEl.html(renderedSidebar);
            return this;
        },
        initialize: function() {
            this.listenTo(this.collection, 'categories:route:changed', this.filterByCategories)
        },
        filterByCategories: function(categoryId) {
            var isCategory = this.setTasksForCategory(categoryId);
            if (!isCategory) this.setAllTasks();
            this.render();
        },
        setTasksForCategory: function(id) {
            var categoryId = parseInt(id);
            if (categoryId && !isNaN(categoryId)) {
                category = this.collection.get(categoryId);
                if(category) {
                    this.tasks = category.get('tasks').models;
                    this.tableTitle = category.get('title');
                    return true;
                }
                console.log("Dope, category not found!");
            }
            return false;
        },
        setAllTasks: function() {
            var self = this;
            // Reset tasks to empty and then push all tasks from all categories
            self.tasks = [];
            self.collection.each(function(category) {
                self.tasks = self.tasks.concat(category.get('tasks').models);
            });
            self.tableTitle = 'All';
        }
    });
    return ContentView;
});