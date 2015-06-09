var AWS = require("aws-sdk");

exports.handler = function(event, context) {

    var xnum = Math.round(Math.random()*500)+1;
    var ynum = Math.round(Math.random()*500)+1;
    var op = (xnum % 2 === 0) ? " + " : " - "; 
    var ex = xnum + op + ynum + ' = ?';

    var timestamp = Math.round((new Date()).getTime() / 1000);

    var ddb = new AWS.DynamoDB();
    var params = {
	Item: {
	    CognitoId : { S : context.identity.cognitoIdentityId},
	    ChallengeId : { N : timestamp.toString() },
	    Status : { S : "pending" },
	    Starttime : { N : timestamp.toString() }
	},
	
	TableName : "Computournament-Registry"
    };
    
    ddb.putItem(params, function(err, data) {
	if (err) {
	    context.fail(err);
	}
	
	context.succeed(ex);
    });
};
