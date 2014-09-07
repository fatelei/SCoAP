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
  requestOption.option = coapOptionType.URI_PATH;
  requestOption.value = 'temperature';
  requestOption.length = 11;
  coapRequest.options.push(requestOption);

  coapRequest.optionCount = coapRequest.options.length;

  var sendBuffer = serialize(coapRequest, MACRO.iots.temperature);
  ws.emit('temperature', sendBuffer);
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
  requestOption.option = coapOptionType.URI_PATH;
  requestOption.value = 'aircondition';
  requestOption.length = 12;
  coapRequest.options.push(requestOption);

  requestOption = new CoapOption();
  requestOption.option = coapOptionType.URI_QUERY;
  requestOption.value = 'open=true';
  requestOption.length = 'open=true'.length;
  coapRequest.options.push(requestOption);

  coapRequest.optionCount = coapRequest.options.length;

  var sendBuffer = serialize(coapRequest, MACRO.iots.aircondition);
  ws.emit('aircondition', sendBuffer);
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
  requestOption.option = coapOptionType.URI_PATH;
  requestOption.value = 'aircondition';
  requestOption.length = 12;
  coapRequest.options.push(requestOption);

  requestOption = new CoapOption();
  requestOption.option = coapOptionType.URI_QUERY;
  requestOption.value = 'open=false';
  requestOption.length = 'open=false'.length;
  coapRequest.options.push(requestOption);

  coapRequest.optionCount = coapRequest.options.length;

  var sendBuffer = serialize(coapRequest, MACRO.iots.aircondition);
  ws.emit('aircondition', sendBuffer);
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