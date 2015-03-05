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
  record: function(data, message) {
    return new Promise(function(resolve, reject) {
      Member.find({}).exec()
        .then(function(members) {
          if (!members.length) {
            reject("transaction not recoded, because " + data.paidFor + " is not a registerted member")
          }

          var paidBy = _(members).find(function(member) {
            return member.name === data.paidBy;
          });

          if (!paidBy) {
            reject("transaction not recoded, because " + data.paidBy + " is not a registerted member")
          }
          if (data.paidFor === "all") {
            var paidFor = _(members).chain().filter(function(member) {
              return member.name !== data.paidBy;
            }).pluck("_id").value();
          } else {
            var paidFor = _(members).chain().filter(function(member) {
              return member.name === data.paidFor;
            }).pluck("_id").value();
          }


          if (!paidFor) {
            reject("transaction not recoded, because " + data.paidBy + " is not a registerted member")
          }

          var share = data.amount / members.length;
          Expense.credit(share, paidBy, paidFor, message, data.dateValue)
            .then(function(result) {
              resolve("transaction recorded.");
            }, function(err) {
              reject(err);
            });

        }, function(err) {
          reject(err);
        })
    });
  },
  addMember: Promise.method(function(name) {
    return Member.addMember(name);
  })
}
