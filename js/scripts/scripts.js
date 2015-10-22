$(document).ready(function(){

	var currentPage = location.href;
	var indexPage="";
	init();
	loadImages();
  

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
	    $(this).find('.modal-content').css("margin-top", top);
	  });
	}

	$('.modal-vcenter').on('show.bs.modal', function(e) {
	  centerModals($(this));
	});

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
		var toCompare = $('#selectDomain option:selected').text();
		if(toCompare == "Other"){
			$('.lblArroba').css('opacity','0');
			$('.lblMessageOtherDomain').show().effect("slide");
		}else{
			$('.lblArroba').css('opacity','1');
			$('.lblMessageOtherDomain').slideUp("fast");
		}
	});
	$('#selectSendDomain').change(function(){
		var toCompare = $('#selectSendDomain option:selected').text();
		if(toCompare == "Other"){
			$('.lblArroba').css('opacity','0');
			$('.lblMessageOtherDomain').show().effect("slide");
		}else{
			$('.lblArroba').css('opacity','1');
			$('.lblMessageOtherDomain').slideUp("fast");
		}
	});
	$('#selectRecoveryDomain').change(function(){
		console.log("df");
		var toCompare = $('#selectRecoveryDomain option:selected').text();
		if(toCompare == "Other"){
			$('.lblArroba').css('opacity','0');
			$('.lblMessageOtherDomain').show().effect("slide");
		}else{
			$('.lblArroba').css('opacity','1');
			$('.lblMessageOtherDomain').slideUp("fast");
		}
	});

	$('.thumbnail img').hover(function(){
		$(this).effect("shake");
	});


	$('#homeScreen').click(function(){
		$(this).effect("fade","slow");
		$("#skuCode").focus();
	});

	$('#btnRecovery').click(function(){
		$('.hideRecovery').show();
		$('.btnHideRecovery').show();
	});

	$(".btnBack").click(function(){
		var currentPage = location.href;
		var rowid, count;
		if (afterHomePage==currentPage){
		localStorage.flag=2;		
		}
		window.history.back();
		
	});

	function init() {
	 	var db = openDatabase("AppPreferences", "1.0", "Save local preferences", 2 * 1024 * 1024);
	 	var currentPage = location.href;
		db.transaction(function (tx) {  
			tx.executeSql("INSERT INTO History (Url) VALUES (?)",[currentPage],function(tx,success){},function(tx,e){}); 
		});
		db.transaction(function (tx) {
		   	tx.executeSql("SELECT * FROM History", [], function (tx, results) {
		      afterHomePage = results.rows.item(1).Url;
		      indexPage= results.rows.item(0).Url;
			},null);
		});	

	}

	function loadImages(){
		$(".logoCompany").attr("src",localStorage.logo);
		$(".homeScreen").attr("src",localStorage.home);		
	}

	$('#btnHideSection').click(function(){
		$('.btnHideRecovery').hide();
		$('.hideRecovery').hide();
	});
	$('#cancelSettings').click(function(){
		$('#btnHideSection').click();
	});



	if(localStorage.current_lang = "es"){

		$('#lblWelcome').text( " Bienvenido a RCS" );
		
	}

});


document.onkeydown = keydown;

function keydown(evt){
  if (!evt) evt = event;
  if (evt.ctrlKey && evt.altKey && evt.keyCode==115){ //CTRL+ALT+F4
    alert("CTRL+ALT+F4"); 
  }
  else if (evt.shiftKey && evt.keyCode == 9){ //Shif+TAB
    alert("Shift+TAB");
  }
}


