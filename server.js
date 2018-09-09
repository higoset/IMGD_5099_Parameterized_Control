var http = require('http');
var path = require('path');
var express = require('express');

var app = express();

app.use(express.static('src'));

app.get('/', function (req, res) {
	var pathname = req.url;

	if(pathname === '/'){
		pathname = '/index.html'
	}

	res.sendFile(path.join(__dirname + pathname));
});

app.listen(9020);

