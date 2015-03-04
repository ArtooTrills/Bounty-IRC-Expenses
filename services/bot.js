var
  parser = require("./parser"),
  command = require("./commands"),
  Promise = require("BlueBird");

module.exports = Promise.method(function(to, from, message) {
  var action = parser.action(message);

  switch (action) {
    case "addt":
      var transaction = parser.transaction(message);
      return command.record(transaction.amount, message, transaction.userName, from);
      break
    case "addm":
      var member = parser.member(message);
      return command.addMember(member.userName);
      break;
    case "mail":
      throw new Error("Not implemented Yet");
      break
    case "export":
      throw new Error("Not implemented Yet");
      break
    case "report":
      throw new Error("Not implemented Yet");
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
