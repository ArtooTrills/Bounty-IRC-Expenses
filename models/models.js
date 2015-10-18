var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var expenseSchema = new Schema({
    paidBy          : { type: String, required: true }
  , paidFor   : [{ type: String, required: true }]
  , money  : { type: Number, required: true }
  , desc  : { type: String, required: true }
  , date : { type : Date }
});

var userSchema = new Schema({
    userName          : { type: String, required: true , index: { unique: true }}
  , email			 : { type: String, default : 'samp-irc-node@gmail.com'}
});

var expense = mongoose.model('expense', expenseSchema);
var user = mongoose.model('user', userSchema);

module.exports = {
  Expense   : expense,
  User     : user
};