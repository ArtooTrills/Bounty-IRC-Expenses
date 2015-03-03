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
  record: function(amount, message, users, from) {
    if (users === "all") {
      Member.find(function(err, members) {
        if (err) return console.error(err);
        var paidBy = _(members).find(function(member) {
          return member.name === from;
        });
        var paidFor = _(members).chain().filter(function(member) {
          return member.name !== from;
        }).pluck("_id").value();
        var share = amount / members.length;
        Expense.credit(share, paidBy, paidFor, message);
      });
    }
  },
  addMember: Promise.method(function(name) {
    console.log("addmember", Member)
    return Member.addMember(name);
  })
}
