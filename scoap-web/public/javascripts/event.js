/**
 * Get the temperature
 */
var fetchTemperature = function(event) {
  var coapRequest = new CoapMessage();
  coapRequest.version = 1;
  coapRequest.type = coapMessageType.CON;
  coapRequest.code = coapMethod.GET;
  coapRequest.id = Math.floor(Math.random() * 65536);

  var requestOption = new CoapOption();
  requestOption.option = coapOptionType.URL_PATH;
  requestOption.value = 'temperature';
  requestOption.length = 11;
  coapRequest.options.push(requestOption);

  coapRequest.optionCount = coapRequest.options.length;

  var sendBuffer = serialize(coapRequest, MACRO.iots.temperature);
  ws.send(sendBuffer);
};

/**
 * Subscribe the change of temperature
 */
var subscribeTemperatureChange = function(event) {
  alert('sub');
};

/**
 * Open the air condition
 */
var onAirCondition = function(event) {
  var coapRequest = new CoapMessage();
  coapRequest.version = 1;
  coapRequest.type = coapMessageType.CON;
  coapRequest.code = coapMethod.PUT;
  coapRequest.id = Math.floor(Math.random() * 65536);

  var requestOption = new CoapOption();
  requestOption.option = coapOptionType.URL_PATH;
  requestOption.value = 'aircondition';
  requestOption.length = 12;
  coapRequest.options.push(requestOption);

  coapRequest.optionCount = coapRequest.options.length;

  var sendBuffer = serialize(coapRequest, MACRO.iots.aircondition);
  ws.send(sendBuffer);
};

/**
 * Close the air condition
 */
var offAirCondition = function(event) {
  var coapRequest = new CoapMessage();
  coapRequest.version = 1;
  coapRequest.type = coapMessageType.CON;
  coapRequest.code = coapMethod.PUT;
  coapRequest.id = Math.floor(Math.random() * 65536);

  var requestOption = new CoapOption();
  requestOption.option = coapOptionType.URL_PATH;
  requestOption.value = 'aircondition';
  requestOption.length = 12;
  coapRequest.options.push(requestOption);

  coapRequest.optionCount = coapRequest.options.length;

  var sendBuffer = serialize(coapRequest, MACRO.iots.aircondition);
  ws.send(sendBuffer);
};

/**
 * Initiate the dom event listener
 */
var initEventListener = function() {
  var getTemperature = document.getElementById('getTemperature');
  var subTemperature = document.getElementById('subTemperature');
  var openAirCondition = document.getElementById('openAirCondition');
  var closeAirCondition = document.getElementById('closeAirCondition');

  // Add Listener
  getTemperature.addEventListener('click', fetchTemperature);
  subTemperature.addEventListener('click', subscribeTemperatureChange);
  openAirCondition.addEventListener('click', onAirCondition);
  closeAirCondition.addEventListener('click', offAirCondition);
};