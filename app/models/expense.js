// Expence Model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ExpenseSchema = new Schema({
  amount: 'Number',
  paid_by: {
    type: Schema.Types.ObjectId,
    ref: 'Member'
  },
  paid_for: {
    type: Schema.Types.ObjectId,
    ref: 'Member'
  },
  description: 'String'
});

mongoose.model('Expense', ExpenseSchema);
