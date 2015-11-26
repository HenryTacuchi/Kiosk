
$(document).ready(function(){

  loadImages();

  loadCombos(); 

	$('#cleanInputProduct').click(function(){
		$('#skuCode').val("");
		$('#skuCode').focus();
		$('#sizeOptions option').remove();
	});

	/* center modal */
	function centerModals($element) {
	  var $modals;
	  if ($element.length) {
	    $modals = $element;
	  } else {
	    $modals = $('.modal-vcenter:visible');
	  }
	  $modals.each( function(i) {
	    var $clone = $(this).clone().css('display', 'block').appendTo('body');
	    var top = Math.round(($clone.height() - $clone.find('.modal-content').height()) / 2);
	    top = top > 0 ? top : 0;
	    $clone.remove();
	    $(this).find('.modal-content').css("margin-top", top).css("transition", "all 0.2s").css("-webkit-transition", "all 0.2s");
	  });
	}

	$('.modal-vcenter').on('show.bs.modal', function(e) {
	  centerModals($(this));
	});

	function loadImages(){
		$(".logoCompany").attr("src",localStorage.logo);			
	}

  function loadCombos(){

  	var otherOption = "Other"; 
  	if(localStorage.current_lang == "es") otherOption = "Otro";

  	$("#selectDomain option[value = 'Other']").text(otherOption);
  	$("#selectDomain").val("Other");
  	$('#selectDomain').selectmenu().selectmenu( "menuWidget");

  	$("#selectRecoveryDomain option[value = 'Other']").text(otherOption);
  	$('#selectRecoveryDomain').val("Other");
		$('#selectRecoveryDomain').selectmenu().selectmenu( "menuWidget");

	  $("#selectSendDomain option[value = 'Other']").text(otherOption);
	  $('#selectSendDomain').val("Other");
	  $('#selectSendDomain').selectmenu().selectmenu( "menuWidget");   

	  $('#sizeOptions').selectmenu().selectmenu("menuWidget").addClass("overflow");
	  $('#sizeOptions').selectmenu( "disable" );
	}
	
	$(window).on('resize', centerModals);



	$(".img-responsive").error(function(){
		if (indexPage)
		$(this).attr("src","../img/noImage.jpg");
	});
	
	$("#cancelClientEmail").click(function(){
		$("#modal-container-submit").modal("hide");
	});
	$("#cancelClientEmail2").click(function(){
		$("#modal-email").modal("hide");
	});

	$('#cancelEmailfromStore').click(function(){
		$("#modal-email").modal('hide');
	});

	$('.lblMessageOtherDomain').hide();


	$('#selectDomain').change(function(){
		var toCompare = $('#selectDomain option:selected').val();
		if(toCompare == "Other"){
			$('.lblArroba').css('opacity','0');
			$('.lblMessageOtherDomain').show().effect("slide");
		}else{
			$('.lblArroba').css('opacity','1');
			$('.lblMessageOtherDomain').slideUp("fast");
		}
	});
	$('#selectDomain-menu').click(function(){
		$('#selectDomain').change();
	});

$('#selectDomainSettings').change(function(){
		var toCompare = $('#selectDomainSettings option:selected').val();
		if(toCompare == "Other"){
			$('.lblArroba').css('opacity','0');
			$('.lblMessageOtherDomain').show().effect("slide");
		}else{
			$('.lblArroba').css('opacity','1');
			$('.lblMessageOtherDomain').slideUp("fast");
		}
	});
	$(document).on("click","#selectDomainSettings-menu",function(){
		$('#selectDomainSettings').change();
	});


	$('#selectSendDomain').change(function(){
		var toCompare = $('#selectSendDomain option:selected').val();
		console.log("value = " +  toCompare);
		if(toCompare == "Other"){
			$('.lblArroba').css('opacity','0');
			$('.lblMessageOtherDomain').show().effect("slide");
		}else{
			$('.lblArroba').css('opacity','1');
			$('.lblMessageOtherDomain').slideUp("fast");
		}
	});
	$('#selectSendDomain-menu').click(function(){
		$('#selectSendDomain').change();
	});

	$('#selectRecoveryDomain').change(function(){
		console.log("df");
		var toCompare = $('#selectRecoveryDomain option:selected').val();
		if(toCompare == "Other"){
			$('.lblArroba').css('opacity','0');
			$('.lblMessageOtherDomain').show().effect("slide");
		}else{
			$('.lblArroba').css('opacity','1');
			$('.lblMessageOtherDomain').slideUp("fast");
		}
	});
	$('#selectRecoveryDomain-menu').click(function(){
		$('#selectRecoveryDomain').change();
	});

	$('#homeScreen').click(function(){
		$(this).effect("fade","slow");
		$("#skuCode").focus();
	});

	$('#btnRecovery').click(function(){
		$('.hideRecovery').show();
		$('.btnHideRecovery').show();
		centerModals($('#modal-key'));
	});
	$("#btnHideSection").click(function(){
		$('.hideRecovery').hide();
		$('.btnHideRecovery').hide();
		centerModals($('#modal-key'));
	});




	if(localStorage.current_lang == "es"){		
		$('.scanProduct h1').text("1. Escanee el producto");
		$('.selectSize h1').text("2. Seleccione la talla");
		$('.coolMessage').text("¡Suscr\u00EDbete y te sorprenderemos!");
		$('.btnSubmit .lblOption').text("Subscribir");
		$('.btnHome .lblOption').text("Inicio");
		$('.btnKey .lblOption').text("Admin");
		$('.btnConfig .lblOption').text("Config");
		$('.btnSizeChart .lblOption').text("Maestro de Tallas");
		$('#lblSizeChart').text("Maestro de Tallas");		
		$('.btnRefresh .lblOption').text("Actualizar");
		$('.btnContinue .lblOption').text("Continuar");
		$('#lblSelect').text("Seleccione la tienda a la que desea ir");
		$('.btnReturn .lblOption').text("Atr\u00E1s");
		$('.btnBack .lblOption').text("Atr\u00E1s");
		$('.btnScanProduct .lblOption').text("Escanear producto");
		$('#lblMessageNoStores').text("No hay tiendas disponibles");
		

		$('#tabs-sizes li:nth-child(1) a').text("Mujer");
		$('#tabs-sizes li:nth-child(2) a').text("Hombre");
		$('#tabs-sizes li:nth-child(3) a').text("Ni\u00F1as");
		$('#tabs-sizes li:nth-child(4) a').text("Ni\u00F1os");

		$('.sizesFields thead tr th:nth-child(1)').text("Britania");
		$('.sizesFields thead tr th:nth-child(2)').text("Europa");
		$('.sizesFields thead tr th:nth-child(3)').text("Am\u00E9rica");
		$('.sizesFields thead tr th:nth-child(4)').text("Jap\u00f3n");

		//Modales---
		//Submit
		$('#modal-container-submit .modalTitle').text("Por favor, escriba su Email");
		$('.lblMessageOtherDomain').text("Complete su email aqu\u00ED");
		$('#submitClientEmail').text("Enviar");
		$('#cancelClientEmail').text("Cancelar");

		//Submit Send Email
		$('#modal-email .modalTitle').text("Por favor, escriba su Email");
		$('.lblMessageOtherDomain').text("Complete su email aqu\u00ED");
		$('#sendEmailfromStore').text("Enviar");
		$('#cancelEmailfromStore').text("Cancelar");

		//Key
		$('#modal-key .modalTitle').text("Ingrese su Contrase\u00F1a");
		$('#lockSettings').text("Hecho");
		$('#cancelSettings').text("Cancelar");
		$('#btnRecovery').text("Recuperar Contrase\u00F1a");
		$('#btnHideSection').text("Cerrar");
		$('#btnRecoverySend').text("Recuperar");

		//storeList Page
		// $('#lblStyle').text("Estilo:");
		$('.btnLink').text("Ver Producto");
		$('#relatedItemsTitle').text("Productos Relacionados en la Tienda");
		$('.btnLongDescription').text("Descripci\u00F3n T\u00E9cnica");
		$('.lblAvailability').text("Disponibilidad:");
		$('.lblStyle').text("Estilo:");
		$('.lblPrice').text("Precio:");
		$('.lblSize').text("Talla:");
		$('.lblUnits').text("Unid:");
		$('#lblMessageResultProducts').text("Lo sentimos, no hay productos encontrados.");
		$('.btnCheckLocals .lblOption').text("Buscar Otras Tiendas");

		$('#modal-settings .modalTitle').text("Debe completar sus preferencias antes de empezar!");
		$('#goSettings').text("Ir");

		//Config
		$('#lbltitleConfig').text("Configuraci\u00F3n de la Tienda");
		$('.lblStoreNo').text("Tienda No:");
		$('.lblStoreName').text("Nombre Tienda:");
		$('#lbltitleConfig').text("Configuraci\u00F3n de la Tienda");
		$('.lblWebService').text("IP del Servidor");
		$('.lblRecoveryEmail').text("Correo de Recuperaci\u00F3n");
		$('#btnConfiguration').text("Guardar Configuraci\u00F3n");

		$('#lbltitleChangePass').text("Cambiar Contrase\u00F1a");
		$('.lblPassword').text("Contrase\u00F1a");
		$('.lblNewPassword').text("Nueva Contrase\u00F1a");
		$('.lblNewPasswordRepeat').text("Repetir Contrase\u00F1a");	
		$('#btnPassword').text("Guardar Contrase\u00F1a");

		$('.btnConfirm .lblOption').text("Aceptar");

		$('#invalidPassword').text("Contrase\u00F1a Incorrecta");
	}else{ 
		//English Language
		$('.scanProduct h1').text("1. Scan the product");
		$('.selectSize h1').text("2. Select your size");
		$('.coolMessage').text("Sign up to win something cool!");
		$('.btnSubmit .lblOption').text("Submit");
		$('.btnHome .lblOption').text("Home");
		$('.btnKey .lblOption').text("Key");
		$('.btnConfig .lblOption').text("Config");
		$('.btnSizeChart .lblOption').text("Size Chart");
		$('#lblSizeChart').text("Size Chart");		
		$('.btnRefresh .lblOption').text("Refresh");
		$('.btnContinue .lblOption').text("Continue");
		$('#lblSelect').text("Select the Email Store to get the Store Directions");
		$('.btnReturn .lblOption').text("Return");
		$('.btnBack .lblOption').text("Return");
		$('.btnScanProduct .lblOption').text("Scan Product");
		$('#lblMessageNoStores').text("No Stores Avaliable");
		

		$('#tabs-sizes li:nth-child(1) a').text("Women");
		$('#tabs-sizes li:nth-child(2) a').text("Men");
		$('#tabs-sizes li:nth-child(3) a').text("Boys");
		$('#tabs-sizes li:nth-child(4) a').text("Girls");

		$('.sizesFields thead tr th:nth-child(1)').text("British");
		$('.sizesFields thead tr th:nth-child(2)').text("European");
		$('.sizesFields thead tr th:nth-child(3)').text("American");
		$('.sizesFields thead tr th:nth-child(4)').text("Japanese");

		//Modales---
		//Submit
		$('#modal-container-submit .modalTitle').text("Please, write your email");
		$('.lblMessageOtherDomain').text("Complete your email here");
		$('#submitClientEmail').text("Send");
		$('#cancelClientEmail').text("Cancel");

		//Submit Send Email
		$('#modal-email .modalTitle').text("Please, write your email");
		$('.lblMessageOtherDomain').text("Complete your email here");
		$('#sendEmailfromStore').text("Send");
		$('#cancelEmailfromStore').text("Cancel");

		//Key
		$('#modal-key .modalTitle').text("Write your Password");
		$('#lockSettings').text("Done");
		$('#cancelSettings').text("Cancel");
		$('#btnRecovery').text("Recovery Password");
		$('#btnHideSection').text("Close");
		$('#btnRecoverySend').text("Recovery");

		//storeList Page
		// $('#lblStyle').text("Estilo:");
		$('.btnLink').text("View Product:");
		$('#relatedItemsTitle').text("Retaled items avaliable in store");
		$('.btnLongDescription').text("Technical Description");
		$('.lblAvailability').text("Available:");
		$('.lblStyle').text("Style:");
		$('.lblPrice').text("Price:");
		$('.lblSize').text("Size:");
		$('.lblUnits').text("Unit");
		$('#lblMessageResultProducts').text("Sorry, no products found.");
		$('.btnCheckLocals .lblOption').text("Check Other Stores");

		$('#modal-settings .modalTitle').text("You must complete your preferences before you start!");
		$('#goSettings').text("Go");

		//Config
		$('#lbltitleConfig').text("Store Settings");
		$('.lblStoreNo').text("Store No:");
		$('.lblStoreName').text("Store Name:");
		$('#lbltitleConfig').text("Store Settings");
		$('.lblWebService').text("Server IP:");
		$('.lblRecoveryEmail').text("Recovery Email");
		$('#btnConfiguration').text("Save Configuration");

		$('#lbltitleChangePass').text("Change Password");
		$('.lblPassword').text("Password");
		$('.lblNewPassword').text("New Password");
		$('.lblNewPasswordRepeat').text("Repeat Password");	
		$('#btnPassword').text("Save Password");

		$('.btnConfirm .lblOption').text("Accept");

		$('#invalidPassword').text("Wrong Password!");
	}



 $("#submitClientEmail").click(function(){
      var domain = $("#selectDomain option:selected").val();
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
            if (localStorage.current_lang == "es") { toastr.info("Por favor, ingrese un email v\u00E1lido!", "", { timeOut: 1000 }); } else { toastr.info("Please, enter a valid email!", "", { timeOut: 1000 }); }
            $("#toast-container").effect("bounce");
          }
        } 
        else{
          email=email+"@"+domain
          if(email.length!=0 && whitespaces==-1 && (errorDomain<=1 && errorSintax==0)){
            submitEmail(email);
          }
          else{
            if (localStorage.current_lang == "es") { toastr.info("Por favor, ingrese un email v\u00E1lido!", "", { timeOut: 1000 }); } else { toastr.info("Please, enter a valid email!", "", { timeOut: 1000 }); }
            $("#toast-container").effect("bounce");
          }

        } 
      
  });

function submitEmail(email){

		$.ajax({
            type: "POST",
            url: "http://"+ localStorage.webIp + "/KioskoServices/Service.svc/SubmitEmailPost",
            async: false,
            contentType: "application/json",
            data: JSON.stringify({"email": email}),
            crossdomain: true,
            success:function(result){
            	 	if (result==true){
								    if (localStorage.current_lang == "es") { toastr.success("Susbscripci\u00f3n exitosa"); } else { toastr.success("Successful subscription!"); }
                    $("#toast-container").effect("slide", "slow");
                    $("#modal-container-submit").modal("hide");
								}
								else{
									  if (localStorage.current_lang == "es") { toastr.error("Correo incorrecto o ya est\u00e1 registrado!", "", { timeOut: 1000 }); } else { toastr.error("Invalid email or it is already subscripted!", "", { timeOut: 1000 }); }
                    $("#toast-container").effect("bounce");
								}
						
          	
            },
            error:function(error) {
				 	  	 if (localStorage.current_lang == "es") { toastr.info("Int\u00e9ntelo nuevamente, por favor"); } else { toastr.info("Try again, please"); }
               $("#toast-container").effect("bounce");
				 	 	}
					});
	}

	   

});
$(window).load(function() {	
	$(".loader").removeClass("show").addClass("hide");
	 
    $("body").mCustomScrollbar({
	    theme:"minimal",
			scrollButtons:{
			enable:true
			}
		});	
    imagesResponsive();
});

var widthImage  = null;
var sectionMainImage = $('.sectionMainImage').width();

var sectionRelatedImage = $('.productsRelated div').width();

function imagesResponsive(){
	widthImage = $(".mainImage").width();			
	$(".img-responsive").width(widthImage/4);
	$(".img-responsive").height(widthImage/4);
	$(".img-responsive").css('margin-bottom',widthImage/16- widthImage/32);
	$(".btnLongDescription").css('margin-top',widthImage/16 - widthImage/18);


	$(".thumbnail img").width(sectionRelatedImage);
	$(".thumbnail img").height(sectionRelatedImage);
}

$(window).load(function() {
	$(".mainImage").width(sectionMainImage);
	$(".mainImage").height(sectionMainImage);

	imagesResponsive();
});

$(window).resize(function() {
	
	$(".mainImage").width('100%');
	$(".mainImage").height('100%');

	imagesResponsive();
	
});