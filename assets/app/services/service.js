(function () {
    'use strict';

    angular
        .module('dhp')
        .config(function($httpProvider) {
            $httpProvider.defaults.withCredentials = true;
        })
        .service('profileService', profileService)
        .service('utilityService', utilityService);
    profileService.$inject = ['$http','Upload'];
    utilityService.$inject = ['$http'];
    function profileService($http,Upload) {
      var profile = this;
        profile.baseDHIS = "http://139.162.204.124/training/";
        profile.basePortal = "server/";
        profile.listProfileByYear = function(year){
            return $http.get(profile.basePortal+'process.php?by_year='+year+'&only=1').then(handleSuccess, handleError('Error creating user'));
        }

        profile.listProfileByOrgUnit = function(orgunits){
            return $http.get(profile.basePortal+'process.php?by_orgunit='+orgunits).then(handleSuccess, handleError('Error creating user'));
        }

        profile.listProfileByOrgUnitAndPeriod = function(year,orgunits){
            return $http.get(profile.basePortal+'process.php?by_year='+year+'&by_orgunit='+orgunits).then(handleSuccess, handleError('Error creating user'));
        }

        profile.saveProfile = function(data){
            console.log(data);
            return Upload.upload({
                url: 'server/process.php?file=1&new_file_name='+data.file_name,
                data: {file: data.file_object}
            }).then(handleSuccess, handleError('Error creating user'));
        }

        profile.uploadCSVProfile = function(data){
            console.log(data);
            return Upload.upload({
                url: 'server/process.php?csv_input=1&new_file_name='+data.file_name+'&orgUnitId='+data.orgunit+'&period='+data.period,
                data: {file: data.file_object}
            }).then(handleSuccess, handleError('Error creating user'));
        }

        profile.editProfile = function(data){
            return $http.get(profile.basePortal+'process.php?by_year='+year+'&period='+orgunits).then(handleSuccess, handleError('Error creating user'));
        }

        profile.delete = function(health_profile){
            return $http.get(profile.basePortal+"process.php?delete="+health_profile).then(handleSuccess, handleError('Error creating user'));
        }
    }
    function utilityService($http) {
      var profile = this;
        profile.baseDHIS = "http://139.162.204.124/training/";
        profile.basePortal = "server/";

        profile.loadOrganisationUnits = function(){
            return $http.get(profile.basePortal+'organisationUnits_level_1_org.json').then(handleSuccess, handleError('Error creating user'));
        }
        profile.getOrgUnits = function(){
            return $http.get(profile.basePortal+'organisationUnits.json').then(handleSuccess, handleError('Error creating user'));
        }

        profile.login = function(username,password){
            return $.post(profile.baseDHIS+"dhis-web-commons-security/login.action?authOnly=true", {
                'j_username':username,
                'j_password':password
            }).then(handleSuccess, handleError('Error creating user'));
        }

        profile.getUserDetails = function(){
            var currentUserUrl = "api/me.json";
            return $http.get(profile.baseDHIS+currentUserUrl).then(handleSuccess, handleError('Error creating user'));

        }
        profile.getDataElements = function(){
            var url = "api/dataElementGroups/TWx3Doxh1jG.json?fields=id,name,dataElements[id,name]";
            return $http.get(profile.baseDHIS+url).then(handleSuccess, handleError('Error creating user'));

        }

        profile.prepareDataElementUid = function(data){
            localStorage.removeItem('dataElementsNames');
            localStorage.setItem('dataElementsNames',data);
            console.log(data);
        }

        profile.prepareDataElementNames = function(data){
            localStorage.removeItem('dataElementsUids');
            localStorage.setItem('dataElementsUids',data);
            console.log(data);
        }


        profile.modifyOrgUnits = function(rawOrgUnits){
            var Regions = [];
            var i  = 0;
            angular.forEach(rawOrgUnits,function(value,index){
                var regions = {value:value.name,children:[]};
                angular.forEach(value.children,function(valueChildren,indexChildren){
                    regions.children.push({name:valueChildren.name,value:value.name+"_"+valueChildren.name,id:value.id});
                });
                Regions.push(regions);
                i++;
            });
            return Regions;
        }

        profile.getPropertiesArray = function(profile_string){
            var stage_one = profile_string.split("_");
            var region = stage_one[0];
            var district_name = stage_one[1];
            var year_and_format = stage_one[2];

            var stage_two = year_and_format.split(".");
            var year = stage_two[0];

            return {region:region,district:district_name,year:year};
        }
    }



    // private functions

    function handleSuccess(res) {
        return res.data;
    }

    function handleError(error) {
        return function () {
            return { success: false, message: error };
        };
    }

})();