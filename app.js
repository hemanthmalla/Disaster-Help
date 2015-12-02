var server = require('./server');
var config = require('./config');
var bunyan = require('bunyan');
var log = bunyan.createLogger({name: 'chennai_resuce'});


log.info("Starting web server...");
server.start();
log.info("Successfully started web server. Waiting for connections...");
