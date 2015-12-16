(function() {
    'use strict';

   angular
    .module('dhp',['openlayers-directive','ivh.treeview','highcharts-ng','ngFileUpload','datatables','ngCookies','ngRoute'])
       .config(['$routeProvider','$httpProvider',function($routeProvider,$httpProvider){
           $httpProvider.defaults.withCredentials = true;
           $routeProvider.
               when('/', {
                   templateUrl: 'partials/dashboard.html',
                   controller: 'mapController'
               }).
               when('/admin', {
                   templateUrl: 'partials/admin.html',
                   access: {
                       requiresLogin: true,
                       requiredPermissions: ['admin'],
                       permissionType: 'AtLeastOne'
                   },
                   controller: 'adminController'
               }).
               otherwise({
                   redirectTo: '/'
               });

       }])


})();

