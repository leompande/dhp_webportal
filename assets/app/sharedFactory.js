/**
 * Created by leo on 11/11/15.
 */

(function() {
    'use strict';

    angular
        .module('dhp')
        .factory('shared',  shared);
        function shared() {
            var shared = {
            "facility":0
        };
        return shared;
        }
})();
