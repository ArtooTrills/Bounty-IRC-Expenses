var Parser = require('../parser/parser');
var User = require('../models/models').User
var Expense = require('../models/models').Expense
var expenseBot = require('../expenseBot/expense')
var asyncArray = require('async')
var keys = require('../keywords/keywords')
var sheet = require('../sheets/report');
var parser;
var from;
exports.actions = function(sentence,person){
	from =person;
	console.log("in there");
	parser = new Parser(sentence);
	var type = parser.getTransactionType();
	console.log(type);
	if(type === 0 || type ===1)
	{
		saveTransaction(type);
	}
	if(type==2)
	{
		generateReport();
	}
	if(type===3)
	{
		saveUser();
	}
	else if(type==4)
	{
		help();
	}
}

function help()
{
	expenseBot.reply("Each command should start with @bot.\nTo add new user use @bot username email.\nTo get reports use @bot report month person.\nTo add transaction say @bot person1 spent(verb) 500 on dinner for all today.");
}

function saveTransaction(type)
{
	var persons = parser.getPersons();
	var firstPerson,desc;
	var money = parser.getMoney(type);
	console.log("check4 "+ persons);
	if(persons[0]==="i" || !parser.isFirstPersonPresent())
	{
		firstPerson = from;
	}
	else{
		firstPerson = persons[0];
		persons.splice(0,1);
	}
	
	if(type == 0)
	{
		desc = "owes";
	}
	else
	{
		desc = parser.getDesc(type);
	}
	
	if(persons.indexOf("all")>=0)
	{
		persons = keys.members;
		var index = persons.indexOf(firstPerson);
		persons.splice(index,1);
	}
	console.log("date is  :"+ parser.getDate());
	var expense = new Expense({
		  paidBy    : firstPerson
		, paidFor   : persons
		, money     : money
		, desc      : desc
		, date      : parser.getDate()
	});
		
	expense.save(function(err,doc){
		if(err)
		{
			console.log(err);
			expenseBot.reply("Transaction failed");
		}
		if(doc)
		{
			expenseBot.reply("Transaction recorded!");	
		}
	});
	
	
}

function generateReport()
{
	var person = parser.getReportName();
	var month = parser.getReportMonth();
	console.log("person :"+person +"month : "+month )
	sheet.getExcelReport(month,person);
}

function saveUser()
{
	var user = new User({
		userName : parser.newUser(),
		email	 : parser.newUserEmail()
	});
	
	user.save(function (err) {
				if (err){ 
					expenseBot.reply("Adding failed! Try again!!");
				}
				else{
					keys.users.push(user.userName);
					keys.members.push(user.userName);
					keys.emails.push(user.email);
					expenseBot.reply("User Added");
				}
			});
}

exports.getUsers = function()
{
	User.find({},function(err,doc){
		if(doc)
		{
			asyncArray.each(doc,function(user,callback){
				keys.users.push(user.userName);
				keys.members.push(user.userName);
				keys.emails.push(user.email);
				callback();
			});
			console.log(keys.users);
		}
	});
}
