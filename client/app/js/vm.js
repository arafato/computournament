"use strict";

var vm = function(vm) {

    var that = this;
    
    this.identityId = ko.observable();
    this.rank = ko.observable();
    this.level = ko.observable();
    this.error = ko.observable(false);
    this.errormsg = ko.observable("");
    this.pending = ko.observable(false);
    this.showStatistics = ko.observable(false);
    // Time it took to solve the last challenge
    this.timeToSolve = ko.observable();
    // Was the result right or wrong?
    this.resultStatus = ko.observable(false);
    // The proposed solution of the user
    this.solution = ko.observable();
    
    this.challenge = ko.observable("Fetching challenge...");
    
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

    this.lambda.invoke(Config.generateChallengeLambdaParams, function(err, data) {
	if (err) {
	    console.log(err, err.stack);
	    that.error(true);
	    that.errormsg(err);
	    that.pending(false);
	} else {
	    that.challenge(data.Payload);
	}
    });
};

vm.prototype.submitChallenge = function() {

    var that = this;

    this.pending(false);
    this.challenge("Fetching challenge...");

    var params = Object.create(Config.submitChallengeLambdaParams);
    params.Payload = JSON.stringify({
	solution: this.solution()
    });
    
    this.lambda.invoke(params, function(err, data) {
	if (err) {
	    console.log(err, err.stack);
	    that.error(true);
	    that.errormsg(err);
	} else {
	    var res = JSON.parse(data.Payload);
	    that.timeToSolve(res.timeToSolve);
	    that.resultStatus(res.result === "solved");
	    that.showStatistics(true);
	}
    });
};
