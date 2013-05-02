define([
    'backbone',
    'underscore',
    'collections/tasks',
    'models/task',
    'text!templates/content.html',
    'text!templates/create-task-partial.html',
    'text!templates/categories-dropdown-partial.html',
    'text!templates/delete-confirm-partial.html'
],
function(Backbone, _, Tasks, Task, contentTpl, createTaskTpl, categoriesDropdownTpl, deleteConfirmPartial)
{
    var ContentView = Backbone.View.extend({
        template: _.template(contentTpl),
        createTemplate: _.template(createTaskTpl),
        categoriesDropdownTemplate: _.template(categoriesDropdownTpl),
        deleteConfirmTemplate: _.template(deleteConfirmPartial),
        tasks: [],
        enableAddCategory: true,
        className: "content",
        events: {
            'click input[name=check]': 'onRecordChecked',
            'click .mark-completed': 'onTaskToggled',
            'click .clear-completed': 'onClearCompleted',
            'click .filter-completed': 'onFilterCompleted',
            'click .filter-all': 'onFilterAll',
            'click .btn.create': 'onCreateTask',
            'dblclick .title': 'onEditTitle',
            'dblclick td.category': 'onEditCategory',
            'blur .title-editing': 'onFinishedEditingTitle',
            'click .category-editing li': 'onFinishedEditingCategory',
            'click .btn.delete': 'onDeleteTasks',
            'click .save-cancel a.cancel': 'onCancel',
            'click .save-cancel button.save': 'onSaveTask',
            'click #newCategoryModal .btn.save': 'onSaveNewCategory',
            'keypress .task-title': 'onKeypress',
            'keypress .title-editing': 'onEditingTitleKeypress'
        },
        render: function($el) {
            this.$containerEl = $el || this.$containerEl;
            this.tableTitle = this.tableTitle || 'All';
            var rendered =  this.$el.html(this.template());
            this.$containerEl.html(rendered);
            this.delegateEvents();
            this.toggleClearCompleted();
            return this;
        },
        initialize: function() {
            _.bindAll(this);
            this.listenTo(this.collection, 'categories:selected:changed', this.filterByCategories);
            this.listenTo(this.collection, 'category:delete', this.confirmDelete);
            this.listenTo(this.collection, 'destroy', this.onCategoryDeleted);
        },
        onFinishedEditingTitle: function(evt) {
            evt.preventDefault();
            var $row, $col, $inp, oldtitle, newtitle, $leftCheck, taskId, categoryId, $currentTarget;
            $currentTarget = this.$(evt.currentTarget);
            $col = this.$($currentTarget);
            $row = this.$($currentTarget).closest('tr');
            leftCheck = $currentTarget.closest('tr').find('td:first input');
            taskId = this.$(leftCheck).data('id');
            categoryId = this.$(leftCheck).data('category-id');
            $inp = this.$($col).find('input');
            oldtitle = $inp.data('old-title');
            newtitle = $inp.val();
            // Hack - if called as a result of <enter>, that inp.remove will, in turn, cause this to fire again and then we get a DOM not found exception
            try {$inp.remove();} catch(e){}
            this.$($col).removeClass('title-editing').addClass('title').text(newtitle);
            if (oldtitle && oldtitle !== newtitle) {
                this.collection.setTaskForCategory(categoryId, taskId, {title: newtitle});
            }
        },
        onEditTitle: function(evt) {
            evt.preventDefault();
            var col = this.$(evt.currentTarget);
            var taskTitle = this.$(col).removeClass('title').addClass('title-editing').text() || '';
            this.$(col).text('');
            $('<input type="text" class="edit-title" data-old-title="'+taskTitle+'" value="' + taskTitle + '" />').fadeIn('slow').appendTo(col);
        },
        onFinishedEditingCategory: function(evt) {
            evt.preventDefault();
            var $anchor, $currentTarget, $row, leftCheck, taskId, categoryId, previousCategoryId, newtitle;
            $currentTarget = this.$(evt.currentTarget);
            $row = this.$($currentTarget).closest('tr');
            leftCheck = $currentTarget.closest('tr').find('td:first input');
            taskId = this.$(leftCheck).data('id');
            previousCategoryId = this.$(leftCheck).data('category-id');
            $anchor = this.$(evt.currentTarget).find('a');
            newtitle = $anchor.text();
            if ($anchor) {
                categoryId = $anchor.data('id');
                if (previousCategoryId && previousCategoryId !== categoryId) {
                    // We need to change the category id in the checkbox attribute too
                    this.$(leftCheck).data('category-id', categoryId);
                    this.collection.moveTaskToCategory(previousCategoryId, categoryId, taskId);
                }
            }
            $('.dropdown-toggle').dropdown('toggle');
            this.$($currentTarget).closest('td').removeClass('category-editing').addClass('category').text(newtitle);
            this.reloadCategories(categoryId);
        },
        onEditCategory: function(evt) {
            evt.preventDefault();
            var col, categoryTitle, dropdownToggle, dropdown, categoriesTitleElement, categoryId;
            col = this.$(evt.currentTarget);
            categoryTitle = this.$(col).removeClass('category').addClass('category-editing').text() || '';
            categoryTitle = categoryTitle ? categoryTitle.trim() : '';
            this.$(col).text('');
            this.renderCategoriesDropdownNoAdd(col, categoryTitle);
        },
        // When user clicks pencil to add a new task
        onCreateTask: function(evt) {
            evt.preventDefault();
            var $pencil;
            $pencil = this.$('.btn.create');
            if (!$pencil.attr('disabled')) {
                this.showCreateForm();
            }
        },
        // When user saves a new task
        onSaveTask: function(evt) {
            var title, categoriesTitleElement, category;
            title = this.$('table.create-task .task-title').val().trim();
            categoriesTitleElement = this.$('table.create-task').find('.btn.menu:first-child')
            var categoryId = categoriesTitleElement.data('id')
            var categoryTitle = categoriesTitleElement.text();
            if (categoryId) {
                this.collection.addTaskForCategory(categoryId, {title: title, category: categoryTitle});
                this.clearCreateTaskForm();
                this.$('.btn.create').removeAttr('disabled');
                this.reloadCategories(categoryId);
            }
        },
        // When user hits <ENTER> when creating a new task
        onKeypress: function(evt) {
            if (evt.which === 13) {
                this.onSaveTask(evt);
            }
        },
        onEditingTitleKeypress: function(evt) {
            if (evt.which === 13) {
                this.onFinishedEditingTitle(evt);
            }
        },
        // When user clicks trash icon to with one or more tasks checked
        onDeleteTasks: function(evt) {
            evt.preventDefault();
            var self = this,
                categoryId = null;

            // If trash icon is not disabled then one or more records are checked
            $trash = this.$('.btn.delete');
            if (!$trash.attr('disabled')) {
                // Loop all records and remove each one that is checked
                this.$('table.tasks input[name=check]').each(function(index, record) {
                    if (record.checked) {
                        var taskId = self.$(record).data('id');
                        categoryId = self.$(record).data('category-id');
                        self.collection.removeTaskForCategory(categoryId, taskId);
                    }
                });
                this.collection.trigger('categories:selected:changed', this.lastCategoryId);
            }
        },
        onFilterAll: function(evt) {
            evt.preventDefault();
            this.filterByCategories(this.lastCategoryId);
        },
        onFilterCompleted: function(evt) {
            evt.preventDefault();
            this.filterByCompleted(this.lastCategoryId);
        },
        onClearCompleted: function(evt) {
            evt.preventDefault();
            this.collection.pruneCompletedForCategory(this.lastCategoryId);
            this.filterByCategories(this.lastCategoryId);
            this.collection.trigger('select:category', this.lastCategoryId);
        },
        onTaskToggled: function(evt) {
            evt.preventDefault();
            evt.stopPropagation();
            var completed = false, leftCheck, taskId, categoryId, $currentTarget, $row;

            // Note: no 'active' class actually means it's about to "become active" ;)
            $currentTarget = this.$(evt.currentTarget);
            $row = $currentTarget.closest('tr');
            $row.removeClass('completed');
            if (!$currentTarget.hasClass('active')) {
                completed = true;
                $row.addClass('completed');
            }
            $row.find('button.mark-completed').button('toggle')
            // Get task and category ids and toggle 'completed' property for task
            leftCheck = $currentTarget.closest('tr').find('td:first input');
            taskId = this.$(leftCheck).data('id');
            categoryId = this.$(leftCheck).data('category-id');
            this.collection.toggleTaskForCategory(categoryId, taskId, completed);
            this.toggleClearCompleted();
            // Hack: Sidebar listens for sync events and above essentially causes a 'sync'
            // when categories are 'reset' .. this ensures we stay on same sidebar link
            this.collection.trigger('select:category', this.lastCategoryId);
        },
        onRecordChecked: function(evt) {
            if (this.$('input[name=check]:checked').length === 0) {
                $('.delete').attr('disabled', 'disabled');
            } else {
                $('.delete').removeAttr('disabled', 'disabled');
            }
        },
        onCancel: function(evt) {
            this.clearCreateTaskForm();
            this.$('.btn.create').removeAttr('disabled');
        },
        clearCreateTaskForm: function(saveState) {
            this.$('#newCategoryModal').remove();
            this.$('table.create-task').remove();
            if (!saveState) {
                this.enteredTitle = '';
            }
        },
        onSaveNewCategory: function(evt) {
            var categoryId, newCategory,
                newCategoryTitle = this.$('#newCategoryModal input.new-cat').val();
            if (newCategoryTitle) {
                newCategory = this.collection.create({title: newCategoryTitle});
                this.categoryAdded();
            }
            this.collection.trigger('select:category', this.lastCategoryId);
        },
        // Listener for category destroy event (user deletes entire category)
        onCategoryDeleted:function(collection, options) {
            this.collection.fetch();
            this.setAllTasks();
            this.render();
        },
        confirmDelete: function(categoryToDelete) {
            // Insert the delete confirmation alert
            var self = this, deleteConfirmationHtml, category;
            category = categoryToDelete;
            deleteConfirmationHtml = this.deleteConfirmTemplate();
            $('.table-title').before(deleteConfirmationHtml);
            // Listen for confirm / delete button clicks
            this.$('.delete-confirmed').on('click', function(evt) {
                evt.preventDefault();
                // This w/trigger destroy event
                category.destroy();
                self.removeDeleteConfirmation();
            });
            this.$('.delete-cancelled').on('click', function(evt) {
                evt.preventDefault();
                self.removeDeleteConfirmation();
            });
        },
        // Removes delete confirmation and it's event listeners
        removeDeleteConfirmation: function() {
            this.$('.delete-confirmed').off('click');
            this.$('.delete-cancelled').off('click');
            this.$('div.delete-confirm').remove();
        },
        categoryAdded: function() {
            var addedCategory, enteredTaskTitle, categoriesTitleElement;
            if (this.$containerEl) {
                addedCategory = this.collection.at(this.collection.length-1);
                enteredTaskTitle = this.$('table.create-task .task-title').val();
                this.enteredTitle = enteredTaskTitle || '';
                this.renderCategoriesDropdown();
                categoriesTitleElement = this.$('table.create-task').find('.btn.menu:first-child')
                this.setCategoriesTitle(categoriesTitleElement, addedCategory.get('title'), addedCategory.id);
                this.$('#newCategoryModal').modal('hide');
                this.$('#newCategoryModal input.new-cat').val('');
                this.$('table.create-task .task-title').focus();
            }
        },
        showCreateForm: function() {
            var createTaskTpl = this.createTemplate();
            // Here we're inserting create task just above the main tasks table.
            this.$('table.tasks').before(createTaskTpl);
            // Disable the pencil if we're already in create mode
            this.renderCategoriesDropdown();
            this.$('.btn.create').attr('disabled', 'disabled');
        },
        renderCategoriesDropdownNoAdd: function(col, categoryTitle) {
            var dropdownToggle, dropdown, categoriesTitleElement, categoryId;
            this._disposeCategoriesDropdownListeners(col);
            dropdownToggle = '<div class="btn-group"><button class="btn menu">Select a category</button> <button class="btn dropdown-toggle" data-toggle="dropdown"> <span class="caret"></span></button>'
            dropdown = this._compileCategoriesDropdown(false);//no add category
            col.append(dropdownToggle + dropdown + '</div>');
            this.bindCategoryTitle();
            this._presetCategoriesDropdownTitle(col, categoryTitle);
        },
        renderCategoriesDropdown: function() {
            this._disposeCategoriesDropdownListeners('table.create-task');
            var dropdown = this._compileCategoriesDropdown(true);
            this.$('table.create-task button.dropdown-toggle').after(dropdown);
            this.bindCategoryTitle();
        },
        _presetCategoriesDropdownTitle: function(col, categoryTitle) {
            var categoryId, categoriesTitleElement;
            this.$(col.find('ul.categories li')).each(function(i, li) {
                if ($(li).text() === categoryTitle) {
                    categoryId = $(li).find('a').data('id')
                }
            });
            categoriesTitleElement = this.$(col).find('.btn.menu:first-child')
            if (categoriesTitleElement && categoryId) {
                this.setCategoriesTitle(categoriesTitleElement, categoryTitle, categoryId);
            }
        },
        // sel is a selector pointed at a root element to limit the scope searched
        // so we don't inadvertantly turn off other dropdowns on the page ;)
        _disposeCategoriesDropdownListeners: function(sel) {
            // Remove previous listener before removing dropdown
            this.$(sel).find(".dropdown-menu li a").off('click');
            this.$(sel).find('.categories.dropdown-menu').remove();
        },
        _compileCategoriesDropdown: function(enableAddCategory) {
            this.enableAddCategory = enableAddCategory !== undefined ? enableAddCategory : true;
            var dropdown = this.categoriesDropdownTemplate();
            this.enableAddCategory = true;//always go back to add category enabled
            return dropdown;
        },
        setCategoriesTitle: function(categoriesTitleElement, title, id) {
            categoriesTitleElement.text(title);
            categoriesTitleElement.attr('data-id', id);
        },
        // Displays whatever is selected in the category menu on top button
        bindCategoryTitle: function() {
            var self = this;
            this.$(".dropdown-menu li a").on('click', function(evt) {
                evt.preventDefault();
                var id, title, categoriesTitleElement;
                id = self.$(this).data('id');
                title = self.$(this).text();
                categoriesTitleElement = self.$(this).closest('div').find('.btn:first-child');
                self.setCategoriesTitle(categoriesTitleElement, title, id);
            });
        },
        toggleClearCompleted: function() {
            var completedTasks = this._getCompletedTasks(this.lastCategoryId);
            if (completedTasks.length) {
                this.$('.clear-completed').removeClass('disabled');
            } else {
                this.$('.clear-completed').addClass('disabled');
            }
        },
        _getCompletedTasks: function(categoryId) {
            var self = this, completed = [], category, completedTasks;
            if (categoryId) {
                category = _.find(this.collection.models, function(category) {return category.id === categoryId; });
                completedTasks = this.collection.getCompletedForCategory(categoryId);
            } else {
                // We need to grab completed for 'All' tasks
                this.collection.each(function(category) {
                    // We need to find and flatten out all found completed task models
                    var tasks = self.collection.getCompletedForCategory(category.id);
                    var models = tasks ? tasks.models : [];
                    completed.push(models);
                });
                completedTasks = new Tasks(_.flatten(completed));
            }
            return completedTasks;
        },
        filterByCompleted: function(categoryId) {
            var self = this, completed = [], category, completedTasks;
            var completedTasks = this._getCompletedTasks(categoryId);
            this.tasks = completedTasks && completedTasks.length ? completedTasks.models : new Tasks();
            this._addCategoryIDToTasks(category, this.tasks.models);
            this.tableTitle = category ? category.get('title') : 'All';
            this.render();
        },
        filterByCategories: function(categoryId) {
            var isCategory = this.setTasksForCategory(categoryId);
            if (!isCategory) this.setAllTasks();
            this.render();
        },
        setTasksForCategory: function(id) {
            var tasks, category;
            category = _.find(this.collection.models, function(category) { return category.id === id; });
            this.lastCategoryId = category ? id : '';//empty string will route to 'all'
            if (category) {
                tasks = category.get('tasks');
                this.tasks = tasks && tasks.models ? tasks.models : [];
                // Add a reference back to each task's category id
                this._addCategoryIDToTasks(category, this.tasks);
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
                var tasks = category.get('tasks');
                tasks = tasks ? tasks.models : [];
                if(tasks) {
                    // Add a reference back to each task's category id
                    self._addCategoryIDToTasks(category, tasks);
                    self.tasks = self.tasks.concat(tasks);
                }
            });
            self.tableTitle = 'All';
        },
        reloadCategories: function(categoryId) {
            if (location.hash.indexOf(categoryId)  === -1) {
                _app.Routers.router.navigate('categories/' + categoryId, {trigger: true});
            } else {
                this.filterByCategories(categoryId);
            }
        },
        _addCategoryIDToTasks: function(category, tasks) {
            _.each(tasks, function(task) {
                task.set({categoryId: category.id});
            });
        }
    });
    return ContentView;
});