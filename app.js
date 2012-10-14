
/**
* Module dependencies.
*/

var express = require("express");
var fs = require("fs");
var _ = require("./public/lib/underscore-min.js");
var app = express();


// Configuration
app.configure(function(){
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
	app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
	res.redirect("/index.html");
	/*
		 res.render('index', {
		 title: 'Express 2'
		 });
		 */
});

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

app.get('/images.json', function(req,res) {
	fs.readdir("public/pics/.", function(err,files) {
		files = _.filter(files,function(f) { return f.toLowerCase().endsWith("jpg"); })
		files = _.map(files,function(f) { return "/pics/" + f });
		res.send(JSON.stringify(files));
	});
});

var port = process.argv[2] || 3000;
app.listen(port);
