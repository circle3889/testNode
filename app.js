var express = require( 'express')
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var fs = require('fs');
var ci = require('./app/libs/ComponentImporter');
var routerLoader = require(__dirname+ '/app/libs/RouterLoader');

var app = express();
app.listen( process.env.PORT || 5000);

//redis
var redisConfig = {host: '169.56.68.111', port: 19236, password: '8f05223c-1311-4fc2-b5f8-38302c679092'};
var vcapServices = process.env.VCAP_SERVICES;
if(vcapServices)
{
	vcapServices = JSON.parse(vcapServices);
	var redisService = vcapServices.Redis[0];
	if(redisService)
	{
		var credentials = redisService.credentials;
		redisConfig.host = credentials.host;
		redisConfig.port = credentials.port;
		redisConfig.password = credentials.password;
	}
}

if(redisConfig.host && redisConfig.port)
{
	var RedisStore = require('connect-redis')(session);
	var redis = require("redis");
	var client = redis.createClient(redisConfig);
	
	client.on('connect', function()
	{
		global._redis = client;
		console.log('connected!!');
	});
}
else
{
	global._redis = null;
	console.log('failed to connect!!');
	// app.use(session({ secret: 'dtlabs-system', resave: true, saveUninitialized: true, cookie: {expires: new Date(Date.now() + 60 * 60 * 2 * 1000), maxAge: 60 * 60 * 2 * 1000}}));
}

//express session 
app.use(session({
	    // store: new RedisStore({client: client}),
	secret: 'node_green',
    saveUninitialized: true,
    resave: false,
    cookie: { 
	  expires: new Date(Date.now() + 60 * 60 * 2 * 1000), 
   	  maxAge: 60 * 60 * 2 * 1000
   	}
}));

app.use(express.static( __dirname + '/public'))

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(function(req, res, next)
{
	res.render = function(name, segment)
	{

		if(name.indexOf('.html') == -1)
			name += '.html';
		
		fs.readFile(__dirname + '/views/' + name, 'utf8', function(err, data)
		{
			if(err)
			{
				res.status(500).send(err.stack);
			}
			else
			{
				res.writeHead(200, {"Content-Type" : "text/html"});
				ci(data, segment, function(html)
				{
					res.end(html);
				});
			}
		});
	};
	// }
	
	next();
});

app.use(function(err, req, res, next)
{
	console.error('=================================================');
	console.error('time : ' + new Date().toString());
	console.error('name : Exception');
	console.error('-------------------------------------------------');
	console.error(err.stack);
	console.error('=================================================');

	res.statusCode = 500;
	res.send(err.stack);
});

process.on('uncaughtException', function (err)
{
	console.error('\n\n');
	console.error('=================================================');
	console.error('time : ' + new Date().toString());
	console.error('name : UncaughtException');
	console.error('-------------------------------------------------');
	console.error(err.stack);
	console.error('=================================================\n\n');
});

routerLoader(__dirname + '/app/routers', app);