define(['jquery', 'underscore', 'backbone', 'App'], function($, _, Backbone, App) {

    describe("Backbone Model Tests", function() {

        it("just learning me some Backbone", function() {
            var firstNameValidationError = 'First name must contain only alpha characters.';
            var Model = Backbone.Model.extend({
                validate: function(attrs, options) {
                    if (attrs.first_name) {
                        if (! /^(?:[A-Za-z]+)$/.test(attrs.first_name)) {
                            return firstNameValidationError;
                        }
                    }
                }
            });
            var instance = new Model({
                first_name: 'Rob'
            });
            instance.on('invalid', function(model, error) {
                expect(error).to.equal(firstNameValidationError);
            });
            instance.set('first_name', '1234Robin');
            instance.save();
        });

        it('should return a backbone model from our application', function() {
            var contact = new App.Contact({
                first_name: 'Rob',
                last_name: 'Levin'
            });
            expect(contact instanceof Backbone.Model).to.equal(true);
            expect(contact.get('first_name')).to.equal('Rob');
        });

    });
});