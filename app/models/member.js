// Member Model

var
  Promise = require("bluebird"),
  mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var MemberSchema = new Schema({
  name: 'String',
  nick: 'String'
});

MemberSchema.statics.addMember = function(name) {
  return new Promise(function(resolve, reject) {
    Member.findOneAndUpdate({
      name: name
    }, {
      upsert: true
    }, function(err, member) {
      if (err) reject("member already exist");
      resolve("member added")
    })
  });
}

mongoose.model('Member', MemberSchema);
