var DB = require('./index.js');

var feedons_config = {host:'', user:'', password:'', database:''};

var db = new DB(feedons_config);

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