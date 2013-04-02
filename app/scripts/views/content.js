define([
    'backbone',
    'underscore',
    'text!templates/content.html'
],
function(Backbone, _, contentTpl) {
    var ContentView = Backbone.View.extend({
        template: _.template(contentTpl),
        render: function($el) {
            var renderedContent =  this.$el.html(this.template());
            $el.html(renderedContent);
            return this;
        }
    });
    return ContentView;
});