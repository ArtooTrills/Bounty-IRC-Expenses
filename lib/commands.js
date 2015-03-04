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
  record: function(amount, message, who, from) {
    var query = {};
    if (who !== "all") {
      query.name = who;
    }

    return new Promise(function(resolve, reject) {
      Member.find(query, function(err, members) {
        var paidBy = _(members).find(function(member) {
          return member.name === from;
        });
        var paidFor = _(members).chain().filter(function(member) {
          return member.name !== from;
        }).pluck("_id").value();

        var share = amount / members.length;

        Expense.credit(share, paidBy, paidFor, message)
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
