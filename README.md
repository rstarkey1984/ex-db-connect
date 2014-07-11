# ex-db-connect -- Simple db connect

# Install
	
	$ npm install mysql ex-db-connect

# Simple Example

	var config = {host:'', user:'', password:'', database:''};

	var db = new DB(config);

	db.prepare('select sum(1+1) ');

	db.result = function(row){
		console.log(row);
	};

	db.end = function(){
		console.log('end');
	};
	
	db.execute();

# Easy Make Insert Query

	var config = {host:'', user:'', password:'', database:''};

	var db = new DB(config);

	var param = {};
	param['table column name'] = '1';
	param['table column name'] = '2';
	param['table column name'] = '3';
	param['table column name'] = '4';
	param['table column name'] = '5';

	var func_param = {}; // mysql function used
	func_param['table column name'] = 'now()';

	var query = db.build_insert_query('table_name', param, func_param);

	db.prepare(query, param);
	db.result = function(row){
		console.log(row);
	};
	db.execute();

# bind params

	var config = {host:'', user:'', password:'', database:''};

	var db = new DB(config);
	
	// select query
	var param = {};
	param['idx'] = 1;

	var query = 'select * from user where idx = :idx ';

	db.prepare(query, param);
	db.result = function(row){
		console.log(row);
	};
	db.execute();
	
	// update query
	var param = {};
	param['idx'] = 1;
	param['test'] = '123';

	var query = 'update user set test = :test where idx = :idx ';

	db.prepare(query, param);
	db.result = function(row){
		console.log(row);
	};
	db.execute();