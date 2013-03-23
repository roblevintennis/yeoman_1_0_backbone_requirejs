/*global define */
define(['jquery', 'underscore', 'backbone'], function ($, _, Backbone) {
    'use strict';
//    debugger;
    console.group("App Debugging");
    console.log("Got inside app!")
    console.log('Running Backbone %s', Backbone.VERSION);
    console.log('Running Underscore %s', _.VERSION);
    console.log('Running jQuery %s', $().jquery);
    console.groupEnd();
});