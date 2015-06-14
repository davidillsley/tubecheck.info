const tabs = require("sdk/tabs");
const data = require("sdk/self").data;

var latestResponse = {};
var latestETag = "*";


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
    url: "http://tubecheck.info/status",
    headers: {"If-None-Match":latestETag},
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
  var message = {"type":"details"};
  if("304" != response.status){
    latestETag = response.headers["Etag"];
    latestResponse = response.json;
  }
  message.details  = latestResponse;
  panel.port.emit("details",message)
}
