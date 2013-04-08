define([
    'backbone',
    'underscore',
    'collections/tasks',
    'models/task',
    'text!templates/content.html',
    'text!templates/create-task-partial.html'
],
function(
    Backbone,
    _,
    Tasks,
    Task,
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
            _.bindAll(this);
            this.listenTo(this.collection, 'categories:selected:changed', this.filterByCategories);
            this.listenTo(this.collection, 'sync', this.categoryAdded);
        },
        onSave: function(evt) {
            var title, categoriesTitleElement, category;
            title = this.$('table.create-task .task-title').val();
            categoriesTitleElement = this.$('table.create-task').find('.btn.menu:first-child')
            var categoryId = categoriesTitleElement.data('id')
            var categoryTitle = categoriesTitleElement.text();
            if (categoryId) {
                // TODO: Move this on to Categories addTaskToCategoryWithId(categoryId, taskTitle)
                var updateCategories = _.map(this.collection.models, function(category) {
                    if (category.id === categoryId) {
                        // Update matching category
                        var tasks = category.get('tasks') || new Tasks();
                        var task = new Task({
                            title: title,
                            // TODO: We need to use ids instead here
                            categories: [category.get('title')]
                        });
                        tasks.add(task);
                        category.save({tasks: tasks});
                    }
                    // return updated category
                    return category;
                });
                this.collection.reset(updateCategories);
                this.clearCreateTaskForm();
                this.$('.btn.create').removeAttr('disabled');
                this.collection.trigger('categories:selected:changed', categoryId);
            }
        },
        onCancel: function(evt) {
            this.clearCreateTaskForm();
            this.$('.btn.create').removeAttr('disabled');
        },
        onDeleteTask: function() {
            console.log("onDeleteTask called...");
        },
        clearCreateTaskForm: function() {
            this.$('#newCategoryModal').remove();
            this.$('table.create-task').remove();
            this.enteredTitle = '';
        },
        onCreateTask: function() {
            var $pencil;
            $pencil = this.$('.btn.create');
            if (!$pencil.attr('disabled')) {
                this.showCreateForm();
            }
        },
        onSaveNewCategory: function(evt) {
            var newCategoryTitle = this.$('#newCategoryModal input.new-cat').val();
            if (newCategoryTitle) {
                // Add the new category (will persist to localStorage)
                this.collection.create({title: newCategoryTitle});
            }
        },
        categoryAdded: function() {
            var addedCategory, enteredTaskTitle, categoriesTitleElement;
            if (this.$containerEl) {
                addedCategory = this.collection.at(this.collection.length-1);
                enteredTaskTitle = this.$('table.create-task .task-title').val();
                this.enteredTitle = enteredTaskTitle || '';
                categoriesTitleElement = this.$('table.create-task').find('.btn.menu:first-child')
                this._setCategoriesTitle(categoriesTitleElement, addedCategory.get('title'), addedCategory.id);
                this.$('#newCategoryModal').modal('hide');
                this.$('#newCategoryModal input.new-cat').val('');
                this.$('table.create-task .task-title').focus();
            }
        },
        showCreateForm: function() {
            this.$('#newCategoryModal').remove();
            this.$('table.create-task').remove();
            var createTaskTpl = this.createTemplate();
            // Here we're inserting create task just above the main tasks table.
            this.$('table.tasks').before(createTaskTpl);
            // Disable the pencil if we're already in create mode
            this.$('.btn.create').attr('disabled', 'disabled');
            this._bindCategoryTitle();
        },
        _setCategoriesTitle: function(categoriesTitleElement, title, id) {
            categoriesTitleElement.text(title);
            categoriesTitleElement.attr('data-id', id);
        },
        // Displays whatever is selected in the category menu on top button
        _bindCategoryTitle: function() {
            var self = this;
            this.$(".dropdown-menu li a").click(function() {
                var id, title, categoriesTitleElement;
                id = self.$(this).data('id');
                title = self.$(this).text();
                categoriesTitleElement = self.$(this).closest('div').find('.btn:first-child');
                self._setCategoriesTitle(categoriesTitleElement, title, id);
            });
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