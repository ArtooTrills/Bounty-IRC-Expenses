/*
* bot.js is the library file, which deals with read/write databse.
*/
var irc = require('irc');
var mysql = require('mysql');
var async = require('async');
var transaction = require('./transaction.js');
var report = require('./report-date.js');
var config = require('../../config/config');
var Promise = require('bluebird');

//create databse connection from config file
var conn = config.conn;

module.exports = {
  /*
  *
  * getUsers fetches all the members stored in the database. It is a endpoint for Controller files
  * Endpoint : localhost:8000/api/users
  *
  */
  getUsers: Promise.method(function() {
    return new Promise(function(resolve, reject) {
      conn.query('SELECT * FROM members_db', function(err, rows) {
        if (err) {
          return reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }),

  /*
  *
  * getReport fetches report based on month.
  * Endpoint: localhost:8000/api/reports/May
  *
  * Note: Month must start with capital letter
  *
  */
  getReport: Promise.method(function(month) {
    var m = report(month);
    return new Promise(function(resolve, reject) {
      conn.query('SELECT * from transactions_db WHERE MONTH(date) = ?', m, function(err, rows) {
        if(err) {
          return reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }),

  /*
  *
  * checkUser checks for existin users in the databse.
  *
  */
  checkUser: function(user) {
    conn.query('SELECT id FROM members_db WHERE name = ?', user, function(err, rows) {
      if(err) {
        return 'Error' + err;
      } else if(rows.length > 0) {
        return ;
      } else {
        var member = {
          name: user,
          nickName: '_' + user + '_'
        };
        conn.query('INSERT INTO members_db SET ?', member, function(err, res) {
          if(err) {
            return 'Error' + err;
          } else {
            return 'User created';
          }
        });
      }
    });
  },

  /*
  *
  * addUser is the library for command 'addm'.
  * It takes the username as argument and creates a new user
  *
  */
  addUser: function(cmd) {
    var member = {
      name: cmd.split(' ')[2],
      nickName: '_' + cmd.split(' ')[2] + '_'
    };
    conn.query('SELECT id FROM members_db WHERE name = ?', member.name, function(err, rows) {
      if(err) {
        return 'Error' + err;
      } else if(rows.length > 0) {
        return 'User Exists';
      } else {
        conn.query('INSERT INTO members_db SET ?', member, function(err, res) {
          if(err) {
            return 'ERROR' + err;
          } else {
            return 'New User' + member.name + 'added';
          }
        });
      }
    });
  },

  /*
  *
  * transaction adds new transactions to the database.
  * It is the library for command 'addt'.
  *
  */
  transaction : function(cmd, from) {

    var transactionDetails = transaction(cmd);
    console.log('trenascation date', transactionDetails.date);

    //payee
    var splitCmd = cmd.split(/\@/);
    var splitPayee = splitCmd[1].split(' ');
    var payee = splitPayee[0];
    async.waterfall([
      function getFromAndTo(callback) {
        async.parallel({
          getFrom: function(cb) {
            conn.query('SELECT id, name FROM members_db WHERE name = ?', from, function(err, rows) {
              if(err) {
                console.log('Error' + err);
                return cb('Error' + err);
              } else if(rows.length > 0) {
                console.log('User found' + rows[0].id);
                return cb(null, rows[0].id, rows[0].name);
              } else {
                console.log('User not found');
                return cb(null, null);
              }
            });
          },
          getPayee: function (cb) {
            conn.query('SELECT id, name FROM members_db WHERE name = ?', payee, function(err, rows) {
              if(err) {
                console.log('Error' + err);
                return cb('Error' + err);
              } else if(rows.length > 0) {
                console.log('User found' + rows[0].id, rows[0].name);
                return cb(null, rows[0].id, rows[0].name);
              } else {
                console.log('User not found', rows.length);
                return cb(null, null);
              }
            });
          }
        }, function(err, users) {
          if (err) {
            return callback(err);
          } else if(users.getPayee === null) {
            return callback(null, null);
          } else{
            return callback(null, users);
          }
        });
      },
      function addExpenses(users, callback) {
        if(users !== null) {
          if (cmd.indexOf('paid') > -1) {
            var paidBy_id = users.getFrom[0];
            var paidBy_name = users.getFrom[1];
            var paidTo_id = users.getPayee[0];
            var paidTo_name = users.getPayee[1];
            var transaction = {
              paidBy_id: paidBy_id,
              paidBy_name: paidBy_name,
              paidTo_id: paidTo_id,
              paidTo_name: paidTo_name,
              amount: transactionDetails.amt,
              date: transactionDetails.date
            };
            conn.query('INSERT INTO transactions_db SET ?', transaction, function(err, res) {
              if (err) {
                console.log('Error' + err);
                return callback(err);
              } else {
                console.log('Transaction added');
                return callback('Transaction Added');
              }
            });
          } else if((cmd.indexOf('owe') > -1) || (cmd.indexOf('owes')) > -1) {
            var pBy_id = users.getPayee[0];
            var pBy_name = users.getPayee[1];
            var pTo_id = users.getFrom[0];
            var pTo_name = users.getFrom[1];
            var trans = {
              paidBy_id: pBy_id,
              paidBy_name: pBy_name,
              paidTo_id: pTo_id,
              paidTo_name: pTo_name,
              amount: transactionDetails.amt,
              date: transactionDetails.date
            };
            conn.query('INSERT INTO transactions_db SET ?', trans, function(err, res) {
              if (err) {
                console.log('Error' + err);
                return err;
              } else {
                console.log('Transaction added');
                return callback('Transaction Added');
              }
            });
          }
        } else {
          return callback('User not found');
        }
      }
    ]);
  },

  /*
  *
  * report is the library for 'report' command.
  * Currently is generates reports based on the month given
  *
  * Note: Use capital letter for Months.
  * Ex: @bot report July
  *
  */
  report: new Promise.method(function(cmd) {
    var month = report(cmd);
    return new Promise(function(resolve, reject) {
      conn.query('SELECT * from transactions_db WHERE MONTH(date) = ?', month, function(err, rows) {
        if (err) {
          console.log('Error', err);
          reject(err);
        } else {
          var data = [];
          for(var i=0; i<rows.length; i++) {
            data.push(rows[i].paidBy_name,rows[i].paidTo_name,rows[i].amount,rows[i].date);
            console.log('Transactions report', data);
          }
          resolve('Report'+ data);
        }
      });
    });
  })
};
