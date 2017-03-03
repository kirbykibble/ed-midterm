$(document).ready(function() {
	console.log("jquery is ready???");
	
	document.getElementById("create").addEventListener("click", function() {
		$.ajax({
			url:"/roomCRUD",
			type:"post", 
			data: {
				room: document.getElementById("room").value,
				type: "create"
			},
			success: function(resp) {
				console.log(resp);
				
				
				if(resp.status == "success") {
					var ndiv = document.createElement("div");
					ndiv.innerHTML = resp.name;
					ndiv.style.backgroundColor = "#ADF";
					ndiv.style.padding = "5px";
					ndiv.style.margin = "5px";
					document.body.appendChild(ndiv);
					
					ndiv.myindex = resp.index;
					ndiv.addEventListener("click", function() {
						location.href = "/room/" + this.myindex;
					});
				}
			}
		})
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
					
					for(var i = 0; i < rooms.length; i ++) {
						var ndiv = document.createElement("div");
						ndiv.innerHTML = rooms[i];
						ndiv.style.backgroundColor = "#ADF";
						ndiv.style.padding = "5px";
						ndiv.style.margin = "5px";
						document.body.appendChild(ndiv);
						
						
						ndiv.myindex = resp.index;
						ndiv.addEventListener("click", function() {
							location.href = "/room/" + this.myindex;
						});
						
					}
				}
			}
	})
});