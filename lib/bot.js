var
  Promise = require("BlueBird"),
  _ = require("underscore"),
  mongoose = require('mongoose'),
  Expense = mongoose.model('Expense'),
  Member = mongoose.model('Member'),
  Parser = require("./parser"),
  command = require("./process"),
  sendMail = require("./sendMail"),
  report = require("./report");



var showReport = function(data) {
  var totalAmount = 0;
  for (var key in data) {
    var user = data[key]
    totalAmount += _(user).reduce(function(acc, v) {
      return acc + (v.amount * v.paid_for.length)
    }, 0)
  }
  return "Total Expenditure for month is : " + Math.round(totalAmount) + "\u0020\u0020";
}

var expenseStatus = function(data) {
  var statics = {};
  for (var key in data) {
    var user = data[key]
    _(user).each(function(v) {
      _(v.paid_for).each(function(k) {
        if (v.paid_by !== k && v.paid_by && k) {
          var key = v.paid_by + "-" + k;
          var due = statics[key] || 0
          statics[key] = Math.round(v.amount) + due;
          var creditParty = key.split("-").reverse().join("-")
          var credit = statics[creditParty] || 0;
          if (credit) {
            if (statics[creditParty]) {
              statics[creditParty] = statics[creditParty] - statics[key];
            }
          }
          statics[key] -= credit;
        }
      })
    })
  }
  return statics;
}

module.exports = Promise.method(function(to, from, message) {
  var parser = new Parser(message);

  var action = parser.action();

  switch (action) {
    case "addt":
      var data = parser.user(from).transaction().date().build();
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
      break
    case "addm":
      var member = parser.member(message);
      return Member.addMember(member);
      break;
    case "mail":
      return sendMail.sendReport();
      break
    case "export":
      throw new Error("Not implemented Yet");
      break
    case "report":
      var month = parser.getMonth().month;
      return new Promise(function(resolve, reject) {
        Expense.findByMonth(month)
          .then(function(result) {
            var str = showReport(result)
            var expenses = expenseStatus(result);
            for (var k in expenses) {
              str += "\u000A" + (k + "\u0020\u0020[[" + expenses[k] + "]]\u0020\u0020");
            }
            resolve(str);
          })
          .catch(function(err) {
            reject("Not able to genrate report at this moment");
          });
      })
      break
    default:
      throw new Error("No Command found");
  }
})
