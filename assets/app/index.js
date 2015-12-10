(function() {
    'use strict';

    angular
        .module('dhp',['openlayers-directive','ivh.treeview','highcharts-ng','ngFileUpload','datatables','ngCookies'])
        .config(function($httpProvider){
            $httpProvider.defaults.withCredentials = true;
        })
        .controller('mainController', mainController);

    mainController.$inject   = ['$scope','$cookies','$http','$timeout','ivhTreeviewMgr','DTOptionsBuilder', 'DTColumnDefBuilder', 'Upload'];
    function mainController($scope,$cookies,$http,$timeout,ivhTreeviewMgr,DTOptionsBuilder, DTColumnDefBuilder,Upload) {
		var main  = this;
        var date = new Date();
        $scope.custome_height    ="default";
        $scope.viewOpen          = false;
		main.csv_menu            = false;
		main.facilityUid         = null;
        main.current_year = date.getFullYear();
        main.selectedYear = main.current_year;

        //main.selectedYear = 2014;
        main.current_id          = "m0frOspS7JY";
        $scope.data              = {
            };
        main.Documents = null;
        main.current_pdf_link = "";
        main.clickedDistrict = "";
        $scope.viewOpen = false;
        main.chart_shown = true;
        main.available_files_this_year = null;
        $scope.submitted = 0;
        $scope.total_facilities = 0;
        $scope.submitted = 0;
        $scope.total_facilities = 0;
        main.form_period = null;
        main.orgunit = null;
        main.org_unit_selected = null;
        $scope.form={form_period:main.current_year,org_unit_selected:""};
        $scope.showProgress = false;
        main.logedIn = false;
        $scope.progressLogin = false;
        main.logedOut = true;
        $scope.currentLogedUser = $cookies.get('current_user');
        $scope.selectedDistrictName = "";
        $scope.message_class = null;
        main.orgUnitTable = [];
        main.logedSuccessMessage = "";
        if($cookies.get('dhis_enabled')){
            main.logedIn = true;
            main.logedOut = false;
        }



        //front chart for the portal
        main.drawChart = function(){
            $scope.$watch("main.available_files_this_year",function(newOne,oldOne){
                if(main.available_files_this_year!=null){
                    $scope.submitted = main.available_files_this_year.length;
                }

                $scope.chartConfig = {
                    options: {
                        chart: {
                            type: 'pie',
                            zoomType: 'x'
                        }
                        ,color:
                            ['#058DC7', '#50B432']


                    },
                    series: [{
                                    type: 'pie',
                                    name: 'Distribution',
                                    data: [
                                        ['Not Submitted',$scope.total_facilities-$scope.submitted],
                                        ['Submitted',  $scope.submitted]

                                    ]
                                }],
                    title: {
                        text: ''
                    },
                    xAxis: {currentMin: 0, currentMax: 10, minRange: 1},
                    loading: false
                }
                //
                //$scope.chartConfig = {
                //    chart: {
                //        plotBackgroundColor: null,
                //        plotBorderWidth: null,
                //        plotShadow: false
                //    },color:['#058DC7', '#50B432'],
                //    title: {
                //        text: ""
                //    },
                //    tooltip: {
                //        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                //    },
                //    plotOptions: {
                //        pie: {
                //            allowPointSelect: true,
                //            cursor: 'pointer',
                //            depth: 35,  colors: ['#058DC7', '#50B432']
                //            ,
                //                dataLabels: {
                //                enabled: true,
                //                format: '{point.percentage.toFixed(1)}%'
                //            },showInLegend: true
                //        }
                //    },
                //    series: [{
                //        type: 'pie',
                //        name: 'Distribution',
                //        data: [
                //            ['Not Submitted',$scope.total_facilities-$scope.submitted],
                //            ['Submitted',  $scope.submitted]
                //
                //        ]
                //    }]
                //}

            });
        }
        main.drawChart();
        main.backToChart = function(){
            $scope.viewOpen = false;
            main.chart_shown = true;
        }

        main.drawTable = function(){

//         main.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withDisplayLength(2);
//        main.dtColumnDefs = [
//            DTColumnDefBuilder.newColumnDef(0),
//            DTColumnDefBuilder.newColumnDef(1).notVisible(),
//            DTColumnDefBuilder.newColumnDef(2).notSortable()
//        ];
        }


        //broadcast event that year has changed
        $scope.$watch("main.selectedYear",function(oldOne,newOne){
            main.getAvailableFilesThisYear();
            main.chart_shown = true;
            $scope.$watch("main.available_files_this_year",function(oldOneI,newOneI){
                $scope.$broadcast ('yearChangedEvent');
            });
        });


        main.getChildren = function(children){
            var childrens = [];
            angular.forEach(children,function(value,index){
                childrens.push(value.name);
            });

            return childrens;
        }

        main.treeCallback = function(attributes){
            main.chart_shown = false;
            main.backToGrid();
                // deselect by node reference
        ivhTreeviewMgr.deselect($scope.data.organisationUnits, main.current_id);

            var orgUnit = attributes.ivhNode;
            var name = orgUnit.name;
            $scope.selectedDistrictName = name;
            var id = orgUnit.id;
            main.processView(orgUnit,name,id);
            main.current_id = id;
        }
        main.getHealthProfileFromTable = function(row){
            main.openPdfFile(row.file)
        }
        main.processView = function(orgUnit,name,id){
            if(orgUnit.children!=null){
                var children = main.getChildren(orgUnit.children);

            }else{
                var children = [];
            }

            if(name.indexOf("Region")>=0||name.indexOf("Council")>=0){

                if(name.indexOf("Region")>=0){
                    var proposed_files= [];
                    angular.forEach(children,function(value,index){
                        proposed_files.push({facility:value,file:name+"_"+value+"_"+main.selectedYear+".pdf"});
                    });
                    var correct_names=[];
                    $http.get("server/process.php?by_year="+main.selectedYear).success(function(data){
                        var files =[];
                        angular.forEach(proposed_files,function(value,index){
                            files.push(value.file);
                        });
                        angular.forEach(files,function(value,index) {
                            if(data.indexOf(value)>=0){
                                correct_names.push(proposed_files[index]);
                            }
                        });
                        main.Documents = correct_names;
                    });


                }

                if(name.indexOf("Council")>=0){
                    var correct_names=[];
                    $http.get("server/process.php?by_year="+main.selectedYear).success(function(data){

                        var file_template = {facility:name,file:name+"_"+main.selectedYear+".pdf"};
                        angular.forEach(data,function(value,index) {
                            if(value.indexOf(file_template.file)>=0){
                                correct_names.push({facility:name,file:value});
                            }
                        });
                        main.Documents = correct_names;
                    });

                    console.log(children);
                }

            }else{
                alert("select Region or council");
            }
        }
        main.backToGrid = function(){
            $scope.viewOpen = false;
        }
        main.openPdfFile = function(document){
            main.current_pdf_link = "uploads/"+document;
            var details = document.split("_");
            var year = details[2].split(".");
            main.clickedDistrict = details[1]+" "+year[0];
            $scope.viewOpen = true;
            $scope.custome_height ="not_found";

        }


        main.getOrgunitFileStatistics = function(facility_name){
            var file_counts = 0;
            var total = 0;
            angular.forEach(main.available_files_this_year,function(value,index){
                if(value.indexOf(facility_name)>=0){
                    file_counts++;
                }
                total++;
            });
           return {orgUnit:facility_name,count:file_counts,total:total};
        }
        main.getAvailableFilesThisYear = function(){
            $http.get("server/process.php?by_year="+main.selectedYear).success(function(data){

                main.available_files_this_year = data;
            });
        }
        main.getAvailableFilesThisYear();
        main.getOrgUnitWithAvailableFilesThisYear = function(){
            $scope.$watch("main.available_files_this_year",function(newValue,oldOne){
                $scope.orgUnitTable = [];
                main.orgUnitTable = [];
                angular.forEach(newValue,function(value,index){
                    var str_array = value.split("_");
                $scope.orgUnitTable.push({region:str_array[0],district:str_array[1],file:value});
                main.orgUnitTable.push({region:str_array[0],district:str_array[1],file:value});
                });
            });
            main.drawTable();
        };
        main.getOrgUnitWithAvailableFilesThisYear();


        // load org unit for tree
        $scope.customOpts = {
            onCbChange:main.treeCallback
        }
        $http.get("server/organisationUnits_level_1_org.json").success(function(data){
            $scope.data.organisationUnits = data.organisationUnits;
            $scope.modifedOrgunits = main.modifyOrgUnits(data.organisationUnits[0].children);
        });
        $http.get("server/organisationUnits.json").success(function(data){

            $scope.organisationUnits = data.organisationUnits;
        });

        main.modifyOrgUnits = function(rawOrgUnits){
            var modifedOrgunits = [];

            angular.forEach(rawOrgUnits,function(value,index){

                angular.forEach(value.children,function(valueChildren,indexChildren){
                    $scope.total_facilities++;
                    modifedOrgunits.push({name:valueChildren.name,value:value.name+"_"+valueChildren.name});
                });

            });

            return modifedOrgunits;
        }

        main.getPeriod = function(start_period){
            var date = new Date();
            var periods = [];
            var thisyear = date.getFullYear()-1;
            for(var i=Number(thisyear);i>=Number(start_period);i--){
                periods.push({name:i,value:i})
            }
            return periods;
        };
        main.periods	=	main.getPeriod("2011");


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
        main.Logout = function(){
            if($cookies.get('dhis_enabled')){
                $cookies.remove('dhis_enabled');
                $cookies.remove('current_user');
            }
            $cookies.remove('dhis_enabled');
            $scope.currentLogedUser = "";
            main.logedIn = false;
            main.logedOut = true;
            main.csv_menu = false;
            main.logedSuccessMessage = "";

        }
        main.login = function(login){

            $scope.progressLogin = true;
            var username = login.dhis_login_username;
            var password = login.dhis_login_password;

            var base = "http://139.162.204.124/dhis/";
            $.post( base + "dhis-web-commons-security/login.action?authOnly=true", {
                'j_username':username,
                'j_password':password
            },
                function(data){
                $scope.progressLogin = false;
                var currentUserUrl = "api/me.json";
                $.get(base+currentUserUrl,function(userdata){
                    if(userdata){
                        $cookies.put('dhis_enabled', 'logedIn');
                        $cookies.put('current_user', userdata.displayName);
                        $scope.currentLogedUser = $cookies.get('current_user');
                        $scope.progressLogin = false;
                        main.logedIn = true;
                        main.logedOut = false;
                        main.logedSuccessMessage = "LoggedIn as "+userdata.displayName+" Successfully.";
                        $timeout(main.closeLoginForm,3000);

                    }else{
                        $cookies.remove('dhis_enabled');
                        $cookies.remove('current_user');
                        main.logedIn = false;
                        main.logedOut = true;
                        main.logedSuccessMessage = "Login Failed";
                        $scope.progressLogin = false;
                    }
                });

            }).fail(function(failure){
                    $scope.progressLogin = false;
                    main.logedIn = false;
                    main.logedOut = true;
                    main.logedSuccessMessage = "Login Failed";
              });

			}

        main.getLoginForm = function(){
            $('#modal1').openModal();

			}
        main.closeLoginForm = function(){
            $('#modal1').closeModal();

			}

        $scope.submit = function(form) {

            if(form.org_unit_selected&&form.form_period){

                var new_file_name = form.org_unit_selected+"_"+form.form_period+".pdf";
                $scope.upload($scope.file,new_file_name);
            }else{
                $scope.message = "no name and period specified";
            }

        };

        // upload on file select or drop
        $scope.upload = function (file,new_file_name) {

            Upload.upload({
                url: 'server/process.php?file=1&new_file_name='+new_file_name,
                data: {file: file}
            }).then(function (resp) {
                $scope.showProgress = false;
                if(resp.data=="UPLOAD_FAILED"){
                    $scope.message = "upload failed";
                    $scope.message_class = "failed";
                }

                if(resp.data=="UPLOAD_SUCCESS"){
                    main.getAvailableFilesThisYear();
                    $scope.message = "uploaded successful";
                    $scope.message_class = "success";
                }

                if(resp.data=="FILE_EXIST_ERROR"){
                    $scope.message = "file exist";
                    $scope.message_class = "failed";
                }

                if(resp.data=="INVALID_TYPE_ERROR"){
                    $scope.message = "file is not pdf";
                    $scope.message_class = "failed";
                }

            }, function (resp) {
                $scope.showProgress = false;
                console.log('Error status: ' + resp.status);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                if(!evt.config.data.file){
                    $scope.message = "no file specified";
                }else{
                    $scope.showProgress = true;
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                }


            });
        };

		}



})();
