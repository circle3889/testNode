var request = require('request');
module.exports = function(app)
{
    app.all('/bff/:api', function(req, res, next)
	{
        var headers = '';
		if (req.session.jsessionid) headers = req.session.jsessionid;
		// console.log("req.session.jsessionid: " +req.session.jsessionid);
		// console.log("req.params.api: "+ req.params.api);

		request({
            url: "https://twdbff-branny-cabalist.sk.kr.mybluemix.net/"+req.params.api,
            method: "post",
			form:req.query,
            headers: {'cookie' : req.session.jsessionid},
            followRedirect:true
        },
        function(error, response, body){
			// console.log("api body:"+ body);
			if (!req.session.jsessionid){
				for(var i=0; i<response.headers['set-cookie'].length; i++)
				{
					if(response.headers['set-cookie'][i].indexOf('SESSION') != -1)
					{
						req.session.jsessionid = response.headers['set-cookie'][i];
						break;
					}
				}
			}
            res.end(body);
        });
	});
}