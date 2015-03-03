var mongoose = require('mongoose'),
  Member = mongoose.model('Member');

module.exports = function() {
  Member.find({}, function(err, members) {
    if (err) console.log(err);
    if (members.length < 4) {
      Member.create([{
        name: "sameer",
        nick: "sam"
      }, {
        name: "shubham",
        nick: "shub"
      }, {
        name: "kaushik",
        nick: "kush"
      }, {
        name: "dilip",
        nick: "dilip"
      }], function(err, member) {
        if (err) console.log(err);
        console.log(member);
      });
    }
  });
};
