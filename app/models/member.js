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
    var Member = mongoose.model('Member');
    Member.findOne({
      name: name
    }, function(err, member) {
      if (err) reject(err);
      if (!member) {
        var newMember = new Member({
          name: name
        });
        newMember.save(function(err, member) {
          if (err) reject("member already exist");
          resolve(name + " created");
        })
      } else {
        reject("Member already exist");
      }
    });
  });
}

mongoose.model('Member', MemberSchema);
