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
  date: {
    type: Date,
    default: Date.now
  },
  description: 'String'
});

ExpenseSchema.statics.credit = function(amount, paidBy, paidFor, message, date) {
  return new Promise(function(resolve, reject) {
    var Expense = mongoose.model('Expense');
    var expense = new Expense({
      amount: amount,
      paid_by: paidBy,
      paid_for: paidFor,
      description: message,
      date: date || new Date()
    });
    expense.save(function(err) {
      if (err) {
        reject(err);
      }
      resolve(true);
    });
  });
};

ExpenseSchema.statics.findDebitByUsername = function(name) {

}



mongoose.model('Expense', ExpenseSchema);
