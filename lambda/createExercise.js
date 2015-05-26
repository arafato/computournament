console.log('Loading function');

exports.handler = function(event, context) {
    console.log('event:', event);
    var xnum = Math.round(Math.random()*41)- 20;
    var ynum = Math.round(Math.random()*41)- 20;
    var ex = xnum + ' + ' + ynum + ' = ?'
    context.succeed(ex);
};