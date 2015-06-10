var AWS = require("aws-sdk");

var TABLE_NAME = "Computournament-Registry";
var ddb = new AWS.DynamoDB();

exports.handler = function(event, context) {

    var timestamp = Math.round((new Date()).getTime() / 1000);
    
    checkPendingChallenge(context, function(item) {

	item.Status.S = (event.solution === eval(item.Challenge.S)) ? "solved" : "failed";
	item.Enddtime.N = timestamp.toString();
	
	var params = {
	    Item: item,
	    TableName : TABLE_NAME
	};

	ddb.putItem(params, function(err, data) {
	    if (err) {
		context.fail(err);
	    }

	    var timeToSolve = timestamp - item.Starttime.N;
	    context.succeed( { timeToSolve: timeToSolve, result: item.Status.S  }  );
	});
    });
};
			 
function checkPendingChallenge(context, cb) {
    
    var params = {
    	"TableName": TABLE_NAME,
    	"KeyConditionExpression": "CognitoId = :id",
    	"ExpressionAttributeValues": {
            ":id": {"S": context.identity.cognitoIdentityId }
    	},
	"Limit": 1,
	"ScanIndexForward": false
    };

    ddb.query(params, function(err, data) {
	if (err) {
	    context.fail(err);
	}

	if (data.Items[0].Status.S == "pending") {
	    cb(data.Items[0]);
	}
	else {
	    context.fail("No pending challenge available!");
	}
    });
}

