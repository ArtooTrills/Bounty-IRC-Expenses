/*
* transaction.js calculates the amount and sets the sepcified date.
* It also checks if the user has used sepcail keywords like 'today' or 'yesterday'.
* If no month or date is specified, the bot adds the default date.
*/
module.exports = function transaction(cmd) {
  var months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

  var getMonth;
  for(var i=0; i<months.length; i++) {
    if(cmd.indexOf(months[i]) > -1) {
      getMonth = months[i];
    }
  }
  var transaction = {};
  if(cmd.indexOf('today') > -1) {
    var cmdToday = cmd.match(/\d/g);
    var amtToday = parseInt(cmdToday.join(''));

    var todayDate = new Date();
    var cDate = todayDate.getFullYear() + '-' + (todayDate.getMonth() + 1) + '-' + todayDate.getDate();
    transaction.date = cDate;
    transaction.amt = amtToday;
    return transaction;
  } else if(cmd.indexOf('yesterday') > -1) {
    var cmdYesterday = cmd.match(/\d/g);
    var amtYesterday = parseInt(cmdYesterday.join(''));

    var currentDate = new Date();
    var oneDay = 1000 * 60 * 60 * 24;
    var yDay = currentDate - oneDay;
    var yesterdayDate = new Date(yDay);
    transaction.date = yesterdayDate.getFullYear() + '-' + (yesterdayDate.getMonth() + 1) + '-' + yesterdayDate.getDate();
    transaction.amt = amtYesterday;
    return transaction;
  } else if(getMonth !== undefined) {
    var splitCmd = cmd.split(getMonth);
    var splitAmt = splitCmd[0].match(/\d/g);
    var amt = parseInt(splitAmt.join(''));

    var getDate = parseInt(splitCmd[1].trim());
    var month = months.indexOf(getMonth) + 1;
    var defaultYear = new Date();
    var year = defaultYear.getFullYear();
    var tDate =  year + '-' + month + '-' + getDate;
    transaction.date = tDate;
    transaction.amt = amt;
    return transaction;
  } else {
    var cmdDefault = cmd.match(/\d/g);
    var amtDefault = parseInt(cmdDefault.join(''));

    var defaultDate = new Date();
    var dDate = defaultDate.getFullYear() + '-' + (defaultDate.getMonth() + 1) + '-' + defaultDate.getDate();
    transaction.date = dDate;
    transaction.amt = amtDefault;
    return transaction;
  }
};
