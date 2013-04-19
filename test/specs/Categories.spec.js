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
        var categories = myapp.Collections.categories;
        var myTasks = new myapp.Collections.Tasks();
        myTasks.create({title: "Build Backbone Application", categories: ['Mine', 'Screencasts']});
        myTasks.create({title: "Read Secrets of the JavaScript Ninja", categories: ['Mine', 'Reading']} );
        var workTasks = new myapp.Collections.Tasks();
        workTasks.create({title: "Complete docs", categories: ['Work']});
        workTasks.create({title: "Submit timesheets", categories: ['Work']});
        var familyTasks = new myapp.Collections.Tasks();
        familyTasks.create({title: "Lunch with fambam", categories: ['Family']});
        familyTasks.create({title: "Plan Party", categories: ['Family'] });
        // Manually sets category ids so we can use in tests
        categories.create({id: 1, title: 'Mine', tasks: myTasks});
        categories.create({id: 2, title: 'Family', tasks: familyTasks});
        categories.create({id: 3, title: 'Work', tasks: workTasks});
    });
    afterEach(function() {
        myapp.Collections.categories.reset();
        myapp = null;
        sandbox.restore();
    });

    describe("Categories", function() {
        it('should return completed tasks as a Tasks collection', function() {
            var categories = myapp.Collections.categories;
            var taskUnderTest = categories.at(0).tasks.models[0];
            taskUnderTest.set({'completed': true}, {silent: true});
            var completed = categories.getCompletedForCategory(1);
            // console.log("Category: ", JSON.stringify(completed, null, '    '));
            expect(completed.length).to.equal(1);
            expect(completed.at(0).get('id')).to.equal(taskUnderTest.get('id'));
            expect(completed.at(0).get('title')).to.equal(taskUnderTest.get('title'));
        });
        it('should only prune completed tasks ', function() {
            var categories = myapp.Collections.categories;
            categories.pruneCompletedForCategory(1);//nothing marked complete
            expect(categories.at(0).tasks.length).to.equal(2);
        });
        it('should prune completed tasks for categories by id', function() {
            var categories = myapp.Collections.categories;
            expect(categories.at(0).tasks.length).to.equal(2);
            //Mark first task complete .. should be pruned
            categories.at(0).tasks.models[0].set({'completed': true}, {silent: true});
            categories.pruneCompletedForCategory(1);
            expect(categories.at(0).tasks.length).to.equal(1);
        });
        it('should prune completed tasks for across multiple categories', function() {
            var categories = myapp.Collections.categories;
            //Mark first task complete for each of our categories
            categories.at(0).tasks.models[0].set({'completed': true}, {silent: true});
            categories.at(1).tasks.models[0].set({'completed': true}, {silent: true});
            categories.at(2).tasks.models[0].set({'completed': true}, {silent: true});
            // Each of our category's completed tasks should be pruned since we don't pass a category id
            categories.pruneCompletedForCategory();
            expect(categories.at(0).tasks.length).to.equal(1);
            expect(categories.at(1).tasks.length).to.equal(1);
            expect(categories.at(2).tasks.length).to.equal(1);
        });
    });
});