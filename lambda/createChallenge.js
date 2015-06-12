var AWS = require("aws-sdk");

var TABLE_NAME = "Computournament-Registry";
var ddb = new AWS.DynamoDB();

exports.handler = function(event, context) {

    checkPendingChallenge(context, createChallenge);
};

function checkPendingChallenge(context, cb) {
    
    var params = {
    	"TableName": TABLE_NAME,
    	"KeyConditionExpression": "CognitoId = :id",
    	"ExpressionAttributeValues": {
            ":id": {"S": context.identity.cognitoIdentityId }
    	},
	"Limit": 1,
	"ScanIndexForward": false,
	"ConsistentRead": true
    };

    ddb.query(params, function(err, data) {
	if (err) {
	    context.fail(err);
	}

	if (data.Items[0] !== undefined && data.Items[0].Status.S == "pending") {
	    context.succeed(data.Items[0].Challenge.S);
	}
	else {
	    cb(context);
	}
    });
}

function createChallenge(context) {

    var xnum = Math.round(Math.random()*500)+1;
    var ynum = Math.round(Math.random()*500)+1;
    var op = (xnum % 2 === 0) ? " + " : " - "; 
    var challenge = xnum + op + ynum;

    var timestamp = Math.round((new Date()).getTime() / 1000);

    var params = {
	Item: {
	    CognitoId : { S : context.identity.cognitoIdentityId},
	    ChallengeId : { N : timestamp.toString() },
	    Status : { S : "pending" },
	    Starttime : { N : timestamp.toString() },
	    Challenge : { S : challenge }
	},
	
	TableName : TABLE_NAME
    };
    
    ddb.putItem(params, function(err, data) {
	if (err) {
	    context.fail(err);
	}
	
	context.succeed(challenge + " = ?");
    });
}
