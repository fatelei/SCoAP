/*
 * a basic coap server
 */

var CoAPServer = require('coapjs').CoAPServer;
var etcd = require('nodejs-etcd');
var max = 40;
var min = 10;
var e = new etcd({
  url: 'http://127.0.0.1:4001'
});

e.write({
  key: 'temperature.iot.fatelei',
  value: 'localhost:9000'
}, function (e, r, b) {
  if (e) {
    console.error(e);
  } else {
    console.info('register success');
  }
});

var temperature = function (req, res, callback) {
  var curTemperature = Math.floor(Math.random() * (max - min + 1)) + min;
  return callback(res.end(curTemperature.toString()));
}

var app = new CoAPServer({
  port: 9000
});
app.get('/temperature', temperature);

module.exports = app;

