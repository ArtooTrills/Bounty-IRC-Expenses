var mysql = require('mysql');
var config = require('../../config/config');

var conn = config.conn;
conn.query('CREATE TABLE transactions_db ( id int(11) NOT NULL AUTO_INCREMENT,paidBy_id int(11) NOT NULL,
  paidBy_name varchar(55) DEFAULT NULL,
  paidTo_id int(11) NOT NULL,
  paidTo_name varchar(55) DEFAULT NULL,
  amount int(10) DEFAULT NULL,
  date date DEFAULT NULL,
  PRIMARY KEY (id),
  KEY paidBy_id (paidBy_id),
  KEY paidTo_id (paidTo_id),
  CONSTRAINT transactions_db_ibfk_1 FOREIGN KEY (paidBy_id) REFERENCES members_db (id),
  CONSTRAINT transactions_db_ibfk_2 FOREIGN KEY (paidTo_id) REFERENCES members_db (id)
)',function(err, result) {
  if(err) {
    console.log('Error' + err);
  } else {
    console.log('Table created');
  }
});
