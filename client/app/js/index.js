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
		},
		Nickname: {
		    S: "-"
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
		analyseLeadershipBoard(id, poll);
		
	    }, Config.POLLING_INTERVAL);
	})();
    });

    function analyseLeadershipBoard(id, cb) {

	var params = {
	    TableName: Config.LEADERSHIP_TABLE,
	    ReturnConsumedCapacity: "TOTAL"
	};
	
	ddb.scan(params, function(err, data) {
	    if (err) {
		model.error(true);
		model.errormsg(err);
		return;
	    }

	    data.Items.sort(function(a, b){
		return b.Score.N - a.Score.N;
	    });

	    var count = data.Count;
	    var pos = data.Items.map(function(e) { return e.CognitoId.S; }).indexOf(id);
	    var score = data.Items[pos].Score.N;
	    	    
	    model.score(score);
	    model.rank(pos+1 + " / " + count);
	    cb();
	});
    }
});
