require.config({
    paths: {
        App: 'app',
        MyLib: 'MyLib',
        jquery: '../components/jquery/jquery',
        underscore: '../components/underscore-amd/underscore',
        backbone: '../components/backbone-amd/backbone',
        backboneLocalStorage: '../components/backbone.localStorage/backbone.localStorage',
        bootstrap: 'vendor/bootstrap',
        sinon: '../components/sinon/lib/sinon',
        sinonChai: '../components/sinon-chai/lib/sinon-chai'
    },
    shim: {
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        }
    }
});

require(['App', 'jquery', 'underscore', 'backbone', 'backboneLocalStorage', 'sinon', 'sinonChai', 'MyLib', 'bootstrap'],
    function (App, $, _, Backbone, backboneLocalStorage, sinon, sinonChai, MyLib) {
    'use strict';
    // use app here
//    debugger;
//    console.log(App);
//    console.log(Backbone);
//    console.log(MyLib);
//    console.log(_);
//    console.log(backboneLocalStorage);
//    console.log('Running jQuery %s', $().jquery);
});
