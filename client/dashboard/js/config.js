"use strict";

var Config = (function(c) {
        
    AWS.config.region = 'eu-west-1';
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'eu-west-1:ade33e81-ef5d-4759-bbca-ae4bf400947e'
    });

    c.LEADERSHIP_TABLE = "Computournament-LeadershipBoard";

    c.POLLING_INTERVAL = 3000;
    
    return c;
    
}(Config || {}));
