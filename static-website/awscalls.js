var lambda;
var ddb, kinesis, sqs;

function retrieveCredentials() {
  AWS.config.credentials.get(function(err) {
      if (err) {
        console.log(err, err.stack);
      } else {
        config.identityId = AWS.config.credentials.identityId;
        console.log("identityId:", config.identityId);
        /*
        ddb = new AWS.DynamoDB({endpoint: config.ddbEndpoint});
        readRegistry();
        */
        lambda = new AWS.Lambda();
        ready();
      }
  });
}

function getNewEx() {
  var params = {
    FunctionName: 'createExercise',
    InvocationType: 'RequestResponse',
    Payload: JSON.stringify({
      key1: "value1",
      key2: "value2",
      key3: "value3"
    })
  };
  lambda.invoke(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      console.log(data);
      document.getElementById('ex').innerHTML = data.Payload;
    }
  });
}

function readRegistry() {
  if (config.identityId == null) { console.log('not yet authorized'); return; }
  var params = {
    TableName: config.ddbTable,
    Select: 'ALL_ATTRIBUTES'
  };
  ddb.scan(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      console.log(data);
      printRegistry(data);
    }
  });
}
function updateDeviceRegistry(deviceId, deviceName, deviceType, deviceDestination) {
  if (config.identityId == null) { console.log('not yet authorized'); return; }
  if (!deviceName && !deviceType) {
    console.log('nothing to save');
    return;
  }
  var currentTime = new Date().getTime()/1000;
  var params = {
    Key: { 'device-id': { S: deviceId } },
    TableName: config.ddbTable,
    AttributeUpdates: {
      platform: { Action: 'PUT', Value: { S: navigator.userAgent } },
      lastUpdated: { Action: 'PUT', Value: { S: ''+currentTime } }
    },
    ReturnValues: 'ALL_NEW',
  };
  if (deviceName && deviceName != '') {
    params.AttributeUpdates.deviceName = { Action: 'PUT', Value: { S: deviceName } };
  }
  if (deviceType && deviceType != '') {
    params.AttributeUpdates.deviceType = { Action: 'PUT', Value: { S: deviceType } };
  }
  if (deviceDestination && deviceDestination != '') {
    params.AttributeUpdates.destination = { Action: 'PUT', Value: { S: deviceDestination } };
  }
  ddb.updateItem(params, function(err, data) {
    if (err) { console.log(err, err.stack); } else { console.log(data); }
  });
}
function deleteDeviceEntry(deviceId) {
  if (config.identityId == null) { console.log('not yet authorized'); return; }
  var params = {
    Key: { 'device-id': { S: deviceId } },
    TableName: config.ddbTable
  };
  ddb.deleteItem(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      console.log(data);
      entryDeleted(deviceId);
    }
  });
}