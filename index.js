(function() {
    'use strict';

    angular
        .module('dhp',['openlayers-directive','ivh.treeview','highcharts-ng','ngFileUpload','datatables'])
        .config(function(){})
        .controller('mainController', mainController);

    mainController.$inject   = ['$scope','$http','ivhTreeviewMgr', 'Upload'];
    function mainController($scope,$http,ivhTreeviewMgr,Upload) {
		var main  = this;
        var date = new Date();
        $scope.custome_height    ="default";
        $scope.viewOpen          = false;
		main.csv_menu            = false;
		main.facilityUid         = null;
        main.selectedYear = date.getFullYear();
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
        main.form_period = null;
        main.orgunit = null;
        //front chart for the portal
        main.drawChart = function(){
            $scope.$watch("main.available_files_this_year",function(newOne,oldOne){
                if(main.available_files_this_year!=null){
                    $scope.submitted = main.available_files_this_year.length;
                }

                $scope.chartConfig = {
                    chart: {
                        type: 'pie'
                    },
                    title: {
                        text: 'DHP District Submission Statistics: '+main.selectedYear
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            depth: 35,
                            dataLabels: {
                                enabled: false,
                                format: '{point.percentage.toFixed(1)}%'
                            },showInLegend: true
                        }
                    },
                    series: [{
                        type: 'pie',
                        name: 'Distribution',
                        data: [
                            ['Not Submitted',   7],
                            ['Submitted',  $scope.submitted]

                        ]
                    }]
                }

            });
        }
        main.drawChart();
        main.backToChart = function(){
            $scope.viewOpen = false;
            main.chart_shown = true;
        }

        //broadcast event that year has changed
        $scope.$watch("main.selectedYear",function(oldOne,newOne){
            main.getAvailableFilesThisYear();
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
            var id = orgUnit.id;
            main.processView(orgUnit,name,id);
            main.current_id = id;
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
            console.log("abcd");
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


        // load org unit for tree
        $scope.customOpts = {
            onCbChange:main.treeCallback
        }
        $http.get("server/organisationUnits_level_1_org.json").success(function(data){
            console.log(data);
            $scope.data.organisationUnits = data.organisationUnits;
        });
        $http.get("server/organisationUnits.json").success(function(data){

            $scope.organisationUnits = data.organisationUnits;
        });

        main.getPeriod = function(start_period){
            var date = new Date();
            var periods = [];
            var thisyear = date.getFullYear();
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

        $scope.submit = function(period,orgunit) {
            //if ($scope.file.$valid && $scope.file) {
                //$scope.upload($scope.file);
                console.log(period);
                console.log(orgunit);
            $scope.upload($scope.file);
            //}
        };

        // upload on file select or drop
        $scope.upload = function (file) {
            Upload.upload({
                url: 'server/process.php?file=1&period='+main.form_period+"&district="+main.orgunit,
                data: {file: file}
            }).then(function (resp) {
                console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
            }, function (resp) {
                console.log('Error status: ' + resp.status);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            });
        };

		}



})();
