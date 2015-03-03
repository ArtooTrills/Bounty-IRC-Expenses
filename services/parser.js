var _ = require("underscore");

var keyword = {
  paid: "paid",
  owe: "owe",
  newO: "new"
}

var commands = ["addt", "addm"];

function test(word, message) {
  var newReg = new RegExp(word);
  return newReg.test(message);
}

function required(message, spliter) {
  var words = message.split(spliter);
  return words[1].trim();
}

module.exports = {
  parse: function(message) {
    var obj = {};
    var command = _(commands).filter(function(com) {
      var patt = new RegExp(com, "g");
      return message.match(patt);
    });
    if (command.length > 1) {
      throw new Error("Mutiple Command found");
    }
    obj.operation = command[0].trim();
    if (obj.operation === "addt") {
      var subMsg = message.split("addt")[1];
      if (test(keyword.owe)) {
        var usernameAmount = required(subMsg, keyword.owe).split(" ");
        obj.paidFor = usernameAmount[0];
        obj.amount = usernameAmount[1];
        return obj;
      }

      if (test(keyword.paid)) {
        var usernameAmount = required(subMsg, keyword.paid).split(" ");
        if (usernameAmount[0]) {
          obj.userName = usernameAmount[0];
        } else if (usernameAmount[1].indexOf('all')) {
          obj.userName = "all";
        }
        obj.amount = usernameAmount[1].split(" ")[0];
        return obj;
      }

    } else if (obj.operation === "addm") {
      obj.userName = required(message, keyword.newO);
      return obj;
    } else {
      throw new Error("No Command found in message")
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
