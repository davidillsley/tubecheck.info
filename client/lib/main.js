const tabs = require("sdk/tabs");
const data = require("sdk/self").data;

var { ToggleButton } = require('sdk/ui/button/toggle');
var panels = require("sdk/panel");
var self = require("sdk/self");

var button = ToggleButton({
  id: "my-button",
  label: "Tube Status",
  icon: "./tube.png",
  onChange: handleChange
});

function handleChange(state) {
  if (state.checked) {
    panel.show({
      position: button
    });
  }
}

var panel = require("sdk/panel").Panel({
  contentScriptFile: data.url("panel.js"),
  contentScriptWhen: "ready",
  contentURL: data.url("index.html"),
  width:280,
  height:280,
  onShow: doRequest,
  onHide: showLoading
});

function doRequest(){
  var Request = require('sdk/request').Request;
  Request({
    url: "https://api.tfl.gov.uk/line/mode/tube,overground,dlr,tflrail/status",
    overrideMimeType: "application/json; charset=utf-8",
    onComplete: processResponse
  }).get();
}

function showLoading(){
  button.state('window', {checked: false});
  var message = {"type":"loading"};
  panel.port.emit("loading",message);
}

function processResponse(response){
  panel.port.emit("details",response.json)
}
