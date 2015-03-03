// Member Model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var MemberSchema = new Schema({
  name: 'String',
  nick: 'String'
});

mongoose.model('Member', MemberSchema);
