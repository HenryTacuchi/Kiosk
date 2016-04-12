
$(document).ready(function () {
       
    var storeNo;
    // Set local language    
    getLanguage();
    //check if it is necessary to show the splash or not
    checkModal();
    LoadCarouselImages()

     
    $(".homeScreen").click(function () {
        init();
    });
    // Search sizes
    $("#skuCode").keydown(function (e) {
        if (e.which == 13) {
            e.preventDefault();

            var sku = $("#skuCode").val();
            $.ajax({
                type: "GET",
                url: "http://" + localStorage.webIP + "/KioskoServices/Service.svc/LoadSizes/" + sku,
                async: false,
                dataType: "json",
                crossdomain: true,
                success: function (result) {
                    options = $("#sizeOptions");
                    options.find('option').remove().end();
                    var selected = 0;
                    var data = result.LoadSizesResult;
                    optionHeight = data.length;
                    if (data != null && data.length) {
                        $.each(data, function (index, value) {
                            localStorage.SKU = value.sku;
                            options.append($("<option></option>").attr("value", index).text(value.sizecode));

                            if (value.selected == true) {
                                selected = index;
                            }
                        });
                        options.val(selected);
                        $('#sizeOptions').selectmenu("destroy");
                        $('#sizeOptions').selectmenu().selectmenu("menuWidget").addClass("overflow");
                        $('#sizeOptions').selectmenu("enable");
                        resizeCombo(optionHeight);
                    }
                    else {
                        if (localStorage.current_lang == "es") { toastr.info("Producto no encontrado", "", { timeOut: 1000 }); } else { toastr.info("Product not found", "", { timeOut: 1000 }); }
                        $("#toast-container").effect("bounce");
                        $('#sizeOptions').selectmenu("disable");
                    }
                    $('#sizeOptions').selectmenu("destroy");
                    $('#sizeOptions').selectmenu().selectmenu("menuWidget").addClass("overflow");
                    $('#sizeOptions').selectmenu("enable");

                },
                error: function (error) {
                    if (localStorage.current_lang == "es") { toastr.info("Es requerido el c\u00f3digo del producto", "", { timeOut: 1000 }); } else { toastr.error("Missing product information", "", { timeOut: 1000 }); }
                     $("#toast-container").effect("bounce");
                }
            });

        }
    });

    $(document).keydown(function (e) {
      if (e.which == 13) e.preventDefault();
    });

    $("#modal-container-submit").on("shown.bs.modal", function () {
        // focus input when modal appears
        $("#selectRecoveryDomain").val("Other");
        $("#selectRecoveryDomain").change();
        $("#clientEmail").focus();
    });

    $("#btnRecovery").click(function () {
        //focus when recovery modal shows
        $("#selectRecoveryDomain").val("Other");
        $("#selectRecoveryDomain").change();
        $("#recoveryPassword").focus();
    });

    $(".btnHome").click(function () {
        localStorage.flag = 1;
        window.location = "index.html";
    });
    $(".btnContinue").click(function () {
        var sku = $("#skuCode").val();
        var size = $("#sizeOptions option:selected").text();
        var index = $("#sizeOptions").val();
        if (sku.length != 0 && size != "") {
            // save the values chosen for the retuning process 
            localStorage.productSearched = sku;
            localStorage.sizeSearched = size;
            var historyList = [];
            var currentPage = location.href;
            historyList.push(currentPage);
            localStorage.history = JSON.stringify(historyList);
            $(".loader").removeClass("hide").addClass("show");
            setTimeout(function () { window.location = "views/result.html?sku=" + localStorage.SKU + "&size=" + size + "&store=" + storeNo; }, 2000);


        }
        else {
            if (localStorage.current_lang == "es") { toastr.info("Aseg\u00farese de llenar todos los campos", "", { timeOut: 1000 }); } else { toastr.info("Make sure to complete all the entries", "", { timeOut: 1000 }); }
            $("#toast-container").effect("bounce");
            $(".loader").removeClass("show").addClass("hide");
        }

    });

    $(".btnSizeChart").click(function () {
        var sku = $("#skuCode").val();
        var size = $("#sizeOptions option:selected").text();
        var index = $("#sizeOptions").val();      
        localStorage.productSearched = sku;
        localStorage.sizeSearched = size;
        var historyList = [];
        var currentPage = location.href;
        historyList.push(currentPage);
        localStorage.history = JSON.stringify(historyList);
        window.location = "views/size_chart.html";
    });
     
    $(".email").keydown(function (e) {
        if (e.which == 13) {
            $("#submitClientEmail").click();
        }
    });

    function LoadCarouselImages() {

        

        $.ajax({
            type: "GET",
            url: "http://" + localStorage.webIP + "/KioskoServices/Service.svc/LoadImages",
            async: false,
            contentType: "application/json",
            crossdomain: true,
            success: function (result) {
                var data = result.LoadImagesResult.Images;
                if (data != null) {
                    $.each(data, function (index, value) {
                        var active;
                        if (index == 0) {
                            active = "item active";
                        }
                        else active = "item";

                        var template = _.template($("#carouselNTemplate").html());
                        var html = template({
                            itemClass: active,
                            path: value
                        });
                        $(".carousel-inner").append(html);

                    });

                    $('#splashCarousel').addClass('carousel slide').attr('data-ride', 'carousel').attr('data-interval', '3000').attr('data-pause', false);

                }
            },
            error: function (error) {

            }
        });
    }


    function getLanguage() {
        var lang = "";
        lang = navigator.language.split("-");
        localStorage.current_lang = (lang[0]);             
    }

    function resizeCombo(optionHeight) {
        var documentH = $(window).height();
        var navH = $('.navPosition').height();
        var comboH = $('#sizeOptions-button').height();
        var comboPos = $('#sizeOptions-button').offset().top;
        var maxHeight = documentH -
            (comboH + comboPos) - (navH) - 80;
        var comboHeight = comboH * optionHeight;
        $('#sizeOptions-menu').css('max-height', maxHeight);
        $('#sizeOptions-menu').css('height', comboHeight);
    }        	
      
       

    function checkModal() {
        var store = localStorage.store, webIP = localStorage.webIP, email = localStorage.email;
               
        if ((typeof localStorage.store != "undefined" && localStorage.store != null) && (typeof localStorage.webIP != "undefined" && localStorage.webIP != "null") && (typeof localStorage.email != "undefined" && localStorage.email != "null")) {
            if (localStorage.flag > 0) {
                // only when the flag is 2, the splash isnt shown
                if (localStorage.flag == 2) {
                    $("#homeScreen").hide();
                    if (localStorage.productSearched != "null") {
                        $("#skuCode").val(localStorage.productSearched);
                        // var e = $.Event("keydown");
                        //e.which = 13;                                                
                        fillCombo();
                        $('#sizeOptions').selectmenu("destroy");                        
                        $("#sizeOptions").val(localStorage.sizeSearched);                       
                        $('#sizeOptions').selectmenu().selectmenu("menuWidget").addClass("overflow");
                        $('#sizeOptions').selectmenu("enable");
                                              
                        
                        $("#skuCode").focus();
                    }
                    init();
                    loadImages();
                    $("#skuCode").focus();                    
                }
                else {
                    init();
                    loadImages();
                    $("#homeScreen").show();
                }
            }
            else {
                init();
                loadImages();
                $("#homeScreen").show();
            }

        }
        else {
            $("#modal-settings").modal("show");
        }    
    }

    $("#goSettings").click(function () {
        window.location = "views/config.html";

    });

    function init() {
        localStorage.history = "null";
        localStorage.productSearched = "null";

        //Retrive preferences
        var store = localStorage.store, webIP = localStorage.webIP, email = localStorage.email;
        if ((typeof store != "undefined" && localStorage.store != null) && (typeof webIP != "undefined" && localStorage.webIP != "null") && (typeof email != "undefined" && localStorage.email != "null") || (typeof localStorage.storeName!="undefined"|| localStorage.storeName!="null")) {
            storeNo = localStorage.store
            localStorage.flag = 1;
            var bg = localStorage.background, logo = localStorage.logo, home = localStorage.home;
            var storeName;
            if (localStorage.current_lang == "es") {
                storeName = " Bienvenido a " + localStorage.storeName;
                $('#lblWelcome').text( storeName);
            }
            else {
                storeName = " Welcome to " + localStorage.storeName;
                $('#lblWelcome').text(storeName);
            }

            //only if there's no images locally then it retrieves those image paths...so in order to exec this part it's necessary to recover the password to delete all the data stored previously
            if ((typeof bg == "undefined" || localStorage.background == "null") || (typeof logo == "undefined" || localStorage.logo == "null") || (typeof home == "undefined" || localStorage.home == "null")) {
                var bg, logo, home;
                $.ajax({
                    type: "GET",
                    url: "http://" + localStorage.webIP + "/KioskoServices/Service.svc/GetKioskPreferencesPath/" + storeNo,
                    async: false,
                    dataType: "json",
                    crossdomain: true,
                    success: function (result) {
                        var data = result.GetKioskPreferencesPathResult;
                        if (data != null) {
                            localStorage.background = data.BackGroundImagePath;
                            localStorage.logo = data.LogoImagePath;
                            localStorage.home = data.HomeImagePath;
                        }

                    },
                    error: function (error, a, b) {
                        if (localStorage.current_lang == "es") { toastr.error("IP del servicio no encontrada", "", { timeOut: 1000 }); } else { toastr.error("Missing Web Service IP", "", { timeOut: 1000 }); }
                        $("#toast-container").effect("bounce");
                        window.location = "views/config.html"
                    }
                });
            }

        }
        else {
            // if the service entered doesnt respond, the app takes you to the congif view
            window.location = "views/config.html";
        }
    }

    function loadImages() {              
        $(".logoCompany").css("background-image", "url(" + localStorage.logo + ")");
        $(".homeScreen").css("background-image", "url(" + localStorage.home + ")");
        $("body").css("background-image", "url(" + localStorage.background + ")");
        var carousel1 = localStorage.home.replace('home.jpg', 'NK.Kiosk.jpg');
        var carousel2 = localStorage.home.replace('home.jpg', 'NK.Kiosk6.jpg');
        var carousel3 = localStorage.home.replace('home.jpg', 'NK.Kiosk8.jpg');     
        
        $(".carousel1").css("background-image", "url(" + carousel1 + ")");
        $(".carousel2").css("background-image", "url(" + carousel2 + ")");
        //$(".carousel3").css("background-image", "url(" + carousel3 + ")");
        

    }

    function validateEmail() {
        var domain = $("#selectRecoveryDomain option:selected").text();
        var email = $("#recoveryPassword").val();
        var errorDomain = (email.match(/.com/g) || []).length;
        var errorSintax = (email.match(/@/g) || []).length;
        var checkDom = email.lastIndexOf("@");
        var resultDom = email.substring(checkDom + 1);
        var whitespaces = email.lastIndexOf(" ");

        if (domain == "Other") {
            if (email.length != 0 && whitespaces == -1 && (errorDomain <= 1 && errorSintax == 1) && (resultDom != email && resultDom.trim().length > 0)) {
                return email;
            }
            else {
                return -1
            }
        }
        else {
            email = email + "@" + domain
            if (email.length != 0 && whitespaces == -1 && (errorDomain <= 1 && errorSintax == 0)) {
                return email
            }
            else {
                return -1;
            }

        }
    }

    function fillCombo() {                     
        // the same as when you press enter in the sku textbox
        var sku = $("#skuCode").val();
        $.ajax({
            type: "GET",
            url: "http://" + localStorage.webIP + "/KioskoServices/Service.svc/LoadSizes/" + sku,
            async: false,
            dataType: "json",
            crossdomain: true,
            success: function (result) {
                options = $("#sizeOptions");
                options.find('option').remove().end();
                var selected = 0;
                var data = result.LoadSizesResult;
                if (data != null) {
                    $.each(data, function (index, value) {
                        options.append($("<option></option>").attr("value", value.sizecode).text(value.sizecode));                         
                    });                        
                }
                else {
                    if (localStorage.current_lang == "es") { toastr.info("Producto no encontrado", "", { timeOut: 1000 }); } else { toastr.info("Product not found", "", { timeOut: 1000 }); }
                    $("#toast-container").effect("bounce");
                    $('#sizeOptions').selectmenu("disable");
                }

            },
            error: function (error) {
                if (localStorage.current_lang == "es") { toastr.info("Es requerido el c\u00f3digo del producto", "", { timeOut: 1000 }); } else { toastr.error("Missing product information", "", { timeOut: 1000 }); }
                $("#toast-container").effect("bounce");
            }
        });
               
    }

    $(".btnKey").click(function () {
        $("#modal-key").modal("show");
    });

    $(".btnRefresh").click(function () {

        var isIE = /*@cc_on!@*/false || !!document.documentMode;
        if (isIE) { localStorage.flag = 1;location.reload(true); }
        else {
            localStorage.flag = 1;
            window.location = "index.html";
        }

        
        
    });


    $("#btnRecoverySend").click(function () {
        // Delete all information from dataBase
        var validatedEmail = validateEmail();
        var adminEmail;
        var store = localStorage.store, webIP = localStorage.webIP, email = localStorage.email;
        if ((typeof store != "undefined" && localStorage.store != null) && (typeof webIP != "undefined" && localStorage.webIP != "null") && (typeof email != "undefined" && localStorage.email != "null")) {
            adminEmail = localStorage.email;
            if (validatedEmail == adminEmail) {
                localStorage.clear();
                $(".btnHome").click();

            }
            else {
                if (localStorage.current_lang == "es") { toastr.error("Int\u00e9ntelo nuevamente, por favor!"); } else { toastr.error("Try again please!"); }
                $("#toast-container").effect("bounce");
            }

        }
        else {
            if (localStorage.current_lang == "es") { toastr.info("No existe un email en la base de datos!"); } else { toastr.info("No exist an email in the database!"); }
            $("#toast-container").effect("bounce");
        }

    });

    $("#modal-key").on("shown.bs.modal", function () {
        $("#passwordKey").focus();
    });

    $("#modal-container-submit").on("shown.bs.modal", function () {
        $("#clientEmail").focus();
    });

    //lock and unlock configuration button
    $("#lockSettings").click(function () {
        var pass= $("#passwordKey").val();
        var password = localStorage.password;
            if (typeof password!="undefined" && localStorage.password!="null") {
                    if (password == pass) {

                        var visible = $(".btnConfig").is(":visible");
                        if (visible == true) {
                            $(".btnConfig").hide();
                            $(".btnConfig").addClass("hide");
                            $("#passwordKey").val("");
                            $("#modal-key").modal("hide");
                            if (localStorage.current_lang == "es") { toastr.success("Bloqueo administrativo exitoso!"); } else { toastr.success("Lock configuration successfully!"); }
                            $("#toast-container").effect("slide", "slow");
                        }
                        else {
                            $(".btnConfig").show();
                            $(".btnConfig").removeClass("hide");
                            $("#modal-key").modal("hide");
                            $("#passwordKey").val("");
                            if (localStorage.current_lang == "es") { toastr.success("Desbloqueo administrativo exitoso!"); } else { toastr.success("Unlock configuration successfully"); }
                            $("#toast-container").effect("slide", "slow");
                        }

                    }
                    else {
                        if (localStorage.current_lang == "es") { toastr.info("Int\u00e9ntelo nuevamente, por favor"); } else { toastr.info("Try again, please"); }
                        $("#toast-container").effect("bounce");
                    }

                }       
    });

    $("#passwordKey").keydown(function (e) {
        if (e.which == 13) {
            e.preventDefault();
            $("#lockSettings").click();
        }
    });



});
