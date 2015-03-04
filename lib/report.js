var
  mongoose = require('mongoose'),
  Expense = mongoose.model('Expense'),
  Member = mongoose.model('Member'),
  _ = require('underscore'),
  Promise = require("bluebird"),
  dp = require('datapumps'),
  config = require("../config/config");

module.exports = {
  getReportByMonth: function(month) {
    var currentYear = (new Date()).getFullYear();
    var start = new Date(currentYear, month, 1).getTime();
    var end = new Date(currentYear, month, 31).getTime();
    console.log(start, end)
    return new Promise(function(resolve, reject) {
      Expense.find({
          $where: function() {
            return this.date.getMonth() == 1
          }
        },
        function(err, result) {
          if (err) reject(err);
          console.log("hello", result);
          resolve(result)
        });
    });
  },
  getDataByUserForMonth: Promise.method(function(name, month) {

  }),

  toExcel: function() {
    return new Promise(function(resolve, reject) {
      var pump = new dp.Pump()
      pump
        .mixin(dp.mixin.MongodbMixin(config.db))
        .useCollection('expenses')
        .from(pump.find({
          $where: function() {
            return this.date.getMonth() == 1
          }
        }))
        .mixin(dp.mixin.ExcelWriterMixin(function() {
          pump.createWorkbook('/tmp/ContactsInUs.xlsx');
          pump.createWorksheet('expense');
          pump.writeHeaders(['Name', 'Email']);
        }))
        .process(function(contact) {
          return pump.writeRow([contact.name, contact.email]);
        })
        .logErrorsToConsole()
        .start()
        .whenFinished().then(function() {
          resolve("excel sheet exporting done");
        });
    })
  },
  getCurrentYear: Promise.method(function() {
    return "hi"
  })
}
