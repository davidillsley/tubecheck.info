// N.B. Any re-use of this code is subject to acceptance of the TFL data use agreement (and of acceptance of your planned useage by TFL).

module.exports.refreshStatus = function(callback){
	new RefreshRequest(callback).start();	
};

var http = require('http');
var client = http.createClient(80, 'cloud.tfl.gov.uk');

var xml2js = require('xml2js');

function RefreshRequest(callback){
	var self = this;
	this.cback = callback;
	this.currentText = "";
	this.parser = new xml2js.Parser();
	this.processChunk = function(chunk){
		self.currentText = self.currentText + chunk;
	};
	this.processComplete = function(){
		self.parser.parseString(self.currentText);
  	};
	this.start = function(){
		var request = client.request('GET', '/TrackerNet/LineStatus',
		  {'host': 'cloud.tfl.gov.uk'});
		request.end();	
		request.on('response', function (response) {
			response.setEncoding('utf8');
  			response.on('data', self.processChunk);
  			response.on('end', self.processComplete);
		});
	};
	this.parseComplete = function(result) {
    		var lineStatusArray = result.LineStatus;
    		var currentStatus = {};
 		for(var i=0;i<lineStatusArray.length;i++){
			var lineStatus = {};
			lineStatus.id = lineStatusArray[i].Line['@'].ID;
			lineStatus.lineName = lineStatusArray[i].Line['@'].Name;
			lineStatus.longDescription = (lineStatusArray[i])['@'].StatusDetails;
        		lineStatus.shortDescription = lineStatusArray[i].Status['@'].Description;
        		lineStatus.statusClass = lineStatusArray[i].Status['@'].CssClass;
			currentStatus[lineStatus.id] = lineStatus;
    		}
    		self.cback(currentStatus);
	};
	this.parser.addListener('end', self.parseComplete);
}
