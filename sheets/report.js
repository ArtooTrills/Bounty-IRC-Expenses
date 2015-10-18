var Expense = require('../models/models').Expense; 
var User = require('../models/models').User; 
var excelbuilder = require('msexcel-builder');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var mail = require('../mail/sendmail');
var expenseBot = require('../expenseBot/expense')
var keys = require('../keywords/keywords')
var resultDownload;
exports.getExcelReport = function(month,person){
	
	reportPerson(getQuery(month,person));	
}

exports.getQuery = function(month,person)
{
	var query = [];
	if(person)
	{
		query.push({'paidBy' : person});
		query.push({'paidFor': person});
	}
	if(month>0)
	{
		var today = new Date();
		var year = today.getFullYear();
		var startDate = new Date(year,month,1,0,0,0,0);
		console.log(month + " "+ " "+year + " "+startDate);
		if(month==12)
		{
			month =1;
			year++;
		}
		else
		{
			month++;
		}
		var endDate = new Date(year,month,1,0,0,0,0);
		query.push({'date':{"$gte": startDate,"$lt": endDate }});
	}
	return query;
}
function reportPerson(query)
{
	Expense.find({$or : query},function(err,doc){
		if(err)
		{
			expenseBot.reply("Failed to generate report! Try again");	
		}
		if(doc)
		{
			console.log("result of report is : " + doc);
			var workbook = excelbuilder.createWorkbook('./', 'monthReport.xlsx')
			var sheet1 = workbook.createSheet('sheet1', 6, doc.length+1);
				sheet1.set(1, 1, 'Paid By');
  				sheet1.set(2, 1, 'Paid For');
				sheet1.set(3, 1, 'Money');
				sheet1.set(4, 1, 'Description');
				sheet1.set(5, 1, 'Date');

			for (var i = 0; i <= doc.length-1; i++) {
				sheet1.set(1, i+2, doc[i].paidBy);
				sheet1.set(2, i+2, doc[i].paidFor);
				sheet1.set(3, i+2, doc[i].money);
				sheet1.set(4, i+2, doc[i].desc);
				sheet1.set(5, i+2, doc[i].date);
			};

				workbook.save(function(err){
    				if (err){
      					expenseBot.reply("Failed to generate report");
      				}
			    	else
    				{
						mail.sendMail(keys.emails.toString())
    				}
    			});
		}
	});
}