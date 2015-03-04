var
  irc = require('irc'),
  exec = require("../lib/bot");

console.log(exec)

module.exports = function(config) {

  var keywords = ["@"];

  var grammers = [];

  var bot = new irc.Client(config.irc.server, config.irc.name, {
    channels: config.irc.channels,
    port: config.irc.port,
    debug: config.irc.debug
  });

  bot.addListener('message', function(from, to, message) {

    exec(to, from, message)
      .then(function(result) {
        bot.say(to, result);
      })
      .catch(function(err) {
        bot.say(to, err);
      });
    /*var splits = message.split(" ");
    var top = splits[0].splice(0);
    if (to === config.irc.name) {
      console.log(top, message);
      if (message.indexOf('Know any good jokes?') > -1 || message.indexOf('good joke') > -1) {
        bot.say(to, 'Knock knock!');
      }
    }*/
  });

  bot.addListener('message', function(from, to, message) {
    if (message.indexOf('who is there?') > -1 || message.indexOf("who's there?") > -1 || message.indexOf("Who's there?") > -1 || message.indexOf("Who is there?") > -1) {
      bot.say(to, 'Doris');
    }
  });

  bot.addListener('message', function(from, to, message) {
    if (message.indexOf('Doris who?') > -1 || message.indexOf("doris who?") > -1) {
      bot.say(to, "Doris locked, that's why I'm knocking!");
    }
  });

  bot.on("error", function(err) {
    console.log(err)
  });

  return bot;
}
