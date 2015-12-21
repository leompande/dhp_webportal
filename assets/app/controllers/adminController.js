/**
 * Created by leo on 11/11/15.
 */
/**
 * THE BEGINNING OF MAP CONTROLLER FUNCTION
 * */

(function() {
    'use strict';

    angular
        .module('dhp')
        .config(function($httpProvider) {
            $httpProvider.defaults.withCredentials = true;
        })
        .controller('adminController', adminController);

    adminController.$inject   = ['$scope','$cookies', '$http','$q','$timeout', 'olData','olHelpers','shared','profileService','DTOptionsBuilder','Upload','utilityService'];
    function adminController($scope,$cookies, $http,$timeout,$q, olData,olHelpers,shared,profileService,DTOptionsBuilder,Upload,utilityService) {
    var admin = this;
        var date = new Date();
        admin.current_year = date.getFullYear();
        admin.list = true;
        admin.addProfileForm = false;
        admin.editProfileForm = false;
        admin.criteria = false;
        admin.districtSelector = false;
        admin.profiles = null;
        admin.current_pdf_link = "uploads/";
        admin.districtName = [];
        admin.selectedOrgUnit = null;
        admin.selectedOrgUnitList = null;
        admin.tanzania = "Tanzania";
        admin.selectedOrgUnitToDisplay = admin.tanzania;
        admin.selectedPeriod = admin.current_year;
        admin.periodCriteria = admin.current_year;
        admin.regions = [];
        admin.districts = [];
        admin.districtsOnly = [];
        admin.csvfile = null;
        /**
         * THE BEGINNING OF THE FUNCTION THAT HANDLES ADMIN PAGE FUNCTIONALITY OF PORTAL
         * */
        admin.showList = function(){
            admin.editProfileForm = false;
            admin.addProfileForm = false;
            admin.list = true;
            admin.uploadcsv = false;
            admin.drawTable(admin.current_year,admin.selectedOrgUnitToDisplay);
            //profileService.listProfileByYear().then(function(data){

                $('select').material_select();
            //},function(response){
            //});
        }

        admin.drawTable = function(year,orgUnit){
//            var getTableData = function() {
//                console.log($q)
//                var deferred = $q;
//                deferred.resolve([{name:"leonard mpande"},{name:"bianca bree vandamme"},{name:"chris vandamme"}]);
//                return deferred.promise;
//            };
//
//            admin.dtOptions = DTOptionsBuilder.fromFnPromise(getTableData())
//                .withPaginationType('full_numbers');
//            console.log(admin.dtOptions);
            if(orgUnit==admin.tanzania){
                profileService.listProfileByYear(year).then(function(data){
                    admin.profiles = data;
                },function(response){
                    console.log(response);
                });
            }else{
                profileService.listProfileByOrgUnitAndPeriod(year,orgUnit).then(function(data){
                    admin.profiles = data;
                },function(response){
                    console.log(response);
                });
            }

        }

        admin.showList();

        admin.districtSelection = function(){
            if(typeof(admin.selectedOrgUnitRegion)!=="undefined"){
                if(admin.districtSelector){
                    admin.districtSelector = false;
                    admin.selectedOrgUnitToDisplay = JSON.parse(admin.selectedOrgUnitRegion).value;
                }else{
                    admin.districtSelector = true;
                }
        }

        }

        admin.showDistricts = function(district){

            admin.districts = JSON.parse(district).children;
        };


        $scope.$watch("admin.selectedOrgUnitRegion",function(newValue,oldValue){
            if(typeof(newValue) !=="undefined"){
               admin.showDistricts(newValue);
                admin.selectedOrgUnitToDisplay = JSON.parse(newValue).value;
                admin.drawTable(admin.selectedPeriod,admin.selectedOrgUnitToDisplay);
            }
        });

        $scope.$watch("admin.selectedEntryRegion",function(newValue,oldValue){
            if(typeof(newValue)!=="undefined"){
                admin.showDistricts(newValue);
            }
        });

        $scope.$watch("admin.selectedOrgUnitDistrict",function(newValue,oldValue){
            if(typeof(newValue) !=="undefined"){
                admin.selectedOrgUnitToDisplay = JSON.parse(admin.selectedOrgUnitRegion).value+" -> "+newValue.split("_")[1];
                var district = getDirstrictName(admin.selectedOrgUnitToDisplay);
                admin.drawTable(admin.selectedPeriod,district);
            }
        });

        $scope.$watch("admin.selectedPeriod",function(newValue,oldValue){
            if(typeof(newValue) !=="undefined"){
                admin.drawTable(newValue,admin.selectedOrgUnitToDisplay);
            }
        });


        admin.newProfile = function(){
            admin.editProfileForm = false;
            admin.addProfileForm = true;
            admin.list = false;
            admin.uploadcsv = false;

        }

        admin.saveProfile = function(form){
            admin.editProfileForm = false;
            admin.addProfileForm = true;
            admin.list = false;
            admin.uploadcsv = false;
            form.org_unit_selected = admin.selectedEntryDistrict.split("_")[1];


            var payload = {file_name:admin.selectedEntryDistrict+"_"+form.form_period+".pdf",file_object:admin.file};
            if(!admin.selectedEntryDistrict&&!form.form_period){

            }else{
                profileService.saveProfile(payload).then(function(data){

                    admin.showProgress = false;
                    if(data=="UPLOAD_FAILED"){
                        admin.message = "upload failed";
                        admin.message_class = "failed";
                    }

                    if(data=="UPLOAD_SUCCESS"){
                        admin.showList();
                        admin.message = "uploaded successful";
                        admin.message_class = "success";
                    }

                    if(data=="FILE_EXIST_ERROR"){
                        admin.message = "file exist";
                        admin.message_class = "failed";
                    }

                    if(data=="INVALID_TYPE_ERROR"){
                        admin.message = "file is not pdf";
                        admin.message_class = "failed";
                    }

                },function(response){});
            }

        }

        admin.editProfile = function(profile){
            admin.editProfileForm = true;
            admin.addProfileForm = false;
            admin.list = false;
            admin.uploadcsv = false;
            var properties = utilityService.getPropertiesArray(profile);
            admin.editedParrentOrgUnit = properties.region;
            admin.editedOrgUnit = properties.district;
            admin.editedYear = properties.year;
        }
        admin.cancelUpdate = function(){
            admin.editProfileForm = false;
            admin.addProfileForm = false;
            admin.list = true;
            admin.uploadcsv = false;
        }

        admin.openCriteria = function(){
            if(admin.criteria){
                admin.criteria = false;
            }else{
                admin.criteria = true;
            }
        }

        admin.deleteProfile = function(profile){
            profileService.delete(profile).then(function(data){
                admin.showList();
            },function(response){

            });
        }

        admin.getDistrictName = function(profile){
            admin.districtName.push(profile);
            return admin.districtName;

        }

        admin.filterProfiles = function(criteria){
            console.log(criteria);
        }

        admin.uploadCSV = function(){
            admin.uploadcsv = true;
            admin.editProfileForm = false;
            admin.list = false;
            admin.addProfileForm = false;
        }

        admin.uploadProfileToDHIS = function(form){
            admin.uploadcsv = true;
            admin.editProfileForm = false;
            admin.list = false;
            admin.addProfileForm = false;
            //console.log(form);
            //console.log(admin.csvfile);

            form.org_unit_selected = admin.selectedCSVEntryDistrict;


            var payload = {file_name:"dataset.csv",file_object:admin.csvfile,orgunit:admin.selectedCSVEntryDistrict,period:form.form_period};
            if(!admin.selectedCSVEntryDistrict&&!form.form_period){

            }else{
                profileService.uploadCSVProfile(payload).then(function(data){
                    console.log(data);
                    admin.showProgress = false;
                    if(data=="UPLOAD_FAILED"){
                        admin.message = "upload failed";
                        admin.message_class = "failed";
                    }

                    if(data=="UPLOAD_SUCCESS"){
                        //admin.showList();
                        admin.message = "uploaded successful";
                        admin.message_class = "success";
                    }

                    if(data=="FILE_EXIST_ERROR"){
                        admin.message = "file exist";
                        admin.message_class = "failed";
                    }

                    if(data=="INVALID_TYPE_ERROR"){
                        admin.message = "file is not csv";
                        admin.message_class = "failed";
                    }

                },function(response){});
        }
        }


        utilityService.loadOrganisationUnits().then(function(data){
             admin.regions = utilityService.modifyOrgUnits(data.organisationUnits[0].children);
        });

        $scope.$watch("admin.selectedOrgUnitList",function(newValue,oldValue){
            if(newValue){
                var OrgUnit = newValue.split("_");
                admin.selectedOrgUnitToDisplay = OrgUnit[1];
            }
        });

        $scope.$watch("admin.periodCriteria",function(newValue,oldValue){
            admin.selectedPeriod = newValue;
        });
            function getDirstrictName(sample_name){
            var broken_name = sample_name.split(" -> ");

            return broken_name[1];
            }
        /**
         *  THE END
         * */
     }
})()


