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
        .controller('mapController', mapController);

    mapController.$inject   = ['$scope', '$http','$timeout', 'olData','olHelpers','shared'];
    function mapController($scope, $http,$timeout, olData,olHelpers,shared) {
        var map = this;
        map.baseUrl = "http://139.162.204.124/training/";
        /**
         * THE BEGINNING OF THE FUNCTION THAT HANDLES HOME PAGE FUNCTIONALITY OF MAP
         * */
        map.authenticateDHIS = function () {
            var promise = $.post( map.baseUrl + "dhis-web-commons-security/login.action?authOnly=true", {
                j_username: "Demo", j_password: "HMISDEMO2015"
            },function(response){
                $scope.drawMap();
            });

            return promise;
        }

        $scope.drawMap = function(){
            $scope.shared = shared;
            shared.facility =3029;

            var url = map.baseUrl+'api/organisationUnits.geojson?parent=m0frOspS7JY&level=3';

            //map.authenticateDHIS().then(function(){
                $http({
                    method: 'GET',
                    url: url,
                    dataType: "json",
                    cache: true,
                    ifModified: true
                }).success(
                    function(data) {

                        var tempo = data.features;
                        angular.forEach(tempo,function(value,index){
                            tempo[index].expanded = false;
                        });
                        $scope.orgunit = tempo;
                        var TotalGeo = {
                            "type":"FeatureCollection",
                            "features":[]
                        };
                        var districtProperties = [];

                        var dateObject = new Date();
                        $scope.thisyear = dateObject.getFullYear();
                        $scope.districts = {};
                        $scope.DistrictFreeObject = [];
                        var getApproPiateColor = function(percent){


                            if(percent>0){
                                return "#55CD55"
                            }
                            //if(percent>0.4){
                            //    return "#90EE90"
                            //}
                            //
                            //if(percent>0.1){
                            //    return "#E8C25B"
                            //}

                            if(percent==0){
                                return "#E38280"
                            }

                            //if(percent==0){
                            //    // red color
                            //    return "#DE877E"
                            //}
                        }
                        angular.forEach(data.features, function (value, index) {

                            var number_of_files_available = $scope.$parent.main.getOrgunitFileStatistics(value.properties.name);
                            var percent = 0;
                            if(number_of_files_available.total==0){
                                percent = 0;
                            }else{
                                percent = number_of_files_available.count/number_of_files_available.total;
                            }
                            var hue = getApproPiateColor(percent.toFixed(3));

                            // creating dynamic colors for district
                            $scope.saveColorInlocalStorage(value.id,hue);

                            // prepare objects of district for properties to display on tooltip
                            districtProperties[value.id] = {
                                district_id:value.id,
                                year:$scope.thisyear,
                                name:value.properties.name,
                                "color":hue,
                                "facility":Math.floor(Math.random() * 256)
                            };

                            $scope.DistrictFreeObject.push(districtProperties[value.id]);
                            $scope.districts[value.id]= districtProperties;

                            // creating geojson object
                            var Object =
                            {
                                "type":"Feature",
                                "id":value.id,
                                "properties":{
                                    "name":value.properties
                                },
                                "geometry":{
                                    "type":value.geometry.type,
                                    "coordinates":value.geometry.coordinates
                                },
                                "style":{
                                    fill:{
                                        color:$scope.getColorFromLocalStorage(value.id),
                                        opacity:5
                                    },
                                    stroke:{
                                        color:'white',
                                        width:2
                                    }
                                }
                            };
                            TotalGeo.features.push(Object);

                        });

                        // function getter for district object
                        var getColor = function(district){
                            if(!district || !district['district_id']){
                                return "#FFF";
                            }
                            var color = districtProperties[district['district_id']].color;
                            return color;
                        }
                        var getStyle = function(feature){
                            var style = olHelpers.createStyle({
                                fill:{
                                    color:getColor($scope.districts[feature.getId()]),
                                    opacity:0.4
                                },
                                stroke:{
                                    color:'white',
                                    width:2
                                },
                                text:  new ol.style.Text({
                                    textAlign: 'center',
                                    textBaseline: 'middle',
                                    font: 'Arial',
                                    text: formatText(districtProperties[feature.getId()].name),
                                    fill: new ol.style.Fill({color: "#000000"}),
                                    //stroke: new ol.style.Stroke({color: "#000000", width: 0}),
                                    offsetX: 0,
                                    offsetY: 0,
                                    rotation: 0
                                })
                            });
                            return [ style ];

                        }

                        function formatText(orgunitname){
                            var textArray = orgunitname.split(" ");
                            return "";
                        }

                        angular.extend($scope, {
                            Africa: {
                                lat: -6.45,
                                lon: 35,
                                zoom: 5.6
                            },
                            layers:[
                                {
                                    name:'mapbox',
                                    source: {
                                        type: 'TileJSON',
                                        url:'http://api.tiles.mapbox.com/v3/mapbox.geography-class.jsonp'
                                    }
                                }
                                ,
                                {
                                    name:'geojson',
                                    source: {
                                        type: 'GeoJSON',
                                        geojson: {
                                            object: TotalGeo
                                        }
                                    },
                                    style: getStyle
                                }
                            ],defaults: {
                                events: {
                                    layers: [ 'mousemove', 'click']
                                }
                            }
                        });

                        $scope.districts = {};
                        angular.forEach($scope.DistrictFreeObject,function(data,index){
                            var district = data;
                            $scope.districts[district['district_id']] = district;
                        });


                        olData.getMap().then(function(map) {
                            var previousFeature;
                            var overlay = new ol.Overlay({
                                element: document.getElementById('districtbox'),
                                positioning: 'top-right',
                                offset: [100, -100],
                                position: [100, -100]
                            });
                            var overlayHidden = true;
                            // Mouse click function, called from the Leaflet Map Events
                            $scope.$on('openlayers.layers.geojson.mousemove', function(event, feature, olEvent) {
                                $scope.$apply(function(scope) {

                                    scope.selectedDistrictHover = feature ? $scope.districts[feature.getId()] : '';
                                    if(feature) {
                                        scope.selectedDistrictHover = feature ? $scope.districts[feature.getId()] : '';
                                    }

                                });

                                if (!feature) {
                                    map.removeOverlay(overlay);
                                    overlayHidden = true;
                                    return;
                                } else if (overlayHidden) {
                                    map.addOverlay(overlay);
                                    overlayHidden = false;
                                }
                                overlay.setPosition(map.getEventCoordinate(olEvent));
                                if (feature) {
                                    feature.setStyle(olHelpers.createStyle({
                                        fill: {
                                            color: getColor($scope.districts[feature.getId()])
                                        },
                                        stroke: {
                                            color: '#A3CEC5',
                                            width:2

                                        }
                                    }));
                                    if (previousFeature && feature !== previousFeature) {
                                        previousFeature.setStyle(getStyle(previousFeature));
                                    }
                                    previousFeature = feature;
                                }
                            });

                            $scope.$on('openlayers.layers.geojson.click', function(event, feature, olEvent) {
                                $scope.$parent.main.chart_shown = false;
                                $scope.$parent.main.backToGrid()
                                //$scope.closeTootipHover();
                                $scope.$apply(function(scope) {
                                    scope.selectedDistrict = feature ? $scope.districts[feature.getId()] : '';
                                    if(feature) {
                                        // looping throught indicator types
                                        scope.selectedDistrict = feature ? $scope.districts[feature.getId()] : '';
                                        $scope.selectedDistrictName = scope.selectedDistrict.name;
                                        var orgUnit = {children:null};
                                        $scope.$parent.main.processView(orgUnit,scope.selectedDistrict.name,scope.selectedDistrict.district_id)


                                    }
                                });

                                if (!feature) {
                                    map.removeOverlay(overlay);
                                    overlayHidden = true;
                                    return;
                                } else if (overlayHidden) {
                                    map.addOverlay(overlay);
                                    overlayHidden = false;
                                }
                                overlay.setPosition(map.getEventCoordinate(olEvent));
                                if (feature) {
                                    feature.setStyle(olHelpers.createStyle({
                                        fill: {
                                            color: '#FFF'
                                        }
                                    }));
                                    if (previousFeature && feature !== previousFeature) {
                                        previousFeature.setStyle(getStyle(previousFeature));
                                    }
                                    previousFeature = feature;
                                }
                            });
                            $scope.$on('openlayers.layers.geojson.featuresadded', function(event, feature, olEvent) {
                                $scope.$apply(function(scope) {
                                    if(feature) {
                                        $scope.id = feature.getId();
                                        scope.selectedDistrict = feature ? $scope.districts[feature.getId()]: '';
                                    }
                                });

                            });
                        });
                        $scope.closeTootip = function(){
                            $scope.selectedDistrict = null;

                        }
                        $scope.closeTootipHover = function(){
                            $scope.selectedDistrictHover = null;

                        }

                    });
            //});



            $scope.saveColorInlocalStorage  = function(id,value){

                if(!$scope.getColorFromLocalStorage(id)){
                    localStorage.setItem(id , value);
                }else{
                    localStorage.removeItem(id);
                }
            }

            $scope.getColorFromLocalStorage = function(id){
                var Item = localStorage.getItem( id );
                if(!Item){
                    return false;
                }else{
                    return Item;
                }

            }
        };
        // check if year has changed from the parent
        $scope.$on('yearChangedEvent', function(e) {
            $scope.drawMap();
        });
        map.authenticateDHIS();

        /**
         *  THE END
         * */




     }
})()


