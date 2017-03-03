$(document).ready(function() {
	$.ajax({
		url:"/room/roomId",
		type:"post",
		success:function(resp) {
			document.getElementById("status").innerHTML = "Welcome to dimension " + resp.roomId + ": " + resp.roomName;
			
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
		var obj = {
			msg: document.getElementById("msg").value
		};
		
		socket.emit("send message", obj);
		console.log("sending message with object " + obj);	
	});
	
	socket.on("create message", function(obj) {
		console.log(obj);
		var ndiv = document.createElement("div");
		ndiv.innerHTML = obj.msg;
		document.getElementById("display").appendChild(ndiv);
	});	
}
