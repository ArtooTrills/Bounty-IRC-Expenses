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
      Member.findByPaidId(data)
        .then(function(result) {
          _.extend(result, {
            date: data.dateValue || new Date(),
            description: message
          });
          return Expense.credit(result);
        })
        .then(function(result) {
          resolve("transaction recorded.");
        })
        .catch(function(err) {
          reject(err);
        });
    });
  },
  addMember: Promise.method(function(name) {
    return Member.addMember({
      name: name
    });
  })
}
