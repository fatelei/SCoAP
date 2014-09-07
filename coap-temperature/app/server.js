/*
 * a basic coap server
 */

var CoAPServer = require('coapjs').CoAPServer;
var max = 40;
var min = 10;

var temperature = function (req, res, callback) {
  var curTemperature = Math.floor(Math.random() * (max - min + 1)) + min;
  return callback(res.end(curTemperature.toString()));
}

var app = new CoAPServer({
  port: 9000
});
app.get('/temperature', temperature);

module.exports = app;

