/**
 * Parser Module for reading and understanding sentence
 */
var
  _ = require("underscore"),
  moment = require("moment"),
  Text = require("./text"),
  lexicon = require("./lexicon"),
  util = require("./util");

/**
 * Parser constructor
 *
 * @param {String} message
 */
function Parser(message) {
  this._parties = null;
  this._amount = null;
  this._dateValue;
  this.initialize(message);
}

/**
 * initialize Text class and build object to hold other reference
 *
 * @param  {String} message
 */
Parser.prototype.initialize = function(message) {
  this._text = new Text(message);
  //hold reference of message in this class
  this._message = this._text._message;
  this._build = {};
}

/**
 * find out action from sentence
 * Set action and update message;
 *
 * @return {String} action
 */
Parser.prototype.action = function() {
  var actionRegEx = util.regExIt(lexicon.action);
  var actions = this._message.match(actionRegEx);
  if (actions && actions.length > 1) {
    throw new Error("Multiple command found in sentence" + actions)
  }

  this._action = util.first(actions);

  //update message
  this._message = util.replace(this._message, this._action).trim();
  return this._action;
}

/**
 * Search roomie from sentence and update message
 *
 * @return {String}
 */
Parser.prototype.user = function() {
  var users = _(this._text._words).filter(function(word) {
    return (/^\@/g).test(word);
  });

  if (users && users.length > 1) {
    throw new Error("User not found either, or wrong command use type" + users);
  }
  var user = util.first(users).replace(/^\@/, "");
  this._message = this._message.replace(/@/, "").trim();
  return user;
}

/**
 * Search for roomie name and email used by addm command
 *
 * @return {Parser}
 */
Parser.prototype.member = function() {

  var member = {};
  var emails = _(this._text._words).filter(function(word) {
    return (/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/).test(word);
  });

  if (emails && emails.length > 1) {
    throw new Error("Mutliple email id found" + emails);
  }

  member.email = util.first(emails);
  member.name = this.user();
  member.nick = member.name;
  return member;
}

/**
 * Search for date and months, this method is not for chaining
 *
 * @return {Object|Moment}
 */
Parser.prototype.date = function() {

  var monthLexi = ["months", "monthAbbrs", "days"];
  var specialWords = "days";
  var isSpecialWords = false;
  var momentDate = moment();
  var words = this._text._words;
  var date = momentDate.date();

  //search in all months keyword
  for (var i = 0; i < monthLexi.length; i++) {
    if (specialWords === monthLexi[i]) {
      isSpecialWords = true;
    }

    var months = _(words).filter(function(word) {
      return _(lexicon[monthLexi[i]]).contains(word);
    });


    if (months && months.length > 1) {
      throw new Error("Mutiple months found" + months);
    }

    //found
    if (months && months.length) {
      var month = util.first(months);

      //search for any number before or after months keyword, that will be our date
      for (var i = 0; i < words.length; i++) {
        if (words[i] === month) {
          var date = _.isNaN(parseInt(words[i + 1], 10)) ? (_.isNaN(parseInt(words[i - 1], 10)) ?
            undefined : parseInt(words[i - 1], 10)) : parseInt(words[i + 1], 10);
          if (date) {
            momentDate = momentDate.date(date);
          }
        }
      }

      if (isSpecialWords) {
        if ((/yesterday/).test(month)) {
          momentDate = momentDate.subtract(1, 'days');
        }

        if ((/tomorrow/).test(month)) {
          momentDate = momentDate.add(1, 'day');
        }

        if ((/today/).test(month)) {
          momentDate = momentDate;
        }
      } else {
        momentDate = momentDate.month(month);
      }
      break;
    }
  }
  return momentDate
}

/**
 * Search for amount
 *
 * @return {Number}
 */
Parser.prototype.transaction = function() {

  var paid = _(this._text._words).indexOf("paid");
  var owe = _(this._text._words).indexOf("owe");
  var index = paid > -1 ? paid : (owe > -1 ? owe : undefined);
  var amount;

  if (index === undefined || (paid > -1 && owe > -1)) {
    throw new Error("No or mutiple keyword found");
  }

  for (var i = index; i < this._text._words.length; i++) {
    if (!_.isNaN(parseInt(this._text._words[i], 10))) {
      amount = parseInt(this._text._words[i], 10);
      break;
    }
  }

  if (this._amount === undefined) {
    throw new Error("No Amount found")
  }

  return amount;
}

/**
 * search for roomie that paid for or paid by
 *
 * @return {Object}
 */
Parser.prototype.bussiness = function(from) {
  var obj = {};
  var roomie = this.user();

  if (_(this._text._words).contains("owe") > -1) {
    obj.paidBy = roomie;
    obj.paidFor = from;
  } else if (_(this._text._words).contains("paid") > -1) {
    obj.paidBy = from;
    obj.paidFor = roomie;
  }

  if (obj.paidFor === undefined) {
    throw new Error("Wrong command used" + roomie);
  }

  return obj;
}

/**
 * Template function for search all required attribute
 *
 * @return {Object}
 */
Parser.prototype.build = function(from) {
  var dateFormat = "D M YYYY"
  return _.extend({}, this.bussiness(from), {
    date: this.date().format(dateFormat),
    amount: this.transaction(),
  });
}



/*
Parser.prototype = {

  _findDateAndMonth: function(array, regEx) {
    var found = this.message.match(regEx)[0].toLowerCase();
    var index = _(array).indexOf(found);

    if (index > -1) {
      var obj = {
        month: index
      };

      var msgParts = this.message.split(/\s+/);
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
}*/

module.exports = Parser;
