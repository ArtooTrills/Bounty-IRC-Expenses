/*
* app.js is the server file, which runs on express.
*/
var express = require('express');
var config = require('./config/config');
var api = require('./app/controllers/api');

var app = express();

var client = require('./app/ircBot.js')(config);
app.use('/api', api);

app.listen(config.port, function() {
  var str;
  str = "Irc bot has been started at channel: "+config.irc.channels;
  console.log('Server Started at port: ', config.port + '\n');
  console.log(str);
});
