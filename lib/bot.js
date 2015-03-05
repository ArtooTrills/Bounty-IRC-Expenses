var
  Parser = require("./parser"),
  command = require("./process"),
  Promise = require("BlueBird"),
  sendMail = require("./sendMail"),
  report = require("./report");

module.exports = Promise.method(function(to, from, message) {
  var parser = new Parser(message);

  var action = parser.action();

  switch (action) {
    case "addt":
      var obj = parser.user(from).transaction().date().build();
      return command.record(obj, message);
      break
    case "addm":
      var member = parser.member(message);
      return command.addMember(member);
      break;
    case "mail":
      return sendMail.sendReport();
      throw new Error("Not implemented Yet");
      break
    case "export":
      throw new Error("Not implemented Yet");
      break
    case "report":
      var month = parser.getMonth().month;
      return new Promise(function(resolve, reject) {
        report.getReportByMonth(month)
          .then(function(result) {

          }, function(err) {

          });
      })
      return report.getReportByMonth(month);
      break
    default:
      throw new Error("No Command found");
  }

  if (parsedObj.operation === "addt") {
    return command.record(parsedObj.amount, message, parsedObj.userName, from);
  } else if (parsedObj.operation === "addm") {
    return command.addMember(parsedObj.userName);
  } else {
    throw new Error("Parsing Error");
  }
})
