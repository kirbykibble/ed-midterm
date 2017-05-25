const express = require("express");
const port = process.env.PORt || 10000;
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");

var pF = path.resolve(__dirname, "public");
var app = express();

const server = require("http").createServer(app);
var io = require("socket.io")(server);

app.use("/public", express.static("public"));
app.use("/scripts", express.static("build"));
app.use("/styling", express.static("styles"));
app.use("/img", express.static("images"));

app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(session({
	secret: "pepperoni",
	resave: true,
	saveUninitialized: true
}));
var allRooms = [];
var allPics = [];
var allDescs = [];
var roomMessages = [];


app.get("/room/:roomindex", function(req, resp){
	console.log(req.params.roomindex);	
	
	var index = req.params.roomindex;
	
	req.session.roomId = index;
//	resp.end("You are in Dimension " + index + ". Dimension name " + allRooms[index]);
	resp.sendFile(pF + "/room.html");
});


app.post("/room/roomId", function(req, resp) {
	var obj = {
		roomId: req.session.roomId,
		roomName: allRooms[req.session.roomId],
		roomPic: allPics[req.session.roomId]
	};
	resp.send(obj);
})

app.post("/userInfo", function(req, resp) {	
	console.log(req.body);
	if(req.body.type == "setUserInfo") {
		var userName = req.body.username;
		var profilePic = req.body.profilePicture;
		var alleg = req.body.allegiance;
		
		console.log("setting user information to: " + req);
		req.session.UN = userName;
		req.session.PP = profilePic;
		req.session.AL = alleg;
		
		resp.send({
			status: "success"
		})
	}
	if(req.body.type == "getUserInfo") {
		resp.send({
			status: "success",
			eeUN: req.session.UN,
			eePP: req.session.PP,
			eeAL: req.session.AL
		});
	}
})

app.post("/roomCRUD", function(req, resp) {
	if (req.body.type == "create") {
		console.log(req.body);
			allRooms.push(req.body.room);
			allPics.push(req.body.pic);
			allDescs.push(req.body.descript);
			
			resp.send({
				status:"success",
				name: req.body.room,
				descripter: req.body.descript,
				picture: req.body.pic,
				index:allRooms.length - 1
			});
		
	}

	else if (req.body.type == "read") {
		resp.send({
			status: "success",
			arr:allRooms,
			descripter: allDescs,
			pics:allPics
		})
	}
});


app.get("/", function(req, resp) {
	resp.sendFile(pF + "/index.html");
});

io.on("connection", function(socket) {
//	socket.on("toRoomSelect", function() {
//		
//	});
//	
//	app.get("/getUserInfo", function(req, resp) {
//		console.log("working...")
//		console.log(req.session.userinformation);
//		userign = req.session.userinformation.body.username;
//		profilePic = req.session.userinformation.body.profilePicture;
//		alleg = req.session.userinformation.body.allegiance;
//	});
	
	
	socket.on("send message", function(obj) {
		var newobj = {
			msg: obj.msg,
			uName: obj.userName,
			pPic: obj.profilePic,
			Alle: obj.all
		}
		isAppended = false;
		for(i = 0; i < roomMessages.length; i++) {
			if((roomMessages[i])[0] == obj.roomID) {
				roomMessages[i].push(newobj);
				isAppended = true;
			}
		}	
		if(isAppended == false) {
			roomMessages.push([obj.roomID, newobj])
			isAppended = true;
		}
//		io.emit("create message", obj);
		console.log("current room messages: " + roomMessages);
		console.log("message recieved with object " + newobj);
	
		io.to(socket.roomId).emit("create message", newobj);
	});
	
	
	socket.on("join room", function(roomId) {
		socket.roomId = "room" + roomId;
		var items = {
			roomstuff: roomMessages
		}
		socket.emit("add messages", items);
		socket.join(socket.roomId);
	});
	
	
	socket.on("disconnect", function() {
		
	});
});

server.listen(port, function(err) {
	if(err) {
		console.log(err);
		return(false);
	}
	
	console.log(port + " is running");
});

