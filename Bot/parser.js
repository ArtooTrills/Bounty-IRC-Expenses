var _ = require('lodash');

module.exports = (function () {
  var COMMANDS = {
    addt: 'addTransaction',
    settle: 'showSettlements',
    addm: 'addMember',
    showm: 'showMembers',
    showt: 'showTransactions',
    help: 'showHelp'
  },

  ALIASES = {
    'i': 'self',
    'me': 'self'
  }

  FUNC = {
    addMember: function (message) {
      return {event: 'addm', users: message.split(',')};
    },

    showMembers: function () {
      return {event: 'showm'};
    },

    showTransactions: function (message) {
      return {event: 'showt', month: message};
    },

    showSettlements: function () {
      return {event: 'settle'};
    },

    showHelp: function () {
      return {event: 'help'};
    },

    addTransaction: function (message, from) {
      var recievers, payee, amount, date, name;

      if (transaction.indexOf('paid') > -1) {
        var data = message.split('.'),
          transaction = data[0];

        recievers = data[1].split(',');

        transaction = _.compact(transaction.split(' '));

        if (transaction[0] === 'paid') {
          payee = 'self';
          amount = transaction[1];
          name = transaction[3];
          date = transaction[4] === 'on' ? transaction[5]: transaction[4];
        } else {
          payee = ALIASES[transaction[0]] || transaction[0];
          amount = transaction[2];
          name = transaction[4];
          date = transaction[5] === 'on' ? transaction[6]: transaction[5];
        }
      } else if (message.indexOf('owe') > -1) {
        transaction = _.compact(transaction.split(' '));
        recievers = transaction[0].split(',');
        payee = ALIASES[transaction[2]] || transaction[2];
        name = 'borrowes';
        amount = transaction[3];
      }

      return {
        event: 'addt',
        payee: payee === 'self' ? from : payee,
        name: name,
        date: date,
        amount: parseInt(amount, 10),
        recievers: recievers;
      };
    }
  };

  this.parse = function (message, from) {
    for (command in COMMANDS) {
      if (message.indexOf(command) > -1) {
        return FUNC[COMMANDS[command]](message, from);
      }
    };

    return null;
  };

  return this;
})()
