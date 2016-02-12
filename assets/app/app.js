(function() {
    'use strict';

   angular
    .module('dhp',['openlayers-directive','ivh.treeview','highcharts-ng','ngFileUpload','datatables','ui.materialize','ngCookies','ngRoute'])
       .config(['$routeProvider','$httpProvider',function($routeProvider,$httpProvider){
           $httpProvider.defaults.withCredentials = true;
           $routeProvider.
               when('/', {
                   templateUrl: 'partials/dashboard.html',
                   controller: 'mapController'
               }).
               when('/admin', {
                   templateUrl: 'partials/admin.html',
                   controller: 'adminController'
               }).
               otherwise({
                   redirectTo: '/'
               });

       }])


})();

