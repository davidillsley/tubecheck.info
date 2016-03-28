var lineInfo ={
	"bakerloo":"#AE6118",
	"central":"#E41F1F",
	"victoria":"#009FE0",
	"jubilee":"#8F989E",
	"northern":"#000000",
	"piccadilly":"#0450A1",
	"circle":"#F8D42D",
	"hammersmith-city":"#E899A8",
	"district":"#00A575",
	"metropolitan":"#893267",
	"waterloo-city":"#70C3CE",
	"dlr":"#00BBB4",
	"london-overground":"#F86C00",
	"tfl-rail": "#0019A8"
};
var lineMap = {};
var tableRef = document.getElementById("summary");
for(i in lineInfo){
	var newRow   = tableRef.insertRow(i);

	var lineCell  = newRow.insertCell(0);
	lineCell.id = "line_"+i;
	lineCell.style.background = lineInfo[i];
	lineCell.className = "line";

	var statusCell = newRow.insertCell(1);
	statusCell.id =  "line_"+i+"_status";
	statusCell.className = "ss";
	statusCell.textContent = "Loading...";

	var moreCell = newRow.insertCell(2);
	moreCell.id = "line_"+i+"_more";
	moreCell.className = "more";
	moreCell.innerHTML = "<a href=\"#\">More...</a>";
}

function showMore(lineStatus){
	var self = this;
	this.lineStatus = lineStatus;
	this.onClick = function(){
		document.getElementById("detail").style.display="block";
		document.getElementById("summary").style.display="none";
		var obj = self.lineStatus;
		document.getElementById("detailTitle").textContent=obj.lineName;
		document.getElementById("detailTitle").style.background = obj.background;
		document.getElementById("detailContent").textContent=obj.longDescription;
	}
}

function setDetails(msg) {
	for(i in msg) {
		var id = msg[i].id;
		var name = msg[i].name;
		document.getElementById("line_"+id).textContent = name;

		var currentStatus = {"statusSeverity": -1};
		for(j in msg[i].lineStatuses) {
			if(msg[i].lineStatuses[j].statusSeverity > currentStatus.statusSeverity) {
				if(msg[i].lineStatuses[j].validityPeriods.length == 0){
					currentStatus = msg[i].lineStatuses[j];
				} else {
					for(k in msg[i].lineStatuses[j].validityPeriods) {
						if(msg[i].lineStatuses[j].validityPeriods[k].isNow) {
							currentStatus = msg[i].lineStatuses[j];
						} else {
						  var fromDate = Date.parse(msg[i].lineStatuses[j].validityPeriods[k].fromDate);
							var toDate = Date.parse(msg[i].lineStatuses[j].validityPeriods[k].toDate);
							var now = Date.now();
							if(now > fromDate && now < toDate) {
								currentStatus = msg[i].lineStatuses[j];
							}
						}
					}
				}
			}
		}
		document.getElementById("line_"+id+"_status").textContent = currentStatus.statusSeverityDescription;
		if(msg[i].lineStatuses[j].reason) {
				var moreElement = document.getElementById("line_"+id+"_more")
				moreElement.style.visibility="visible";
				var obj = {
					"lineName" : name,
					"background": lineInfo[id],
					"longDescription":msg[i].lineStatuses[j].reason
				};
				var sm = new showMore(obj);
				moreElement.addEventListener("click", sm.onClick, true);
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
