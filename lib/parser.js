var _ = require("underscore");



var keyword = {
  paid: "paid",
  owe: "owe",
  newO: "new"
}

var commands = ["addt", "addm", "mail", "report", "export"];

var months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
var monthAbbrs = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sept', 'oct', 'nov', 'dec'];
var days = ["yesterdays", "tomorrow"];

function regExIt(array) {
  return new RegExp(("(" + array.join("|") + ")"), "gi");
}

function replace(str, pattern) {
  var replacedStr = str.replace(pattern, "");
  return replacedStr.trim();
}

function Parser(message) {
  message = replace(message, "@bot");

  //check for email
  if ((/\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/).test(message)) {
    this.email = message.match(/\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)[0];
    message = message.replace(this.email, "");
  }

  this.message = message.replace(/[.]/g, "");
  this.parties = null;
  this.amount = null;
  this.dateValue;
}

Parser.prototype = {
  _test: function(word) {
    var newReg = new RegExp(word, "i");
    return newReg.test(this.message);
  },

  _findDateAndMonth: function(array, regEx) {
    var found = this.message.match(regEx)[0].toLowerCase();
    var index = _(array).indexOf(found);

    if (index > -1) {
      var obj = {
        month: index
      };

      var msgParts = this.message.split(" ");
      for (var i = 0; i < msgParts.length; i++) {
        if (msgParts[i].toLowerCase() === found) {
          var date = _.isNaN(parseInt(msgParts[i + 1], 10)) ? (_.isNaN(parseInt(msgParts[i - 1], 10)) ?
            undefined : parseInt(msgParts[i - 1], 10)) : parseInt(msgParts[i + 1], 10);
        }
      }
      if (date) {
        obj.day = date
      }
      return obj;
    }
  },

  _required: function(spliter) {
    var words = this.message.split(spliter);
    return words[1].trim();
  },

  action: function() {
    var command = _(commands).filter(function(com) {
      var patt = new RegExp(com, "g");
      return this.message.match(patt);
    }, this);

    if (command.length > 1) {
      throw new Error("Mutiple Command found");
    }
    var action = command[0].trim();
    this.message = replace(this.message, action);
    return action;
  },

  date: function() {
    var date = new Date();

    //search for year, default is current year
    var year = this.message.match(/([2][0-3][0-9][0-9])/) || date.getFullYear();

    var monthDay = this.getMonth();

    if (year && monthDay.month && monthDay.day) {
      this.dateValue = new Date(year, monthDay.month, monthDay.day);
    }
    return this;
  },

  member: function() {
    var member = {};
    if (!(/@\w+/).test(this.message)) {
      throw new Error("user not found either, or wrong command use type @bot !help");
    }

    if (this.email) {
      member.email = this.email;
    }

    member.name = this.message.match(/@\w+/)[0].trim().replace("@", "");
    member.nick = member.name;
    return member;
  },

  getMonth: function() {
    var date = new Date();
    //search for feb or february or month
    var regExofMonthAbr = regExIt(monthAbbrs);
    var regExOfMonth = regExIt(months);
    if (regExOfMonth.test(this.message)) {
      var obj = this._findDateAndMonth(months, regExOfMonth);
    } else if (regExofMonthAbr.test(this.message)) {
      var obj = this._findDateAndMonth(monthAbbrs, regExofMonthAbr);
    } else {
      var obj = {
        month: date.getMonth(),
        day: date.getDate() - 1
      }
    }
    return obj;
  },

  user: function(from) {
    var obj = {};
    if (!(/@\w+/).test(this.message)) {
      throw new Error("user not found either, or wrong command use type @bot !help");
    }
    var user = this.message.match(/@\w+/)[0].trim().replace("@", "");
    if (!user) {
      throw new Error("No User Found in String");
    }

    if (this._test(keyword.owe)) {
      obj.paidBy = user
      obj.paidFor = from;
    } else if (this._test(keyword.paid)) {
      obj.paidBy = from;
      obj.paidFor = user;
    }
    this.message = replace(this.message, ("@" + user));

    this.parties = obj;
    return this;
  },

  transaction: function() {
    this.message = this.message.replace(/\s\s/, " ");
    var msgArray = this.message.split(" ");
    if (this._test(keyword.owe)) {
      var indexOfKeyword = _(msgArray).indexOf(keyword.owe);
    }

    if (this._test(keyword.paid)) {
      var indexOfKeyword = _(msgArray).indexOf(keyword.paid);
    }

    if (!_.isNaN(parseInt(msgArray[indexOfKeyword + 1], 10))) {
      this.amount = parseInt(msgArray[indexOfKeyword + 1], 10);
    }
    return this;
  },

  build: function() {
    var parsedObj = {};
    if (this.parties) {
      _.extend(parsedObj, this.parties)
    }

    if (this.dateValue) {
      parsedObj.dateValue = this.dateValue;
    }

    if (this.amount) {
      parsedObj.amount = this.amount;
    } else {
      throw new Error("No amount defined");
    }
    return parsedObj;
  }
}

module.exports = Parser;
