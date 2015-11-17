$(document).ready(function(){

	$(".loader").removeClass("hide").addClass("show");
	var qsParm = new Array();
	var afterHomePage;
	var opened;	 
	readParameters();
	init();
		$.ajax({
          type: "GET",
          url: "http://"+ localStorage.webIp+"/KioskoServices/Service.svc/GetSKUInfo/"+qsParm["sku"]+"/"+qsParm["size"]+"/"+qsParm["store"],
          async: false,
          dataType: "json",
          crossdomain: true,
          complete:function(){
          	//setTimeout(function(){$(".loader").removeClass("show").addClass("hide");},3000);        	     	
          },
          success:function(result){
          	var data = result.GetSKUInfoResult;
          	var currencySymbol;
          	$.each(data, function( index, value){
						
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
          		var units = (parseFloat(value.OnHandQty)).toFixed(0);
          		var unit = units.toString();
          		
          		if (localStorage.current_lang == "es"){
                    if (value.OnHandQty > 0) {
                        $("#txtStock").text("EN STOCK, "+ unit +" unid." ).addClass("available");
                    }
                    else {
                        $("#txtStock").text("SIN STOCK").addClass("no-available");
                    }
                    
                    //$("#txtUnits").text(unit +" unid.");
                        
              }
              else {
                   if (value.OnHandQty > 0) {
                        $("#txtStock").text("IN STOCK, "+ unit+" units" ).addClass("available");
                    }
                   else {
                        $("#txtStock").text("OUT STOCK").addClass("no-available");
                    }                        
                    //$("#txtUnits").text(unit+" units");
             } 
             	var title;     		
              if (localStorage.current_lang == "es") { title= "<h3>Descripci\u00f3n T\u00e9cnica<h3>";}     
              else{ title= "<h3>Technical Description<h3>";}          					
             	 
             	;
          		$("#longDescriptionContent").append(title+value.LongDescription);
          		//$("#longDescriptionSingleImage").text(value.LongDescription);

          		// Retrieve images
          		images=value.ImagePath;
          		if(images.length>1){
          			$("#longDescriptionContent").show();
	          		$.each(images, function( index, value) {
	          				if(index==0){
		          				$("#zoomImage").children().attr("src",value.Path);
		          					path= value.Path;
				          				var template= _.template($("#carouselTemplate").html());
				            			var html= template ({
									            				active: "active",
									            				path: path 
									            			});            	
				            			$(".carousel-inner").append(html);		          					
		          			}
		          			else{
				          				//var active, path;
					          				//if (index==1){
					          					//active="active";
					          				//}	
					          				//else{
					          				//	active="";
					          				//}
				          			  //var exists= ImageExist(value.Path);
				          				//if (exists == true) {path= value.Path;}
			          					//else{path= "../img/noImage.jpg"}		          				
			          					path= value.Path;
			          					var template;
			          					template= _.template($("#carouselTemplate").html());			          							          				
				            			var html= template ({
									            				active: "active",
									            				path: path 
									            			});            	
				            			$(".carousel-inner").append(html);
		          			}  
		          		});
		          	//startCarrousel();

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
						//setTimeout(function(){$(".loader").removeClass("show").addClass("hide");},1000);                		  	
 					},       					
				  error: function(error) {
			 	  	toastr.error("error = " + error.status +" "+error.statusText);			 	  
			    }
			                
  });
	
	$(".btnCheckLocals").click(function(){
		 $(".loader").removeClass("hide").addClass("show");
     window.location = "store_list.html?sku=" + qsParm["sku"] + "&store=" + qsParm["store"]; 
	});

	$("img").on('error', function(){
		if (localStorage.current_lang == "es") {
        $(this).attr("src", "../img/noImageEs.jpg");            
    }
    else {
        $(this).attr("src", "../img/noImage.jpg");
    }	
	});

	$(".btnReturn").click(function(){
		var currentPage = location.href;
		var rowid, count;
		if (afterHomePage==currentPage){
		localStorage.flag=2;
		window.location= "../index.html"
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
 
 $(".thumbnail").click(function(){
   $(".loader").removeClass("hide").addClass("show");    
 });

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
		
	

 	$("#modal-container-submit").on("shown.bs.modal",function(){
  	 $("#selectDomain").val("Other");
  	 $("#selectDomain").change();
  	 $("#clientEmail").focus();
  	});

  $("#longDescriptionContent").click(function(){
		  if (localStorage.opened!=1) $("#longDescriptionContent").closeMbExtruder();
		  localStorage.opened=0;
		 		  
	});
  $(".btnLongDescription").click(function(){		  
			localStorage.opened=1;
			$(".flap").click();		 

  })

	$("#longDescriptionContent").buildMbExtruder({
          positionFixed:true,
          width:720,
          sensibility:1000,
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

if(localStorage.current_lang == "es"){
	 $(".flapLabel").text("Descripci\u00F3n T\u00E9cnica");
}
else{
	$(".flapLabel").text("Technical Description");
}

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

	
	
});

$(window).load(function(){
	$(".loader").removeClass("show").addClass("hide");
    $(".extruder-content").mCustomScrollbar({
    	theme:"rounded-dark",
    	live: "on",
    	scrollButtons:{ enable: true }
    });	
    				            
});

