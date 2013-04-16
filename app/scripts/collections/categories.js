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
         * Add a task for the category with id for this collection of categories
         * @param {String} categoryId     The category's id
         * @param {Object} taskAttributes key / val object with the task's attributes
         */
        addTaskForCategory: function(categoryId, taskAttributes) {
            var foundit = false;
            var updateCategories = _.map(this.models, function(category) {
                if (category.id === categoryId) {
                    foundit = true;
                    var tasks = category.get('tasks') || new Tasks();
                    tasks.create(taskAttributes);
                    category.save({tasks: tasks});
                }
                return category;
            });
            if (foundit) {
                this.reset(updateCategories);
            }
            return foundit;
        }
    });
    return Categories;
});
