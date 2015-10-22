$(document).ready(function(){


  loadData();
  checkPassword();

	$("#saveConfig").click(function(){
		localStorage.flag=1;
		window.location = "../index.html";
	});

	$("#btnConfiguration").click(function(){
		var storeNo= $("#storeNo").val();
		var webIP= $("#webServices").val();	
		var email= $("#adminEmail").val();		
		var checkEmail= validateEmail();
		if(storeNo.length>0 && webIP.length>0 && email.length>0 && checkEmail != -1 ){
			saveConfiguration(storeNo.trim(),webIP.trim(),checkEmail.trim());

		}
		else {
			if (storeNo.length<0){$("#storeNo").focus();}
			else if (webIP.length<0){$("#webServices").focus();}
			else {$("#adminEmail").focus();}
			toastr.info("There are some required values that are empty!","",{timeOut: 1000});
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
		     			if (newPass==repPass){savePassword(newPass.trim()); $("#invalidPassword").slideUp("fast");}
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
		      	if (newPass==repPass){savePassword(newPass.trim());}
		      	else{
		      		toastr.info("Please, check your password and confirmation again!","",{timeOut: 1000});
					 	  $("#toast-container").effect("bounce");
					 	  $("#newPasswordRepeat").focus();
		      	}
		      }
				},null);
			});

	});

	$("img").on('error', function(){
			$(this).attr("src","../img/noImage.jpg");		
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

	function loadData(){
		var db = openDatabase("AppPreferences", "1.0", "Save local preferences", 2 * 1024 * 1024);
			db.readTransaction(function (tx) {
					tx.executeSql("SELECT * FROM KioskPreferences", [], function (tx, results) {
						var count = results.rows.length;
			      if(count>0){
			      		$("#storeNo").val(results.rows.item(0).StoreNo);
								$("#webServices").val(results.rows.item(0).WebServiceIP);	
								var email= results.rows.item(0).AdminEmail;
								var checkDom = email.lastIndexOf("@");
      					var resultDom = email.substring(checkDom + 1);
      					var splitEmail= email.substring(0,checkDom);
      					var existDomain= $("#selectDomain").val(resultDom);
      					if(existDomain){
      						$("#adminEmail").val(splitEmail);
      					}
      					else{
      						$("#adminEmail").val(email);
      						("#selectDomain").val("Other");

      					}

								

			      }
			   	});
			 
			});

	}

	function saveConfiguration(storeNo,webIP,email){
	
		var db = openDatabase("AppPreferences", "1.0", "Save local preferences", 2 * 1024 * 1024);
    db.transaction(function (tx) {  
	   		tx.executeSql("DELETE FROM KioskPreferences",[],
	   			function(tx,success){},
	   			function(tx,e){	}
				);
		});
    db.transaction(function (tx) {  
	   		tx.executeSql("INSERT INTO KioskPreferences (StoreNo,WebServiceIP,AdminEmail ) VALUES (?,?,?)",[storeNo,webIP,email],
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


	
	 function validateEmail(){
      var domain = $("#selectDomain option:selected").text();
      var email=$("#adminEmail").val();
      var errorDomain= (email.match(/.com/g) || []).length;
      var errorSintax= (email.match(/@/g) || []).length;
      var checkDom = email.lastIndexOf("@");
      var resultDom = email.substring(checkDom + 1);
      var whitespaces = email.lastIndexOf(" ");

      if(domain=="Other"){
          if(email.length!=0 && whitespaces==-1 && (errorDomain<=1 && errorSintax==1) && (resultDom!=email && resultDom.trim().length>0 )){
            return email;      
          }
          else{
           	return -1            
          }
        } 
        else{
          email=email+"@"+domain
          if(email.length!=0 && whitespaces==-1 && (errorDomain<=1 && errorSintax==0)){
            return email
          }
          else{
           return -1;
          }

        } 
      
  }


});