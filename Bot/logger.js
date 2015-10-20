var winston =  require('winston'),
  transports = winston.transports;

module.exports = new (winston.Logger)({
  transports: [
    new (transports.Console)(),
    new (transports.File)({filename: '../log/bot.log'})
  ]
});
