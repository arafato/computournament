"use strict";

var config = {};

function init() {
    AWS.config.region = 'eu-west-1';
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'eu-west-1:68731142-1f92-4e22-a780-bae13717ff0d'
    });
    retrieveCredentials();
}

function error(msg) {
    console.log(typeof msg == 'string' ? msg : msg.message);
}

function ready() {
    document.getElementById('getex').onclick = getNewEx;
}

var regBody = document.getElementById('registryBody');
function printRegistry(data) {
    if (data && data.Items) {
        var deviceId, deviceName, deviceType, deviceDestination, row, rowHtml;
        var gray = false;
        for (var i = 0; i < data.Items.length; i++) {
            deviceId = data.Items[i]['device-id'].S
            deviceName = data.Items[i]['deviceName'] && data.Items[i]['deviceName'].S ? data.Items[i]['deviceName'].S : '';
            deviceType = '';
            deviceType = data.Items[i]['deviceType'] && data.Items[i]['deviceType'].S ? data.Items[i]['deviceType'].S : '';
            deviceDestination = data.Items[i]['destination'] && data.Items[i]['destination'].S ? data.Items[i]['destination'].S : '';
            row = document.createElement('tr');
            row.setAttribute('id', deviceId);
            if (gray) {
                row.className = "gray";
            }
            rowHtml = "<td>"+deviceId+"</td><td><input id='deviceName-"+deviceId+"' value='"+deviceName+"'></td><td><select id='deviceType-"+deviceId+"'><option></option>";
            rowHtml += "<option"+(deviceType == 'button' ? " selected='true'":"")+">button</option>";
            rowHtml += "<option"+(deviceType == 'bulb' ? " selected='true'":"")+">bulb</option>";
            rowHtml += "<option"+(deviceType == 'sensor' ? " selected='true'":"")+">sensor</option></select></td>";
            rowHtml += "<td><input class='destination' id='destination-"+deviceId+"' value='"+deviceDestination+"'></td>";
            rowHtml += "<td><button deviceId='"+deviceId+"' onclick='updateRegistryEntry(this);'>save</button></td>";
            rowHtml += "<td><button deviceId='"+deviceId+"' onclick='deleteEntry(this);'>delete</button></td>";
            row.innerHTML = rowHtml; 
            regBody.appendChild(row);
            gray = !gray;
        }
    }
}

function updateRegistryEntry(btn) {
    var deviceId = btn.attributes['deviceId'].value;
    var deviceName = document.getElementById('deviceName-'+deviceId).value;
    var selectBox = document.getElementById('deviceType-'+deviceId);
    var deviceType = selectBox.options[selectBox.selectedIndex].value;
    var deviceDestination = document.getElementById('destination-'+deviceId).value;
    updateDeviceRegistry(deviceId, deviceName, deviceType, deviceDestination);
}

function deleteEntry(btn) {
    var deviceId = btn.attributes['deviceId'].value;
    deleteDeviceEntry(deviceId);
}

function entryDeleted(deviceId) {
    var row = document.getElementById(deviceId);
    row.parentNode.removeChild(row);
}

// Get rid of address bar on iphone/ipod
var fixSize = function() {
    window.scrollTo(0, 1);
    document.body.style.height = '100%';
    if (!(/(iphone|ipod)/.test(navigator.userAgent.toLowerCase()))) {
        if (document.body.parentNode) {
            document.body.parentNode.style.height = '100%';
        }
    }
};
setTimeout(fixSize, 700);
setTimeout(fixSize, 1500);
