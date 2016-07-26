/*
* api.js is the API file.
* It uses the bot library for querying specified endpoints.
*/
var express = require('express');
var app = module.exports = express();

var members = require('../lib/bot');

/*
* '/users' endpoint get the all the users, stored in the database.
* Ex: localhost:8000/api/users
* data: [{
*    "id":2,
*    "name":"Vivek",
*    "nickName":"_Vivek_"
* }]
*/
app.get('/users', function(req, res) {
  members.getUsers()
    .then(function(result) {
      res.status(200).send({
        data: result
      });
    })
    .catch(function(err) {
      res.status(404).send({
        err: err
      });
    });
});

/*
* '/reports/:Month' is the endpoint for querying reports based on months.
* Ex: localhost:8000/api/reports/May
* data: [{
*       "id":19,
*      "paidBy_id":9,
*      "paidBy_name": "Vivek",
*      "paidTo_id":2,
*      "paidTo_name": "John",
*      "amount":1500,
*      "date":"2016-05-31
* }]
*/
app.get('/reports/:Month', function(req, res) {
  var month = req.params.Month;
  members.getReport(month)
  .then(function(result) {
    res.status(200).send({
      data: result
    });
  })
  .catch(function(err) {
    res.status(404).send({
      err: err
    });
  });
});
