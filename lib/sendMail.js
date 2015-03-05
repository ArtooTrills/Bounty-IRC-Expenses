var
  Mailer = require('../middleware/mail.js'),
  Promise = require("BlueBird");

exports.sendReport = Promise.method(function() {
  return Mailer('bday');
});
