define([], function() {
    /**
     * Main entry point in to application
     * @param {Backbone.Collection} Tasks Collection of tasks
     * @param {Backbone.Collection} Categories  Collection of Categories
     * @param {Backbone.Model} Task        Task model
     * @param {Backbone.Model} Category    Category model
     * @param {Backbone.View} AppView     Main application view
     * @param {Backbone.View} NavBarView  Nav bar view
     * @param {Backbone.View} SidebarView Sidebar view
     * @param {Backbone.View} ContentView Main content view
     * @param {Backbone.Router} AppRouter   Application router
     */
    var App = function(Tasks, Categories, Task, Category, AppView, NavBarView, SidebarView, ContentView, AppRouter) {
        // Our models will be instantiated later as needed later.
        this.Models.Task = Task;
        this.Models.Category = Category;
        this.Collections.Tasks = Tasks;
        this.Collections.Categories = Categories;
        this.Collections.categories = new Categories();
        this.Views.appView = new AppView();
        this.Views.navView = new NavBarView();
        this.Views.sidebarView = new SidebarView({collection: this.Collections.categories});
        this.Views.contentView = new ContentView({collection: this.Collections.categories});
        this.Routers.router = new AppRouter();
    };
    App.prototype = {
        Views: {},
        Models: {},
        Collections: {},
        Routers: {},
        start: function() {
            this.Views.navView.render();
            var mainView = this.Views.appView.render();
            this.Views.sidebarView.render(mainView.$el.find('.left'), this);
            this.Views.contentView.render(mainView.$el.find('.right'), this);
            Backbone.history.start();
        },
        // TODO: We'll get rid of this or move later ... just "spiking" ;)
        seedDemoData: function() {
            var categories = this.Collections.categories;
            categories.fetch();
            if (!categories.length) {
                var myTasks = new this.Collections.Tasks();
                myTasks.create({title: "Build Backbone Application", categories: ['Mine', 'Screencasts']});
                myTasks.create({title: "Read Secrets of the JavaScript Ninja", categories: ['Mine', 'Reading']} );
                var workTasks = new this.Collections.Tasks();
                workTasks.create({title: "Complete docs", categories: ['Work']});
                workTasks.create({title: "Submit timesheets", categories: ['Work']});
                var familyTasks = new this.Collections.Tasks();
                familyTasks.create({title: "Lunch with fambam", categories: ['Family']});
                familyTasks.create({title: "Plan Party", categories: ['Family'] });
                categories.create({title: 'Mine', tasks: myTasks});
                categories.create({title: 'Family', tasks: familyTasks});
                categories.create({title: 'Work', tasks: workTasks});
                console.log("***** Demo Categories Created *****");
            } else {
                console.log("***** Categories in localStorage found (length: " + categories.length + ") *****");
            }
        }
    };
    return App;
});
