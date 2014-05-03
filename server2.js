// own modules
var FileServer = require('./module/fileServer');
var ChatServer = require('./module/bingoServer');

var fileServer = new FileServer(843);
var sakeServer = new sakeServer(fileServer, {'log level': 1});