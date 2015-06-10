var AWS = require("aws-sdk");

var TABLE_NAME_REGISTRY = "Computournament-Registry";
var TABLE_NAME_LEADERSHIPBOARD = "Computournament-LeadershipBoard";
var ddb = new AWS.DynamoDB();

exports.handler = function(event, context) {

    var timestamp = Math.round((new Date()).getTime() / 1000);
    
    checkPendingChallenge(context, function(item) {

	item.Status.S = (event.solution == eval(item.Challenge.S)) ? "solved" : "failed";
	item.Enddtime = { N: timestamp.toString() }; 
	
	var params = {
	    Item: item,
	    TableName : TABLE_NAME_REGISTRY
	};

	ddb.putItem(params, function(err, data) {
	    if (err) {
		context.fail(err);
	    }

	    var timeToSolve = timestamp - item.Starttime.N;

	    var score = (item.Status.S === "solved") ? (20 - timeToSolve).toString() : (-10).toString();
	    
	    var params2 = {
		TableName: TABLE_NAME_LEADERSHIPBOARD,
		Key: {
		    CognitoId: {
			S: context.identity.cognitoIdentityId
		    }
		},
		UpdateExpression: 'SET Score = Score + :p',
		ExpressionAttributeValues: {
		    ':p': { N: score }
		}
	    };

	    ddb.updateItem(params2, function(err, data) {
		if (err) {
		    context.fail(err);
		}
		context.succeed( { timeToSolve: timeToSolve, result: item.Status.S  }  );	
	    });
	});
    });
};
			 
function checkPendingChallenge(context, cb) {
    
    var params = {
    	"TableName": TABLE_NAME_REGISTRY,
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
