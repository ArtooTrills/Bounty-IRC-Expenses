var _ = require("underscore");

var keyword = {
  paid: "paid",
  owe: "owe",
  newO: "new"
}

var commands = ["addt", "addm", "mail", "report", "export"];

var months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
var monthAbbrs = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sept', 'oct', 'nov', 'dec'];
var monthsReg = new RegExp(("(" + months.join("|") + ")"), "gi");
var monthAbbrsReg = new RegExp(("(" + monthAbbrs.join("|") + ")"), "gi");

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

    if (command.length > 1) {
      throw new Error("Mutiple Command found");
    }
    return obj.operation = command[0].trim();
  },

  date: function(message) {
    var date = new Date();

    var year = message.match(/([2][0-3][0-9][0-9])/) || date.getFullYear();
    var messages = message.split(" ");
    var monthStr = _(messages).find(function(msg) {
      return monthsReg.test(msg) || monthAbbrsReg.test(msg);
    });

    var index = _(messages).indexOf(monthStr);

    var regMonths = _(months).indexOf();
    var regMonthsAbbrs = _(monthAbbrs).indexOf();

    var month = regMonths === -1 ? (regMonths === -1 ? date.getMonth() : regMonths) : regMonths;
    if (index === 0) {
      var day = parseInt(messages[index + 1], 10);
    } else {
      if (!_.isNaN(parseInt(messages[index + 1], 10))) {
        var day = parseInt(messages[index + 1], 10)
      } else if (!_.isNaN(parseInt(messages[index - 1], 10))) {
        var day = parseInt(messages[index + 1], 10)
      } else {
        var day = date.getDate();
      }
    }
    return new Date(year, month, day)
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
