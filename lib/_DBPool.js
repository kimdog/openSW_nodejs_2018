var mysql = require("mysql");
var genericPool = require("generic-pool");

const pool = genericPool.Pool({               // Pool method를 호출해서 pool에 저장
	name : "my Connection Pool",
	max : 10,                               // 최대 10개
	min : 5,                                // 최소 5개
	log : false,                            // 로그 찍기
	create : function(callback) {
		var config = {
			host : "localhost",
			port : 3306,
			user : "root",
			password : "asdf1234",
			database : "swcamp"
		};
		var conn = mysql.createConnection(config);
		conn.connect(function(err) {        // connction 끝나고 function 호출해
			if(err) {
				console.log("Connection 생성 실패!");
			}
			callback(err,conn);             // 최소 5번
		});

	},
	destroy : function(conn) {
		conn.end();
	}

});

module.exports = pool;