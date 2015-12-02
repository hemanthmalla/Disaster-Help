// Global routes
global.__base = __dirname + '/';

var express = require('express');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var http = require('http');
var debug = require('debug')('src:server');
var errorHandler = require('errorhandler');
var bunyan = require('bunyan');
var uuid = require('node-uuid');

var log = bunyan.createLogger({name: 'chennai_resuce',level: 'debug'});
var routes = require(global.__base + 'routes');
var app = express();


app.use(function(req, res, next){
    if(req.url === '/favicon.ico') {
        res.status(200).send();
    }else{
        next();
    }
});

var allowedDomains = ['http://www.helpchennai.in','www.helpchennai.in','helpchennai.in','http://helpchennai.in'];

var allowCrossDomain = function(req, res, next) {
    var origin = req.headers.origin;
        if(allowedDomains.indexOf(origin) > -1){
            res.header('Access-Control-Allow-Origin',origin);
            res.header('Access-Control-Allow-Credentials', 'true');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
        }
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,OPTIONS');
    next();
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(allowCrossDomain);

app.use(function(req, res, next) {
    req.log = log.child({clientId: req.query.deviceIdentifier || 'Unknown',
        remoteIp:req.headers['x-real-ip'],
        clientIp:req.headers['x-forwarded-for'],
        route:req.baseUrl + req.path});
    req.startTime = new Date;

    var req_info = {};
    req_info.msg = "Request came in with : ";
    req_info.bodyParams = req.body;
    req_info.queryParams = req.query;
    req_info.headers = req.headers;
    req.log.info(req_info,"Request came in with : ");

    next();
});


app.use('/', routes);


log.info(app.get('env'));
if (app.get('env') === 'development') {
    app.use(errorHandler());
}

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
var server = http.createServer(app);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}


function start() {
    server.listen(port);
    log.info("Express server listening on port %d", port);
    server.on('error', onError);
    server.on('listening', onListening);

}

exports.start = start;
exports.app = app;
