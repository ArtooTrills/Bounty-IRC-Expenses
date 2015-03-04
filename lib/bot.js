var
  parser = require("./parser"),
  command = require("./process"),
  Promise = require("BlueBird"),
  sendMail = require("./sendMail"),
  report = require("./report");

module.exports = Promise.method(function(to, from, message) {
  var action = parser.action(message);

  switch (action) {
    case "addt":
      var transaction = parser.transaction(message);
      transaction.date = parser.date(message);
      return command.record(from, transaction, message);
      break
    case "addm":
      var member = parser.member(message);
      return command.addMember(member.userName);
      break;
    case "mail":
      return sendMail.sendBdayMail();
      throw new Error("Not implemented Yet");
      break
    case "export":
      throw new Error("Not implemented Yet");
      break
    case "report":
      return report.getReportByMonth(0);
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
