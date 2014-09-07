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

  document.addEventListener("DOMContentLoaded", function(e){
    initEventListener();
  });
})();