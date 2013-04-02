define([
    'backbone',
    'text!templates/main.html'
],
function(Backbone, mainTpl) {

    var AppView = Backbone.View.extend({
        // This is defined in our main index.html
        el: '#app',
        template: _.template(mainTpl),
        render: function() {
            this.$el.html(this.template());
            return this;
        }
    });
    return AppView;
});
