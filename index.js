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
		this.error = function(err){ console.log(err); };
		this.result = function(row){};
		this.end = function(){};

		this.connection = mysql.createConnection(this.config);
		this.connection.connect(function(err) {
			if (err !== null){
				console.log(err);
			}
		});

		this.connection.config.queryFormat = function (query, values) {
			if (!values) return query;
			return query.replace(/\:(\w+)/g, function (txt, key) {
				if (values.hasOwnProperty(key)) {
					return this.escape(values[key]);
				}
				return txt;
			}.bind(this));
		};

		this.error = this.d_error;
		this.result = this.d_result;
		this.end = this.d_end;
	},
	d_error : function(err){ console.log(err); },
	d_result : function(row){},
	d_end : function(){},
	error : function(err){ console.log(err); },
	result : function(row){},
	end : function(){}, // 여기서 this 는 connection 임
	execute : function(/* query, params */){
		var rs = this.connection.query(this.query, this.params);
		
		rs.on('error', this.error);
		rs.on('result', this.result);
		rs.on('end', this.end); // 여기서 this 는 DB 객체

		this.connection.end();
	},
	build_insert_query : function(table, param){

		var query = 'insert into ' + table + ' (';
		for (var key in param){
			query += key+',';
		}
		query = query.substr(0, (query.length-1)) + ') values (';
	
		for (var key in param){
			query += ':'+key+',';
		}

		query = query.substr(0, (query.length-1)) + ') ';

		return query;
		
	}

}