define(['jquery', 'underscore', 'backbone', 'App'], function($, _, Backbone, App) {
    describe("Backbone experiments", function() {
        it("should create new model", function() {
            var Model = Backbone.Model.extend({});
            var instance = new Model({
                title: "It works"
            });
            expect(instance.get('title')).to.equal('It works');
        });
        it("should create new User", function() {
            var user = new App.User({first_name: "Rob", last_name: "Levin"});
            expect(user.get("first_name")).to.equal("Rob");
        });
    });
});