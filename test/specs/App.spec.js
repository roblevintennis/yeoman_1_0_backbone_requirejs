define([
    'jquery',
    'underscore',
    'backbone',
    'App',
    'views/app'
],

function($, _, Backbone, App, AppView) {
    var myapp, sandbox;

    beforeEach(function() {
        myapp = new App(AppView);
        sandbox = sinon.sandbox.create();
    });
    afterEach(function() {
        myapp = null;
        sandbox.restore();
    });

    it('should bootstrap app and take AppView dependency', function() {
        expect(myapp.views.app instanceof Backbone.View).to.equal(true);
        expect(myapp.views.app instanceof AppView).to.equal(true);
        expect(_.isFunction(myapp.views.app.render)).to.equal(true);
    });
    it('should render main app view when start called', function() {
        var stub = sandbox.stub(myapp.views.app, 'render');
        myapp.start();
        expect(stub.called).to.equal(true);
    });
});