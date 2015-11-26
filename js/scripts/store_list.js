

$(document).ready(function(){
  
	var qsParm = new Array();
  var zipValue, stateValue,cityValue,fromValue,addressValue;
 	qs();

	$.ajax({		
          type: "GET",
          url: "http://"+ localStorage.webIp + "/KioskoServices/Service.svc/GetOtherLocations/"+qsParm["sku"]+"/"+qsParm["store"],
          async: false,
          dataType: "json",
          crossdomain: true,          
          success:function(result){
          	var data = result.GetOtherLocationsResult;
          	var colorName= "blueSock";
            var count=0;
            if (data!= null ){
            	  if (data.length>0 ){
                  $.each(data, function( index, value) {
                 		index= index+1;
                 		if (index>2) index=index%2;

                 		if ((index%2)==0){
                 			colorName="redSock";
                 		}
                 		//else if (index==1){
                 			//colorName="greenSock";
                 		//}
                 		else{
                 			colorName="greenSock";
                 		}

                 		var stock= (parseFloat(value.OnHandQty)).toFixed(0);
                 		var template= _.template($("#storeSec").html());
                		var html= template ({
                            			storeName: value.StoreName,
                            			address: value.Address1 ,
                            			phone: value.Phone1,
                            			stock: stock,
                            			emailAddress: value.StoreEmail,
                            			color: colorName,
                                  state: value.State,
                                  city: value.City,
                                  zipCode: value.ZipCode,
                                  fromStore: value.fromstore,
                                  index: count
                            	 });

                		$(".storeList").append(html);
                    count=count+1;
                	});
               
                
                for (var i = 0; i <= count; i++) {
                  var element = "#item"+i;
                  $(element).delay(i*100).effect("slide",500);
                };
            }
            else{
               $(".lblNoStores").show();
            }
          }
          else{
            $(".lblNoStores").show();
          }
         // setTimeout(function(){$(".loader").removeClass("show").addClass("hide");},1000);                  
        },
        error: function(error) {
			 	  toastr.error("error = " + error.status +" "+error.statusText);
         //setTimeout(function(){$(".loader").removeClass("show").addClass("hide");},1000);
			 	}

         
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


  $(".btnHome").click(function(){
      localStorage.flag=1;
      window.location = "../index.html";
  });

  $(document).on("click",".btn-Email",function(e){
    zipValue= $(this).next().children(".zipcode").text();
    stateValue= $(this).next().children(".state").text();
    cityValue= $(this).next().children(".city").text();
    fromValue= ($(this).next().children(".fromStore").text()).trim().replace(/\s+/g," ");
    addressValue= ($(this).closest("div").prev().children("p:first-child").text()).trim().replace(/\s+/g," ");

  });

  $("img").on('error', function(){
      $(this).attr("src","../img/noImage.jpg");   
  });


  $("#sendEmailfromStore").click(function(){
    var toValue= addressValue + " " +cityValue+ " " + stateValue+ " " + zipValue;
    var domain = $("#selectSendDomain option:selected").val();
    var email=$("#clientEmailfromStore").val();
    var errorDomain= (email.match(/.com/g) || []).length;
    var errorSintax= (email.match(/@/g) || []).length;
    var checkDom = email.lastIndexOf("@");
    var resultDom = email.substring(checkDom + 1);
    var whitespaces = email.lastIndexOf(" ");  

      if(domain=="Other"){
          if(email.length!=0 && whitespaces==-1 && (errorDomain<=1 && errorSintax==1) && (resultDom!=email && resultDom.trim().length>0 )){
            sendEmail(email,fromValue,toValue);
            $("#clientEmailfromStore").val("");            
          }
          else{
            if (localStorage.current_lang == "es") { toastr.info("Por favor, ingrese un email v\u00E1lido!", "", { timeOut: 1000 }); } else { toastr.info("Please, enter a valid email!", "", { timeOut: 1000 }); }
            $("#toast-container").effect("bounce");
          }
        } 
        else{
          email=email.trim()+"@"+domain
          if(email.length!=0 && whitespaces==-1 && (errorDomain<=1 && errorSintax==0)){
            sendEmail(email,fromValue,toValue);
          }
          else{
           if (localStorage.current_lang == "es") { toastr.info("Por favor, ingrese un email v\u00E1lido!", "", { timeOut: 1000 }); } else { toastr.info("Please, enter a valid email!", "", { timeOut: 1000 }); }
           $("#toast-container").effect("bounce");
          }

        }    
    
  });
	

  $("#modal-container-submit").on("shown.bs.modal",function(){
     $("#selectDomain").change();
     $("#clientEmail").focus();
  });

  $("#modal-email").on("shown.bs.modal",function(){
     $("#selectSendDomain").change();
     $("#clientEmailfromStore").focus();
  });

  function qs() {
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


  function sendEmail(emailValue,fromValue,toValue){
     $.ajax({
          type: "GET",
          url: "http://"+ localStorage.webIp + "/KioskoServices/Service.svc/SendMail/"+emailValue+"/"+fromValue+"/"+toValue+"/"+qsParm["store"],
          async: false,
          dataType: "json",
          crossdomain: true,
          success:function(result){
            var isSuccessfull= result.SendMailResult;
            if (isSuccessfull == true){
              if (localStorage.current_lang == "es") { toastr.success("Email enviado correctamente"); } else { toastr.success("Email sent successfully"); }
              $("#toast-container").effect("slide","slow");
              $("#modal-email").modal("hide");
            }
            else{
              if (localStorage.current_lang == "es") { toastr.info("Int\u00e9ntelo nuevamente, por favor"); } else { toastr.info("Try again, please"); }             
              $("#toast-container").effect("bounce");
            }
          },
          error: function(error) {
            toastr.error("error = " + error.status +" "+error.statusText);
            $("#toast-container").effect("bounce");
          }
    });
  }
  

});




