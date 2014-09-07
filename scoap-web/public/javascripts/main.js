/**
 * Main entry
 */

var ws = null;

(function() {
  // Initiate the websocket connection
  ws = io('http://localhost:8000/coap');
  ws.on('connect', function() {
    console.log('connect to server');
  });

  ws.on('error', function(err) {
    console.log('Error is: ' + err.message);
  });

  ws.on('disconnect', function() {
    console.log('connection lose');
  });

  ws.on('message', function(data) {
    console.log(data);
  });

  ws.on('temperature', function(data) {
    var obj = document.getElementById('temperature');
    obj.innerHTML = '<p>Current Temperature is:' + data.curtemperature + '</p>';
  });

  ws.on('aircondition', function(data) {
    var obj = document.getElementById('aircondition');
    var rst = JSON.parse(data.data);
    obj.innerHTML = '<p>The status of aircondition is:' + rst.data + '</p>';
  });

  document.addEventListener("DOMContentLoaded", function(e){
    initEventListener();
  });
})();