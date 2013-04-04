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
    describe("Sidebar", function() {
        it('should populate sidebar according to Categories collection', function() {
            myapp.start();
            var categoriesAdded = myapp.Views.sidebarView.$el.find('.nav-list li').not('.nav-header').length;
            var expected = myapp.Collections.categories.length + 1;// +1 for 'All'
            expect(categoriesAdded).to.equal(expected);
        });
        it('should select category if category id passed in sidebar', function() {
            var stubRemoveAllActive = sandbox.stub(myapp.Views.sidebarView, 'removeAllActive');
            var stubHighlightElement = sandbox.stub(myapp.Views.sidebarView, 'highlightElement');
            myapp.start();
            myapp.Views.sidebarView.selectCategory("1");//'my' category
            expect(stubRemoveAllActive.called).to.equal.true;
            expect(stubHighlightElement.called).to.equal.true;

            stubRemoveAllActive.reset();
            stubHighlightElement.reset();
            myapp.Views.sidebarView.selectCategory(undefined);
            expect(stubRemoveAllActive.called).to.equal.false;
            expect(stubHighlightElement.called).to.equal.false;
        });
    });
});