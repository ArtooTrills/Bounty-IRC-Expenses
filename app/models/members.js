var mysql = require('mysql');
var config = require('../../config/config');

var conn = config.conn;

conn.query('CREATE TABLE `members_db` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `nickName` varchar(55) DEFAULT NULL,
  PRIMARY KEY (`id`)
)',function(err, result) {
  if(err) {
    console.log('Error' + err);
  } else {
    console.log('Table created');
  }
});
