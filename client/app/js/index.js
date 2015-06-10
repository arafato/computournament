$(function() {

    var lambda = new AWS.Lambda();
    var ddb = new AWS.DynamoDB();
	
    var model = new vm();
    ko.applyBindings(model);

    // Adding new user to Leadershipboard
    Config.getIdentityId(function(id) {
    
	var params = {
	    Item: {
		CognitoId: {
		    S: id
		},
		Score: {
		    N: "0"
		}
	    },
	    TableName : Config.LEADERSHIP_TABLE
	};
		
	ddb.putItem(params, function(err, data) {
	    if (err) {
		model.error(true);
		model.errormsg(err);
	    }
	});
    });
    
    (function poll(){
	setTimeout(function() {

	    lambda.invoke(params, function(err, data) {
		if (err) {
		    
		} else {
		     
		    poll();
		}
	    });
	    
	}, 30000);
    })();
});
