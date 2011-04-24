const widgets = require("widget");
const tabs = require("tabs");
const data = require("self").data;

var panel = require("panel").Panel({
  id:"tubecheck.info/panel1",
  contentScriptFile: data.url("panel.js"),
  contentScriptWhen: "ready",
  contentURL: data.url("index.html"),
  width:280,
  height:265,
  onShow: doRequest
});

function doRequest(){
  var Request = require('request').Request;
  Request({
    url: "http://tubecheck.info/status",
    onComplete: processResponse 
  }).get();	
}

function processResponse(response){
  panel.postMessage(response.json);
}

var widget = widgets.Widget({
  label: "Tube Status",
  contentURL: data.url("tube.png"),
  panel: panel
});
