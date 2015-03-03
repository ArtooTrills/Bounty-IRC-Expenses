var path = require('path'),
  rootPath = path.normalize(__dirname + '/..'),
  env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'bounty-irc-expenses'
    },
    port: 3000,
    db: 'mongodb://localhost/bounty-irc-expenses-development',
    irc: {
      server: 'chat.freenode.net',
      port: 8001,
      channels: ["#expence-manager"],
      name: "embot",
      debug: true
    }
  },

  test: {
    root: rootPath,
    app: {
      name: 'bounty-irc-expenses'
    },
    port: 3000,
    db: 'mongodb://localhost/bounty-irc-expenses-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'bounty-irc-expenses'
    },
    port: 3000,
    db: 'mongodb://localhost/bounty-irc-expenses-production'
  }
};

module.exports = config[env];
