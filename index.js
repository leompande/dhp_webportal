(function() {
    'use strict';

    angular
        .module('dhp')
        .controller('mainCtroller', mainCtroller);

    mainCtroller.$inject   = ['$http'];
    function mainCtroller($http) {
		var main  = this;
		
		main.csv_menu = false;
		
		main.getLeftNav = function(){
			if(main.csv_menu){
				main.csv_menu = false;
				}else{
					main.csv_menu = true;
					}
			
			}
		
		main.getDashboard = function(){			
				main.csv_menu = false;			
			}
		
		main.uploadFile	=	function(){
			
			}
		main.prepareDataForDhisSaving = function(data){
			
			}	
			
		main.getcsvValue = function(){
			$http({
				  method: 'GET',
				  url: 'server/process.php?csv_output=1'
				}).then(function successCallback(response) {
					// this callback will be called asynchronously
					// when the response is available
					console.log(response);
				  }, function errorCallback(response) {
					  console.log(response);
					// called asynchronously if an error occurs
					// or server returns response with an error status.
			    });
			}	
			
			main.getcsvValue();
			
		}
})();
