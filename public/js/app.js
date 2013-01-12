'use strict';

angular.module('RemoteConnector', []).
	config(['$routeProvider', function($routeProvider) {
		$routeProvider.
			when('/plex/movies/:serverIp/:playerIp/:sectionName/:playerType', {templateUrl: 'partials/PlexMovies.html', controller: MovieListCtrl}).
			when('/plex/movies/horiz/:serverIp/:playerIp/:sectionName/:playerType', {templateUrl: 'partials/PlexMoviesHoriz.html', controller: MovieListCtrl}).
			when('/plex/tvshows/:serverIp/:playerIp/:sectionName/:playerType', {templateUrl: 'partials/PlexTVShows.html', controller: TVShowListCtrl}).
			when('/plex/tvshows/horiz/:serverIp/:playerIp/:sectionName/:playerType', {templateUrl: 'partials/PlexTVShowsHoriz.html', controller: TVShowListCtrl}).
			when('/plex/tvshows/Seasons/:showKey/', {templateUrl: 'partials/PlexTVSeasons.html', controller: TVShowSeasonListCtrl}).
			when('/plex/tvshows/horizSeasons/:showKey/', {templateUrl: 'partials/PlexTVSeasonsHoriz.html', controller: TVShowSeasonListCtrl}).
			when('/plex/tvshows/Episodes/:seasonKey/', {templateUrl: 'partials/PlexTVEpisodes.html', controller: TVShowEpisodeListCtrl}).
			when('/plex/tvshows/horizEpisodes/:seasonKey/', {templateUrl: 'partials/PlexTVEpisodesHoriz.html', controller: TVShowEpisodeListCtrl});		
	}]);


// Declare app level module which depends on filters, and services
//angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives']).
 // config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
 //   $routeProvider.when('/view1', {templateUrl: 'partials/partial1', controller: MyCtrl1});
 //   $routeProvider.when('/view2', {templateUrl: 'partials/partial2', controller: MyCtrl2});
 //   $routeProvider.otherwise({redirectTo: '/view1'});
 //   $locationProvider.html5Mode(true);
  //}]);