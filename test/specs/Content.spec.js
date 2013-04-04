define([
    'jquery',
    'underscore',
    'backbone',
    'App',
    'collections/tasks',
    'collections/categories',
    'models/task',
    'models/category',
    'views/app',
    'views/nav',
    'views/sidebar',
    'views/content',
    'routers/router'
],
function(
    $,
    _,
    Backbone,
    App,
    Tasks,
    Categories,
    Task,
    Category,
    AppView,
    NavBarView,
    SidebarView,
    ContentView,
    AppRouter
) {
    var myapp, sandbox;

    beforeEach(function() {
        // Hack ensures no: "Backbone.history has already been started" error
        Backbone.history.stop();
        sandbox = sinon.sandbox.create();
        myapp = new App(Tasks,
                        Categories,
                        Task,
                        Category,
                        AppView,
                        NavBarView,
                        SidebarView,
                        ContentView,
                        AppRouter);
        var me = new myapp.Collections.Tasks([{
                id: 1, title: "Build Backbone Application",
                categories: ['screencasts']
            },{
                id: 2, title: "Read Secrets of the JavaScript Ninja",
                categories: ['reading']
            }]);
        var work = new myapp.Collections.Tasks([{
                id: 11, title: "Complete docs",
                categories: ['Work']
            }, {
                id: 12,
                title: "Submit timesheets",
                categories: ['Work']
            }]);
        my = new myapp.Models.Category({id: 1, title: 'Mine', tasks: me});
        job = new myapp.Models.Category({id: 2, title: 'Work', tasks: work});
        myapp.Collections.categories.reset([my, job]);
    });
    afterEach(function() {
        myapp.Collections.categories.reset();
        myapp = null;
        sandbox.restore();
    });

    describe("Content", function() {
        it('should filter by categories', function() {
            var view = myapp.Views.contentView;
            var spySetTasksForCategory = sandbox.spy(view, 'setTasksForCategory');
            var stubSetAllTasks = sandbox.stub(view, 'setAllTasks');

            myapp.start();
            view.filterByCategories("1");//'my' category
            expect(spySetTasksForCategory.called).to.equal.true;
            expect(stubSetAllTasks.called).to.equal.false;
        });
        it('should set all tasks if category not found', function() {
            var view = myapp.Views.contentView;
            var spySetTasksForCategory = sandbox.spy(view, 'setTasksForCategory');
            var stubSetAllTasks = sandbox.stub(view, 'setAllTasks');

            myapp.start();
            view.filterByCategories("12345");
            expect(spySetTasksForCategory.called).to.equal.true;
            expect(stubSetAllTasks.called).to.equal.true;
        });
        it('should set tasks for category and return boolean', function() {
            var view = myapp.Views.contentView;
            myapp.start();
            var found = view.setTasksForCategory("1");
            expect(found).to.equal.true;
            found = view.setTasksForCategory("2");
            expect(found).to.equal.true;
            found = view.setTasksForCategory("12345");
            expect(found).to.equal.false;
            found = view.setTasksForCategory(undefined);
            expect(found).to.equal.false;
        });
        it('should set all tasks based on content views collection', function() {
            var mytasks = new myapp.Collections.Tasks([{
                id: 1, title: "Foo", categories: ['foo','bar','baz']
            },{
                id: 2, title: "Bar", categories: ['qux', 'yo']
            },{
                id: 3, title: "Baz", categories: ['foo', 'bar', 'yo']
            }]);
            var meCategory = new myapp.Models.Category({
                id: 98, title: 'Mine', tasks: mytasks
            });
            var fambamTasks = new myapp.Collections.Tasks([{
                id: 11, title: "Pappa", categories: ['foo','bar','baz']
            },{
                id: 12, title: "Momma", categories: ['qux', 'yo']
            },{
                id: 13, title: "Lil' Guy", categories: ['foo', 'bar', 'yo']
            }]);
            var familyCategory = new myapp.Models.Category({
                id: 99, title: 'Mine', tasks: mytasks
            });
            myapp.Collections.categories.reset([meCategory, familyCategory]);
            var view = new ContentView({
                collection:  myapp.Collections.categories
            });
            view.setAllTasks();
            expect(view.tableTitle).to.equal('All');
            expect(view.tasks.length).to.equal(6);
        });
    });
});