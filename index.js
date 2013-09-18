var Client = require('ftp');
var sys = require('sys')
var exec = require('child_process').exec;

var octupus =

var path = '/root/test/test';

function puts(error, stdout, stderr) { console.log(stdout) }

process.chdir(path);
exec("git status", puts);


//var c = new Client();
//c.on('ready', function() {
//	c.list(function(err, list) {
//		if (err) throw err;
//		console.dir(list);
//		c.end();
//	});
//});
//
//
//c.connect({
//	host: 'direct.schleumer.com.br',
//	port: 21,
//	user: '',
//	password: '',
//	keepalive: true
//});
