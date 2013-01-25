/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./routes'),
  plexApi = require('./api/plexApi'),
  stateApi = require('./api/stateApi'),
  xbmcApi = require('./api/xbmcApi'),
  mongoose = require('mongoose'),
  $ = require('jquery');

var app = module.exports = express();

// Connect to the database!
mongoose.connect('mongodb://localhost/RemoteConnector');
//mongoose.set('debug', true);

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.engine('.html', require('ejs').renderFile);
  app.set('view engine', 'html');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// State API
app.get('/api/states', stateApi.getStates);
app.get('/api/state/:name', stateApi.getState);
app.get('/api/state/:name/:val', stateApi.setState);

// Plex API
app.get('/api/plex/movies/:serverIp/:sectionName/:pageNumber/:perPage', plexApi.getPlexMovies);
app.get('/api/plex/tvshows/:serverIp/:sectionName/:pageNumber/:perPage', plexApi.getPlexTVShows);
app.get('/api/plex/tvseasons/:serverIp/:ratingKey/:pageNumber/:perPage', plexApi.getPlexTVSeasons);

// XBMC API
app.get('/api/xbmc/plexbmc/play/:serverIp/:playerIp/:metadataId', xbmcApi.playPleXBMC);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Start server
app.listen(3001, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
