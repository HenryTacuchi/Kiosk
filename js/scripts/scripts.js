$(document).ready(function(){

	$('#cleanInputProduct').click(function(){
		$('#skuCode').val("");
		$('#skuCode').focus();
		$('#sizeOptions option').remove();
	});

	//Carousel
	$('#myCarousel').carousel({
	  interval: 3500
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



	$("#cancelClientEmail").click(function(){
		$("#modal-container-submit").modal("hide");
	});
	$("#cancelClientEmail2").click(function(){
		$("#modal-email").modal("hide");
	});

	$('#cancelEmailfromStore').click(function(){
		$("#modal-email").modal('hide');
	});
	$('#cancelModalKey').click(function(){
		$('#modal-key').modal('hide');
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

	$('.thumbnail img').hover(function(){
		$(this).effect("shake");
	});


	$('#homeScreen').click(function(){
		$(this).effect("fade","slow");
		$("#skuCode").focus();
	});

});