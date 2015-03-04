var nodemailer = require('nodemailer'),
  path = require('path'),
  templatesDir = path.join(__dirname, '../public/templates'),
  emailTemplates = require('email-templates'),
  Promise = require("BlueBird"),
  config = require("../config/config");

module.exports = function(templateFolder, birthdayMailObj, users, subject) {
  /*var appConfig = config.smtp;
  console.log(appConfig);
  var smtpConfig = appConfig.smtp;

  var transport = nodemailer.createTransport("SMTP", smtpConfig);
  return new Promise(function(resolve, reject) {
    emailTemplates(templatesDir, function(err, template) {
      template(templateFolder, birthdayMailObj, function(err, html, text) {
        if (err) {
          reject(err)
        } else {
          console.log(html);
          transport.sendMail({
            from: "yashprit@gmail.com",
            bcc: "yashprits@gmail.com",
            subject: "hello",
            html: html
          }, function(err, responseStatus) {
            if (err) {
              reject(err);
            } else {
              resolve("mail sent, please check your inbox");
            }
          });
        }
      });
    });
  });*/

  return new Promise(function(resolve, reject) {
    var transporter = nodemailer.createTransport();
    transporter.sendMail({
      from: 'yashprit@gmail.com',
      to: 'yashprits@gmail.com',
      subject: 'hello',
      text: 'hello world!'
    }, function(err, result) {
      if (err) reject(err);
      resolve("Mail Sent");
    });
  });
}
