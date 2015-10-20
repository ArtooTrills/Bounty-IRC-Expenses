var config = require('./config'),
  irc = require('irc'),
  parser = require('./parser'),
  logger = require('./logger');

module.exports = (function () {
  this.bot = new irc.Client(config.server, config.nick, {
    channels: config.channels,
    debug: true
  });

  this.bot.addListener('message', function (from, to, message) {
    // if bot is mentioned
    if (message.indexOf('@' + config.nick) > -1) {
      var data = parser.parse(message.replace('@' + config.nick).trim());
    }
  });

  this.bot.addListener('error', logger.error);
})();
