'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());


//Define root directory
app.get('/', function(request, response) {
  console.log("Success");
  response.send("Funktioniert!");
});

// POST Request to Chromecast Backend
// Set the headers
const headers = {
    'Content-Type': 'application/json'
};
// Configure the request
const options = {
    url: 'https://zdf-voice-app.herokuapp.com/playerInfo',
    method: 'POST',
    headers: headers,
    form: {'forename': 'Thomas', 'lastname': 'Müller'}
};


// POST Request to Dialogflow Webhook
app.post('/info', function(request, response) {
    var forename = request.body.result && request.body.result.parameters && request.body.result.parameters.playerforename ? request.body.result.parameters.playerforename : "Kein Vorname.";
    var lastname = request.body.result && request.body.result.parameters && request.body.result.parameters.playerlastname ? request.body.result.parameters.playerlastname : "Kein Nachname.";
    var information = request.body.result && request.body.result.parameters && request.body.result.parameters.information ? request.body.result.parameters.information : "Keine Information.";
    var teamname = request.body.result && request.body.result.parameters && request.body.result.parameters.teamname ? request.body.result.parameters.teamname : "Kein Teamname.";

    // Start the request
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // Print out the response body
            console.log(body);}
    });


    return response.json({
        speech: forename + " " + lastname + ". Information: " + information + ". Team: " + teamname + ".",
        displayText: forename + " " + lastname + ". Information: " + information + ". Team: " + teamname + ".",
        source: 'zdf-voice-app-webhook'
    });

});


// Initialize Server
app.listen((process.env.PORT || 8080), function() {
    console.log("Server up and listening");
});
