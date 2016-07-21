var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var memberSchema = new Schema({
  name: String,
  nickname: String
});

var Member = mongoose.model('Member', memberSchema);

module.exports = Member;
