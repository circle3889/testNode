var cheerio = require('cheerio');
var forEach = require('async-foreach').forEach;
var fs = require('fs');

module.exports = function(html, segment, callback)
{
	var check = {};
	var components;

	if(segment!=undefined && segment !=null && segment !='') {
		global._redis.hgetall('segment', function (err, obj) {

			components = JSON.parse(obj['{'+segment+'}']);
			forEach(Object.keys(components), function(item, index, arr){
				
				var done = this.async();
				var name = components[item];
				// console.log('segment:'+ segment+ ' |index:'+ index+ ' |item:'+ item+ ' |name:' +name);

				if(!check[name])
				{
					html = html.replace(new RegExp('<main-'+item+'>', 'g'), '<'+name+' id="'+name+'">');
					html = html.replace(new RegExp('</main-'+item+'>', 'g'), '</'+name+'>');
					fs.readFile('./views/component/' + name + '.html', 'utf-8', function(err, data)
					{
					if(err)
					{
						console.log(err);
					}
					else
					{	
						data = data.replace(new RegExp('-tmpl-'+segment+'">', 'i'), '-tmpl">');
						html = html.replace('</head>', data + '</head>');
					}
					
					done();
				});
				
				check[name] = true;
			}
			else
			{
				done();
			}
		}, function()
		{
			callback(html);
		});
	});
	}
	else
	{
		callback(html);
	}
};