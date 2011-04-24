const widgets = require("widget");
const tabs = require("tabs");
const data = require("self").data;

var panel = require("panel").Panel({
  contentScriptFile: data.url("panel.js"),
  contentScriptWhen: "ready",
  contentURL: data.url("index.html"),
  width:280,
  height:265,
  onShow: doRequest,
  onHide: showLoading
});

function doRequest(){
  var Request = require('request').Request;
  Request({
    url: "http://tubecheck.info/status",
    onComplete: processResponse 
  }).get();	
}

function showLoading(){
  var message = {"type":"loading"};
  panel.postMessage(message);
}

function processResponse(response){
  var message = {"type":"details"};
  message.details = response.json;
  panel.postMessage(message);
}

var widget = widgets.Widget({
  id:"tubecheck.info/widget1",
  label: "Tube Status",
  contentURL: data.url("tube.png"),
  panel: panel
});
