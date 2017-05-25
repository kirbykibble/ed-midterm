$(document).ready(function() {
	socket = io();
	console.log("Everything is ready!");
	var isOpen = false;
	
	var items = ["/img/wings-icon-02.png", "/img/wings-icon-02.png", "/img/wings-icon-03.png", "/img/wings-icon-04.png"]
	var profilePicDefault = items[Math.floor(Math.random()*items.length)];
	
	saveData("Jameson", profilePicDefault, "Ind"); 
	
	TitleText = document.getElementById("Words");
	nameField = document.getElementById("nameText");
	
	startBut = document.getElementById("start");
	profileBut = document.getElementById("profile");
	
	
	userBox = document.getElementById("user");
	usertext = document.getElementById("username");
	profilepicture = document.getElementById("pfp");
	
	playerAll = document.getElementById("PaLL");
	
	saveBut = document.getElementById("save");
	
	profileBut.addEventListener("click", function() {
		if(isOpen == false) {
			isOpen = true;
			userBox.style.top = "60%";
		}
		else {
			isOpen = false;
			userBox.style.top = "150%";
		}
	});
	saveBut.addEventListener("click", function() {
		if(isOpen == true) {
			isOpen = false;
			userBox.style.top = "150%";
			//because variable defaults won't work and i'm lazy
			var userNameSet = usertext.value;
			var profilePicSet = profilepicture.value;
			if(usertext.value == "") {
				var userNameSet = "Jameson";
			} else if(profilepicture.value == "") {
//				var profilePicSet = "/img/wings-icon-01.png";
				var profilePicSet = items[Math.floor(Math.random()*items.length)];
			}
			
			nameField.style.marginTop = "0";
			nameField.style.opacity = "1";
			nameField.innerHTML = userNameSet;
			
			saveData(userNameSet, profilePicSet, playerAll.value);
		}
	});
	startBut.addEventListener("click", function() {
//		io.emit("toRoomSelect");
		location.href = "/public/roomSelect.html";
	});
});

function saveData(UName, PPic, Alg) {
	//not session variable whooops
	console.log(UName);
	console.log(PPic);
	console.log(Alg);
		
	$.ajax({
//		url:"saveUserInformation",
		url:"/userInfo",
		type:"post",
		data: {
			type: "setUserInfo",
			username: UName,
			profilePicture: PPic,
			allegiance: Alg			
		},
		success:function(resp) {
			console.log(resp.items);
			
			if(resp.status == "success") {
				uNameSet = resp.UUname;
				var userList = resp.information;
			}
		}
	});
	
}