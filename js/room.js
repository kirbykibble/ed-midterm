
$(document).ready(function() {
	
	textArea = document.getElementById("display");
	
	$.ajax({
		url:"/room/roomId",
		type:"post",
		success:function(resp) {
			document.getElementById("status").innerHTML = "Welcome to Comm Channel " + resp.roomId + ": " + resp.roomName;
			
			roomID = resp.roomId;
			
			document.body.style.backgroundImage = 'url("' + resp.roomPic + '")';
			
			console.log("ajax calls working");
			
			initSockets(resp.roomId);
			
		}
	})
})

function initSockets(roomId) {
	var socket = io();
	
	console.log("sockets were initialized");
	
	
	socket.emit("join room", roomId);
	
	document.getElementById("send").addEventListener("click", function() {
		console.log("button was clicked");
		
		
		$.ajax({ 
			url:"/userInfo",
			type: "post",
			data: {
				type: "getUserInfo"
			},
			success:function(resp) {
				var obj = {
					roomID: roomId, 
					msg: document.getElementById("msg").value,
					userName: resp.eeUN,
					profilePic: resp.eePP,
					all: resp.eeAL
				};
				
				socket.emit("send message", obj);
				console.log("sending message with object " + obj);		
			}
		})
	});
	
	socket.on("create message", function(obj) {
//		console.log(obj.info);
		
		console.log(obj);
		console.log(obj.body);
		
		var wrapper = document.createElement("div");
		wrapper.setAttribute("ID", "wrap");
		textArea.appendChild(wrapper);
		
		var profilePic = document.createElement("div");
		profilePic.setAttribute("ID", "PPic");
		profilePic.style.backgroundImage = 'url("' + obj.pPic + '")';
		wrapper.appendChild(profilePic);
		
		var ndiv = document.createElement("div");
		ndiv.innerHTML = "[" + obj.Alle + "] CMDR " + obj.uName + ": " + obj.msg;
		ndiv.setAttribute("ID", "text");
		wrapper.appendChild(ndiv);
	});	
	
	socket.on("add messages", function(obj) {
		console.log("working...");
//		console.log(obj.info);
		var messages = obj.roomstuff;
		
		for(i = 0; i < messages.length; i++) {
			console.log("repopulating...");
			if((messages[i])[0] == roomID) {
				console.log("repopulation found... using: " + (messages[i])[0]);
				var roomMessages = messages[roomID];
				for(x = 1; x < roomMessages.length; x++) {	
					console.log("repopulating with: " + (roomMessages));
					var wrapper = document.createElement("div");
					wrapper.setAttribute("ID", "wrap");
					textArea.appendChild(wrapper);
					
					var profilePic = document.createElement("div");
					profilePic.setAttribute("ID", "PPic");
					profilePic.style.backgroundImage = 'url("' + roomMessages[x].pPic + '")';
					wrapper.appendChild(profilePic);
					
					var ndiv = document.createElement("div");
					ndiv.innerHTML = "[" + roomMessages[x].Alle + "] CMDR " + roomMessages[x].uName + ": " + roomMessages[x].msg;
					ndiv.setAttribute("ID", "text");
					wrapper.appendChild(ndiv);
				}
			}
		}	
	});	
}
