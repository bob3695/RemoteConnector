
/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./routes'),
  api = require('./routes/api'),
  mongoose = require('mongoose'),
  $ = require('jquery');

var app = module.exports = express();

// Connect to the database!
mongoose.connect('mongodb://localhost/RemoteConnector');
mongoose.set('debug', true);
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

// JSON API
app.get('/api/states', api.getStates);
app.get('/api/state/:name', api.getState);
app.get('/api/state/:name/:val', api.setState);
app.get('/api/plex/movies/:serverIp/:sectionName/:pageNumber/:perPage', api.getPlexMovies);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Start server

app.listen(3001, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
