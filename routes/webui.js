var express = require('express');
var router = express.Router();
var Expense = require('../models/models').Expense;
var async = require('async');
var report = require('../sheets/report');
var keywords = require('../keywords/keywords');

router.get('/search', function(req, res) {
	console.log("inside search");
	var personName="";
	var monthName="";
	var index=1;
	var query = {};
	if(req.query.personName){
		query.personName = req.query.personName;
		personName= req.query.personName;
	}
	if(req.query.monthName){
		query.monthName = req.query.monthName;
		monthName = req.query.monthName;
		index = keywords.monthsLong.indexOf(monthName)+1;
	}
	console.log("*******************************"+index);
	query = report.getQuery(index,personName);
	console.log(query);
	var pageno = 1;
	if(req.query.page){
		pageno = parseInt(req.query.page);
	}
	
Expense.find({$or :query},function(err,doc){
		if(err)
		{
			res.render('error');
		}
		if(doc)
		{
			console.log("no of reult is ----------------------------"+doc.length);
			res.render('webui',{users:keywords.members, months:keywords.monthsLong, result:doc.slice((pageno-1)*10,(pageno-1)*10+10),totalPages : doc.length/10 })
		}
	});
});

router.get('/', function(req, res) {
	var personName="";
	var monthName="";
	var query = {};
	query = report.getQuery();
	var pageno = 1;
	Expense.find({},function(err,doc){
		if(err)
		{
			res.render('error');
		}
		if(doc)
		{
			res.render('webui',{users:keywords.members, months:keywords.monthsLong, result:doc.slice((pageno-1)*10,(pageno-1)*10+10),totalPages : doc.length/10 })
		}
	});
});


module.exports = router;
