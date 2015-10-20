var Firebase = require('firebase'),
  root = 'https://sweltering-inferno-1511.firebaseio.com/',
  transaction_ref = new Firebase(root + '//transactions'),
  user_ref = new Firebase(root + '//users'),
  _ = require('lodash');

module.exports = (function () {
  user_ref.on('value', function (snp) {
    this.users = snp.val();
  }.bind(this));

  transaction_ref.on('value', function (snp) {
    this.transactions = snp.val();
  }.bind(this))

  this.addUsers = function (users) {
    _.each(users, function (user) {
      if (!this.users || _.values(this.users).indexOf(user) < 0) {
        user_ref.push(user);
      }
    }.bind(this));
  };

  this.getUsers = function () {
    return this.users || [];
  };

  this.getTransactions = function () {
    return _.values(this.transactions)
  };

  this.addTransaction = function (data) {
    var transaction = {
      name: data.name,
      amount: data.amount,
      receivers: data.receivers,
      payee: data.payee,
      date: data.date,
      type: data.type
    }

    transaction_ref.push(transaction);
  };

  this.getSettlements = function () {
    var settlements = {},
      tot ={};

    _.each(_.values(this.transactions), function (transaction) {
      var users = transaction.receivers,
        payee = transaction.payee;

      if (!settlements[payee]) {
        settlements[payee] = 0;
      }

      settlements[payee] += transaction.amount;
      var per_person = transaction.amount / users.length;

      _.each(users, function (user) {
        if (!settlements[user]) {
          settlements[user] = 0;
        }
        settlements[user] -= per_person;
      });
    });

    return settlements;
  };

  return this;
})();
