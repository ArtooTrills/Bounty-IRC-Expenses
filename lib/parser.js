var _ = require("underscore");

var keyword = {
  paid: "paid",
  owe: "owe",
  newO: "new"
}

var commands = ["addt", "addm", "mail", "report", "export"];

function test(word, message) {
  var newReg = new RegExp(word);
  return newReg.test(message);
}

function required(message, spliter) {
  var words = message.split(spliter);
  return words[1].trim();
}

module.exports = {
  action: function(message) {
    var obj = {};

    var command = _(commands).filter(function(com) {
      var patt = new RegExp(com, "g");
      return message.match(patt);
    });

    console.log(command);

    if (command.length > 1) {
      throw new Error("Mutiple Command found");
    }
    return obj.operation = command[0].trim();
  },

  member: function(message) {
    return {
      userName: required(message, keyword.newO)
    }
  },

  transaction: function(message) {
    var obj = {};
    var subMsg = message.split("addt")[1].trim();
    if (test(keyword.owe, message)) {
      var usernameAmount = required(subMsg, keyword.owe).split(" ");
      obj.paidFor = usernameAmount[0];
      obj.amount = usernameAmount[1];
      return obj;
    }

    if (test(keyword.paid, message)) {
      var usernameAmount = required(subMsg, keyword.paid).split(" ");
      if ((/\d+/).test(usernameAmount[0])) {
        obj.amount = usernameAmount[0];
        if ((/all/).test(subMsg)) {
          obj.userName = "all"
        }
        return obj;
      }

      if (_.isString(usernameAmount[0])) {
        obj.userName = usernameAmount[0];
        obj.amount = usernameAmount[1];
        return obj;
      }
    }
  }
}


/*function identifyUser = function() {

}

module.exports = function(message) {
  var operation = function() {
    var command = _(commands).filter(function(com) {
      var patt = new RegExp(com, "g");
      return message.match(patt);
    });
    if (command.length > 1) {
      throw new Error("Mutiple Command found");
    }
    return command;
  }

  var user = function() {
    function test(reg) {
      return newReg.test(message);
    }

    var newReg = new RegExp(keyword.newO);
    if (test(newReg)) {
      var words = message.split(keyword.newO);
      var userName = words[1].trim();
      return userName
    }

    var oweReg = new RegExp(keyword.owe)
    if (test(oweReg)) {

    }

    var paidReg = new RegExp(keyword.paid)
    if (test(oweReg)) {

    }
  }
  return {
    operation: operation
  }
}*/
