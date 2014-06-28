var DB = require('./index.js');

process.on('uncaughtException', function (err) {
	console.log('Caught exception: ' + err);
});

var config = {host:'', user:'', password:'', database:''};

(work_process = function(){
	var db = new DB(config);

	var query = '';

	db.prepare(query);

	db.result = function(row){
		console.log(row);
	}

	db.end = function(){
		console.log('end');
		work_process();
	}

	db.execute();
})();