
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var app = express();

// all environments
//app.set('port', process.env.PORT || 3000);
app.set('port', 3000);
app.set('views', path.join(__dirname, '/app/server/views'));
app.set('view engine', 'jade');
app.locals.pretty = true;
//app.use(express.favicon());
//app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: 'super-duper-secret-secret' }));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(require('stylus').middleware(path.join(__dirname, '/app/public')));
app.use(express.static(path.join(__dirname, '/app/public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

require('./app/server/router')(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
