var db = require('../store/db'),
  _ = require('lodash'),
  fs = require('fs');

module.exports = (function () {
  var COMMANDS = require('./commands'),

    FUNC = {
      addTransaction: function (data) {
        var err;

        if (data.receivers[0] === 'all') {
          data.receivers = _.values(db.users);
        } else {
          _.each(data.receivers, function (user) {
            if (_.values(db.users).indexOf(user) === -1) {
              err = 'Error: user ' + user + ' Not found \n'
                + 'add user by using addm command \n',
                + 'For more info use help command';
            }
          });
        }

        if (err) {
          return err;
        } else {
          db.addTransaction(data);
          return 'transaction added';
        }
      },

      showHelp: function () {
        return fs.readFileSync('./Bot/helpfile.txt').toString();
      },

      addMember: function (users) {
        db.addUsers(users);
        return _.values(users).join(', ') + ' added';
      },

      showMembers: function () {
        return _.values(db.users).join('\n');
      },

      showSettlements: function () {
        return JSON.stringify(db.getSettlements(), '  ', '\n');
      },

      showTransactions: function () {
        var data = [],
          transactions = db.getTransactions();

        _.each(transactions, function (val) {
          data.push(val.payee + '  paid ' + val.receivers.join(', ') + '  ' + val.amount + ' for ' + val.name);
        });

        return data.join('\n');
      }
    };

    return function (data) {
      return FUNC[COMMANDS[data.event]](data.data);
    };
})();
