require.config({
    paths: {
        App: 'app',
        MyLib: 'MyLib',
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
    'views/app'
],
function(App, AppView) {
    window._mainApp = new App(AppView);
    window._mainApp.start();
});

/*
require(['App', 'jquery', 'underscore', 'backbone', 'backboneLocalStorage', 'bootstrap'],
    function (App, $, _, Backbone, backboneLocalStorage, sinon, sinonChai) {
    'use strict';
});
*/
