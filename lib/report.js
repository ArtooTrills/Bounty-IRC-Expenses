var
  mongoose = require('mongoose'),
  Expense = mongoose.model('Expense'),
  Member = mongoose.model('Member'),
  _ = require('underscore'),
  Promise = require("bluebird"),
  dp = require('datapumps'),
  config = require("../config/config");

module.exports = {
  getReportByMonth: Promise.method(function(month) {
    Expense.findByMonth(month)
      .then(function(result) {
        console.log(result);
      })
      .catch(function(err) {
        return "Not able to genrate report at this moment";
      });
  }),
  getDataByUserForMonth: Promise.method(function(name, month) {

  }),

  toExcel: function(month) {
    return new Promise(function(resolve, reject) {
      var pump = new dp.Pump();
      pump
        .mixin(dp.mixin.MongodbMixin(config.db))
        .useCollection('expenses')
        .from(pump.find({
          $where: 'this.date.getMonth() === ' + month
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
