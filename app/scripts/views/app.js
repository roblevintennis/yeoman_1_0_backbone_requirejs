define([
    'backbone',
    'underscore',
    'text!templates/main.html'
],
function(Backbone, _, mainTpl) {
    var AppView = Backbone.View.extend({
        el: '#app',
        template: _.template(mainTpl),
        render: function() {
            this.$el.html(this.template());
            return this;
        }
    });
    return AppView;
});