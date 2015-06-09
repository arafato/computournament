"use strict";

var vm = function(vm) {

    var that = this;
    
    this.identityId = ko.observable();
    this.rank = ko.observable();
    this.level = ko.observable();
    this.error = ko.observable(false);
    this.errormsg = ko.observable("");
    this.pending = ko.observable(false);

    this.challenge = ko.observable("");
    
    this.lambda = new AWS.Lambda();
    
    Config.getIdentityId(function(id) {
	that.identityId(id);
    }, function(err) {
	console.log(err);
	this.authError(true);
    });
};

vm.prototype.generateChallenge = function() {

    var that = this;
    
    this.pending(true);
    console.log("new challenge");

    var params = {
	FunctionName: "generateChallenge",
	InvocationType: "RequestResponse"
    };
    this.lambda.invoke(params, function(err, data) {
	if (err) {
	    console.log(err, err.stack);
	    that.error(true);
	    that.errormsg(err);
	} else {
	    that.challenge(data.Payload);
	}
    });
};

vm.prototype.submitResult = function() {

    console.log("submitting challenge...");
    this.pending(false);
};
