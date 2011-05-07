/*
   Copyright 2011 David Illsley <david@illsley.org>

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

var http = require('http');
var crypto = require('crypto');
var currentStatus = {};
var currentText;
var currentHash;

var helper = require("./tfl_check.js");
function done(stat){
	currentStatus = stat;
	currentText = JSON.stringify(currentStatus);
	var hash = crypto.createHash('sha1');
	hash.update(currentText);
	currentHash = hash.digest('base64');
	console.log("Response@"+new Date()+":"+currentHash);
	console.log(JSON.stringify(stat));
	setTimeout(function(){helper.refreshStatus(done);},30*1000);
}
helper.refreshStatus(done);

http.createServer(function (req, res) {
  if(currentHash == req.headers["if-none-match"]){
    res.statusCode = 304;
    res.end();
  }else{
    res.writeHead(200, {'Content-Type': 'application/json', 'etag' : currentHash});
    res.end(currentText);
  }
}).listen(1337, "127.0.0.1");

