$(document).ready(function() {
	isOpen = false;
	customIsOpen = false;
	
	createMenu = document.getElementById("createCont");
	allRoomsDiv = document.getElementById("allRooms");
	picture = document.getElementById("chanType");
	description = document.getElementById("desc");
	
	customPicUrl = document.getElementById("custPic");
	
	console.log("jquery is ready???");
	
	picture.addEventListener("change", function() {
		if(picture.value == "custom" && isOpen == true && customIsOpen == false) {
			customIsOpen = true;
			customPicUrl.style.top = "10.5vh";
		} else {
			customIsOpen = false;
			customPicUrl.style.top = "-10vh";
		}
		
	});
	
	document.getElementById("create").addEventListener("click", function() {
		if(picture.value == "custom") {
			pictureSelect = customPicUrl.value;
		} else {
			pictureSelect = picture.value;
		}
		if(pictureSelect == "") {
			pictureSelect = "/img/loading.gif";
		}
		$.ajax({
			url:"/roomCRUD",
			type:"post", 
			data: {
				room: document.getElementById("room").value,
				descript: description.value,
				pic: pictureSelect,
				type: "create"
			},
			success: function(resp) {
				if(resp.status == "success") {
					
					var wrapper = document.createElement("div");
					wrapper.setAttribute("ID", "wrap");
					allRooms.appendChild(wrapper);
					
					var nPic = document.createElement("div");
					console.log(picture.value);
					nPic.setAttribute("ID", "innerPic");
					
					
					nPic.style.backgroundImage = 'url("' + pictureSelect + '")';
					
					wrapper.appendChild(nPic);
					
					var ndiv = document.createElement("div");
					ndiv.innerHTML = resp.name;
					ndiv.setAttribute("ID", "newRoom");
					wrapper.appendChild(ndiv);
					
					var nDesc = document.createElement("div");
					nDesc.innerHTML = resp.descripter;
					nDesc.setAttribute("ID", "description");
					wrapper.appendChild(nDesc);
					
					ndiv.myindex = resp.index;
					ndiv.addEventListener("click", function() {
						location.href = "/room/" + this.myindex;
					});
					
					
//					var ndiv = document.createElement("div");
//					ndiv.innerHTML = resp.name;
//					ndiv.style.backgroundColor = "#ADF";
//					ndiv.style.padding = "5px";
//					ndiv.style.margin = "5px";
//					document.body.appendChild(ndiv);
//					
//					ndiv.myindex = resp.index;
//					ndiv.addEventListener("click", function() {
//						location.href = "/room/" + this.myindex;
//					});
				}
			}
		})
	});
	
	document.getElementById("show").addEventListener("click", function() {
		if(isOpen == false) {
			isOpen = true;
			createMenu.style.marginTop = "0";
			allRoomsDiv.style.marginTop = "2vh";
		} else if (isOpen == true) {
			isOpen = false;
			createMenu.style.marginTop = "-25vh";
			allRoomsDiv.style.marginTop = "10vh";
		}
		
		if(picture.value == "custom" && isOpen == true && customIsOpen == false) {
			customIsOpen = true;
			customPicUrl.style.top = "10.5vh";
		} else {
			customIsOpen = false;
			customPicUrl.style.top = "-10vh";
		}
	});
	
	$.ajax({
		url:"/roomCrud",
		type:"post",
		data: {
			type: "read"
		},
		success: function(resp) {
				console.log(resp);
				
				if(resp.status == "success") {
					var rooms = resp.arr;
					var pics = resp.pics;
					var descs = resp.descripter;

					console.log("rooms ??" + rooms[0])
					
					for(var i = 0; i < rooms.length; i++) {
						console.log(rooms[i]);
						
						var wrapper = document.createElement("div");
						wrapper.setAttribute("ID", "wrap");
						allRooms.appendChild(wrapper);
						
						
						var nPic = document.createElement("div");
						console.log(picture.value);
						nPic.setAttribute("ID", "innerPic");
						nPic.style.backgroundImage = 'url("' + pics[i] + '")';
						wrapper.appendChild(nPic);
						
						var ndiv = document.createElement("div");
						ndiv.innerHTML = rooms[i];
						ndiv.setAttribute("ID", "newRoom");
						wrapper.appendChild(ndiv);
						
						var nDesc = document.createElement("div");
						nDesc.innerHTML = descs[i];
						nDesc.setAttribute("ID", "description");
						wrapper.appendChild(nDesc);
						
						ndiv.myindex = i;
						ndiv.addEventListener("click", function() {
							location.href = "/room/" + this.myindex;
						});
					}
				}
			}
	})
});