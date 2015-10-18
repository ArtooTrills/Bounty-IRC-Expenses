var parser = require("natural");
var tokenizer;
var keywords = require('../keywords/keywords');

function Parser(sentence)
{
	tokenizer = new parser.RegexpTokenizer({pattern: /\ /});;
	this.tokens = tokenizer.tokenize(sentence);
	this.persons = [];
	this.persons = matchTokens(this.tokens,keywords.users);
	this.cVerbs = matchTokens(this.tokens,keywords.creditKeywords);
	this.dVerbs = matchTokens(this.tokens,keywords.debitKeywords);
	this.dateKeys = matchTokens(this.tokens,keywords.dateKeywords);
	this.months = matchTokens(this.tokens,keywords.monthsLong);
	this.sMonths = matchTokens(this.tokens,keywords.monthsShort);
}

Parser.prototype.getDesc = function(type)
{
	var startIndex = this.tokens.indexOf(this.getMoney(type));
	var endIndex = this.tokens.indexOf(this.getSecondPerson());
	var desc = "";
	
	for (var i = startIndex+1; i<endIndex; i++)
	{
		desc = desc + this.tokens[i];
	}
	console.log(desc);
	return desc;
}

Parser.prototype.getPersons = function()
{
	return this.persons;
}

Parser.prototype.getMoney= function(type)
{
	var verb = this.getVerb(type);
	return this.tokens[this.tokens.indexOf(verb)+1];
}

Parser.prototype.isFirstPersonPresent = function()
{
	console.log("check1");
	if(this.persons[0]!=this.tokens[0])
	{
		return false;
	}
	else
	{
		return true;
	}
}

Parser.prototype.getSecondPerson= function()
{
	console.log(this.persons);
	console.log(this.tokens);
	console.log(keywords.users);
	if(this.persons[0]!=this.tokens[0])
	{
		return this.persons[0];
	}
	else
	{
		return this.persons[1];
	}
}

Parser.prototype.getVerb = function(type)
{
	if(type==0)
	{
		return this.cVerbs[0];
	}
	else
	{
		return this.dVerbs[0];
	}
}

Parser.prototype.newUser = function()
{
	return this.tokens[1];
}

Parser.prototype.newUserEmail = function()
{
	console.log(this.tokens);
	return this.tokens[2];
}

Parser.prototype.getTransactionType= function()
{
	if(this.cVerbs && this.cVerbs.length>0)
	{
		return 0;
	}
	else if(this.dVerbs && this.dVerbs.length>0)
	{
		return 1;
	}
	else if(this.tokens[0]=="report")
	{
		return 2;
	}
	else if(this.tokens[0]=="add")
	{
		return 3;
	}
	else if(this.tokens[0]=="help")
	{
		return 4;
	}
	else return -1;
}

Parser.prototype.getReportMonth =function()
{
	if(this.months.length !== 0)
	{
		return keywords.monthsLong.indexOf(this.months[0]);
	}
	else if(this.sMonths.length !==0)
	{
		return keywords.monthsShort.indexOf(this.sMonths[0]);
	}
	else
	{
		return 0;
	}
}

Parser.prototype.getReportName =function()
{
	if(this.persons.length !== 0)
	{
		return this.persons[0];
	}
	else
	{
		return "";
	}
}

Parser.prototype.getDate = function()
{
	var date = new Date();
	if(this.dateKeys.length >0)
	{
		if(this.dateKeys[0]=="today")
		{
			return date;
		}
		else
		{
			var yestDate = new Date(date);
			yestDate.setDate(date.getDate()-1);
			return yestDate;
		}
	}
	var day,month;
	if(this.months.length>0)
	{
		month = keywords.monthsLong.indexOf(this.months[0])+1;
		day = this.tokens[this.tokens.indexOf(this.months[0])-1];
		day = parseInt(day);
		var newDate = new Date(date.getFullYear(),month,day,0,0,0,0);
		return newDate;
	}
	else if(this.sMonths.length>0)
	{
		month  = keywords.monthsShort.indexOf(this.sMonths[0]);
		day = this.tokens[this.tokens.indexOf(this.sMonths[0])-1];
		day = parseInt(day);
		var newDate = new Date(date.getFullYear(),month,day,0,0,0,0);
		return newDate;
	}
	else return date;
}

function matchTokens(array1,array2){
	var match =  array1.filter(function(n) {
		return array2.indexOf(n) != -1
	});
	return match;
}

module.exports = Parser;