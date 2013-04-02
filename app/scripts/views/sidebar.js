define([
    'backbone',
    'underscore',
    'text!templates/sidebar.html'
],
function(Backbone, _, sidebarTpl) {
    var SidebarView = Backbone.View.extend({
        template: _.template(sidebarTpl),
        render: function($el) {
            var renderedSidebar =  this.$el.html(this.template());
            $el.html(renderedSidebar);
            return this;
        }
    });
    return SidebarView;
});