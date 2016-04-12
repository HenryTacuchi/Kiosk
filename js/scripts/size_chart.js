$(document).ready(function(){

    var afterHomePage;
    init();
    	
    function init() {
        var historyList = $.parseJSON(localStorage.history);
        var currentPage = location.href;
        historyList.push(currentPage);
        afterHomePage = historyList[1];
        localStorage.history = JSON.stringify(historyList);
        if (localStorage.productSearched == "") {
            localStorage.productSearched = "null";
            localStorage.sizeSearched = "null";
        }

    }

	$(".btnBack").click(function(){
	    var currentPage = location.href;
	    if (afterHomePage == currentPage) {
	        localStorage.flag = 2;
	    }
	    window.history.back();
		
	});




});