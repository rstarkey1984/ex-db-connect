var mysql = require('mysql');

var DB = module.exports = function(/* config */){
	var args = [].slice.call(arguments);
	if (args.length === 1) this.config = args[0];
	
	if (this.config['connectTimeout'] == undefined) this.config['connectTimeout'] = 60000;
}

DB.prototype = {

	config : {host:'', user:'', password:'', database:''},
	connection : null,
	query : '',
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
		var connection = mysql.createConnection(this.config);
		/*this.connection.connect(function(err) {
			if (err !== null){
				console.log(err);
			}
		});*/

		connection.config.queryFormat = function (query, values) {
			if (!values) return query;
			return query.replace(/\:(\w+)/g, function (txt, key) {
				if (values.hasOwnProperty(key)) {
					return this.escape(values[key]);
				}
				return txt;
			}.bind(this));
		};

		var rs = connection.query(this.query, this.params);
		
		if ('function' == typeof this.error) rs.on('error', this.error);
		if ('function' == typeof this.result) rs.on('result', this.result);
		if ('function' == typeof this.end) rs.on('end', this.end);

		connection.end();
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