"use strict";

var Config = (function(c) {
        
    AWS.config.region = 'eu-west-1';
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'eu-west-1:ade33e81-ef5d-4759-bbca-ae4bf400947e'
    });

    var identityId = null;

    c.LEADERSHIP_TABLE = "Computournament-LeadershipBoard";
    
    c.generateChallengeLambdaParams = {
	FunctionName: "generateChallenge",
	InvocationType: "RequestResponse"
    };

    c.submitChallengeLambdaParams = {
	FunctionName: "submitChallenge",
	InvocationType: "RequestResponse"
    };
    
    c.getIdentityId = function(cb, error) {

	if (identityId !== null) {
	    cb(identityId);
	}
	else {
	    AWS.config.credentials.get(function(err) {
		if (err) {
		    console.log(err, err.stack);
		    error(err);
		} else {
		    identityId = AWS.config.credentials.identityId;
		    cb(identityId);
		}
	    });
	}
    };
    
    return c;
    
}(Config || {}));
