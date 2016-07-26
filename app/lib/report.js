/*
* reports.js the library for 'reprot' endpoint.
*/
module.exports = function report(month) {
  var months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  var reportMonth;
  for(var i=0; i<months.length; i++) {
    if(month.indexOf(months[i]) > -1) {
      reportMonth = months[i];
    }
  }
  var monthNumber = months.indexOf(reportMonth) + 1;
  return monthNumber;
};
