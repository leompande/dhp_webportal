(function() {
    'use strict';

    angular
        .module('dhp')
        .filter('renderItLikeHTML',
        function ($sce){

            return function(stringToParse)
            {
                return $sce.trustAsHtml(stringToParse);
            }

        }
    );


})()
