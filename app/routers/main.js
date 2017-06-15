module.exports = function(app)
{
	app.get('/', function(req, res, next)
	{
		req.session.destroy(function(){
 			req.session.segment;
			req.session.jsessionid;
 		}); 
		res.redirect('/login.html');
	});

	app.get('/main', function(req, res, next)
	{
		// console.log('req.session.segment: '+req.session.segment);
		if (!req.session.segment) req.session.segment = req.query.segment;
		// console.log('req.session.segment: '+req.session.segment);
		res.render('main', req.session.segment);
	});

};