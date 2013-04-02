define([
    'backbone',
    'underscore',
    'text!templates/content.html'
],
function(Backbone, _, contentTpl) {
    var ContentView = Backbone.View.extend({
        template: _.template(contentTpl),
        render: function($el) {
            // TODO: The table's title will be pulled from the appropriate Tasks collection's title later ;)
            this.tableTitle = 'All';
            var renderedContent =  this.$el.html(this.template());
            $el.html(renderedContent);
            return this;
        }
    });
    return ContentView;
});