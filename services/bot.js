var
  parser = require("./parser"),
  command = require("./commands"),
  Promise = require("BlueBird");

module.exports = Promise.method(function(to, from, message) {
  var parsedObj = parser.parse(message);
  if (parsedObj.operation === "addt") {

  } else if (parsedObj.operation === "addm") {
    return command.addMember(parsedObj.userName);
  } else {
    throw new Error("Parsing Error");
  }
})
