'use strict';

/* Controllers */
function MovieListCtrl($scope, $rootScope, $routeParams) {
	$scope.shouldStartNewRow = function (index) {
		if (index % 5 == 0) {
			if (index == 0) {
				return "start";
			}
			return "stopstart";
		}

		return "no";
	}
	
	$rootScope.serverIp = $routeParams["serverIp"];
	$rootScope.playerIp = $routeParams["playerIp"];
	$rootScope.playerType = $routeParams["playerType"];

	$.ajax({
		method: 'get',
		url: 'http://' + $rootScope.serverIp + ':32400/library/sections',
		success: function(data) {
			$(data).find('Directory').each(function() {
				if ($(this).attr('title') == $routeParams["sectionName"]) {
					$.ajax({
						method: 'get',
						url: 'http://' + $rootScope.serverIp + ':32400/library/sections/' + $(this).attr('key') + '/all',
						success: function(data) {
							$scope.movies = [];

							$(data).find('Video').each(function() {
								var playUrl = '';

								$(this).find('Media').each(function() {
									$(this).find('Part').each(function() {
										playUrl = $(this).attr('key');
									});
								});

								if (playUrl != undefined && playUrl != '') { // Sanity check to make sure we are not getting something we don't want
									$scope.movies.push({
										Name: $(this).attr('title'),
										Thumb: $(this).attr('thumb'),
										MetadataId: $(this).attr('ratingKey'),
										PlayURL: playUrl
									});
								}
							});
							
							$rootScope.$apply();
						}
					});
				}	
			});
		}
	});	
}

function TVShowListCtrl($scope, $rootScope, $routeParams) {
	$scope.shouldStartNewRow = function (index) {
		if (index % 5 == 0) {
			if (index == 0) {
				return "start";
			}
			return "stopstart";
		}

		return "no";
	}

	$rootScope.serverIp = $routeParams["serverIp"];
	$rootScope.playerIp = $routeParams["playerIp"];
	$rootScope.playerType = $routeParams["playerType"];
	$rootScope.sectionName = $routeParams["sectionName"];

	$.ajax({
		method: 'get',
		url: 'http://' + $rootScope.serverIp + ':32400/library/sections',
		success: function(data) {
			$(data).find('Directory').each(function() {
				if ($(this).attr('title') == $routeParams["sectionName"]) {
					$.ajax({
						method: 'get',
						url: 'http://' + $rootScope.serverIp + ':32400/library/sections/' + $(this).attr('key') + '/all',
						success: function(data) {
							$scope.tvshows = [];

							$(data).find('Directory').each(function() {
								$scope.tvshows.push({
									Name: $(this).attr('title'),
									Thumb: $(this).attr('thumb'),
									RatingKey: $(this).attr('ratingKey')
								});
							});
							
							$rootScope.$apply();
						}
					});
				}	
			});
		}
	});	
}

function TVShowSeasonListCtrl($scope, $rootScope, $routeParams) {
	$scope.shouldStartNewRow = function (index) {
		if (index % 5 == 0) {
			if (index == 0) {
				return "start";
			}
			return "stopstart";
		}

		return "no";
	}

	$rootScope.showKey = $routeParams["showKey"];

	$.ajax({
		method: 'get',
		url: 'http://' + $rootScope.serverIp + ':32400/library/metadata/' + $routeParams["showKey"] + '/children',
		success: function(data) {
			$scope.seasons = [];

			$(data).find('Directory').each(function() {
				if ($(this).attr('title') != 'All episodes') {
					$scope.seasons.push({
						Name: $(this).attr('title'),
						Thumb: $(this).attr('thumb'),
						Key: $(this).attr('ratingKey')
					});
				}
			});
					
			$rootScope.$apply();
		}
	});	
}

function TVShowEpisodeListCtrl($scope, $rootScope, $routeParams) {
	$scope.shouldStartNewRow = function (index) {
		if (index % 5 == 0) {
			if (index == 0) {
				return "start";
			}
			return "stopstart";
		}

		return "no";
	}

	$rootScope.seasonKey = $routeParams["seasonKey"];

	$.ajax({
		method: 'get',
		url: 'http://' + $rootScope.serverIp + ':32400/library/metadata/' + $routeParams["seasonKey"] + '/children',
		success: function(data) {
			/*$scope.seasons = [];

			$(data).find('Video').each(function() {
				$scope.seasons.push({
					Name: $(this).attr('title'),
					Thumb: $(this).attr('thumb'),
					Key: $(this).attr('key')
				});
			});*/

			$scope.episodes = [];

			$(data).find('Video').each(function() {
				var playUrl = '';

				$(this).find('Media').each(function() {
					$(this).find('Part').each(function() {
						playUrl = $(this).attr('key');
					});
				});

				if (playUrl != undefined && playUrl != '') { // Sanity check to make sure we are not getting something we don't want
					$scope.episodes.push({
						Name: $(this).attr('title'),
						Thumb: $(this).attr('thumb'),
						MetadataId: $(this).attr('ratingKey'),
						PlayURL: playUrl
					});
				}
			});

			$rootScope.$apply();
		}
	});	
}

function playMovie(playUrl, metadataId, serverIp, playerIp, playerType) {
	if (playerType.toLowerCase() == "plex") {
		$.ajax({
			method: 'get',
			url: 'http://' + serverIp + ':32400/system/players/' + playerIp + '/application/playFile?path=http://' + serverIp + ':32400' + playUrl,
			success: function() {
				alert("Movie Started!");
			},
			error: function() {
				alert("Error!");
			}
		});
	}
	else if (playerType.toLowerCase() == "plexbmc") {
		// Work PleXBMC magic
		var jsonPlay = {
			"id":1,
			"jsonrpc":"2.0",
			"method":"Player.Open",
			"params": {
				"item": {
					"file":"plugin:\/\/plugin.video.plexbmc\/?url=http://" + serverIp + ":32400/library/metadata/" + metadataId + "&mode=5&id=1"
				}
			}
		};

		$.ajax({
			method: 'get',
			url: 'http://' + playerIp + ':9090',
			data: jsonPlay,
			success: function() {
				alert("Movie Started!");
			},
			error: function() {
				alert("Error!");
			}
		});
	}
}