var Client = require('ftp');
var sys = require('sys')
var exec = require('child_process').exec;
var test = require('./test');
var walk = require('walk');
var path = require('path');
var fs = require('fs');
var _ = require('underscore');
var str = require('underscore.string');

var octopus = {
	path: path.normalize('/var/www/node-guiadolugar/'),
	remotePath: 'test/',
	branch: 'master',
	dest: 'origin',
	files: []
}

octopus.init = function(){
	function mkfile(c, source, file, callback){
		var path = null;
		if(file.toString().indexOf('/') !== -1){
			sfile = file.split('/');
			sfile.pop();
			path = sfile.join('/');
		}
		function put(file){
			c.put(source, file, callback)
		}
		if(path){
			c.mkdir(path, true, function(err){
				put(file);
			});
		}else{
			put(file);
		}
	}


	var c = new Client();
	c.on('ready', function() {
		c.get('.last-deploy', function(err, stream){
			if(!err){
				var version = '';
				stream.on('data', function (chunk) {
					version += chunk;
				});
				stream.on('end', function(){
					console.log(version);
				});
			}else{
				var walker  = walk.walk(octopus.path, { followLinks: false });
				walker.on('file', function(root, stat, next) {
					var fileName = stat.name;
					var trueRoot = (root.replace(octopus.path,'') + path.sep + fileName).replace(/^\/|^\\/g,'');
					var pathname = path.join(root, fileName);
					if(!/^\/?\.git\//.test(trueRoot)){
						mkfile(c, pathname, trueRoot, function(err){
						if(!err){
							//console.log(trueRoot + ' enviado');
							process.stdout.write(str.pad("\nenviado: " + trueRoot, 100, ' '));
						}else{
							console.log("\n", stat, trueRoot, err, ' não enviado\n');
						}
						next();
					});
					}else{
						next();
					}
				});
				walker.on('end', function(){
					c.end();
				});
			}
		});
	});
	c.connect({
		host: test.host,
		port: 21,
		user: test.user,
		password: test.password,
		keepalive: true
	});
}




process.chdir(octopus.path);
exec("git reset --hard", function(){
	exec("git pull "+ octopus.dest + " " + octopus.branch, function(){
		octopus.init();
	});
});

