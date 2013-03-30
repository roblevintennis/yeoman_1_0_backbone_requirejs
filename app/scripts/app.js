define([], function() {
    var App = function(AppView) {
        this.views.app = new AppView();
    };
    App.prototype = {
        views: {},
        start: function() {
            this.views.app.render();
        }
    };
    return App;
});
