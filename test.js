var DB = require('./index.js');

var config = {host:'', user:'', password:'', database:''};

var db = new DB(config);

var query = 'select sum(1+1) ';

db.prepare(query);

db.result = function(row){
	console.log(row);
}

db.error = function(err){
	console.log(err);
}

db.end = function(){
	console.log('end');
}

db.execute();