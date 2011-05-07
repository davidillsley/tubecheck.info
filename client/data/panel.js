function showMore(lineStatus){
	var self = this;
	this.lineStatus = lineStatus;
	this.onClick = function(){
		document.getElementById("detail").style.display="block";
		document.getElementById("summary").style.display="none";
		var obj = self.lineStatus;
		document.getElementById("detailTitle").textContent=obj.lineName;
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
