/*
* config.js configures the port number, mysql connection and bot connection
*/
var mysql = require('mysql');
var irc = require('irc');
var config = {
  port: 8000, //port number
  //create a mysql connection
  conn: mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'bounty_irc_db'
  }),
  //create a irc configuration client
  irc: {
    server: 'irc.freenode.net',
    channels: ["#bounty-irc-channel"],
    name: 'iBot'
  }
};

module.exports = config;
