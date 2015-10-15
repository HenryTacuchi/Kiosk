$(document).ready(function(){
	
 var StoreNo,BackgroundImage,LogoImage,HomeImage;
	
	$("#homeScreen").click(function(){
	  init();
	});  

	// Search sizes
	$("#skuCode").keydown(function(e){
		  
		  if (e.which == 13){
			e.preventDefault();

			var sku= $("#skuCode").val();
			 $.ajax({
              type: "GET",
              url: "http://192.168.1.135/KioskoServices/Service1.svc/LoadSizes/"+sku,
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
                	toastr.info("Product not found");
                }
              	//$("#animate").attr("src","file://192.168.1.154/Web%20Design/KIOSKO.NET/okey.gif");
              	//$("#paisana").attr("src","http://retailcs.com/paisana.jpg");
 						 	
     					},       					
						  error: function(error) {
					 	  	 toastr.error("Missing product information");
					    }	                
	     });
			
		}	
	});
		
	$(document).keydown(function(e){
		  
		  if (e.which == 13) e.preventDefault();


	});


	$(".btnContinue").click(function(){
		var sku= $("#skuCode").val();
		var size = $("#sizeOptions option:selected").text();
		
		if (sku.length!=0 && size!=""){
			
			var db = openDatabase("AppPreferences", "1.0", "Save local preferences", 2 * 1024 * 1024);
			db.transaction(function (tx) {  
		   		tx.executeSql("DELETE FROM ProductSearched");
			 	});
			db.transaction(function (tx) {  
		   		tx.executeSql("INSERT INTO ProductSearched (Sku) VALUES ('?')",[sku],
		   			function(tx,success){ console.log(sku+" saved");  },
		   			function(tx,e){ console.log(e);}
					);
		  });
			window.location = "views/result.html?sku="+sku+"&size="+size+"&store="+StoreNo;
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

	$("#saveConfig").click(function(){
		var store= $("#storeNo").val();
		
		if(store.length!=0){

			var db = openDatabase("AppPreferences", "1.0", "Save local preferences", 2 * 1024 * 1024);
			db.transaction(function (tx) {  
		   		tx.executeSql("DELETE FROM KioskPreferences");
			 	});
			db.transaction(function (tx) {  
		   		tx.executeSql("INSERT INTO KioskPreferences (StoreNo) VALUES ('?')",[store],
		   			function(tx,success){ 
		   				StoreNo=store;
		   				toastr.success("Configuration set up successfully!","",{timeOut: 1000});
							$("#toast-container").effect("slide","slow");
							$("#modal-config").modal("hide");
							$("#storeNo").focus();
		   			},
		   			function(tx,e){
		   				toastr.error("Try again please!","",{timeOut: 1000});
					 	  $("#toast-container").effect("bounce");
		   			}
					);

			});
		}
		else {
				toastr.info("Please write your store number!","",{timeOut: 1000});
					 	  $("#toast-container").effect("bounce");
		}
	});

	function submitEmail(email){

		$.ajax({
            type: "POST",
            url: "http://192.168.1.135/KioskoServices/Service1.svc/SubmitEmailPost",
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

	function init(){
			//Open and/or create structure
			var db = openDatabase("AppPreferences", "1.0", "Save local preferences", 2 * 1024 * 1024);
			db.transaction(function (tx) {  
	   		tx.executeSql("CREATE TABLE IF NOT EXISTS KioskPreferences (BackgroundImage TEXT, StoreNo TEXT, LogoImage TEXT,	HomeImage TEXT)");
		 	});
		 	db.transaction(function (tx) {  
	   		tx.executeSql("CREATE TABLE IF NOT EXISTS ProductSearched(Sku TEXT)");
		 	});
		 	db.transaction(function (tx) {  
	   		tx.executeSql("CREATE TABLE IF NOT EXISTS History(Url TEXT)");
		 	});
		 	db.transaction(function (tx) {  
	   		tx.executeSql("DELETE FROM History");
		 	});
		 	var currentPage = location.href;
		 	db.transaction(function (tx) {  
		   		tx.executeSql("INSERT INTO History (Url) VALUES ('?')",[currentPage],function(tx,success){},function(tx,e){}); 
		   });


		 	//Retrive preferences
		 	db.transaction(function (tx) {
		   	tx.executeSql("SELECT * FROM KioskPreferences", [], function (tx, results) {
		      var count = results.rows.length;
		      
		      if(count>0){
		      	StoreNo= results.rows.item(0).StoreNo;
		      	BackgroundImage= results.rows.item(0).BackgroundImage;
		      	HomeImage= results.rows.item(0).HomeImage;
		      	LogoImage= results.rows.item(0).LogoImage;
		      }
		      else
		      {
		      	/*setTimeout(function(){
		      		toastr.info("Please, set up your configuration first","",{timeOut: 2000});
						$("#toast-container").effect("bounce");
		      	},500);
		      	// Show modal
					  $('#modal-config').modal({
      				backdrop: 'static',
       				keyboard: false
 						});
   					$('#modal-config').modal("show");*/
		      }     
				     	
		   		}, null);
			});
	}





});
