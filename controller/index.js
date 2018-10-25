var pool = require('../lib/_DBPool');
var mysql = require('mysql');

// 암호화
var crypto = require('crypto');
var hashPw = 'mypassword';

// 아이디 중복여부
exports.checkid = function(req, res) {
	pool.acquire(function(err, conn) {
		if(err) {
			console.log("connection 획득 실패!");
		}
		else {
			var sql = "select * from user where id = ?";
			var id = req.body.id;
			var params = [
				id	
			];
			
			sql = mysql.format(sql, params);			
			console.log(sql);
			conn.query(sql, function(err, result, fields) {
				if(err) {
					console.log("Query 문제");
					res.json([{errorCode : "0005"}]);
				}
				else {
					if( result === undefined || result.length == 0 ) {	
						// 중복 없음
						res.json([{errorCode : "Y"}]);
					}
					else {
						
						res.json([{errorCode : "0003"}]);	
					}
					
					
				}
			});
		}
	});
};

// 회원가입
exports.signup = function(req, res) {	
	pool.acquire(function(err, conn) {
		if(err) {
			console.log("connection 획득 실패!");
		}
		else {
			var sql = "insert into user(id, pw, name, phone, passYn) values(?, ?, ?, ?, ?)";
			
			var id = req.body.id;
			var pw = req.body.pw;
			var name = req.body.name;
			var phone = req.body.phone;
			var passYn = 'Y'; // 승인 여부 승인
			
			// 패스워드 암호화
			var hmac = crypto.createHmac('sha256', hashPw);
			pw = hmac.update(pw).digest('hex');
			
			var params = [
				id,
				pw,
				name,
				phone,
				passYn
			];
			
			sql = mysql.format(sql, params);		
			console.log(sql);
			conn.query(sql, function(err, row, cols) {
				if(err) {
					console.log("Query error");
					conn.rollback(function() {
						throw err;
					});
					// error 코드
					return res.json([{errorCode : "N"}]);
				}
				
				conn.commit(function(err) {
					if(err) {
						conn.rollback(function() {
							throw err;
						});
					}
					console.log("commit Complete!");
				});
				pool.release(conn);
				res.json([{errorCode : "Y"}]);
				
			});
		}
	});
};

// 로그인
exports.signin = function(req, res) {
	pool.acquire(function(err, conn) {
		if(err) {
			console.log("connection 획득 실패!");
		}
		else {
			
			var sql = "select uid, name, phone, passYn, posid, profile_id from user where id=? and pw=?";
			var id = req.body.id;
			var pw = req.body.pw;
			
			// 패스워드 암호화
			var hmac = crypto.createHmac('sha256', hashPw);
			pw = hmac.update(pw).digest('hex');

			var params = [
				id,
				pw
			];
			
			sql = mysql.format(sql, params);
			console.log(sql);
			conn.query(sql, function(err, result, fields) {
				if(err) {
					console.log("Query 문제");
				}
				else {
					if( result === undefined || result.length == 0 ) {	
						// 중복 없음
						res.json([{errorCode: "0001"}]);
					}
					else {
						
						res.json(result);
					}
					
				}
			});
		}
	});
};


// 유저 한명의 모임들
exports.getmoims = function(req, res) {
	pool.acquire(function(err, conn) {
		if(err) {
			console.log("connection 획득 실패!");
		}
		else {
			
			var sql = "SELECT " +
						"M.mid, M.mname, M.pid, M.range, M.cate_id, M.pic_id, " +
						"P.pname, C.cate_name, PIC.url, " +
						"POS.lon, POS.lat " +
					"FROM " +
						"m_to_u MU " +
						"JOIN user U ON U.uid = MU.uid " +
						"JOIN moim M ON M.mid = MU.mid " +
						"LEFT JOIN place P ON P.pid = M.pid " +
						"LEFT JOIN category C ON C.cate_id = M.cate_id " +
						"LEFT JOIN picture PIC ON PIC.pic_id = M.pic_id " +
						"LEFT JOIN pos POS ON POS.posid = P.posid " +
					"WHERE " +
						"MU.uid = ? ";
				
			var uid = req.body.uid;
			var params = [
				uid	
			];
			
			sql = mysql.format(sql, params);
			console.log(sql);
			conn.query(sql, function(err, result, fields) {
				if(err) {
					console.log("Query 문제");
				}
				else {
					if( result === undefined || result.length == 0 ) {	
						
						res.json([{isEmpty: "Y"}]);
					}
					else {
						
						res.json(result);
					}
				}
			});
			
			
		}
	});
};


// 한 모임에 대한 유저들 정보
exports.getmoim = function(req, res) {
	pool.acquire(function(err, conn) {
		if(err) {
			console.log("connection 획득 실패!");
		}
		else {
			
			var sql = "SELECT " +
						"U.uid, U.id, U.name, U.phone, " +
						"P.lon, P.lat, P.time, " +
						"PF.comment " +
					"FROM " + 
						"m_to_u MU " +
						"JOIN user U ON U.uid = MU.uid " +
						"LEFT JOIN pos P ON P.posid = U.posid " +
						"LEFT JOIN profile PF ON PF.profile_id = U.profile_id " +
					"WHERE " +
						"MU.mid = ? " +
						"AND U.passYn = 'Y' ";
			
			var mid = req.body.mid;
			var params = [
				mid	
			];
			
			sql = mysql.format(sql, params);
			console.log(sql);
			conn.query(sql, function(err, result, fields) {
				if(err) {
					console.log("Query 문제");
				}
				else {					
					if( result === undefined || result.length == 0 ) {	
						
						res.json([{isEmpty: "Y"}]);
					}
					else {
						
						res.json(result);
					}
				}
			});
		}
	});
};


// insert, select 포맷
exports.fooormaat = function(req, res) {
	pool.acquire(function(err, conn) {
		if(err) {
			console.log("connection 획득 실패!");
		}
		else {
			
			// do it ! data
			
			var sql = "select * from user where id = ?";
			var id = req.body.id;
			var params = [
				id	
			];
			
			sql = mysql.format(sql, params);
			
			// do it ! select
			conn.query("select * from user", function(err, result, fields) {
				if(err) {
					console.log("Query 문제");
				}
				else {
					res.send("list", {
						result : result
					});
				}
			});
			
			// do it ! insert
			conn.query(sql, function(err, row, cols) {
				if(err) {
					console.log("Query error");
					conn.rollback(function() {
						throw err;
					});
					// error 코드
					return res.json([{errorCode : "0003"}]);
				}
				
				conn.commit(function(err) {
					if(err) {
						conn.rollback(function() {
							throw err;
						});
					}
					console.log("commit Complete!");
				});
				pool.release(conn);
				
			});
		}
	});
};
	
	