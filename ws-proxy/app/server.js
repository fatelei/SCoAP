/**
 * WebSocket proxy
 */

var server = require('http').Server()
var io = require('socket.io')(server);
var IncomeMessage = require('coap-message').IncomeMessage;
var CoAPClient = require('coapjs').CoAPClient;
var etcd = require('nodejs-etcd');
var e = new etcd({
  url: 'http://127.0.0.1:4001'
});


var convert = function(data) {
  var view = new Uint8Array(data);
  var buffer = new Buffer(view.byteLength);
  for (var i = 0; i < buffer.length; ++i) {
    buffer[i] = view[i];
  }

  var len = buffer.readUInt8(0);
  var hostname = buffer.slice(1, len + 1).toString();
  var payload = buffer.slice(len + 1);

  return [hostname, payload];
};

var getCoapMethod = function(code) {
  var method = null;
  switch(code) {
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
  return method;
};

io.of('/coap')
  .on('connection', function (socket) {
  console.log('A new client connected');
  socket.on('temperature', function (data) {
    var tmp = convert(data);
   
    var hostname = tmp[0];
    var payload = tmp[1];

    e.read({key: '/' + hostname}, function (err, result, body) {
      if (err) {
        socket.emit('error', err.message); 
      } else {
        body = JSON.parse(body);
        var address = body.node.value;
        var host = address.split(':')[0];
        var port = parseInt(address.split(':')[1]);
        var incomeMessage = new IncomeMessage(payload);
        var packet = incomeMessage.parse();
      
        var options = {};
        var method = null;
        options.host = host;
        options.port = port;
        options.method = getCoapMethod(packet.code);

        paths = [];
        for (var i = 0; i < packet.options.length; i++) {
          if (packet.options[i].type === 'Uri-Path') {
            paths.push(packet.options[i].value);
          }
        }
        options.path = paths.join('/');

        if (packet.type.confirm) {
          options.type = 'confirmable';
        } else if (packet.type.unconfirm) {
          options.type = 'unconfirmable';
        }

        var client = new CoAPClient();
        client.request(options, function (err, result) {
          if (err) {
            console.error(err);
            socket.emit('error', err.message);
          } else {
            console.log(result);
            socket.emit('temperature', {curtemperature: result});
          }
        });

      }
    });
  });

  socket.on('aircondition', function (data) {
    var tmp = convert(data);
    var hostname = tmp[0];
    var payload = tmp[1];

    e.read({key: '/' + hostname}, function (err, result, body) {
      if (err) {
        socket.emit('error', err.message);
      } else {
        body = JSON.parse(body);
        var address = body.node.value;
        var host = address.split(':')[0];
        var port = parseInt(address.split(':')[1]);
        var incomeMessage = new IncomeMessage(payload);
        var packet = incomeMessage.parse();
        var options = {};
        var method = null;
        options.host = host;
        options.port = port;
        options.method = getCoapMethod(packet.code);

        paths = [];
        queries = [];
        for (var i = 0; i < packet.options.length; i++) {
          if (packet.options[i].type === 'Uri-Path') {
            paths.push(packet.options[i].value);
          } else if (packet.options[i].type === 'Uri-Query') {
            queries.push(packet.options[i].value);
          }
        }

        var query = queries.join('&');
        options.path = paths.join('/');

        if (query.length !== 0) {
          options.path = options.path + '?' + query;
        }

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
            socket.emit('aircondition', {data: result});
          }
        });
      }
    });
  });
});

module.exports = server;