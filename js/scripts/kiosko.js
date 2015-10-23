$(document).ready(function(){
	
  var storeNo;
	

	getLanguage();
	checkModal();
	$("#homeScreen").click(function(){
	  init();
	});	

	$(".btnExit").click(function(){
		document.close();
	});
		// Search sizes
		$("#skuCode").keydown(function(e){
		  
		  if (e.which == 13){
			e.preventDefault();

			var sku= $("#skuCode").val();
			 $.ajax({
              type: "GET",
              url: "http://"+ localStorage.webIp + "/KioskoServices/Service.svc/LoadSizes/"+sku,
              async: false,
              dataType: "json",
              crossdomain: true,
              success:function(result){
              	options= $("#sizeOptions");
              	options.find('option').remove().end();
              	var selected = 0;
              	var data= result.LoadSizesResult;
              	if (data!=null){
	              	$.each(data, function( index, value) {
										options.append($("<option></option>").attr("value",index).text(value.sizecode)); 
										if (value.selected == true ){
											selected=index;
										}
									}); 
	              	options.val(selected);
                }
                else{
                	toastr.info("Product not found","",{timeOut:1000});
                	$("#toast-container").effect("bounce");
                }
              	//$("#animate").attr("src","file://192.168.1.154/Web%20Design/KIOSKO.NET/okey.gif");
              	//$("#paisana").attr("src","http://retailcs.com/paisana.jpg");
 						 	
     					},       					
						  error: function(error) {
					 	  	 toastr.error("Missing product information","",{timeOut:1000});
					 	  	 $("#toast-container").effect("bounce");
					    }	                
	     });
			
		}	
	});
		
	$(document).keydown(function(e){
		  
		  if (e.which == 13) e.preventDefault();
	});

	$("#modal-container-submit").on("shown.bs.modal",function(){
  	 $("#selectRecoveryDomain").val("Other");
  	 $("#selectRecoveryDomain").change();
  	 $("#clientEmail").focus();
  });

  $("#btnRecovery").click(function(){
  	 $("#selectRecoveryDomain").val("Other");
  	 $("#selectRecoveryDomain").change();
  	 $("#recoveryPassword").focus();
  });

  $(".btnHome").click(function(){
 		 localStorage.flag=1;	
     window.location = "index.html";
  });
	$(".btnContinue").click(function(){
		var sku= $("#skuCode").val();
		var size = $("#sizeOptions option:selected").text();
		var index= $("#sizeOptions").val();
		if (sku.length!=0 && size!=""){
			
			var db = openDatabase("AppPreferences", "1.0", "Save local preferences", 2 * 1024 * 1024);
			db.transaction(function (tx) {  
		   		tx.executeSql("DELETE FROM ProductSearched");
			 	});
			db.transaction(function (tx) {  
		   		tx.executeSql("INSERT INTO ProductSearched (Sku, Size) VALUES (?,?)",[sku,index],
		   			function(tx,success){ console.log(sku+" saved"); window.location = "views/result.html?sku="+sku+"&size="+size+"&store="+storeNo;},
		   			function(tx,e){ console.log(e);}
					);
		  });
			
		}
		else{
				toastr.info("Make sure to complete all the entries","",{timeOut: 1000});
				$("#toast-container").effect("bounce");
		}	

	});

	$(".btnSizeChart").click(function(){
		window.location = "views/size_chart.html";
	});

	
	$("#submitClientEmail").click(function(){
		var domain = $("#selectDomain option:selected").text();
		var email=$("#clientEmail").val();
		var errorDomain= (email.match(/.com/g) || []).length;
	  var errorSintax= (email.match(/@/g) || []).length;
	  var checkDom = email.lastIndexOf("@");
		var resultDom = email.substring(checkDom + 1);
		var whitespaces = email.lastIndexOf(" ");
	  if(domain=="Other"){
				if(email.length!=0 && whitespaces==-1 && (errorDomain<=1 && errorSintax==1) && (resultDom!=email && resultDom.trim().length>0 )){
					submitEmail(email);
					$("#clientEmail").val("");
				}
				else{
					toastr.info("Please, enter a valid email!","",{timeOut: 1000});
					$("#toast-container").effect("bounce");
				}
			}	
			else{
				email=email+"@"+domain
				if(email.length!=0 && whitespaces==-1 && (errorDomain<=1 && errorSintax==0)){
					submitEmail(email);
				}
				else{
					toastr.info("Please, enter a valid email!","",{timeOut: 1000});
					$("#toast-container").effect("bounce");
				}

			}	
		
	});


	$(".email").keydown(function (e) {    
	  if (e.which == 13){
	    $("#submitClientEmail").click();
	  }
	});

	
	function submitEmail(email){

		$.ajax({
            type: "POST",
            url: "http://"+ localStorage.webIp + " /KioskoServices/Service.svc/SubmitEmailPost",
            async: false,
            contentType: "application/json",
            data: JSON.stringify({"email": email}),
            crossdomain: true,
            success:function(result){
            	 	if (result==true){
									toastr.success("Successful subscription!");
									$("#toast-container").effect("slide","slow");
									$("#modal-container-submit").modal("hide");
								}
								else{
									toastr.error("Invalid email or it is already subscripted!");
									$("#toast-container").effect("bounce");

								}
						
          	
            },
            error:function(error) {
				 	  	 toastr.error("Try again please!");
				 	  	$("#toast-container").effect("bounce");
				 	 	}
					});
	}


function checkModal(){
	var db = openDatabase("AppPreferences", "1.0", "Save local preferences", 2 * 1024 * 1024);
	db.readTransaction(function (tx) {
			   	tx.executeSql("SELECT * FROM KioskPreferences", [], function (tx, results) {
			      var count = results.rows.length;
			      if(count>0){
			      				      			
			      			if(localStorage.flag>0){
				      			
							      if(localStorage.flag==2){
							      		$("#homeScreen").hide();
						      			db.readTransaction(function (tx) {
								   				tx.executeSql("SELECT * FROM ProductSearched", [], function (tx, results) {
								   						var count = results.rows.length;
								   						if(count>0){
							      		     	 var index= results.rows.item(0).Size;
							      		     	 $("#skuCode").val(results.rows.item(0).Sku);
							      		     	 var e = $.Event("keydown");
   														 e.which = 13; 
   														 $("#skuCode").trigger(e);
   														 $("#sizeOptions").val(index);
   														 $("#skuCode").focus();
							      		      }
								   				},null);
							   				});
		      
							      		init();
							      		loadImages();
							      		$("#skuCode").focus();
							      }
							      else{
							      	init();
							      	loadImages();
							      	$("#homeScreen").show();
							      }
							    }
							    else{
							     	init();
							      loadImages();
							    	$("#homeScreen").show();
							    }
					      		      					      	
			      }
			      else{
			      		window.location = "views/config.html";
			      }
		}, function(){init();});
	});	   	
}
	function init(){
			//Open and/or create structure
			var db = openDatabase("AppPreferences", "1.0", "Save local preferences", 2 * 1024 * 1024);
			db.transaction(function (tx) {  
	   		tx.executeSql("CREATE TABLE IF NOT EXISTS KioskPreferences (BackgroundImage TEXT, StoreNo INT, LogoImage TEXT,	HomeImage TEXT, WebServiceIP TEXT, AdminEmail TEXT)");
		 	});
		 	db.transaction(function (tx) {  
	   		tx.executeSql("CREATE TABLE IF NOT EXISTS ProductSearched(Sku TEXT, Size TEXT)");
		 	});
		 	db.transaction(function (tx) {  
	   		tx.executeSql("CREATE TABLE IF NOT EXISTS History(Url TEXT)");
		 	});
		 	db.transaction(function (tx) {  
	   		tx.executeSql("CREATE TABLE IF NOT EXISTS Security(Password TEXT)");
		 	});
		
		 	db.transaction(function (tx) {  
	   		tx.executeSql("DELETE FROM History");
		 	});
		 	db.transaction(function (tx) {  
	   		tx.executeSql("DELETE FROM ProductSearched");
		 	});
		 	var currentPage = location.href;
		 	db.transaction(function (tx) {  
		   		tx.executeSql("INSERT INTO History (Url) VALUES (?)",[currentPage],function(tx,success){},function(tx,e){}); 
		  });
		
		 	//Retrive preferences
		 	db.readTransaction(function (tx) {
		   	tx.executeSql("SELECT * FROM KioskPreferences", [], function (tx, results) {
		      var count = results.rows.length;
		  
		      
		      if(count>0){

		      	localStorage.webIp= results.rows.item(0).WebServiceIP;
		      	storeNo= results.rows.item(0).StoreNo;
		      	localStorage.background= results.rows.item(0).BackgroundImage;
		     		localStorage.logo= results.rows.item(0).LogoImage;
		   			localStorage.home= results.rows.item(0).HomeImage;
		     		localStorage.email= results.rows.item(0).AdminEmail;
		     		localStorage.flag = 1;

		     		db.readTransaction(function (tx) {
					   	tx.executeSql("SELECT * FROM Security", [], function (tx, results) {
					      var count = results.rows.length;					      
					      if(count==0 || (storeNo==null || localStorage.webIp == "null" || localStorage.email == "null") ){
						      window.location= "views/config.html";	
			          }	       
							     	
					   	}, null);
						});

		      	if(localStorage.background== "null" || localStorage.logo== "null" || localStorage.home== "null"){
		      			var bg,logo,home;
				      	$.ajax({
				              type: "GET",
				              url: "http://"+localStorage.webIp+"/KioskoServices/Service.svc/GetKioskPreferencesPath/"+storeNo,
				              async: false,
				              dataType: "json",
				              crossdomain: true,
				              success:function(result){
				              	var data= result.GetKioskPreferencesPathResult;
				              	if (data!=null){					              	
												 	bg= data.BackGroundImagePath;
												 	logo = data.LogoImagePath;
													home = data.HomeImagePath;	
					              	db.transaction(function (tx) {  
							   						tx.executeSql("UPDATE KioskPreferences SET BackgroundImage = ? , LogoImage = ? , HomeImage= ? ",[bg,logo,home],function(tx,success){},function(tx,e){}); 
							  					});

												}
				 						 	
				     					},       					
										  error: function(error) {
									 	  	 toastr.error("Missing Web Service IP","",{timeOut:1000});
									 	  	 $("#toast-container").effect("bounce");
									 	  	 window.location = "views/config.html";
									    }	                
			     			});

				     	 	db.readTransaction(function (tx) {
			   					tx.executeSql("SELECT * FROM KioskPreferences", [], function (tx, results){
					      		var count = results.rows.length;	      
				      			if(count>0){
									     	localStorage.background= results.rows.item(0).BackgroundImage;
								     		localStorage.logo= results.rows.item(0).LogoImage;
								   			localStorage.home= results.rows.item(0).HomeImage;
		     		
							    	}
		      				})
		      			});
		      	}   			      
	 
		      }
		      else {
		      		window.location = "views/config.html";		        
		      }     
				     	
		   		}, null);
			});		

	}

		function loadImages(){
			$(".logoCompany").attr("src",localStorage.logo);
			$(".homeScreen").attr("src",localStorage.home);
			$(".bgBody").attr("src",localStorage.background);
		}

	 function validateEmail(){
      var domain = $("#selectRecoveryDomain option:selected").text();
      var email=$("#recoveryPassword").val();
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

  $(".btnKey").click(function(){
		 	$("#modal-key").modal("show");
  });

  $("#btnRecoverySend").click(function(){
		 // Delete all information from dataBase
		 var validatedEmail= validateEmail();
		 var adminEmail;
		 var db = openDatabase("AppPreferences", "1.0", "Save local preferences", 2 * 1024 * 1024);
			 db.readTransaction(function (tx) {				   
				   tx.executeSql("SELECT * FROM KioskPreferences", [], function (tx, results) {
				     var count = results.rows.length;
				     if(count>0){
					 		adminEmail= results.rows.item(0).AdminEmail;
					 		count=0;
						 		if(validatedEmail==adminEmail){
									 
									 db.transaction(function (tx) {  
								   		tx.executeSql("DROP TABLE KioskPreferences",[],function(){
								   			count++; 
								   				if(count==4){
									   				 toastr.success("Restoration complete!");
										 				 $("#toast-container").effect("slide","slow");
										 				 location.reload();
									   			}
								   			},null);
								   		
									 	});
									 db.transaction(function (tx) {  
								   		tx.executeSql("DROP TABLE Security",[],function(){
								   			count++; 
								   				if(count==4){
									   				 toastr.success("Restoration complete!");
										 				 $("#toast-container").effect("slide","slow");
										 				 location.reload();
									   			}
								   			},null);
								   
									 	});
									 db.transaction(function (tx) {  
								   		tx.executeSql("DROP TABLE ProductSearched",[],function(){
								   			count++; 
								   				if(count==4){
									   				 toastr.success("Restoration complete!");
										 				 $("#toast-container").effect("slide","slow");
										 				 location.reload();
									   			}
								   			},null);
								   	
									 	});
									 db.transaction(function (tx) {  
								   		tx.executeSql("DROP TABLE History",[],function(){
								   			count++;
									   			if(count==4){
									   				 toastr.success("Restoration complete!");
										 				 $("#toast-container").effect("slide","slow");
										 				 location.reload();
									   			}
								   			},null);
								   	
									 	});
									
									 								
								}	
								else{
										toastr.error("Try again please!");
				 	  				$("#toast-container").effect("bounce");
								}
					   
					   }
					   else{
						   	toastr.info("No exist an email in the database!");
					 	  	$("#toast-container").effect("bounce");
					   }	       
						     	
				   		}, null);
				});		 
  });
	

  $("#modal-key").on("shown.bs.modal",function(){
  	 $("#passwordKey").focus();  
  });

  $("#modal-container-submit").on("shown.bs.modal",function(){
  	 $("#clientEmail").focus();  
  });

  $("#lockSettings").click(function(){
		var db = openDatabase("AppPreferences", "1.0", "Save local preferences", 2 * 1024 * 1024);
		var passwordKey= $("#passwordKey").val();
  	db.readTransaction(function (tx) {
		   	tx.executeSql("SELECT * FROM Security", [], function (tx, results) {
		      var count = results.rows.length;
		      
		 			if(count>0){
			 			if(results.rows.item(0).Password==passwordKey){
	  					
	  					var visible= $(".btnConfig").is(":visible");
		  					if(visible== true){
		  						$(".btnConfig").hide();
		  						$(".btnConfig").addClass("hide");
		  						$("#passwordKey").val("");
		  						$("#modal-key").modal("hide");
  								toastr.success("Lock configuration successfully!");
									$("#toast-container").effect("slide","slow");
		  					}
		  					else{
		  						$(".btnConfig").show();
		  						$(".btnConfig").removeClass("hide");
		  						$("#modal-key").modal("hide");
		  						$("#passwordKey").val("");
  								toastr.success("Unlock configuration successfully");
									$("#toast-container").effect("slide","slow");
		  					}
  					
	  				}
						else{
							toastr.error("Try again please!");
				 	  	$("#toast-container").effect("bounce");
						}
			     
          }	       
				     	
		   		}, null);
		});
	});

	$("#passwordKey").keydown(function(e){
		  
		  if (e.which == 13){
				e.preventDefault();
				$("#lockSettings").click();
			}
	});

	function getLanguage(){
		var lang = "";

		lang = navigator.language.split("-");

	    localStorage.current_lang = (lang[0]);
		
	    //localStorage.current_lang es en 
	}



});

