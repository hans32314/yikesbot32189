var tmi = require('tmi.js');
var request = require('request');
const express = require('express');
const app = express();
const userChannel = process.env.CHANNEL;

var ans;
var options = {
        options: {
                debug: true
        },
        connection: {
                reconnect: true
        },
        identity: {
                username: "64x61x6ex6b",
                password: "oauth:y4d4l6hu8obv0qk9rieislvl8glya1"
        },
        channels: ["64x61x6ex6b"]
};

var client = new tmi.client(options);
// Connect the client to the server
client.connect();
client.on('chat', function(channel, userstate, message, self){
        if(message.includes("@"+process.env.USERNAME)){ // checking if SUSI is tagged
                var u = message.split("@" + process.env.USERNAME + " ");
                // Setting options to make a successful call to SUSI API
                var options1 = {
                        method: 'GET',
                        url: 'http://api.susi.ai/susi/chat.json',
                        qs:
                        {
                                timezoneOffset: '-300',
                                q: u[1]
                        }
                };
                request(options1, function(error, response, body) {
                        if (error) throw new Error(error);
                        if((JSON.parse(body)).answers[0])
                                ans = userstate['display-name'] + " " + (JSON.parse(body)).answers[0].actions[0].expression;
                        else
                                ans = userstate['display-name'] + " Sorry, I could not understand what you just said."
                
                        client.action(userChannel, ans);
                });
        }
});

client.on('connected', function(address, port){
        client.action(userChannel, `Hey I'm not a real person!`);
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
   console.log(`Listening on ${port}`);
});