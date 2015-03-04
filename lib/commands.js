/**
 * Various command, used by bot
 */

var
  mongoose = require('mongoose'),
  Expense = mongoose.model('Expense'),
  Member = mongoose.model('Member'),
  _ = require('underscore'),
  Promise = require("bluebird");

module.exports = {
  record: function(from, transaction, message) {
    var query = {};
    if (transaction.userName !== "all") {
      query.name = transaction.userName;
    }

    return new Promise(function(resolve, reject) {
      Member.find(query, function(err, members) {
        var paidBy = _(members).find(function(member) {
          return member.name === from;
        });
        var paidFor = _(members).chain().filter(function(member) {
          return member.name !== from;
        }).pluck("_id").value();

        var share = transaction.amount / members.length;

        Expense.credit(share, paidBy, paidFor, message, transaction.date)
          .then(function(result) {
            resolve("transaction recorded.");
          })
          .catch(function(err) {
            reject(err);
          });
      });
    });
  },
  addMember: Promise.method(function(name) {
    return Member.addMember(name);
  })
}
