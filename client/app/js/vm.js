"use strict";

var vm = function(vm) {

    var that = this;
    
    this.identityId = ko.observable();
    this.rank = ko.observable();
    this.level = ko.observable();
    this.authError = ko.observable(false);
    this.pending = ko.observable(false);
    
    Config.getIdentityId(function(id) {
	that.identityId(id);
    }, function(err) {
	console.log(err);
	this.authError(true);
    });
};

vm.prototype.newChallenge = function() {
    this.pending(true);
    console.log("new challenge");
};

vm.prototype.submitResult = function() {

    console.log("submitting challenge...");
    this.pending(false);
}
