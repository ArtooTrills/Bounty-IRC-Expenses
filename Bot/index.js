var config = require('./config'),
  irc = require('irc'),
  parser = require('./parser'),
  logger = require('./logger'),
  adapter = require('./adapter');

module.exports = (function () {
  var bot = new irc.Client(config.server, config.nick, {
    channels: config.channels,
    debug: true
  });

  bot.addListener('message', function (from, to, message) {
    // if bot is mentioned
    console.log(from)
    if (message.indexOf('@' + config.nick) > -1) {
      var parsed = parser
        .parse(
          message.replace('@' + config.nick, '')
            .trim()
            .toLowerCase(),
           from
        );

      if (parsed) {
        bot.say(to, adapter(parsed));
      }
    }
  });

  bot.addListener('error', logger.error);

  return bot;
})();
