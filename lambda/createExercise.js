
exports.handler = function(event, context) {

    var xnum = Math.round(Math.random()*500)+1;
    var ynum = Math.round(Math.random()*500)+1;
    var op = (xnum % 2 === 0) ? " + " : " - "; 
    var ex = xnum + op + ynum + ' = ?';

    // TODO: Store challenge along with cognito id in DynamoDB
    
    context.succeed(ex);
};
