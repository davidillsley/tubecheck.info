// N.B. Any re-use of this code is subject to acceptance of the TFL data use agreement (and of acceptance of your planned useage by TFL).

var http = require('http');

var currentStatus = {};

var helper = require("./tfl_check.js");
function done(stat){
	currentStatus = stat;
	console.log("done "+JSON.stringify(stat));
	setTimeout(function(){helper.refreshStatus(done);},30*1000);
}
helper.refreshStatus(done);

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(currentStatus));
}).listen(1337, "127.0.0.1");
//console.log('Server running at http://127.0.0.1:1337/');

