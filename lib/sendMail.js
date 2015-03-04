var
  Mailer = require('../middleware/mail.js'),
  Promise = require("BlueBird");

exports.sendBdayMail = Promise.method(function() {
  return Mailer('bday');
});
