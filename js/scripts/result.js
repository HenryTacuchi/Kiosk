$(document).ready(function(){

	var qsParm = new Array();
	var afterHomePage;
	readParameters();
	init();
		$.ajax({
          type: "GET",
          url: "http://"+ localStorage.webIp+"/KioskoServices/Service.svc/GetSKUInfo/"+qsParm["sku"]+"/"+qsParm["size"]+"/"+qsParm["store"],
          async: false,
          dataType: "json",
          crossdomain: true,
          success:function(result){
          	var data = result.GetSKUInfoResult;
          	var currencySymbol;
          	$.each(data, function( index, value) {
						
							// Retrieve product information
							var price= (parseFloat(value.RetailPrice)).toFixed(2);
          		$(".shortDescription").text(value.Description);
          		$("#txtStyle").text(value.Style);          		
          		
          		if (value.CurrencyName == "NUEVOS SOLES"){
          			currencySymbol= "S/. ";          		
          		}else{
          			currencySymbol= "$ ";          			
          		} 
          		$("#txtPrice").text(currencySymbol+ price);
          		
          		if(value.OnHandQty > 0){
          			$("#txtStock").text("IN STOCK").addClass("available");          			
          		}
          		else{
          			$("#txtStock").text("OUT STOCK").addClass("no-available");
          		}
          		$("#txtUnits").text(value.OnHandQty);
          		$("#txtColor").text(value.colorName);
          		$("#txtSize").text(value.SizeCode);
          		$("#longDescriptionContent").text(value.LongDescription);
          		$("#longDescriptionSingleImage").text(value.LongDescription);

          		// Retrieve images
          		images=value.ImagePath;
          		if(images.length>1){
          			$("#longDescriptionContent").show();
	          		$.each(images, function( index, value) {
	          				if(index==0){
		          				$("#zoomImage").children().attr("src",value.Path);
		          					
		          			}
		          			else{
				          				var active, path;
					          				if (index==1){
					          					active="active";
					          				}	
					          				else{
					          					active="";
					          				}
				          			  //var exists= ImageExist(value.Path);
				          				//if (exists == true) {path= value.Path;}
			          					//else{path= "../img/noImage.jpg"}		          				
			          					path= value.Path;
				          				var template= _.template($("#carouselTemplate").html());
				            			var html= template ({
									            				active: active,
									            				path: path 
									            			});            	
				            			$(".carousel-inner").append(html);
		          			}  
		          		});
		          	startCarrousel();

	          	}
	          	else if(images.length==0) {
		          		$.each(images, function( index, value) {
		          			$("#zoomImage").children().attr("src",value.Path);
		          		});
		          		$("#myCarousel").hide();
		          		$("#technicalDescriptionPanel").show();
		         	}

          		// Retrieve related products
          		$.ajax({
		            type: "GET",
		            url: "http://"+ localStorage.webIp + "/KioskoServices/Service.svc/GetRelatedProduct/"+qsParm["sku"]+"/"+qsParm["store"],
		            async: false,
		            dataType: "json",
		            crossdomain: true,
		            success:function(relatedProducts){
		            	var relatedProducts = relatedProducts.GetRelatedProductResult;
		            	if(relatedProducts.length>0){
			            	$.each(relatedProducts, function( index, item) {
			            		var i= index+1;
			            		var price= (parseFloat(item.RetailPrice)).toFixed(2);
			            		$("#relatedItem"+i+" p:first-child").text(item.Descr);			            		
			            		$("#relatedItem"+i+" p:nth-child(2)").text(currencySymbol+price);
			            		$(".sku"+i).text(item.SKU);
			            		$(".size"+i).text(item.SizeCode);			            		
			            		$(".relatedProductImage"+i).attr("src",item.ImagePath);
			            		$("#relatedItem"+i).attr("href","result.html?sku="+item.SKU+"&size="+item.SizeCode+"&store="+qsParm["store"]);

			     				});			            
			            }
			            else{
			            	$(".productsRelated").hide();
			            	$(".messageResultProducts").show();
			            }

          			},
          			error: function(error) {
			 	  				toastr.error("error = " + error.status +" "+error.statusText);
			    			}	 

							});  

						});              		  	
 					},       					
				  error: function(error) {
			 	  	toastr.error("error = " + error.status +" "+error.statusText);
			    }	                
  });
	
	$(".btnCheckLocals").click(function(){
		window.location = "store_list.html?sku="+qsParm["sku"]+"&store="+qsParm["store"];
	});

	$("img").on('error', function(){
			$(this).attr("src","../img/noImage.jpg");		
	});

	$(".btnReturn").click(function(){
		var currentPage = location.href;
		var rowid, count;
		if (afterHomePage==currentPage){
		localStorage.flag=2;		
		}
		window.history.back();
		
	});
	$(".btnHome").click(function(){
			localStorage.flag=1;
		 	window.location = "../index.html";
	});
	
  $(".btnScanProduct").click(function(){
    localStorage.flag=2;
    var db = openDatabase("AppPreferences", "1.0", "Save local preferences", 2 * 1024 * 1024);
      db.transaction(function (tx) {  
        tx.executeSql("DELETE FROM ProductSearched",[],function(tx,success){
           window.location = "../index.html";
        },null);
      });
   
  });

  $(".img-responsive").click(function(){
		var path=$(this).attr("src");
		$("#zoomImage").trigger('zoom.destroy');
		$("#zoomImage").children().attr("src",path);
		$('#zoomImage').zoom({ on:'toggle' });

	});

  function ImageExist(url) 
	{
   var img = new Image();
   img.src = url;
   return img.height != 0;
	}

	function startCarrousel(){
		$('#myCarousel').carousel({
	 	  interval: 3000
	   });

	 	$('.carousel .item').each(function(){
		   var next = $(this).next();
		   if (!next.length) {
		     next = $(this).siblings(':first');
		   }
		   next.children(':first-child').clone().appendTo($(this));

		   if (next.next().length>0) {
		  
		       next.next().children(':first-child').clone().appendTo($(this)).addClass('rightest');
		       
		   }
		   else {
		       $(this).siblings(':first').children(':first-child').clone().appendTo($(this));
		      
		   }
	 	});
	}	

		
	
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

 	$("#modal-container-submit").on("shown.bs.modal",function(){
  	 $("#selectDomain").val("Other");
  	 $("#selectDomain").change();
  	 $("#clientEmail").focus();
  });

	$("#longDescriptionContent").buildMbExtruder({
          positionFixed:true,
          width:720,
          sensibility:800,
          position:"right", // left, right, bottom
          extruderOpacity:1,
          flapDim:100,
          textOrientation:"tb", // or "tb" (top-bottom or bottom-top)
          onExtOpen:function(){},
          onExtContentLoad:function(){},
          onExtClose:function(){},
          hidePanelsOnClose:true,
          autoCloseTime:0, // 0=never
          slideTimer:500
  });
  
 $(".flapLabel").text("Technical Description");

	function readParameters() {
		    var query = window.location.search.substring(1);
		    var parms = query.split('&');
		    for (var i=0; i < parms.length; i++) {
		        var pos = parms[i].indexOf('=');
		        if (pos > 0) {
		            var key = parms[i].substring(0, pos);
		            var val = parms[i].substring(pos + 1);
		            qsParm[key] = val;
		        }
		    }
	}


	function init() {
	 	var db = openDatabase("AppPreferences", "1.0", "Save local preferences", 2 * 1024 * 1024);
	 	var currentPage = location.href;
		db.transaction(function (tx) {  
			tx.executeSql("INSERT INTO History (Url) VALUES (?)",[currentPage],function(tx,success){},function(tx,e){}); 
		});
		db.transaction(function (tx) {
		   	tx.executeSql("SELECT * FROM History", [], function (tx, results) {
		      afterHomePage = results.rows.item(1).Url;
			},null);
		});	

	}

	function submitEmail(email){

		$.ajax({
            type: "GET",
            url: "http://"+ localStorage.webIp + "/KioskoServices/Service.svc/SubmitEmail/"+email,
            async: false,
            dataType: "json",
            crossdomain: true,
            success:function(result){
            	$.each(result, function( index, value) {
							 	if (value==true){
									toastr.success("Successful subscription!");
									$("#toast-container").effect("slide","slow");
									$("#modal-container-submit").modal("hide");
								}
								else{
									toastr.error("Invalid email or it is already subscripted!");
									$("#toast-container").effect("bounce");

								}
							});
          	
            },
            error:function(error) {
				 	  	 toastr.error("Try again please!");
				 	  	$("#toast-container").effect("bounce");
				 	 	}
					});
	}

	
});

