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
        },
        /**
         * Renders the content view
         * @param  {Object} $el A jQuery object pointing to the this view's
         * container.
         * @param  {Object} app The main application's context.
         * @return {Backbone.View} This view.
         */
        render: function($el, app) {
            var renderedSidebar =  this.$el.html(this.template());
            $el.html(renderedSidebar);
            return this;
        },
        selectCategory: function(id) {
            var self = this, href, categoryId, chunks, idPart;
            categoryId = parseInt(id);
            if (categoryId && !isNaN(categoryId)) {
                this.lastSelectedCategoryId = categoryId;
                this.$('.nav-list>li').not('.nav-header').each(function(idx, categoryElement) {
                    var idPart;
                    href = self.$(categoryElement).find('a').attr('href');
                    chunks = href.split('/');
                    idPart = chunks[chunks.length-1];
                    // if href (e.g. #categories/3) ends in same id make 'active'
                    if (idPart && idPart.indexOf(self.lastSelectedCategoryId) >= 0) {
                        self.removeAllActive();
                        self.highlightElement(categoryElement);
                    }
                });
            }
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