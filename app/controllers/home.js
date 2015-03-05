var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  report = require("../../lib/report");

module.exports = function(app) {
  app.use('/', router);
};

router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Graphs'
  });
});


router.get('/:year', function(req, res, next) {
  console.log(req.params.year)
  report.getCurrentYear(req.params.year)
    .then(function(result) {
      var data = [{
        "amount": 200,
        "name": "yashprit"
      }, {
        "amount": 100,
        "name": "ruby"
      }, {
        "amount": 20,
        "name": "brijesh"
      }]

      res.status(200).jsonp({
        data: data
      });
    })
    .catch(function(err) {
      res.status(500).json(err);
    })
});
