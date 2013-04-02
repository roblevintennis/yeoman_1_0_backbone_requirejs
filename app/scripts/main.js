require.config({
    paths: {
        App: 'app',
        jquery: '../components/jquery/jquery',
        underscore: '../components/underscore-amd/underscore',
        backbone: '../components/backbone-amd/backbone',
        backboneLocalStorage: '../components/backbone.localStorage/backbone.localStorage',
        bootstrap: 'vendor/bootstrap',
        text: '../components/requirejs-text/text',
        templates: '../templates'
    },
    shim: {
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        }
    }
});

require([
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
    window._mainApp = new App(
        Tasks,
        Categories,
        Task,
        Category,
        AppView,
        NavBarView,
        SidebarView,
        ContentView
    );
    window._mainApp.start();
});
