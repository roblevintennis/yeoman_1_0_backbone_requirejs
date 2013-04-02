define([
    'backbone',
    'underscore',
    'text!templates/navbar.html'
],
function(Backbone, _, navbarTpl) {
    var NavBarView = Backbone.View.extend({
        el: '.navbar',
        template: _.template(navbarTpl),
        render: function() {
            this.$el.html(this.template());
            return this;
        }
    });
    return NavBarView;
});
