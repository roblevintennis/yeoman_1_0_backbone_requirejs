define([
    'backbone',
    'underscore',
    'text!templates/sidebar.html'
],
function(Backbone, _, sidebarTpl) {
    var SidebarView = Backbone.View.extend({
        template: _.template(sidebarTpl),
        events: {
            "click .sidebar-nav li:not(.nav-header)": "onCategorySelected",
            "click .remove-category": "onDeleteCategory"
        },
        // Keeps track of last selected category
        selectedCategory: null,
        initialize: function() {
            this.listenTo(this.collection, 'categories:selected:changed', this.selectCategory)
            this.listenTo(this.collection, 'select:category', this.selectCategory)
            // Sync fired when they add a new category via 'Create category'
            this.listenTo(this.collection, 'sync', this.updateSidebar);
        },
        render: function($el) {
            this.$containerEl = $el || this.$containerEl;
            var rendered = this.$el.html(this.template());
            this.$containerEl.html(rendered);
            this.delegateEvents();
            return this;
        },
        updateSidebar: function(collection) {
            var collectionId = collection ? collection.id : null;
            if (this.$containerEl) {
                this.render();
                this.selectCategory(collectionId);
            }
        },
        selectCategory: function(id) {
            var self = this, id;
            id = id || '';
            this.lastSelectedCategoryId = id;
            this.removeAllActive();

            // If no id optimize to just select 'All'
            if (!id) {
                self.selectAllCategory();
                return;
            }
            // Otherwise, look for category on sidebar with a matching id
            this.$('.nav-list>li').not('.nav-header').each(function(idx, categoryElement) {
                var categoryId = self.$(categoryElement).data('category-id');
                if (categoryId && categoryId === self.lastSelectedCategoryId) {
                    self.highlightElement(categoryElement);
                }
            });
        },
        selectAllCategory: function() {
            var all = this.$('.nav-list>li').not('.nav-header').first();
            this.highlightElement(all);
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
        onDeleteCategory: function(evt) {
            evt.preventDefault();
            evt.stopPropagation();
            var categoryLI = this.$(evt.currentTarget).closest('li');
            var categoryId = categoryLI.data('category-id');

            if (categoryId) {
                var category = this.collection.findWhere({id: categoryId});
                if (category) {
                    this.collection.trigger('category:delete', category);
                }
            }
        }
    });
    return SidebarView;
});