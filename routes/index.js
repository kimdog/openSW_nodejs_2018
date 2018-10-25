
module.exports = function(app) 
{
	controller = require("../controller/index");
	
	// check duplicate id
	app.post('/api/checkid', function(req, res) {
		
		controller.checkid(req, res);
	});
	
	// sign up
	app.post('/api/signup', function(req, res) {
		
		controller.signup(req, res);
	});
	
	// sign in
	app.post('/api/signin', function(req, res) {
		
		controller.signin(req, res);
	});
	
	// user's MOIM
	app.post('/api/moims', function(req, res) {
		
		controller.getmoims(req, res);
	});
	
	// one MOIM
	app.post('/api/moim', function(req, res) {
		controller.getmoim(req, res);
	});
	
	
};