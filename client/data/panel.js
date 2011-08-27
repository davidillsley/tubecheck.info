var lineInfo =[
{
"id":"1",
"lineName":"Bakerloo",
"background":"#AE6118"
},
{
"id":"2",
"lineName":"Central",
"background":"#E41F1F"
},
{
"id":"3",
"lineName":"Victoria",
"background":"#009FE0"
},
{
"id":"4",
"lineName":"Jubilee",
"background":"#8F989E"
},
{
"id":"5",
"lineName":"Northern",
"background":"#000000"
},
{
"id":"6",
"lineName":"Piccadilly",
"background":"#0450A1"
},
{
"id":"7",
"lineName":"Circle",
"background":"#F8D42D"
},
{
"id":"8",
"lineName":"Hammersmith and City",
"background":"#E899A8"
},
{
"id":"9",
"lineName":"District",
"background":"#00A575"
},
{
"id":"11",
"lineName":"Metropolitan",
"background":"#893267"
},
{
"id":"12",
"lineName":"Waterloo and City",
"background":"#70C3CE"
},
{
"id":"81",
"lineName":"DLR",
"background":"#00BBB4"
},
{
"id":"82",
"lineName":"Overground",
"background":"#F86C00"
}
];
var lineMap = {};
var tableRef = document.getElementById("summary");
for(var i=0;i<lineInfo.length;i++){
	var newRow   = tableRef.insertRow(i);

	var lineCell  = newRow.insertCell(0);
	lineCell.id = "line_"+lineInfo[i].id;
	lineCell.style.background = lineInfo[i].background;
	lineCell.textContent = lineInfo[i].lineName;
	lineCell.className = "line";

	var statusCell = newRow.insertCell(1);
	statusCell.id =  "line_"+lineInfo[i].id+"_status";
	statusCell.className = "ss";
	statusCell.textContent = "Loading...";

	var moreCell = newRow.insertCell(2);
	moreCell.id = "line_"+lineInfo[i].id+"_more";
	moreCell.className = "more";
	moreCell.textContent = "More...";
      	lineMap[lineInfo[i].id] = lineInfo[i];
}

function showMore(lineStatus){
	var self = this;
	this.lineStatus = lineStatus;
	this.onClick = function(){
		document.getElementById("detail").style.display="block";
		document.getElementById("summary").style.display="none";
		var obj = self.lineStatus;
		document.getElementById("detailTitle").textContent=lineMap[obj.id].lineName;
		document.getElementById("detailTitle").style.background = lineMap[obj.id].background;
		document.getElementById("detailContent").textContent=obj.longDescription;
	}
}

function setDetails(msg) {
  var message = msg.details;
  for(i in message){
	var elementId = ("line_"+message[i].id+"_status");
	document.getElementById(elementId).textContent = message[i].shortDescription;
	if(message[i].longDescription != ""){
		var moreElement = document.getElementById("line_"+message[i].id+"_more")
		moreElement.style.visibility="visible";
		var sm = new showMore(message[i]);
		moreElement.addEventListener("click", sm.onClick, true);
	}else{
		document.getElementById("line_"+message[i].id+"_more").style.visibility="hidden";
	}
  }
};

function setLoading(){
  var ssElements = document.getElementsByClassName("ss");
  for(var i=0;i<ssElements.length;i++){
    ssElements[i].innerHTML = "Loading...";
  }
  var moreElements = document.getElementsByClassName("more");
  for(var i=0;i<moreElements.length;i++){
    moreElements[i].style.visibility = "hidden";
  }
  document.getElementById('summary').style.display='block';
  document.getElementById('detail').style.display='none';
}

self.port.on("loading",setLoading);
self.port.on("details",setDetails);
