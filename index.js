'use strict';

const express = require('express');
const bodyParser = require('body-parser');

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

// POST Request to Dialogflow Webhook
app.post('/info', function(request, response) {
    var forename = request.body.result && request.body.result.parameters && request.body.result.parameters.playerforename ? request.body.result.parameters.playerforename : "Kein Vorname.";
    var lastname = request.body.result && request.body.result.parameters && request.body.result.parameters.playerlastname ? request.body.result.parameters.playerlastname : "Kein Nachname.";
    var information = request.body.result && request.body.result.parameters && request.body.result.parameters.information ? request.body.result.parameters.information : "Keine Information.";
    var teamname = request.body.result && request.body.result.parameters && request.body.result.parameters.teamname ? request.body.result.parameters.teamname : "Kein Teamname.";

        // POST Request to Chromecast Backend
        // Start the request
        const requestservice = require('request');
        // Set the headers
        const headers = {
            'Content-Type': 'application/json'
        };
        // Configure the request
        const options = {
            url: 'https://zdf-voice-app.herokuapp.com/playerInfo',
            method: 'POST',
            headers: headers,
            form: {'forename': forename, 'lastname': lastname}
        };
        // Send the request
        requestservice(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // Print out the response body
                console.log(body);}
        });

    // Return parameters to Dialogflow
    return response.json({
        speech: forename + " " + lastname + ". Bitteschön.",
        displayText: forename + " " + lastname + ". Bitteschön.",
        source: 'zdf-voice-app-webhook'
    });

});

// Initialize Server
app.listen((process.env.PORT || 8080), function() {
    console.log("Server up and listening");
});
