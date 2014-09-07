/**
 * WebSocket proxy
 */

var server = require('http').Server()
var io = require('socket.io')(server);

var serverDns = {
  'temperature.iot.fatelei': {
    host: 'localhost',
    port: 9000
  },
  'aircondition.iot.fatelei': {
    host: 'localhost',
    port: 9001
  }
};

io.of('/coap')
  .on('connection', function(socket) {
  console.log('A new client connected');
  socket.on('message', function(data) {
    var view = new Uint8Array(data);
    var buffer = new Buffer(view.byteLength);
    for (var i = 0; i < buffer.length; ++i) {
        buffer[i] = view[i];
    }
    console.log(buffer);
    var len = buffer.readUInt8(0);
    var hostname = buffer.slice(1, len + 1).toString();
    var payload = buffer.slice(len + 2);

    var host = serverDns[hostname].host;
    var port = serverDns[hostname].port;

  });
});

module.exports = server;