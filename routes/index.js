var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var app = express();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Bounty Web Expenses' });
});


module.exports = router;
