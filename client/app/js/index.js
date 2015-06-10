$(function() {

    var lambda = new AWS.Lambda();
    var ddb = new AWS.DynamoDB();
	
    var model = new vm();
    ko.applyBindings(model);

    Config.getIdentityId(function(id) {

	// Adding new user to Leadershipboard
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

	(function poll(){
	    setTimeout(function() {
		
		var params = {
		    Key: {
			CognitoId: {
			    S: id
			}
		    },
		    TableName: Config.LEADERSHIP_TABLE
		};
		
		ddb.getItem(params, function(err, data) {
		    if (err) {
			model.error(true);
			model.errormsg(err);
			return;
		    }

		    model.score(data.Item.Score.N);
		    poll();
		});
		
	    }, Config.POLLING_INTERVAL);
	})();
    });
});
