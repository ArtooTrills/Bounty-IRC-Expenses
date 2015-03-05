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
    return new Promise(function(resolve, reject) {
      Expense.find({
        $where: 'this.date.getMonth() === ' + month
      }, function(err, expenses) {
        if (err) reject(err);
        Expense.populate(expenses, [{
          path: 'paid_by'
        }, {
          path: 'paid_for'
        }], function(err, result) {
          if (err) reject(err);
          resolve(result)
        })
      })
    });
  },
  getDataByUserForMonth: Promise.method(function(name, month) {

  }),

  toExcel: function() {
    return new Promise(function(resolve, reject) {
      var pump = new dp.Pump();
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
