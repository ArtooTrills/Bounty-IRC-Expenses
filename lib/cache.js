var
  Promise = require("bluebird"),
  _ = require("underscore"),
  Member = mongoose.model('Member');

module.exports = {
  _pool: {},
  load: function() {
    return new Promises(function(resolve, reject) {
      var self = this;
      Member.find(function(err, members) {
        if (err) reject(err);
        _(members).map(function(member) {
          self._pool[member.name] = member;
        });
        resolve(_pool);
      })
    }.bind(this));
  },
  findByName: function(name) {
    return new Promises(function(resolve, reject) {
      var self = this;
      if (self._pool[name]) {
        resolve(self._pool[name])
      } else {
        Member.findOne({
          name: name
        }, function(err, member) {
          if (err) reject(err);
          self._pool[name] = member;
          resolve(self._pool[name])
        });
      }
    }.bind(this))
  }
}
