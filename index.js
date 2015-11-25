(function() {
    'use strict';

    angular
        .module('dhp',['openlayers-directive','ivh.treeview','datatables'])
        .config(function(){})
        .controller('mainController', mainController);

    mainController.$inject   = ['$scope','$http'];
    function mainController($scope,$http) {
		var main  = this;
        $scope.custome_height ="default";
        $scope.viewOpen = false;
		main.csv_menu = false;
		main.facilityUid = null;
		main.period_map = 2015;
		main.period_table = 2015;
		main.orgUnits	=	[{"id":"plSLZJGUHZb","name":"Bukombe District Council"},{"id":"e3ATlebHNrD","name":"Mbeya City Council"},{"id":"saOGTLvMX4F","name":"Geita District Council"},{"id":"WgQHWeMx6Zl","name":"Ushetu District Council"},{"id":"AiyppObGUqI","name":"Kahama Town Council"},{"id":"Hob4dzCAW2W","name":"Rombo District Council"},{"id":"Kug5uWxs0mu","name":"Magu District Council"},{"id":"GbVBjR8A7aK","name":"Kilosa District Council"},{"id":"fSZfOuCkmAb","name":"Geita Town council"},{"id":"WB7EAwS3F8N","name":"Mbinga District Council"},{"id":"Ak1TMj0oYc7","name":"Bahi District Council"},{"id":"dIiTyLaZAEb","name":"Kigoma Municipal Council"},{"id":"uvsgHtPzLSo","name":"Nzega Town Council"},{"id":"aiZstwpkrny","name":"Lindi Municipal Council"},{"id":"gOcZSwBmijY","name":"Tandahimba District Council"},{"id":"SnczTnCrk6d","name":"Kisarawe District Council"},{"id":"jupsOTyKi1W","name":"Mpanda Town Council"},{"id":"G2obPNftMUt","name":"Morogoro District Council"},{"id":"B9idcF4fOIW","name":"Mkinga District Council"},{"id":"tNFOa31xGhu","name":"Iramba District Council"},{"id":"z4dfv9EOq3c","name":"Musoma District Council"},{"id":"C96DDKK03pu","name":"Mbulu District Council"},{"id":"QekURU8eIU0","name":"Kibaha Town Council"},{"id":"dPzNEI2Cxqj","name":"Rungwe District Council"},{"id":"GI57B0uNPOX","name":"Mafia District Council"},{"id":"F8NIzb16wVU","name":"Missenyi District Council"},{"id":"yiR1QdOwPqP","name":"Chamwino District Council"},{"id":"kISvf8gGZMm","name":"Kishapu District Council"},{"id":"aQEZnk4RzKv","name":"Longido District Council"},{"id":"uPphu8kRXoZ","name":"Bagamoyo District Council"},{"id":"bDteRg6tH0A","name":"Itilima District Council"},{"id":"N5FKtARi6dB","name":"Mbeya District Council"},{"id":"X5MzEu84hUN","name":"Serengeti District Council"},{"id":"QBC1po2JaJW","name":"Korogwe District Council"},{"id":"PHGm198Hcil","name":"Mtwara Municipal Council"},{"id":"QUTWca9YxNb","name":"Njombe Town Council"},{"id":"jAI2fd8kK1z","name":"Misungwi District Council"},{"id":"P1TuGaaZ981","name":"Kiteto District Council"},{"id":"mbXn83McbCh","name":"Maswa District Council"},{"id":"WCTbfnMiNF3","name":"Same District Council"},{"id":"IfQ2Sjbfdme","name":"Kasulu Town Council"},{"id":"Srvx9L1LGZM","name":"Mkuranga District Council"},{"id":"dGtH1WiNUrP","name":"Kilwa District Council"},{"id":"Yb483pDzzWj","name":"Bariadi Town Council"},{"id":"gu92DYtO3ii","name":"Bumbuli District Council"},{"id":"rQS2cX4JH88","name":"Pangani District Council"},{"id":"wIjscdPZF3N","name":"Muleba District Council"},{"id":"A54bflEH57w","name":"Simanjiro District Council"},{"id":"Qp6ocX9ESSa","name":"Tarime Town Council"},{"id":"duES2Gfgvpw","name":"Kibondo District Council"},{"id":"dWfRpHKykpk","name":"Kyela District Council"},{"id":"qHJkyM0bG8U","name":"Korogwe Town Council"},{"id":"QE0OH5162nV","name":"Ukerewe District Council"},{"id":"O8O3HQdJWHX","name":"Kwimba District Council"},{"id":"T3A9X81ABG3","name":"Kakonko District Council"},{"id":"OzGGHqXQn5p","name":"Dodoma Municipal Council"},{"id":"wsCWwNbLJNY","name":"Ileje District Council"},{"id":"ouZ5YpZ4T3a","name":"Bunda District Council"},{"id":"LoPF5WqswyW","name":"Bukoba District Council"},{"id":"cb9rqgLXFeh","name":"Sumbawanga District Council"},{"id":"K8HUKJUZ7aj","name":"Urambo District Council"},{"id":"XLrownkhsKI","name":"Ngara District Council"},{"id":"VdIZ0pAYfBK","name":"Songea Municipal Council"},{"id":"IGSrsG5I54W","name":"Sengerema District Council"},{"id":"MiLb81EwC7j","name":"Hai District Council"},{"id":"mOqc3ajETpA","name":"Sikonge District Council"},{"id":"PKl52zU7vuH","name":"Nsimbo District Council"},{"id":"iEIdCVxSJct","name":"Nkasi District Council"},{"id":"xOJxkz079Ek","name":"Mtwara District Council"},{"id":"lQOxGNRaklm","name":"Kigoma District Council"},{"id":"ppnbxB0TxjG","name":"Mufindi District Council"},{"id":"RHLUbsrsFoE","name":"Singida District Council"},{"id":"sjKfO239rjD","name":"Lindi District Council"},{"id":"xRx7W86ElUH","name":"Hanang District Council"},{"id":"dFCrIa5paz7","name":"Ikungi District Council"},{"id":"d07Wtk7brGz","name":"Momba District Council"},{"id":"L9scGbK6d61","name":"Chunya District Council"},{"id":"r9NgS2Jsu9I","name":"Tunduru District Council"},{"id":"Nc1C12TG69d","name":"Tabora Municipal Council"},{"id":"xe93MrFXOYV","name":"Ilala Municipal Council"},{"id":"xVzeWrXHf81","name":"Busokelo District Council"},{"id":"N8oGVhuoUcK","name":"Kibaha District Council"},{"id":"gncV3iPt6Sk","name":"Rufiji District Council"},{"id":"Qyg5jjxGeQD","name":"Mkalama District Council"},{"id":"PvqxGEssig9","name":"Nanyumbu District Council"},{"id":"tLzrq5IZ23W","name":"Masasi Town Council"},{"id":"Fez1Dp8bXSk","name":"Chemba District Council"},{"id":"cnsiTXSJqqF","name":"Babati Town Council"},{"id":"f7UPzYMgzVH","name":"Nyamagana Municipal Council"},{"id":"HIOQoi1aeL8","name":"Temeke Municipal Council"},{"id":"GOmwoDIGL98","name":"Njombe District Council"},{"id":"oMao5qA3DBy","name":"Kilombero District Council"},{"id":"vo788oc0NEn","name":"Iringa Municipal Council"},{"id":"L5AfyN2zxns","name":"Babati District Council"},{"id":"et6lWc8GDHy","name":"Ilemela Municipal Council"},{"id":"NzvekEmEzUG","name":"Makete District Council"},{"id":"TO89Eu9qoSX","name":"Nyasa District Council"},{"id":"mKI72g04l0D","name":"Kilindi District Council"},{"id":"cjlkhW8VMDO","name":"Mlele District Council"},{"id":"QeMjl7Ld0Vj","name":"Kalambo District Council"},{"id":"P5H056daq2I","name":"Mpwapwa District Council"},{"id":"nUFAmN93pH4","name":"Morogoro Municipal Council"},{"id":"dt0Q0NhyPty","name":"Uvinza District Council"},{"id":"fogigwn9cW7","name":"Igunga District Council"},{"id":"I58Bh8dN2sO","name":"Busega District Council"},{"id":"Le7ysFRJrMk","name":"Ulanga District Council"},{"id":"H2LvCkw2bCO","name":"Muheza District Council"},{"id":"yPCs2xE66we","name":"Buhigwe District Council"},{"id":"cZMveFzVrXh","name":"Sumbawanga Municipal Council"},{"id":"VMTJLxcFH9o","name":"Moshi District Council"},{"id":"LbM25p7KBDP","name":"Songea District Council"},{"id":"m2ux1UEElNB","name":"Uyui District Council"},{"id":"LdzOZ9hNTwH","name":"Kyerwa District Council"},{"id":"fqlNpTvqMw4","name":"Tunduma Town Council"},{"id":"vQvBfxn7Cjs","name":"Msalala District Council"},{"id":"yh0b4OAgg8z","name":"Gairo District Council"},{"id":"RCDM6DotMZw","name":"Mbogwe District Council"},{"id":"yTTjcYh4xqa","name":"Kondoa District Council"},{"id":"btLScg6XCBN","name":"Butiama District Council"},{"id":"WAwWjYYzdkS","name":"Nzega District Council"},{"id":"cirtJ7KuNU0","name":"Makambako Town Council"},{"id":"ZszYGa2Vnyc","name":"Liwale District Council"},{"id":"Q16E1rzDnVD","name":"Bariadi District Council"},{"id":"XL0luikY9oG","name":"Namtumbo District Council"},{"id":"DkxlFk8MuM7","name":"Handeni District Council"},{"id":"ySuyuvNNFp8","name":"Tanga City Council"},{"id":"PEIzWSzWQ7S","name":"Kaliua District Council"},{"id":"G9VxK1Dmkpc","name":"Nyang'hwale District Council"},{"id":"uHp3aLKA6Tn","name":"Manyoni District Council"},{"id":"AvfNRAIsvhg","name":"Mbarali District Council"},{"id":"uafqZbOYpVL","name":"Meru District Council"},{"id":"aVLidCZ2RYk","name":"Mpanda District Council"},{"id":"BVBmQDCexxG","name":"Mvomero District Council"},{"id":"YFPElmUhUok","name":"Karagwe District Council"},{"id":"zfwo4rq1XC3","name":"Kasulu District Council"},{"id":"bRz3nu8rSWS","name":"Rorya District Council"},{"id":"QKEr8DFutO8","name":"Karatu District Council"},{"id":"W884lMlfpca","name":"Nachingwea District Council"},{"id":"OHu1VHzyA0x","name":"Mwanga District Council"},{"id":"m4ow47nd3DC","name":"Wanging'ombe District Council"},{"id":"rrHtwyYjprs","name":"Masasi District Council"},{"id":"zHa2ohFrpPM","name":"Arusha District Council"},{"id":"IYqT1Xik8Bj","name":"Newala District Council"},{"id":"NzVLQOcSJJU","name":"Tarime District Council"},{"id":"vJY7WRfb5Hc","name":"Meatu District Council"},{"id":"aa5sxEFiAwN","name":"Ludewa District Council"},{"id":"PF4defRibDi","name":"Shinyanga Municipal Council"},{"id":"IZAkMaffRh8","name":"Chato District Council"},{"id":"D21VsjNL2LB","name":"Monduli District Council"},{"id":"xBWOfftpkLT","name":"Kilolo District Council"},{"id":"yz7jPBCDXlX","name":"Biharamulo District Council"},{"id":"PM74xoecSpJ","name":"Bukoba Municipal Council"},{"id":"bKA4yc2NUxA","name":"Musoma Municipal Council"},{"id":"chzBato6xed","name":"Mafinga Town Council"},{"id":"ts6eEeUjcfO","name":"Kinondoni Municipal Council"},{"id":"aouUIozrc7I","name":"Mbozi District Council"},{"id":"aMnC7MINXlM","name":"Siha District Council"},{"id":"FylvwNXCTAQ","name":"Shinyanga District Council"},{"id":"lgZ6HfZaj3f","name":"Arusha City Council"},{"id":"Y8sOGpb4AFE","name":"Moshi Municipal Council"},{"id":"ilY7TEjviqa","name":"Lushoto District Council"},{"id":"tcZz4Bh4mqc","name":"Iringa District Council"},{"id":"DTc1rxSmlde","name":"Kongwa District Council"},{"id":"OOplITY83ud","name":"Ruangwa District Council"},{"id":"V60DkMrlQ5Q","name":"Singida Municipal Council"},{"id":"PHWaJvzTmL8","name":"Ngorongoro District Council"}];
		main.periods	=	[{id:"2015",name:"2015"},{id:"2014",name:"2014"},{id:"2013",name:"2013"},{id:"2012",name:"2012"},{id:"2011",name:"2011"}];

        $scope.data = {
            };

        // load org unit for tree

        $http.get("server/organisationUnits_level_1.json").success(function(data){
            console.log(data);
            $scope.data.organisationUnits = data.organisationUnits;
        });

        $scope.treeCallback = function(iv_node,iv_selected,iv_tree){
            console.log(iv_node);
        }

		main.getLeftNav = function(){
			if(main.csv_menu){
				main.csv_menu = false;
				}else{
					main.csv_menu = true;
					}
			
			}
        main.getAppropiatePdf= function(orunit,period){

            var pdf_file = "DHP_"+orunit.name.replace(" Council","").replace(" ","_")+"_"+period+".pdf";
            $scope.current_pdf_link = "uploads/"+pdf_file;
            $scope.viewOpen = true;
            $scope.custome_height ="not_found";

        }

        main.getHtmlReport= function(orunitUid,period){


            var base = "http://139.162.204.124/mvc/";
            $.post( base + "dhis-web-commons-security/login.action?authOnly=true", {
                j_username: "portal", j_password: "Portal123"
            },function(data){
                $http.get(url).success(function(data){
                    console.log(data);
                }).fail(function(repsonse){

                    console.log("Request Failured");
                    console.log(response);
                });

            }).fail(function(response){

                console.log("Login Failure");
                console.log(response);
            });


        }

		main.getDashboard = function(){			
				main.csv_menu = false;			
			}
		
		main.uploadFile	=	function(){
			
			}
		main.prepareDataForDhisSaving = function(data){
			console.log(data);
			}	
			
		main.getcsvValue = function(){
			$http({
				  method: 'GET',
				  url: 'server/process.php?csv_output=1'
				}).then(function successCallback(response) {
					// this callback will be called asynchronously
					// when the response is available
					main.prepareDataForDhisSaving(response);
				  }, function errorCallback(response) {
					  console.log(response);
					// called asynchronously if an error occurs
					// or server returns response with an error status.
			    });
			}	
			
			main.getcsvValue();



		}


})();
