/**
 * WebSocket proxy
 */

var server = require('http').Server()
var io = require('socket.io')(server);
var IncomeMessage = require('coap-message').IncomeMessage;
var CoAPClient = require('coapjs').CoAPClient;

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
  socket.on('temperature', function(data) {
    var view = new Uint8Array(data);
    var buffer = new Buffer(view.byteLength);
    for (var i = 0; i < buffer.length; ++i) {
        buffer[i] = view[i];
    }

    var len = buffer.readUInt8(0);
    var hostname = buffer.slice(1, len + 1).toString();
    var payload = buffer.slice(len + 1);

    var host = serverDns[hostname].host;
    var port = serverDns[hostname].port;
    var incomeMessage = new IncomeMessage(payload);
    var packet = incomeMessage.parse();
  
    var options = {};
    var method = null;
    options.host = host;
    options.port = port;

    switch(packet.code) {
      case '0.01':
        method = 'GET';
        break;
      case '0.02':
        method = 'POST';
        break;
      case '0.03':
        method = 'PUT';
        break;
      case '0.04':
        method = 'DELETE';
        break;
    }

    options.method = method;
    paths = [];
    for (var i = 0; i < packet.options.length; i++) {
      if (packet.options[i].type === 'Uri-Path') {
        paths.push(packet.options[i].value);
        break;
      }
    }
    options.path = paths.join('/');

    if (packet.type.confirm) {
      options.type = 'confirmable';
    } else if (packet.type.unconfirm) {
      options.type = 'unconfirmable';
    }

    var client = new CoAPClient();
    client.request(options, function(err, result) {
      if (err) {
        console.error(err);
        socket.emit('error', err.message);
      } else {
        console.log(result);
        socket.emit('temperature', {curtemperature: result});
      }
    });
  });
});

module.exports = server;