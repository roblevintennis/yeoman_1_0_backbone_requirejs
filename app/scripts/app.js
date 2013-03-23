/*global define */


define(['jquery', 'underscore', 'backbone'], function ($, _, Backbone) {
    'use strict';
    var myapp = myapp || {};
    myapp.User = Backbone.Model.extend({
        initialize: function(options) {
        }
    });
    return myapp;
});