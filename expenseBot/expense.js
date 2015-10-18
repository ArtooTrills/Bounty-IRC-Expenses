var irc = require('irc');
var client;
var channel = "expense-ch";
var parser = require('../parser/parser');
var expenseAction = require('../expenseBot/expenseActions');
var keys = require('../keywords/keywords')
exports.createBot = function(){
	client = new irc.Client('irc.freenode.net', 'expenseBot', {
		autoConnect: false
	});
	client.connect(5, function(input) {
		console.log("Connected!");
		client.join('#expense-ch', function(input) {
			client.say('#expense-ch', "Greetings! I am back!! Say @bot help, if you need any help");
			expenseAction.getUsers();
		});
	});

	client.addListener('pm', function (from, text) {
		console.log("[PM] - " + from + ': ' + text);
		client.say(from, text);
	});

	client.addListener('message', function (from, to, text) {
		if(text.indexOf('@bot') == 0)
		{
			console.log("inside listener");
			expenseAction.actions(text.substring(4,text.length),from);
			console.log("outside listener");
		}
	});
	
	client.addListener("join", function(channel, who) {
		client.say(channel, "Hi "+who);
		if(keys.members.indexOf(who)== -1 && who != "expenseBot")
		{
			client.say(channel, "I don't know who you are! Can you please add yourself or change to your original name?");
		}
	});
}

exports.reply = function(reply)
{
	console.log(reply);
	client.say("#expense-ch",reply);
}


