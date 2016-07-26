/*
*  IrcBot.js handles all the commands being passed to the bot.
*  Redirects to require library when a particular command is invoked.
*/
var irc = require('irc');
var mysql = require('mysql');
var botLib = require('./lib/bot');

module.exports = function(config) {

  //Create a irc client
  var bot = new irc.Client(config.irc.server, config.irc.name, {
    channels: config.irc.channels
  });

  /*
  * On joining the channel, the bot checks for logged in user details.
  * If user does not exist, then the bot adds the user to the database.
  */
  bot.addListener('join', function(channel, nick, message) {
    if(nick != config.irc.name) {
      var newUser = botLib.checkUser(nick);
      return bot.say(channel, newUser);
    }
  });

  /*
  * Bot listens for commands beaing passed to it.
  * Whenever a match is found, bot redirects to BotLib file.
  */
  bot.addListener('message', function(from, to, message) {
    var cmdString = message.split(/@bot/)[1].trim();
    var cmd = cmdString.split(' ')[0];
    switch(cmd) {
      // 'addm' requests a new member creation
      // Ex: @bot addm new john
      case 'addm':
        botLib.addUser(cmdString);
        break;
      // 'addt' requests for recording transaction
      // Ex: @bot addt paid 1000 to @john on July 1
      case 'addt':
        var record = cmdString.split(/addt/)[1].trim();
        botLib.transaction(record, from);
        break;
      // 'report' requests for reports of particualr month
      // Ex: @bot report May
      case 'report':
        var report = cmdString.split(/report/)[1].trim();
        botLib.report(report)
          .then(function(result) {
            bot.say(to, result);
          })
          .catch(function(err) {
            bot.say(to, err);
          });
        break;
      default:
        bot.say(to, 'Command does not exist');
        break;
    }
  });
};
