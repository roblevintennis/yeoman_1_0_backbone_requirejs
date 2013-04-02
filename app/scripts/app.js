define([], function() {
    var App = function(Tasks, Categories, Task, Category, AppView, NavBarView, SidebarView, ContentView) {
        this.Views.appView = new AppView();
        this.Views.navView = new NavBarView();
        this.Views.sidebarView = new SidebarView();
        this.Views.contentView = new ContentView();
        this.Models.Task = Task;
        this.Models.Category = Category;
        this.Collections.Tasks = Tasks;
        this.Collections.Categories = Categories;
    };
    App.prototype = {
        Views: {},
        Models: {},
        Collections: {},
        start: function() {
            this.Views.navView.render();
            var mainView = this.Views.appView.render();
            this.Views.sidebarView.render(mainView.$el.find('.left'));
            this.Views.contentView.render(mainView.$el.find('.right'));
        },
        seedDemoData: function() {
            var me = new this.Collections.Tasks([
                {
                    id: 1,
                    title: "Build Backbone Application",
                    categories: ['screencasts']
                },
                {
                    id: 2,
                    title: "Read Secrets of the JavaScript Ninja",
                    categories: ['reading']
                }
            ]);
            var work = new this.Collections.Tasks([
                {
                    id: 11,
                    title: "Complete docs",
                    categories: ['Work']
                },
                {
                    id: 12,
                    title: "Submit timesheets",
                    categories: ['Work']
                }
            ]);
            var family = new this.Collections.Tasks([
                {
                    id: 21,
                    title: "Lunch with fambam",
                    categories: ['Family']
                },
                {
                    id: 22,
                    title: "Plan Party",
                    categories: ['Family']
                }
            ]);
            var my = new this.Models.Category({id: 1, title: 'Mine', tasks: me});
            var job = new this.Models.Category({id: 2, title: 'Work', tasks: work});
            var fam = new this.Models.Category({id: 3, title: 'Family', tasks: family});
            this.Collections.categories = new this.Collections.Categories();
            this.Collections.categories.reset([my, job, fam]);
            console.log("***** Demo Categories Created *****");
            this.Collections.categories.each(function(c) {
                console.log('Category: ', c.get('title'));
                c.get('tasks').models.forEach(function(t) {
                    console.log('Task: ', t.get('title'));
                });
            });
        }
    };
    return App;
});
