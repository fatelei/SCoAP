/*
 * a basic coap server
 */

var CoAPServer = require('coapjs').CoAPServer;
var isOpen = false;

var aircondition = function(req, res, callback) {
  var open = req.params.open;
  var status = {};
  console.log(open);
  if (open) {
    status.data = '空调已经打开';
    if (!isOpen) {
      isOpen = true;
      console.log('Open the aircondition');
    }
  } else {
    status.data = '空调已经关闭';
    if (isOpen) {
      console.log('Close the aircondition');
    }
  }
  return callback(res.end(status));
}

var app = new CoAPServer({
  port: 9001
});
app.put('/aircondition', aircondition);

module.exports = app;

