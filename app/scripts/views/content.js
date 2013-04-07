define([
    'backbone',
    'underscore',
    'text!templates/content.html',
    'text!templates/create-task-partial.html'
],
function(
    Backbone,
    _,
    contentTpl,
    createTaskTpl
){
    var ContentView = Backbone.View.extend({
        template: _.template(contentTpl),
        createTemplate: _.template(createTaskTpl),
        tasks: [],
        className: "content",
        events: {
            'click input[name=check]': 'onRecordChecked',
            'click .btn.create': 'onCreateTask',
            'click .btn.delete': 'onDeleteTask',
            'click .save-cancel a.cancel': 'onCancel',
            'click .save-cancel button.save': 'onSave',
            'click #newCategoryModal .btn.save': 'onSaveNewCategory'
        },
        /**
         * Renders the content view
         * @param  {Object} $el A jQuery object pointing to the this view's
         * container. This should only be passed on bootstrap.
         * @return {Backbone.View} This view.
         */
        render: function($el) {
            this.$containerEl = $el || this.$containerEl;
            this.tableTitle = this.tableTitle || 'All';
            var rendered =  this.$el.html(this.template());
            this.$containerEl.html(rendered);
            this.delegateEvents();
            return this;
        },
        initialize: function() {
            this.listenTo(this.collection, 'categories:route:changed', this.filterByCategories);
        },
        onSaveNewCategory: function(evt) {
            var newCategoryTitle = this.$('#newCategoryModal input.new-cat').val();
            if (_app && newCategoryTitle) {
                // Add the new category (will persist to localStorage)
                _app.Collections.categories.create({title: newCategoryTitle});
                this.$('#newCategoryModal').modal('hide');
                this.$('#newCategoryModal input.new-cat').val('');
            }
        },
        onSave: function(evt) {
            //TODO
            console.log("TODO: Need to do a model save for the task, etc...");
            // ON SUCCESS
            this.$(evt.currentTarget).closest('table').remove();
            this.$('.btn.create').removeAttr('disabled');
        },
        onCancel: function(evt) {
            this.$(evt.currentTarget).closest('table').remove();
            this.$('.btn.create').removeAttr('disabled');
        },
        onDeleteTask: function() {
            console.log("onDeleteTask called...");
        },
        onCreateTask: function() {
            var createTaskTpl, $pencil, self = this;

            $pencil = this.$('.btn.create');
            if (!$pencil.attr('disabled')) {
                // If pencil not disabled, inject create task markup and disable
                createTaskTpl = this.createTemplate();
                // Here we're inserting create task just above the main tasks table.
                this.$('table.tasks').before(createTaskTpl)
                // Disable the pencil if we're already in create mode
                this.$('.btn.create').attr('disabled', 'disabled');
                // Displays whatever is selected in the category menu on top button
                this.$(".dropdown-menu li a").click(function() {
                    // TODO: If 'create category' selected
                    self.$(this).closest('div').find('.btn:first-child').text(self.$(this).text());
                    self.$(this).closest('div').find('.btn:first-child').val(self.$(this).text());
                });
            }

        },

        /**
         * Toggles the action buttons. For example, delete button should only
         * be enabled if at least one checkbox is checked.
         * @param  {Event} evt The DOM Event
         */
        onRecordChecked: function(evt) {
            if (this.$('input[name=check]:checked').length === 0) {
                $('.delete').attr('disabled', 'disabled');
            } else {
                $('.delete').removeAttr('disabled', 'disabled');
            }
        },
        filterByCategories: function(categoryId) {
            var isCategory = this.setTasksForCategory(categoryId);
            if (!isCategory) this.setAllTasks();
            this.render();
        },
        setTasksForCategory: function(id) {
            var tasks, category;
            category = _.find(this.collection.models, function(category) { return category.id === id; });
            if (category) {
                tasks = category.get('tasks');
                this.tasks = tasks && tasks.models ? tasks.models : [];
                this.tableTitle = category.get('title');
                return true;
            }
            return false;
        },
        setAllTasks: function() {
            var self = this;
            // Reset tasks to empty and then push all tasks from all categories
            self.tasks = [];
            self.collection.each(function(category) {
                // If this category has task models yet
                if(category.get('tasks')) {
                    self.tasks = self.tasks.concat(category.get('tasks').models);
                }
            });
            self.tableTitle = 'All';
        }
    });
    return ContentView;
});