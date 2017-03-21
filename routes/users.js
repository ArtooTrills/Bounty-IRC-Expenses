var express = require('express');
var router = express.Router();
var db;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
MongoClient.connect('mongodb://test:test@ds127300.mlab.com:27300/webexpenses', function(err, database) {
    if (err) return console.log(err)
  	db = database;
		//console.log(db);
});

/* GET users listing. */
/*router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});*/

// expenses command apis
router.post('/:text', textMessage);

function textMessage(req, res, next){
	var text = req.params.text;
	var stringTxt = text.toLowerCase();	
    var textVal = stringTxt.split(" ");
    

	// add user username
    if((textVal[0] == "add") && (textVal[1] == "user") ){
     	var userName = textVal[2];
    	if(typeof(userName) !== undefined && (typeof(textVal[2]) === "string")){

    		var data = { name : textVal[2] }

    		db.collection('users').insert(data, function(err, results){
			if(err) return err;
			return res.send({status: 'User created', data:results});
			});
    	} else {
  				return res.send({status: 'Please add username'}); 
  			}    	
    } 

	//delete user username
    else if((textVal[0] == "delete") && (textVal[1] == "user")){
    	if((typeof(textVal[2]) !== undefined) && (typeof(textVal[2]) === "string")){

    		var data =  textVal[2];

    		db.collection('users').findOneAndDelete({name: data}, function(err, results) {
    		if (err) return next(err);

    			return res.send({status: 'User Deleted', data:results});
  			});
    	}else {
  				return res.send({status: 'Please add username'}); 
  			}
    }
    

	//user expenses (paid 600 for dinner)
    else if(textVal[0] == "paid") {
    	var amt = text.match(/\d+/g); 
    	var today = new Date();

    	if((textVal[1] == amt[0])){

    		var data =  {
    			amount: amt[0],
    			desc : textVal[3],
    			date : today
        		}

    		db.collection('expenses').insert(data, function(err, results) {
    		if (err) return next(err);

    			return res.send({status: 'Transaction recorded', data:results});
  			});
    	}else {
  				return res.write({status: 'Oops you missed something'}); 
  			}  
    }

    //user expenses (user paid 600 for dinner)
    else if((textVal.length != 1) && (textVal[1] == "paid")){  
    	db.collection('users').find({name:textVal[0]}).toArray(function(err, results){
			if(err) return next(err);		

			var userID = results[0]._id;
			var amt = text.match(/\d+/g); 
			var today = new Date();

			if(results != ''){
			var data = {
    					amount: amt[0],
    					desc : textVal[4],
    					userId : ObjectId(userID),
    					date : today
    				  }

    				db.collection('expenses').insert(data, function(err, results) {
    				if (err) return next(err);

    					return res.send({status: 'Transaction recorded', data:results});
  					});  

  			} else {
  				return res.write({status: textVal[0] +' not found'}); 
  			}  		
		});	
    }

   //user expenses (total)
    else if(textVal[0] == "total"){ 	
    	db.collection('users').find().toArray(function(err, results){
				if(err) return next(err);

				var userCount = results.length;

				db.collection('expenses').find({}, {"amount":1, "date":1}).toArray(function(err, results){
					if(err) return next(err);
			
					var totalamt = results.reduce(function(prevVal, elem) {return prevVal + Number(elem.amount);}, 0);		
					var average = totalamt/userCount;

					return res.send({status: 'Total Amt '+ totalamt, data:results});				
				});				
		}); 	

	}

	else {
		return res.write('Oops you missed something');
	}
}


module.exports = router;
