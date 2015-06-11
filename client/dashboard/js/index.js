$(function() {

    var ddb = new AWS.DynamoDB();
    var model = new vm();
    ko.applyBindings(model);

    (function poll(){
	setTimeout(function() {
	   analyseLeadershipBoard(poll);
	    
	}, Config.POLLING_INTERVAL);
    })();
    
    
    function analyseLeadershipBoard(cb) {
	
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

	    model.players(ko.utils.arrayMap(data.Items, function(p) {
		return new player(p.CognitoId.S, p.Score.N, p.Nickname.S);
	    }));

 	    model.players.sort(function(a, b) {
	     	return b.score() - a.score();
	    });

	    cb();
	});
    }
});
