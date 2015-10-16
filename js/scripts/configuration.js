$(document).ready(function(){


  checkPassword();

	$("#saveConfig").click(function(){
		localStorage.flag=1;
		window.location = "../index.html";
	});

	$("#btnConfiguration").click(function(){
		var storeNo= $("#storeNo").val();	
		if(storeNo.length>0 ){
			saveConfiguration(storeNo);

		}
		else {
			if (storeNo.length<0)$("#storeNo").focus();
			toastr.info("Password can not be empty!","",{timeOut: 1000});
					 	  $("#toast-container").effect("bounce");	
		}
		
	});


	$("#btnPassword").click(function(){
		var db = openDatabase("AppPreferences", "1.0", "Save local preferences", 2 * 1024 * 1024);
		db.readTransaction(function (tx) {
				tx.executeSql("SELECT * FROM Security", [], function (tx, results) {
					var count = results.rows.length;
		      if(count>0){
		     	// Validate old password
		     		var oldPass=$("#oldPassword").val(); 
		     		if (results.rows.item(0).Password== oldPass){
		     			var newPass=$("#newPassword").val();
		     			var repPass=$("#newPasswordRepeat").val(); 
		     			if (newPass==repPass){savePassword(newPass); $("#invalidPassword").slideUp("fast");}
		      		else{
			      		toastr.info("Please, check your password and confirmation again!","",{timeOut: 1000});
						 	  $("#toast-container").effect("bounce");
						 	  $("#newPasswordRepeat").focus();
						 	}
		      	}
		      	else{
		      		$("#invalidPassword").show().effect("slide").addClass("yellow");

		      	}
		     			
		      }
		      else{
		      // Check both password new one and repeated one
		      	var newPass=$("#newPassword").val(); 	
		      	var repPass=$("#newPasswordRepeat").val(); 
		      	if (newPass==repPass){savePassword(newPass);}
		      	else{
		      		toastr.info("Please, check your password and confirmation again!","",{timeOut: 1000});
					 	  $("#toast-container").effect("bounce");
					 	  $("#newPasswordRepeat").focus();
		      	}
		      }
				},null);
			});

	});


function checkPassword(){
	var db = openDatabase("AppPreferences", "1.0", "Save local preferences", 2 * 1024 * 1024);
		db.readTransaction(function (tx) {
				tx.executeSql("SELECT * FROM Security", [], function (tx, results) {
					var count = results.rows.length;
		      if(count==0){
		     		$("#oldPasswordGroup").hide();
		      }
		   	});
		 
		});
}


	function saveConfiguration(storeNo){
	
		var db = openDatabase("AppPreferences", "1.0", "Save local preferences", 2 * 1024 * 1024);
    db.transaction(function (tx) {  
	   		tx.executeSql("DELETE FROM KioskPreferences",[],
	   			function(tx,success){},
	   			function(tx,e){	}
				);
		});
    db.transaction(function (tx) {  
	   		tx.executeSql("INSERT INTO KioskPreferences (StoreNo) VALUES (?)",[storeNo],
	   			function(tx,success){  	
	   					toastr.success("Configuration set up successfully!","",{timeOut: 1000});
							$("#toast-container").effect("slide","slow");   						},
	   			function(tx,e){	
	   					toastr.error("Try again please!","",{timeOut: 1000});
					 	  $("#toast-container").effect("bounce");
	   			}
				);
		});
	}

	function savePassword(password){
		
		var db = openDatabase("AppPreferences", "1.0", "Save local preferences", 2 * 1024 * 1024);
    	db.transaction(function (tx) {  
	   		tx.executeSql("DELETE FROM Security",[],
	   			function(tx,success){},
	   			function(tx,e){	}
				);
		});
    db.transaction(function (tx) {  
   		tx.executeSql("INSERT INTO Security (Password) VALUES (?)",[password],
   			function(tx,success){
   				toastr.success("Password set up successfully!","",{timeOut: 1000});
					$("#toast-container").effect("slide","slow");   			
   			},
   			function(tx,e){	
   				toastr.error("Try again please!","",{timeOut: 1000});
					$("#toast-container").effect("bounce");
   			}
			);
		});
	
	}






});