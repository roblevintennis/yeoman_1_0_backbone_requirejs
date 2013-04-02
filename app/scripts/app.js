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
        }
    };
    return App;
});
