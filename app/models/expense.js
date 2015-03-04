// Expence Model

var
  Promise = require("bluebird"),
  mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ExpenseSchema = new Schema({
  amount: 'Number',
  paid_by: {
    type: Schema.Types.ObjectId,
    ref: 'Member'
  },
  paid_for: [{
    type: Schema.Types.ObjectId,
    ref: 'Member'
  }],
  description: 'String'
});

ExpenseSchema.statics.credit = function(amount, paidBy, paidFor, message) {
  return new Promise(function(resolve, reject) {
    var Expense = mongoose.model('Expense');
    var expense = new Expense({
      amount: amount,
      paid_by: paidBy,
      paid_for: paidFor,
      description: message
    });
    expense.save(function(err) {
      if (err) {
        reject(err);
      }
      resolve(true);
    });
  });
};



mongoose.model('Expense', ExpenseSchema);
