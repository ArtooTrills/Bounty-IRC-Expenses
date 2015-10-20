var _ = require('lodash');

module.exports = (function () {
  var ALIASES = {
    'i': 'self',
    'me': 'self'
  },

  COMMANDS = require('./commands'),

  FUNC = {
    addMember: function (message) {
      return {event: 'addm', data: message.split(',')};
    },

    showMembers: function () {
      return {event: 'showm'};
    },

    showTransactions: function (message) {
      return {event: 'showt', data: message};
    },

    showSettlements: function () {
      return {event: 'settle'};
    },

    showHelp: function () {
      return {event: 'help'};
    },

    addTransaction: function (message, from) {
      var recievers, payee, amount, date, name, type, transaction;

      if (message.indexOf('paid') > -1) {
        var data = message.split('.');

        transaction = data[0];

        receivers = data[1].split(',');
        receivers.push(from);
        transaction = _.compact(transaction.split(' '));
        type = 'bill';
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
        transaction = _.compact(message.split(' '));
        receivers = transaction[0].split(',');
        payee = ALIASES[transaction[2]] || transaction[2];
        name = 'borrow';
        amount = transaction[3];
        type = 'loan';
      }

      return {
        event: 'addt',
        data: {
          payee: payee === 'self' ? from : payee,
          name: name,
          date: date || new Date(),
          amount: parseInt(amount, 10),
          receivers: receivers,
          type: type
        }
      };
    }
  };

  this.parse = function (message, from) {
    for (command in COMMANDS) {
      if (message.indexOf(command) > -1) {
        return FUNC[COMMANDS[command]](message.replace(command, '').trim(), from);
      }
    };

    return null;
  };

  return this;
})()
