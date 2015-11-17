$(document).ready(function(){

	var afterHomePage;
	init();
	
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

	$(".btnBack").click(function(){
		var currentPage = location.href;
		var rowid, count;
		if (afterHomePage==currentPage){
		localStorage.flag=2;		
		}
		window.history.back();
		
	});




});