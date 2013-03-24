define(['jquery', 'underscore', 'backbone', 'App'], function($, _, Backbone, App) {

    describe('Backbone Models', function() {

        it('should be able to work with Backbone Models', function() {
            var Model = Backbone.Model.extend({});
            var model = new Model({first_name: 'Rob', last_name: 'Levin'});
            expect(model instanceof Backbone.Model).to.equal(true);
            expect(model.get('first_name')).to.equal('Rob');
        });

        it('should be able to get a backbone model from our app', function() {
            var contact = new App.Contact({
                first_name: 'Johnny',
                last_name: 'Mac'
            });
            expect(contact instanceof Backbone.Model).to.equal(true);
            expect(contact.get('first_name')).to.equal('Johnny');
            expect(contact.get('last_name')).to.equal('Mac');
        });

        it('should validate the backbone model from our app', function() {
            var contact = new App.Contact({
                first_name: '123_illegal_Johnny',
                last_name: 'Mac'
            });

            contact.on("invalid", function(model, error) {
                console.log(error);
                expect(error.length > 0).to.equal(true);
                expect(error.match(/.*alphabetical.*/g)).not.to.equal(false);
            });
            contact.save();
        });
    });
});