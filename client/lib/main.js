const widgets = require("widget");
const tabs = require("tabs");
const data = require("self").data;

var latestResponse = {};
var latestETag = "*";

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
    headers: {"If-None-Match":latestETag},
    onComplete: processResponse 
  }).get();	
}

function showLoading(){
  var message = {"type":"loading"};
  panel.postMessage(message);
}

function processResponse(response){
  var message = {"type":"details"};
  if("304" != response.status){
    latestETag = response.headers["Etag"];
    latestResponse = response.json;
  }
  message.details  = latestResponse;
  panel.postMessage(message);
}

var widget = widgets.Widget({
  id:"tubecheck.info/widget1",
  label: "Tube Status",
  contentURL: data.url("tube.png"),
  panel: panel
});
