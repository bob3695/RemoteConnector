var $ = require('jquery');
var http = require('http');


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
	    					res.write('Item ' + trueOnMovie + ' Title:' + $(this).attr('title') + '\n');
	    					res.write('Item ' + trueOnMovie + ' Cover:' + 'http://' + req.params.serverIp + ":32400" + $(this).attr('thumb') + '\n');
	    					res.write('Item ' + trueOnMovie + ' URL:' + 'http://' + req.params.serverIp + ":32400" + playUrl + '\n');
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

exports.getPlexTVShows = function (req, res) {
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

					http.request(options, showsCallback).end();
				}
			});
		});
	}

	var showsCallback = function(response) {
		var str = '';

	  	//another chunk of data has been recieved, so append it to `str`
	  	response.on('data', function (chunk) {
	    	str += chunk;
	  	});

	  	//the whole response has been recieved, so we just print it out here
	  	response.on('end', function () {
	  		var onShow = 0;
	  		var trueOnShow = 0;

	    	$(str).find('Directory').each(function() {
	    		onShow++;
	    		if (onShow > (req.params.pageNumber - 1) * req.params.perPage) {
	    			trueOnShow++;

	    			if (trueOnShow <= req.params.perPage) {
						//if (playUrl != undefined && playUrl != '') { // Sanity check to make sure we are not getting something we don't want
	    					res.write('Item ' + trueOnShow + ' Title:' + $(this).attr('title') + '\n');
	    					res.write('Item ' + trueOnShow + ' Cover:' + 'http://' + req.params.serverIp + ":32400" + $(this).attr('thumb') + '\n');
	    					res.write('Item ' + trueOnShow + ' URL:' + $(this).attr('ratingKey') + '\n');
						//}
					}
					else {
						console.log("Someone pulled tv shows!");
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

exports.getPlexTVSeasons = function (req, res) {
	var options = {
		host: req.params.serverIp,
		port: '32400',
		path: '/library/metadata/' + req.params.ratingKey + '/children'
	};
console.log("I am here!");
	var showsCallback = function(response) {
		var str = '';

	  	//another chunk of data has been recieved, so append it to `str`
	  	response.on('data', function (chunk) {
	    	str += chunk;
	  	});

	  	//the whole response has been recieved, so we just print it out here
	  	response.on('end', function () {
	  		var onSeason = 0;
	  		var trueOnSeason = 0;

	    	$(str).find('Directory').each(function() {
	    		onSeason++;
	    		if (onSeason > (req.params.pageNumber - 1) * req.params.perPage) {
	    			if ($(this).attr('title') != 'All episodes') {
		    			trueOnSeason++;

		    			if (trueOnSeason <= req.params.perPage) {
							//if (playUrl != undefined && playUrl != '') { // Sanity check to make sure we are not getting something we don't want
		    					res.write('Item ' + trueOnSeason + ' Title:' + $(this).attr('title') + '\n');
		    					res.write('Item ' + trueOnSeason + ' Cover:' + 'http://' + req.params.serverIp + ":32400" + $(this).attr('thumb') + '\n');
		    					res.write('Item ' + trueOnSeason + ' URL:' + $(this).attr('ratingKey') + '\n');
							//}
						}
						else {
							console.log("Someone pulled tv seasons!");
							res.end();
							return false;
						}
					}
				}
	    	});

	    	res.end();
	  	});
	}

	http.request(options, showsCallback).end();
}