var RemoteState = require('../models/remoteState.js');
var $ = require('jquery');
var http = require('http');

exports.getStates = function(req, res) {
	RemoteState.find(function (err, remoteStates) {

		remoteStates.forEach(function (remoteState) {
			res.write(remoteState.name + ": " + remoteState.val + "\n");
		});

		res.end();
	});
}

exports.getState = function(req, res) {
	RemoteState.findOne({"name": req.params.name}, function (err, remoteState) {
		if (remoteState == null) {
			res.send("Didn't find anything!\n");
		}
		else {
			res.send(remoteState.name + ": " + remoteState.val + "\n");
		}
	});
}

exports.setState = function(req, res) {
	RemoteState.findOne({name: req.params.name}, function(err, remoteState) {
		if (remoteState == null) {
			var remoteState = new RemoteState({name: req.params.name, val: req.params.val});
		}
		else {
			remoteState.val = req.params.val;
		}
		
		remoteState.save();
		res.send('Saved!\n');
	});
}

// Plex movies!
exports.getPlexMovies = function(req, res) {
	var options = {
		host: req.params.serverIp,
		port: '32400',
		path: '/library/sections'
	};

	var sectionsCallback = function(response) {
	  	var str = '';

	  	//another chunk of data has been recieved, so append it to `str`
	  	response.on('data', function (chunk) {
	    	str += chunk;
	  	});

	  	//the whole response has been recieved, so we just print it out here
	  	response.on('end', function () {
	    	//console.log(str);

		    $(str).find('Directory').each(function() {
				if ($(this).attr('title') == req.params.sectionName) {
					options = {
						host: req.params.serverIp,
						port: '32400',
						path: '/library/sections/' + $(this).attr('key') + '/all'
					};

					http.request(options, moviesCallback).end();
				}
			});
		});
	}

	var moviesCallback = function(response) {
		var str = '';

	  	//another chunk of data has been recieved, so append it to `str`
	  	response.on('data', function (chunk) {
	    	str += chunk;
	  	});

	  	//the whole response has been recieved, so we just print it out here
	  	response.on('end', function () {
	  		var onMovie = 0;
	  		var trueOnMovie = 0;

	    	$(str).find('Video').each(function() {
	    		onMovie++;
	    		if (onMovie > (req.params.pageNumber - 1) * req.params.perPage) {
	    			trueOnMovie++;

	    			if (trueOnMovie <= req.params.perPage) {
			    		var playUrl = '';

						$(this).find('Media').each(function() {
							$(this).find('Part').each(function() {
								playUrl = $(this).attr('key');
							});
						});

						if (playUrl != undefined && playUrl != '') { // Sanity check to make sure we are not getting something we don't want
	    					res.write('Movie ' + trueOnMovie + ' Title:' + $(this).attr('title') + '\n');
	    					res.write('Movie ' + trueOnMovie + ' Cover:' + 'http://' + req.params.serverIp + ":32400" + $(this).attr('thumb') + '\n');
	    					res.write('Movie ' + trueOnMovie + ' URL:' + 'http://' + req.params.serverIp + ":32400" + playUrl + '\n');
						}
					}
					else {
						console.log("Someone pulled movies!");
						res.end();
						return false;
					}
				}
	    	});

	    	res.end();
	    });
	  }

	http.request(options, sectionsCallback).end();
}