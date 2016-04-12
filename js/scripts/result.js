
$(document).ready(function () {

    // hides the loader screen
    $(".loader").removeClass("hide").addClass("show");
    var qsParm = new Array();
    var afterHomePage;
    var tmpImg;

    //get values from url
    readParameters();

    //save the history pages for the returning process
    init();

    //fill product information and related products
        $.ajax({
        type: "GET",
        url: "http://" + localStorage.webIP + "/KioskoServices/Service.svc/GetSKUInfo/" + qsParm["sku"] + "/" + qsParm["size"] + "/" + qsParm["store"],
        async: false,
        dataType: "json",
        crossdomain: true,        
        success: function (result) {
            var data = result.GetSKUInfoResult;
            var currencySymbol;
            if (data != null) {
                // first, product information
                $.each(data, function (index, value) {
                    var price = (parseFloat(value.RetailPrice)).toFixed(2);
                    $(".shortDescription").text(value.Description);
                    $("#txtStyle").text(value.Style);
                    localStorage.SKU = value.Sku;
                    $("#txtSize").text(value.SizeCode);
                    var units = (parseFloat(value.OnHandQty)).toFixed(0);
                    var unit = units.toString();
                    if (value.CurrencyName == "NUEVOS SOLES") {
                        currencySymbol = "S/. ";
                    } else {
                        currencySymbol = "$ ";
                    }
                    $("#txtPrice").text(currencySymbol + price);
                    if (localStorage.current_lang == "es") {
                        if (value.OnHandQty > 0) {
                            $("#txtStock").text("EN STOCK, " + unit + " unid.").addClass("available");
                        }
                        else {
                            $("#txtStock").text("SIN STOCK").addClass("no-available");
                        }
                        
                    }
                    else {
                        if (value.OnHandQty > 0) {
                            $("#txtStock").text("IN STOCK, " + unit + " units").addClass("available");
                        }
                        else {
                            $("#txtStock").text("OUT STOCK").addClass("no-available");
                        }                        
                    }

                    $("#txtColor").text(value.colorName);
                    $("#txtSize").text(value.SizeCode);
                    var title;
                    if (localStorage.current_lang == "es") { title = "<h3>Descripci\u00f3n T\u00e9cnica<h3>"; }
                    else { title = "<h3>Technical Description<h3>"; }
                    $("#longDescriptionContent").append(title + value.LongDescription);
                    $('.technicalTemp').append(title + value.LongDescription);

                    // Retrieve images for product searched                
                    images = value.ImagePath;
                    var noImage;
                    if (images.length > 1) {
                        $("#longDescriptionContent").show();
                        $.each(images, function (index, value) {
                            if (index == 0) {
                                var i = new Image;
                                i.onload = function () { localStorage.size= this.width; }
                                i.src = value.Path;

                                if (localStorage.current_lang == "es") {
                                    $("#zoomImage").children().css("background-image", "url(" + value.Path + "), url('../img/noImageEs.jpg')");
                                    noImage= "../img/noImageEs.jpg";
                                       
                                }
                                else {
                                    $("#zoomImage").children().css("background-image", "url(" + value.Path + "), url('../img/noImage.jpg')");
                                    noImage= "../img/noImage.jpg";
                                }

                                path = value.Path;
                                var template = _.template($("#carouselTemplate").html());
                                var html = template({
                                    active: "active",
                                    path: path,
                                    noImage: noImage
                                });
                                $(".carousel-inner").append(html);
                               
                            }
                            else {
                                path = value.Path;
                                var template = _.template($("#carouselTemplate").html());
                                var html = template({
                                    active: "active",
                                    path: path,
                                    noImage: noImage
                                });
                                $(".carousel-inner").append(html);
                            }
                        });                       
                    }
                    else if (images.length == 0) {
                        $.each(images, function (index, value) {
                            $("#zoomImage").children().css("background-image", "url(" + value.Path + ")");
                        });
                        $("#myCarousel").hide();
                        $("#technicalDescriptionPanel").show();
                    }

                    // Retrieve related products
                    $.ajax({
                        type: "GET",
                        url: "http://" + localStorage.webIP + "/KioskoServices/Service.svc/GetRelatedProduct/" + localStorage.SKU + "/" + qsParm["store"],
                        async: false,
                        dataType: "json",
                        crossdomain: true,
                        success: function (relatedProducts) {
                            var relatedProducts = relatedProducts.GetRelatedProductResult;
                            var elements = relatedProducts.length;
                            var colDivision;
                            if (elements > 0) {
                                if (elements == 1) { colDivision = "col-xs-6 col-xs-offset-3"; }
                                else if (elements == 2) { colDivision = "col-xs-6"; }
                                else if (elements == 3) { colDivision = "col-xs-4"; }
                                else if (elements == 4) { colDivision = "col-xs-3"; }
                                else { colDivision = "col-xs-2"; }
                                var viewProduct;
                                if (localStorage.current_lang == "es") { viewProduct = "Ver Producto"; }
                                else { viewProduct = "View Product"; }
                                var animate, delay,noImage;

                                $.each(relatedProducts, function (index, item) {
                                    var i = index + 1;
                                    var price = (parseFloat(item.RetailPrice)).toFixed(2);
                                    if (elements == 1) { animate = "slideUp"; }
                                    else if (elements == 2) { if (i == 1) { animate = "slideRight"; delay = "delay" + i; } else { animate = "slideRight"; delay = "delay" + i; } }
                                    else if (elements == 3) { if (i == 1) { animate = "slideRight"; delay = "delay" + i; } else if (i == 2) { animate = "slideRight"; delay = "delay" + i; } else { animate = "slideRight"; delay = "delay" + i; } }
                                    else if (elements == 4) { if (i == 1 || i == 2) { animate = "slideRight"; delay = "delay" + i } else { animate = "slideRight"; delay = "delay" + i; } }
                                    else { if (i == 1 || i == 2) { animate = "slideRight"; delay = "delay" + i; } else if (i == 3) { animate = "slideRight"; delay = "delay" + i; } else { animate = "slideRight"; delay = "delay" + i; } }
                                    
                                    if (localStorage.current_lang == "es") noImage= "../img/noImageEs.jpg";                                                                           
                                    else  noImage= "../img/noImage.jpg";
                                    
                                    
                                    var template = _.template($("#relatedTemplate").html());
                                    var html = template({
                                        description: item.Descr,
                                        price: currencySymbol + price,
                                        sku: item.SKU,
                                        size: item.SizeCode,
                                        image: item.ImagePath,
                                        noImage: noImage,
                                        style: item.StyleName,
                                        link: "result.html?sku=" + item.SKU + "&size=" + item.SizeCode + "&store=" + qsParm["store"],
                                        colDivision: colDivision,
                                        btnText: viewProduct,
                                        animation: animate,
                                        delay: delay
                                    });
                                    $(".productsRelated").append(html);                                   
                                });
                            }
                            else {
                                $(".productsRelated").hide();
                                $(".messageResultProducts").show();
                            }

                        },
                        error: function (error) {
                            toastr.error("error = " + error.status + " " + error.statusText);
                        }
                    });                   
                 });
            }
        },
        error: function (error) {
            toastr.error("error = " + error.status + " " + error.statusText);
           
        }
    });

    $(".btnCheckLocals").click(function () {
        $(".loader").removeClass("hide").addClass("show");
        window.location = "store_list.html?sku=" + qsParm["sku"] + "&store=" + qsParm["store"]; 
    });


    $("img").on('error', function () {
        if (localStorage.current_lang == "es") {
            $(this).css("background-image", "url('../img/noImageEs.jpg')");
        }
        else {
            $(this).css("background-image", "url('../img/noImage.jpg')");            
        }
    });

    $(".btnReturn").click(function () {
        var currentPage = location.href;
        if (afterHomePage == currentPage) {
            localStorage.flag = 2;
        }
        window.history.back();

    });
    $(".btnHome").click(function () {
        localStorage.flag = 1;
        window.location = "../index.html";
    });

    $(".btnScanProduct").click(function () {
        localStorage.flag = 2;
        localStorage.productSearched = "null";
        localStorage.sizeSearched = "null";
        window.location = "../index.html";
    });

    $(".img-responsive").click(function () {
        var path = $(this).css("background-image");
        $("#zoomImage").children().css("background-image", path);
    });

    $("#longDescriptionContent").click(function () {
        if (localStorage.opened != 1) $("#longDescriptionContent").closeMbExtruder();
        localStorage.opened = 0;

    });
    $(".btnLongDescription").click(function () {
        localStorage.opened = 1;
        $(".flap").click();

    })

    function ImageExist(url) {
        var img = new Image();
        img.src = url;
        return img.height != 0;
    }

    function startCarrousel() {
        $('#myCarousel').carousel({
            interval: 3000
        });
        $('.carousel .item').each(function () {
            var next = $(this).next();
            if (!next.length) {
                next = $(this).siblings(':first');
            }
            next.children(':first-child').clone().appendTo($(this));

            if (next.next().length > 0) {

                next.next().children(':first-child').clone().appendTo($(this)).addClass('rightest');

            }
            else {
                $(this).siblings(':first').children(':first-child').clone().appendTo($(this));

            }
        });
    }
    
    $("#modal-container-submit").on("shown.bs.modal", function () {
        $("#selectDomain").val("Other");
        $("#selectDomain").change();
        $("#clientEmail").focus();
    });

    // show the side bar
    $("#longDescriptionContent").buildMbExtruder({
        positionFixed: true,
        width: 520,
        sensibility: 800,
        position: "right", // left, right, bottom
        extruderOpacity: 1,
        flapDim: 100,
        textOrientation: "tb", // or "tb" (top-bottom or bottom-top)
        onExtOpen: function () { },
        onExtContentLoad: function () { },
        onExtClose: function () { },
        hidePanelsOnClose: true,
        autoCloseTime: 0, // 0=never
        slideTimer: 500
    });

    // change the text of the sidebar
    if (localStorage.current_lang == "es") {
        $(".flapLabel").text("Descripci\u00F3n T\u00E9cnica");
    }
    else {
        $(".flapLabel").text("Technical Description");
    }

    function readParameters() {
        var query = window.location.search.substring(1);
        var parms = query.split('&');
        for (var i = 0; i < parms.length; i++) {
            var pos = parms[i].indexOf('=');
            if (pos > 0) {
                var key = parms[i].substring(0, pos);
                var val = parms[i].substring(pos + 1);
                qsParm[key] = val;
            }
        }
    }
    
    function init() {
        var historyList = $.parseJSON(localStorage.history);
        var currentPage = location.href;
        historyList.push(currentPage);
        afterHomePage = historyList[1];
        localStorage.history = JSON.stringify(historyList);

    }
         

});

$(window).load(function () {
        
    var sectionMainImage = $('.sectionMainImage').width();
    var sectionRelatedImage = $('.productsRelated div').width();
    $(".extruder-content").mCustomScrollbar({
        theme: "rounded-dark",
        live: "on",
        scrollButtons: { enable: true }
    });

    $(".mainImage").width(sectionMainImage);
    $(".mainImage").height(sectionMainImage);

    imagesResponsive(sectionRelatedImage);

    var dynamicHeight = $('.technicalTemp').height();
    var maxHeight = $('.extruder-content').height();
    if (dynamicHeight < maxHeight) {
        $('.extruder-content').height(dynamicHeight);
        $('#mCSB_2_scrollbar_vertical').removeClass('showScroll').addClass('hideScroll');
      
    }
    else {        
        $('#mCSB_2_scrollbar_vertical').removeClass('.hideScroll').addClass('showScroll');
    }

});
$(window).resize(function () {
    var sectionRelatedImage = $('.productsRelated div').width();
    $(".mainImage").width('100%');
    $(".mainImage").height('100%');
    imagesResponsive(sectionRelatedImage);
    
});

function imagesResponsive(sectionRelatedImage) {

    var widthImage = null;
    widthImage = $(".mainImage").width();
    $(".img-responsive").width(widthImage / 4);
    $(".img-responsive").height(widthImage / 4);
    $(".img-responsive").css('margin-bottom', widthImage / 16 - widthImage / 32);

    $(".btnLongDescription").css('margin-top', widthImage / 16 - widthImage / 32);

    $(".relatedProductImage1").width(sectionRelatedImage);
    $(".relatedProductImage1").height(sectionRelatedImage);
    $(".relatedProductImage1").css('background-size', sectionRelatedImage);
    $(".relatedProductImage1").css('background-repeat', 'no-repeat');
}

