define([
    'backbone',
    'underscore',
    'text!templates/sidebar.html'
],
function(Backbone, _, sidebarTpl) {
    var SidebarView = Backbone.View.extend({
        template: _.template(sidebarTpl),
        events: {
            "click .sidebar-nav li:not(.nav-header)": "onCategorySelected"
        },
        // Keeps track of last selected category
        selectedCategory: null,
        initialize: function() {
            this.listenTo(this.collection, 'categories:route:changed', this.selectCategory)
            this.listenTo(this.collection, 'add', this.categoryAdded)
        },
        /**
         * Renders the content view
         * @param  {Object} $el A jQuery object pointing to the this view's
         * container.
         * @return {Backbone.View} This view.
         */
        render: function($el) {
            this.$containerEl = $el || this.$containerEl;
            var rendered = this.$el.html(this.template());
            this.$containerEl.html(rendered);
            this.delegateEvents();
            return this;
        },
        categoryAdded: function(category) {
            // if we've already initialized view
            if (this.$containerEl) this.render();
        },
        selectCategory: function(id) {
            var self = this, id;
            id = id || '';
            this.lastSelectedCategoryId = id;

            this.$('.nav-list>li').not('.nav-header').each(function(idx, categoryElement) {
                // Find the matching category on the sidebar by id
                var categoryId = self.$(categoryElement).data('category-id');
                if (categoryId && categoryId === self.lastSelectedCategoryId) {
                    self.removeAllActive();
                    self.highlightElement(categoryElement);
                }
            });
        },
        removeAllActive:  function() {
            this.$('.nav-list>li').removeClass('active');
        },
        highlightElement:  function(el) {
            this.$(el).addClass('active');
        },
        onCategorySelected: function(evt) {
            this.removeAllActive();
            this.highlightElement(evt.currentTarget);
        },
    });
    return SidebarView;
});