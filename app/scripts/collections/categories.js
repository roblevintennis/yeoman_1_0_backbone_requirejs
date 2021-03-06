define([
    'backbone',
    'collections/tasks',
    'models/task',
    'models/category',
    'backboneLocalStorage'
],
function(Backbone, Tasks, Task, Category, Store) {
    var Categories = Backbone.Collection.extend({
        model: Category,
        localStorage: new Store('tasks-manager'),
        /**
         * Performs an action by using a callback strategy where the caller can actually perform the desired action.
         * @param  {String} categoryId    The category id, if falsy, action function will be called back for all categories
         * @param  {String} taskId        The task id, if falsy, actionFunc called with just tasks and category
         * @param  {Function} actionFunc    Callback function to perform action on each task (or tasks if taskId is falsy)
         * @param  {Function} completedFunc Callback function to perform on updated categories (if category etc. found)
         */
        _performAction: function(categoryId, taskId, actionFunc, completedFunc) {
            var actionPerformed = false, self = this;
            // If categoryId is falsy we will perform action on all categories
            var performActionOnAllCategories = categoryId ? false : true;
            var updateCategories = _.map(this.models, function(category) {
                var tasks, task;
                if (category.id === categoryId || performActionOnAllCategories && actionFunc) {
                    tasks = category.get('tasks') || new Tasks();
                    // If no task id it's probably a task create in which case caller wants the tasks (not a task)
                    if (taskId) {
                        task = tasks.get(taskId);
                        if (task) {
                            actionFunc.call(self, tasks, task, category);
                        }
                    } else {
                        actionFunc.call(self, tasks, category);
                    }
                    // We've matched on category id so always mark actionPerformed true at this point
                    actionPerformed = true;
                }
                return category;
            });
            if (completedFunc) {
                completedFunc.call(self, actionPerformed ? updateCategories : false);
            }
        },
        _updateCategories: function(updateCategories) {
            if (updateCategories) {
                this.reset(updateCategories);
            }
        },
        getCompletedForCategory: function(categoryId) {
            var completed = null, tasks, task, category;
            for (var i = 0; i < this.length; i++) {
                category = this.models ? this.at(i) : null;
                if (category && category.id === categoryId) {
                    tasks = category.get('tasks') || new Tasks();
                    completed = _.filter(tasks.models, function(t) {
                        return t.get('completed') ? true : false;
                    });
                }
            };
            return new Tasks(completed);
        },
        addTaskForCategory: function(categoryId, taskAttributes) {
            var self = this;
            this._performAction(categoryId, null,
                function(tasks, category) {
                    tasks.create(taskAttributes);
                    category.save({tasks: tasks});
                },
                self._updateCategories);
        },
        moveTaskToCategory: function(categoryId, moveToCategoryId, taskId) {
            var self = this;
            this._performAction(categoryId, taskId,
                function(tasks, task, originalCategory) {
                    var moveToCategory, moveToTasks;
                    tasks.remove(task);
                    originalCategory.save({tasks: tasks}, {silent: true});
                    moveToCategory = this.get(moveToCategoryId);
                    moveToTasks = moveToCategory.get('tasks') || new Tasks();
                    task.set({category: moveToCategory.get('title'), categoryId: moveToCategory.id})
                    moveToTasks.push(task);
                    moveToCategory.save({tasks: moveToTasks}, {silent: true});
                },
                self._updateCategories);
        },
        setTaskForCategory: function(categoryId, taskId, attributes) {
            var self = this;
            this._performAction(categoryId, taskId,
                function(tasks, task, category) {
                    task.set(attributes);
                    category.save({tasks: tasks}, {silent: true});
                },
                self._updateCategories);
        },
        pruneCompletedForCategory: function(categoryId) {
            var self = this;
            var categoryId = categoryId ? categoryId : null;
            this._performAction(categoryId, null,
                function(tasks, category) {
                    var completed = _.filter(tasks.models, function(t) {
                        return t.get('completed') ? true : false;
                    });
                    if (completed.length) {
                        _.invoke(completed, 'destroy');
                    }
                    category.save({tasks: tasks});
                },
                self._updateCategories);
        },
        toggleTaskForCategory: function(categoryId, taskId, checked) {
            var self = this;
            this._performAction(categoryId, taskId,
                function(tasks, task, category) {
                    task.set({completed: checked});
                    // silent because we don't want category save to update active sidebar link
                    category.save({tasks: tasks}, {silent: true});
                },
                self._updateCategories);
        },
        removeTaskForCategory: function(categoryId, taskId) {
            var removed = false, self = this;
            this._performAction(categoryId, taskId,
                function(tasks, task, category) {
                    tasks.remove(task);
                    category.save({tasks: tasks});
                    removed = true;
                },
                self._updateCategories);
        }
    });
    return Categories;
});
