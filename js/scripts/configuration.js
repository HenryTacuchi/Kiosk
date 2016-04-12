$(document).ready(function(){

  // show settings stored
    loadData();
  // check if the user set the password to show or not the textbox old password
  checkPassword();

	$("#saveConfig").click(function(){
		localStorage.flag=1;
		window.location = "../index.html";
	});

    // save or update settings
	$("#btnConfiguration").click(function(){
		var storeNo= $("#storeNo").val();
		var webIP = $("#webServices").val();
		var storeName = $("#storeName").val();
		var email= $("#adminEmail").val();		
		var checkEmail= validateEmail();
		if(storeNo.length>0 && webIP.length>0 && storeName.length>0 && email.length>0 && checkEmail != -1 ){
		    saveConfiguration(storeNo.trim(),webIP.trim(),checkEmail.trim(),storeName.trim());
		    $(".sectionConfig").effect("drop");
		    if (localStorage.current_lang == "es") {
		        newPass = "Nueva Contrase\u00F1a"; oldPass = "Contrase\u00F1a"; repPass = "Confirmar Contrase\u00F1a"; buttonPass = "Guardar Contrase\u00F1a"; changePass = "Cambiar Contrase\u00F1a";
		    }
		    else {
		        newPass = "New Password"; oldPass = "Password"; repPass = "Repeat Password"; buttonPass = "Save Password"; changePass = "Change Password";
		    }

		    var template = _.template($("#sectionSockTemplate").html());
		    var html = template({
		        newPass: newPass,
		        oldPass: oldPass,
		        repPass: repPass,
		        buttonPass: buttonPass,
		        changePass: changePass
		    });
		    $(".showSectionIP").append(html);
		    $(".sectionIP").delay(100).show("drop", { direction: "down" }, "fast");
		    checkPassword();

		}
		else {
			if (storeNo.length<0){$("#storeNo").focus();}
			else if (webIP.length<0){$("#webServices").focus();}
			else if (storeName.length<0) {$("#storeName").focus();}
			else { $("#adminEmail").focus(); }
			if (localStorage.current_lang == "es") { toastr.info("Hay algunos campos requeridos incompletos!", "", { timeOut: 1000 }); } else { toastr.info("There are some required values that are empty!", "", { timeOut: 1000 }); }
			$("#toast-container").effect("bounce");	
		}
		
	});

    // save or update password
	$(document.body).on("click", "#btnPassword", function () {
		var store = localStorage.store, webIP = localStorage.webIP, email = localStorage.email, password = localStorage.password;
	    if ((typeof store != "undefined" && localStorage.store != null) && (typeof webIP != "undefined" && localStorage.webIP != "null") && (typeof email != "undefined" && localStorage.email != "null") && (typeof password != "undefined" && localStorage.password!="null")) {
		     	// Validate old password
		     	var oldPass=$("#oldPassword").val(); 
		     	if (localStorage.password== oldPass){
		     			var newPass=$("#newPassword").val();
		     			var repPass=$("#newPasswordRepeat").val(); 
		     			if (newPass == repPass) { savePassword(newPass.trim()); $("#invalidPassword").slideUp("fast"); $(".sectionIP").effect("drop"); }
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
		      	if (newPass == repPass) {
		      	    savePassword(newPass.trim());
		      	    $(".sectionIP").effect("drop");
		      	    //$(".sectionIP").effect("drop");
		      	}
		      	else{
		      	    if (localStorage.current_lang == "es") { toastr.info("La confirmaci\u00f3n de la contrasena no es correcta!", "", { timeOut: 1000 }); } else { toastr.info("Please, check your password and confirmation again!", "", { timeOut: 1000 }); }
					 	  $("#toast-container").effect("bounce");
					 	  $("#newPasswordRepeat").focus();
		      	}
		      }	

	});


	function checkPassword(){
        var password =localStorage.password;
        if (typeof password == "undefined" || localStorage.password == "null") $("#oldPasswordGroup").hide();
	}

	function loadData(){
	    var store = localStorage.store, webIP = localStorage.webIP, email = localStorage.email;
	    var otherOption = "Other";
	    if (localStorage.current_lang == "es") otherOption = "Otro";
	    if ((typeof store != "undefined" && localStorage.store != null) && (typeof webIP != "undefined" && localStorage.webIP != "null") && (typeof email != "undefined" && localStorage.email != "null")) {
	        $("#storeNo").val(localStorage.store);
	        $("#storeName").val(localStorage.storeName);
	        $("#webServices").val(localStorage.webIP);
	        var email = localStorage.email;
	        var checkDom = email.lastIndexOf("@");
            var resultDom = email.substring(checkDom + 1);
            var splitEmail= email.substring(0,checkDom);
            var existDomain = $("#selectDomainSettings option[value='" + resultDom + "']").length;
	        // Set the value saved in the db
            if (existDomain > 0) {
                $("#adminEmail").val(splitEmail);
                $("#selectDomainSettings").val(resultDom);
                $("#selectDomainSettings option[value = 'Other']").text(otherOption);
                $('#selectDomainSettings').selectmenu().selectmenu("menuWidget");
                $("#selectDomainSettings").change();

            }
            else {
                $("#adminEmail").val(email);
                $("#selectDomainSettings").val("Other");
                $("#selectDomainSettings option[value = 'Other']").text(otherOption);
                $('#selectDomainSettings').selectmenu().selectmenu("menuWidget");
                $("#selectDomainSettings").change();

            }
	    }
	    else {
	        $("#selectDomainSettings option[value = 'Other']").text(otherOption);
	        $("#selectDomainSettings").val("Other");	        
	        $('#selectDomainSettings').selectmenu().selectmenu("menuWidget");
	        $("#selectDomainSettings").change();
	    }

	}

	function saveConfiguration(storeNo, webIP, email,storeName) {
	    localStorage.email = email;
	    localStorage.store = storeNo;
	    localStorage.webIP = webIP;
	    localStorage.storeName= storeName;
	    localStorage.background = "null";
	    localStorage.logo = "null";
	    localStorage.home = "null";
	    if (localStorage.current_lang == "es") { toastr.success("Configuraci\u00f3n realizada exitosamente!", "", { timeOut: 1000 }); } else { toastr.success("Configuration set up successfully!", "", { timeOut: 1000 }); }
	    $("#toast-container").effect("slide","slow"); 
	}

	function savePassword(password){		
	    localStorage.password = password;
	    if (localStorage.current_lang == "es") { toastr.success(" Asignaci\u00f3n de contrase\u00f1a exitosamente!", "", { timeOut: 1000 }); } else { toastr.success("Password set up successfully!", "", { timeOut: 1000 }); }
   		$("#toast-container").effect("slide","slow"); 		
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
            if(email.length!=0 && whitespaces==-1 && (errorDomain<=1 && errorSintax==1) && (resultDom!=email && resultDom.trim().length>0 )){  return email;  }
            else{ return -1 }
        } 
        else{
            email=email+"@"+domain
            if (email.length != 0 && whitespaces == -1 && (errorDomain <= 1 && errorSintax == 0)) { return email;  }
            else{ return -1; }

        } 
      
    }


});