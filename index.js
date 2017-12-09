'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get('/', function(request, response) {
  console.log("Success");
});

var xhr = new XMLHttpRequest();
var url = "https://zdf-voice-app.herokuapp.com/playerInfo/";
xhr.open("POST", url, true);
xhr.setRequestHeader("Content-type", "application/json");
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4 && xhr.status === 200) {
    var json = JSON.parse(xhr.responseText);
    console.log(json.forename + ", " + json.lastname);
  }
};
var data = JSON.stringify({"forename:": "thomas", "lastname:" "müller"});
xhr.send(data);

app.post('/info', function(request, response) {
    var forename = request.body.result && request.body.result.parameters && request.body.result.parameters.playerforename ? request.body.result.parameters.playerforename : "Kein Vorname.";
    var lastname = request.body.result && request.body.result.parameters && request.body.result.parameters.playerlastname ? request.body.result.parameters.playerlastname : "Kein Nachname.";
    var information = request.body.result && request.body.result.parameters && request.body.result.parameters.information ? request.body.result.parameters.information : "Keine Information.";
    var teamname = request.body.result && request.body.result.parameters && request.body.result.parameters.teamname ? request.body.result.parameters.teamname : "Kein Teamname.";
    return response.json({
        speech: forename + " " + lastname + ". Information: " + information + ". Team: " + teamname + ".",
        displayText: forename + " " + lastname + ". Information: " + information + ". Team: " + teamname + ".",
        source: 'zdf-voice-app-webhook'
    });
});

app.listen((process.env.PORT || 8080), function() {
    console.log("Server up and listening");
});
