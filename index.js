var mysql = require('mysql');
var debug = function() {};

var DB = module.exports = function(/* config */){
	var args = [].slice.call(arguments);
	if (args.length === 1) this.config = args[0];
	this.debug = args[1] === undefined ? false : args[1];
	if (this.config['connectTimeout'] == undefined) this.config['connectTimeout'] = 60000;

	if (this.debug){
		try {
			debug = require('debug')('db-ex-connect');
		}
		catch (e) {
			console.log("Notice: 'debug' module is not available. This should be installed with `npm install debug` to enable debug messages", e);
			debug = function() {};
		}
	}
}

DB.prototype = {

	config : {host:'', user:'', password:'', database:''},
	connection : null,
	query : '',
	retry : 5,
	prepare : function(/* query, params */){
		var args = [].slice.call(arguments);
		this.query = args[0];
		this.params = args[1];
		this.error = null;
		this.result = null;
		this.end = null;
	},
	d_error : function(err){ console.log(err); },
	d_result : function(row){},
	d_end : function(){},
	error : null,
	result : null,
	end : null, // 여기서 this 는 connection 임
	execute : function(/* query, params */){
		var data = {};
		data['query'] = this.query;
		data['params'] = this.params;
		data['error'] = this.error;
		data['result'] = this.result;
		data['end'] = this.end;
		data['retry'] = this.retry;
		data['debug'] = this.debug;
		data['connect_cnt'] = 0;
		this.connect(data);
	},
	connect:function(data){

		var connection = mysql.createConnection(this.config);

		connection.config.queryFormat = function (query, values) {
			if (!values) return query;
			return query.replace(/\:(\w+)/g, function (txt, key) {
				if (values.hasOwnProperty(key)) {
					return this.escape(values[key]);
				}
				return txt;
			}.bind(this));
		};

		var thisEl = this;
		connection.connect(function(err) {
			data['connect_cnt']++;

			if (err !== null){
				var date = new Date();
				debug('error connect sql : ' + data['query'] + ' date : ' + date);
				debug(err);
				if (data['connect_cnt'] < data['retry']){
					setTimeout(function(){
						debug('reconnect sql : ' + data['query'] + ' date : ' + date);
						thisEl.connect(data);
					}, 1000);
				}else{
					debug('connect error sql : ' + data['query'] + ' retry : ' + data['connect_cnt'] + ' date : ' + date);
					if ('function' == typeof data['error']) data['error'].apply(this, [err]);
					if ('function' == typeof data['end']) data['end'].apply();
				}
			}else{
				var rs = connection.query(data['query'], data['params']);
		
				if ('function' == typeof data['error']) rs.on('error', data['error']);
				if ('function' == typeof data['result']) rs.on('result', data['result']);
				if ('function' == typeof data['end']) rs.on('end', data['end']);
			}

			connection.end();
		});

	},
	build_insert_query : function(table, param, func_params){

		var query = 'insert into ' + table + ' (';
		for (var key in param) query += key+',';
		for (var key in func_params) query += key+',';

		query = query.substr(0, (query.length-1)) + ') values (';
	
		for (var key in param) query += ':'+key+',';
		for (var key in func_params) query += func_params[key]+',';

		query = query.substr(0, (query.length-1)) + ') ';

		return query;
		
	}

}