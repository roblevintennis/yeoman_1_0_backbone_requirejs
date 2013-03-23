define([], function() {
	var MyLib = function() {};

	MyLib.prototype.add = function(a,b) {
		return a + b;
	};

	return MyLib;
});