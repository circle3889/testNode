var fs = require('fs');
// var request = require('request');

(function()
{
	var loader = function(dir, app)
	{
		var files = fs.readdirSync(dir);
		
		for(var i=0; i<files.length; i++)
		{
			if(fs.lstatSync(dir + '/' + files[i]).isDirectory())
			{
				loader(dir + '/' + files[i], app);
			}
			else
			{
				if(dir.lastIndexOf("routers") != dir.length-7 || files[i].lastIndexOf(".js") == -1){
				// if(dir.lastIndexOf("routers") != dir.length-7 || files[i].lastIndexOf(".js") == -1){

					continue;
				}
				
				var router = require(dir + '/' + files[i]);
				router(app);
			}	
		}
	};
	
	module.exports = loader;
})();