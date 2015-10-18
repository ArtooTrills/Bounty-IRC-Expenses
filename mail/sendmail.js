var nodemailer = require('nodemailer');
var fs = require('fs');
var expenseBot = require('../expenseBot/expense')

function sendMail(email)
{
// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'expense.manager.irc@gmail.com',
        pass: 'Expense-IRC'
    }
});
// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails


// setup e-mail data with unicode symbols
console.log(email);
fs.readFile("./monthReport.xlsx", function (err, data) {
	var mailOptions = {
		from: 'expense.manager.irc@gmail.comm', // sender address
		to: email, // list of receivers
		subject: 'Expense Report', // Subject line
		text: 'Hi,\nFind attached expense report.\nRegards,\nExpense Manager', // plaintext body
		html: '<b>'+'Hi,\nFind attached expense report.\nRegards,\nExpense Manager'+'</b>', // html body
		attachments: [{'filename': 'monthReport.xlsx', 'contents': data}]
	};
    transporter.sendMail(mailOptions, function(error, info){
		if(error){
			expenseBot.reply("Failed to generate report");
		}else{
			expenseBot.reply("Report generated and mailed to your email!!");
		}
	});
});

}
module.exports.sendMail=sendMail;