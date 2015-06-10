$(function() {

    var lambda = new AWS.Lambda();
    
    var model = new vm();
    ko.applyBindings(model);
    
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
