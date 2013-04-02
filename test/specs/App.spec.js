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
    'views/content'
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
    ContentView
) {
    var myapp, sandbox;
    beforeEach(function() {
        myapp = new App(Tasks,
                        Categories,
                        Task,
                        Category,
                        AppView,
                        NavBarView,
                        SidebarView,
                        ContentView);
        sandbox = sinon.sandbox.create();
    });
    afterEach(function() {
        myapp = null;
        sandbox.restore();
    });

    it('should bootstrap app, take AppView, NavBarView, Sidebar, Content, view dependencies', function() {
        expect(myapp.Views.appView instanceof AppView).to.equal(true);
        expect(myapp.Views.navView instanceof NavBarView).to.equal(true);
        expect(myapp.Views.sidebarView instanceof SidebarView).to.equal(true);
        expect(myapp.Views.contentView instanceof ContentView).to.equal(true);
        expect(_.isFunction(myapp.Views.appView.render)).to.equal(true);
        expect(_.isFunction(myapp.Views.navView.render)).to.equal(true);
        expect(_.isFunction(myapp.Views.sidebarView.render)).to.equal(true);
        expect(_.isFunction(myapp.Views.contentView.render)).to.equal(true);
    });
    it('should render main app and subviews when start called', function() {
        var sidebarSpy = sandbox.spy(myapp.Views.sidebarView, 'render');
        var contentSpy = sandbox.spy(myapp.Views.contentView, 'render');
        myapp.start();
        expect(sidebarSpy.called).to.equal(true);
        expect(contentSpy.called).to.equal(true);
    });
    it('should create a Categories collections', function() {
        var allCategories = new myapp.Collections.Categories([
            {id: 99, title: 'Job'},
            {id: 98, title: 'Fun'}
        ]);
        expect(allCategories.models.length === 2).to.equal(true);
        allCategories.each(function(c) {
            expect(c.get('title').length > 0).to.equal(true);
            expect(c.url().indexOf(c.get('id') >= 0).to.equal(true);
        });
    });
    it('should have Task, Tasks, and Categories with correct URL', function() {
        var attributes, t1, t2, personalTasks;
        attributes = {
            id: 1234,
            title: "Personal Tasks",
            tasks:[
                {id: 1, title: 'Buy groceries'},
                {id: 2, title: 'Watch movies'}
            ]
        };
        personalTasks= new myapp.Models.Category(attributes);
        t1 = personalTasks.tasks.models[0];
        t2 = personalTasks.tasks.models[1]
        expect(t1.get('id')).to.equal(1);
        expect(t1.get('title')).to.equal('Buy groceries');
        expect(t1.url()).to.equal('/category/1234/tasks/1');
        expect(t2.get('id')).to.equal(2);
        expect(t2.get('title')).to.equal('Watch movies');
        expect(t2.url()).to.equal('/category/1234/tasks/2');
    });
});