$(document).ready(function(){

  loadData();
  checkPassword();


	$("#saveConfig").click(function(){
		localStorage.flag=1;
		window.location = "../index.html";
	});

	$("#btnConfiguration").click(function(){
		var storeNo= $("#storeNo").val();
		var webIp= $("#webServices").val();	
		var storeName= $("#storeName").val();
		var email= $("#adminEmail").val();		
		var checkEmail= validateEmail();
		var newPass,oldPass,repPass,buttonPass;
		if(storeNo.length>0 && webIp.length>0 && storeName.length>0 && email.length>0 && checkEmail != -1 ){
			saveConfiguration(storeNo.trim(),webIp.trim(),checkEmail.trim(),storeName.trim());
			
			$(".sectionConfig").effect("drop");
			if(localStorage.current_lang == "es"){		
				newPass="Nueva Contrase\u00F1a";oldPass="Contrase\u00F1a";repPass="Confirmar Contrase\u00F1a";buttonPass="Guardar Contrase\u00F1a";changePass="Cambiar Contrase\u00F1a";
			}		
			else{
				newPass="New Password";oldPass="Password";repPass="Repeat Password";buttonPass="Save Password";changePass="Change Password";
			}

			var template= _.template($("#sectionSockTemplate").html());
				            			var html= template ({
				            			newPass: newPass,
				            			oldPass: oldPass,
				            			repPass: repPass,
				            			buttonPass: buttonPass,
				            			changePass: changePass
									        });            	
		  $(".showSectionIP").append(html);		          			
			$(".sectionIP").delay(100).show( "drop", {direction: "down"},"fast");
			checkPassword();

		}
		else {
			if (storeNo.length<0){$("#storeNo").focus();}
			else if (webIp.length<0){$("#webServices").focus();}
			else if (storeName.length<0) {$("#storeName").focus();}
			else {$("#adminEmail").focus();}
			if (localStorage.current_lang == "es") { toastr.info("Hay algunos campos requeridos incompletos!", "", { timeOut: 1000 }); } else { toastr.info("There are some required values that are empty!", "", { timeOut: 1000 }); }
			$("#toast-container").effect("bounce");
		}
		

	});

	$(document.body).on("click", "#btnPassword" ,function(){
	//$("#btnPassword").click(function(){
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
			     			if (newPass==repPass){savePassword(newPass.trim()); $("#invalidPassword").slideUp("fast");$(".sectionIP").effect("drop");}
			      		else{
				      		if (localStorage.current_lang == "es") { toastr.info("La confirmaci\u00f3n de la contrasena no es correcta!", "", { timeOut: 1000 }); } else { toastr.info("Please, check your password and confirmation again!", "", { timeOut: 1000 }); }
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
		      	if (newPass==repPass){savePassword(newPass.trim());$(".sectionIP").effect("drop");}  
		      	else{
		      		if (localStorage.current_lang == "es") { toastr.info("La confirmaci\u00f3n de la contrasena no es correcta!", "", { timeOut: 1000 }); } else { toastr.info("Please, check your password and confirmation again!", "", { timeOut: 1000 }); }
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
						var otherOption = "Other"; 
  					if(localStorage.current_lang == "es") otherOption = "Otro";    
			      if(count>0){
			      		$("#storeNo").val(results.rows.item(0).StoreNo);
								$("#storeName").val(localStorage.storeName);
								$("#webServices").val(results.rows.item(0).WebServiceIP);
								var email= results.rows.item(0).AdminEmail;
								var checkDom = email.lastIndexOf("@");
      					var resultDom = email.substring(checkDom + 1);
      					var splitEmail= email.substring(0,checkDom);      					
      					var existDomain= $("#selectDomainSettings option[value='"+resultDom+"']").length;
      					  					 

      					// Set the value saved in the db
      					if(existDomain>0){
      						$("#adminEmail").val(splitEmail);
      						$("#selectDomainSettings").val(resultDom);
      						$("#selectDomainSettings option[value = 'Other']").text(otherOption);
      					  $('#selectDomainSettings').selectmenu().selectmenu( "menuWidget");
      					  $("#selectDomainSettings").change();

      					}
      					else{
      						// Fill textbox
      						$("#adminEmail").val(email);
      						// Set language for the option other
      						$("#selectDomainSettings option[value = 'Other']").text(otherOption);
      						$("#selectDomainSettings").val("Other");  
      						// Build personalize select    						
      						$('#selectDomainSettings').selectmenu().selectmenu( "menuWidget");
      						$("#selectDomainSettings").change();

      					}								

			      }
			      else{			      	
			      	//Set initial configuration for Email
			      	$("#selectDomainSettings option[value = 'Other']").text(otherOption);
			      	$("#selectDomainSettings").val("Other");
			      	$('#selectDomainSettings').selectmenu().selectmenu( "menuWidget");
							$("#selectDomainSettings").change();
							
			      }
			   	});
			 
			});
	

	}

	function saveConfiguration(storeNo,webIp,email,storeName){
	
		var db = openDatabase("AppPreferences", "1.0", "Save local preferences", 2 * 1024 * 1024);
    db.transaction(function (tx) {  
	   		tx.executeSql("DELETE FROM KioskPreferences",[],
	   			function(tx,success){},
	   			function(tx,e){	}
				);
		});
		localStorage.storeName="null";
    db.transaction(function (tx) {  
	   		tx.executeSql("INSERT INTO KioskPreferences (StoreNo,WebServiceIP,AdminEmail ) VALUES (?,?,?)",[storeNo,webIp,email],
	   			function(tx,success){  	
	   					if (localStorage.current_lang == "es") { toastr.success("Configuraci\u00f3n realizada exitosamente!", "", { timeOut: 1000 }); } else { toastr.success("Configuration set up successfully!", "", { timeOut: 1000 }); }
	    				$("#toast-container").effect("slide","slow");   						},
	   			function(tx,e){	
	   					if (localStorage.current_lang == "es") { toastr.info("Int\u00e9ntelo nuevamente, por favor"); } else { toastr.info("Try again, please"); }
                $("#toast-container").effect("bounce");
	   			}
				);
		});
		localStorage.storeName=storeName;
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
   			 	if (localStorage.current_lang == "es") { toastr.success(" Asignaci\u00f3n de contrase\u00f1a exitosamente!", "", { timeOut: 1000 }); } else { toastr.success("Password set up successfully!", "", { timeOut: 1000 }); }
   				$("#toast-container").effect("slide","slow");     			
   			},
   			function(tx,e){	
   				if (localStorage.current_lang == "es") { toastr.error("Int\u00e9ntelo nuevamente, por favor!"); } else { toastr.error("Try again please!"); }
          $("#toast-container").effect("bounce");
   			}
			);
		});	
	}
	
	function validateEmail(){
      var domain = $("#selectDomainSettings option:selected").val();
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