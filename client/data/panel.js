function showMore(lineStatus){
	var self = this;
	this.lineStatus = lineStatus;
	this.onClick = function(){
		document.getElementById("detail").style.display="block";
		document.getElementById("summary").style.display="none";
		var obj = self.lineStatus;
		document.getElementById("detailTitle").innerHTML=obj.lineName;
		document.getElementById("detailTitle").style.background = document.getElementById('line_'+obj.id).style.background;
		document.getElementById("detailContent").innerHTML=obj.longDescription;
	}
}

onMessage = function onMessage(message) {
  for(i in message){
	var elementId = ("line_"+message[i].id+"_status");
	document.getElementById(elementId).innerHTML = message[i].shortDescription;
	if(message[i].longDescription != ""){
		document.getElementById("line_"+message[i].id+"_img").style.visibility="visible";
		document.getElementById("line_"+message[i].id+"_img").style.border="10px";
		document.getElementById("line_"+message[i].id+"_img").style.background="grey";
		document.getElementById("line_"+message[i].id+"_img").style.color="white";
		var sm = new showMore(message[i]);
		document.getElementById("line_"+message[i].id+"_img").addEventListener("click", sm.onClick, true);
	}else{
		document.getElementById("line_"+message[i].id+"_img").style.visibility="hidden";
	}
  }
};
