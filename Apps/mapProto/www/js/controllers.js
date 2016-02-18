angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $rootScope, $ionicModal, $timeout) {
  
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope, $state, $cordovaGeolocation) {
  $scope.playlists = [
    { title: 'Current Location', id: 1 },
    { title: 'Marcellus, NY', id: 2, loc: { lat: 42.98471, lng: -76.34045 } },
    { title: 'Beaverton, OR', id: 3, loc: { lat: 45.4452962, lng: -122.8373029 } }
  ];

      var options = {maximumAge:600000, timeout:5000, enableHighAccuracy: false};

  $scope.selectLocation = function(item) {

    if(!item.loc) {

      var posOptions = {timeout: 10000, enableHighAccuracy: false};
      $cordovaGeolocation
          .getCurrentPosition(posOptions)
          .then(function (position) {
            var lat  = position.coords.latitude;
            var long = position.coords.longitude;

            console.log("lat=" + lat);
            console.log("long=" + long);

          }, function(err) {
            // error
          });

      //-- First launch a basic geolocalisation to get user acceptance of geosharing ;)
      navigator.geolocation.getCurrentPosition(function(location) {
            console.log('[GEOLOCAL JS1] Location from Phonegap');
            var dynItem = { title: 'Current Location', id: 1, loc: { lat: location.coords.latitude, lng: location.coords.longitude }}
            $state.go('app.mapLocation', {Location: dynItem});
          },
          function (error){
            console.log('[GEOLOCAL JS1] error with GPS: error.code: ' + error.code + ' Message: ' + error.message);
            alert('Cannot determine location; reason: ' + error.message)
          }, options);

    }
    else {
      $state.go('app.mapLocation', {Location: item});
    }
  }
})

.controller('PlaylistCtrl', function($scope, $rootScope, $compile, $stateParams, MapService) {

      $scope.location = $stateParams.Location;

      $scope.getNaturalAtlasStyles = function() {
        var naturalAtlasStyles = [
          {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [
              { "color": "#ff0000" },
              { "hue": "#2200ff" },
              { "weight": 1.3 }
            ]
          },{
            "featureType": "road.arterial",
            "elementType": "geometry.stroke",
            "stylers": [
              { "color": "#ffff00" },
              { "weight": 0.7 },
              { "hue": "#ff5e00" }
            ]
          },{
            "featureType": "road.local",
            "elementType": "geometry.stroke",
            "stylers": [
              { "weight": 0.6 },
              { "color": "#1c6540" },
              { "hue": "#ff00cc" }
            ]
          },{
            "featureType": "landscape.natural.landcover",
            "elementType": "geometry.fill",
            "stylers": [
              { "color": "#5bf1b7" },
              { "lightness": 54 },
              { "hue": "#08ff00" }
            ]
          },{
            "featureType": "landscape.man_made",
            "stylers": [
              { "color": "#00ffff" },
              { "hue": "#fff700" }
            ]
          },{
            "featureType": "poi.park",
            "stylers": [
              { "color": "#80ffc4" },
              { "hue": "#003bff" }
            ]
          },{
            "featureType": "landscape.natural.terrain",
            "elementType": "labels",
            "stylers": [
              { "hue": "#ff7700" },
              { "color": "#cbbabf" }
            ]
          }
        ];

        return naturalAtlasStyles;
      }

      $scope.getMapStyle = function() {
        var roadAtlasStyles = [
          {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [
              { hue: '#ff0022' },
              { saturation: 60 },
              { lightness: -20 }
            ]
          },{
            featureType: 'road.arterial',
            elementType: 'all',
            stylers: [
              { hue: '#2200ff' },
              { lightness: -40 },
              { visibility: 'simplified' },
              { saturation: 30 }
            ]
          },{
            featureType: 'road.local',
            elementType: 'all',
            stylers: [
              { hue: '#f6ff00' },
              { saturation: 50 },
              { gamma: 0.7 },
              { visibility: 'simplified' }
            ]
          },{
            featureType: 'water',
            elementType: 'geometry',
            stylers: [
              { saturation: 40 },
              { lightness: 40 }
            ]
          },{
            featureType: 'road.highway',
            elementType: 'labels',
            stylers: [
              { visibility: 'on' },
              { saturation: 98 }
            ]
          },{
            featureType: 'administrative.locality',
            elementType: 'labels',
            stylers: [
              { hue: '#0022ff' },
              { saturation: 50 },
              { lightness: -10 },
              { gamma: 0.90 }
            ]
          },{
            featureType: 'transit.line',
            elementType: 'geometry',
            stylers: [
              { hue: '#ff0000' },
              { visibility: 'on' },
              { lightness: -70 }
            ]
          }
        ];

        return roadAtlasStyles;

      }

      $scope.getMapProxmity = function(measType) {

        // Get Gmap radius / proximity start
        var bounds = $scope.map.getBounds();

        var sw = bounds.getSouthWest();
        var ne = bounds.getNorthEast();

        var proximitymeter = google.maps.geometry.spherical.computeDistanceBetween (sw, ne)/2;
        if(measType == 'radians') {
          var proximityRadians = proximitymeter / 63781;
          console.log(" " + proximityRadians + " Radians Proximity");
          return proximityRadians;
        }

        var proximitymiles = proximitymeter * 0.000621371192;
        if(measType == 'miles') {
          console.log(" " + proximitymiles + " Miles Proximity");
          return proximitymiles;
        }

        console.log(" " + proximitymiles + " Meters Proximity");
        return proximitymeter;

      }


      $scope.initialize = function() {


      var myLatlng;

        if($scope.location.loc) {
          myLatlng = new google.maps.LatLng($scope.location.loc.lat, $scope.location.loc.lng);
        }
        else {
          myLatlng = new google.maps.LatLng(43.07493,-89.381388);
        }

        if(! $rootScope.zoomLevel ) {
          $rootScope.zoomLevel = 16;
        }

      var mapOptions = {
        center: myLatlng,
        zoom: $rootScope.zoomLevel ,
        mapTypeControlOptions: {
          mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'usroadatlas', 'naturalatlas']
        }
      };

      var map = new google.maps.Map(document.getElementById("map"),
          mapOptions);

        var styledMapOptions = {
          name: 'Road Atlas'
        };

        var usRoadMapType = new google.maps.StyledMapType(
            $scope.getMapStyle(), styledMapOptions);

        map.mapTypes.set('usroadatlas', usRoadMapType);
        map.setMapTypeId('usroadatlas');

        var styledMapOptions = {
          name: 'Campground Atlas'
        };

        var usRoadMapType = new google.maps.StyledMapType(
            $scope.getNaturalAtlasStyles(), styledMapOptions);

        map.mapTypes.set('naturalatlas', usRoadMapType);


        //Marker + infowindow + angularjs compiled ng-click
        var contentString = "<div><a ng-click='clickTest()'>Click me!  I am a genius and ace !</a></div>";
        var compiled = $compile(contentString)($scope);

        var infowindow = new google.maps.InfoWindow({
          content: compiled[0]
        });

        var marker = new google.maps.Marker({
          position: myLatlng,
          map: map,
          title: $scope.location.title
        });

        $scope.markers =[];

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.open(map,marker);
        });

        google.maps.event.addListener(map, 'zoom_changed', function() {
          $rootScope.zoomLevel = map.getZoom();
          console.log($rootScope.zoomLevel);
        });

        google.maps.event.addListener(map, 'idle', function() {

          // 3 seconds after the center of the map has changed, pan back to the
          // marker.
          window.setTimeout(function() {

            var myMapInstance = $scope.map;
            $rootScope.zoomLevel = myMapInstance.getZoom();

            if($rootScope.zoomLevel < 8) {
              console.log('zoom level =' + $rootScope.zoomLevel);
              return;
            }

            var maxDistanceR = $scope.getMapProxmity('radians');

            var latLong = myMapInstance.getCenter();
            var rect = myMapInstance.getBounds();
            for (var i = 0; i < $scope.markers.length; i++) {
              if(!rect.contains(new google.maps.LatLng($scope.markers[i].position.A, $scope.markers[i].position.F)))
                $scope.markers[i].setMap(null);
            }

            MapService.getCampgroundsByLoc(latLong.F, latLong.A, maxDistanceR).then(function(data) {
              console.log("received: " + data.length + " campgrounds");


              // Add the marker to the map
              data.forEach(function(item) {

                var myLatlng = new google.maps.LatLng(item.loc[1],item.loc[0]);
                var marker = new google.maps.Marker({
                  position: myLatlng,
                  title: item.ShortName,
                  map: myMapInstance
                });


                item.AmenditiesList = $scope.getLabels(item.Amendities);

                var amendStr = "<br/>";
                item.AmenditiesList.forEach( function(itm) {
                     amendStr += itm + "<br/>";
                })

                //Marker + infowindow + angularjs compiled ng-click
                var contentString = "<div>Name:<a href='' ng-click='selectItem(\"" + item._id + "\")'>"  + item.Name + "</a><br/>" +
                                    "Phone:<a href='tel:" + item.Phone + "' >" + item.Phone + '</a><br/>' +
                                    "ParkType:" + item.ParkType + "<br/>" +
                                    "Amendities: " + amendStr ;

                var compiled = $compile(contentString)($scope);

                var infowindow = new google.maps.InfoWindow({
                  content: compiled[0]
                });

                google.maps.event.addListener(marker, 'click', function() {
                  infowindow.open(map,marker);
                });

                $scope.markers.push(marker);

              })
            }, function(err){
              console.log(err);
            });


          }, 1000);
        });

      $scope.map = map;
    }

    google.maps.event.addDomListener(window, 'load', $scope.initialize);

      $scope.getLabels = function(str) {

        var cr = [];

        // crossreference
        cr['NH'] = 'No Hookups';
        cr['E'] = 'Electric';
        cr['WE'] = 'Water and Electric';
        cr['WES'] = 'Water, Electric and Server';
        cr['DP'] = 'Dump Station';
        cr['ND'] = 'No Dump';
        cr['FT'] = 'Flush';
        cr['VT'] = 'Vault';
        cr['FTVT'] = 'Some Flush/Vault';
        cr['PT'] = 'Pit';
        cr['NT'] = 'NO TOLIETS';
        cr['DW'] = 'Drinking Water';
        cr['NW'] = 'NO WATER';
        cr['SH'] = 'Showers';
        cr['RS'] = 'Reservations';
        cr['NR'] = 'No Reservations';
        cr['PA'] = 'Pets';
        cr['NP'] = 'NO PETS';
        cr['L$'] = 'FREE or <$12';

        var s = str.split(' ');

        for(var i = 0; i< s.length; i++) {
          if(cr[s[i]]) {
            s[i] = cr[s[i]];
          }
        }

        return s;
      }

    $scope.centerOnMe = function() {
      if(!$scope.map) {
        return;
      }

    $scope.loading = $ionicLoading.show({
      content: 'Getting current location...',
      showBackdrop: false
    });

    navigator.geolocation.getCurrentPosition(function(pos) {
      $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      $scope.loading.hide();
    }, function(error) {
      alert('Unable to get location: ' + error.message);
    });

};

      $scope.selectItem = function(item) {
        alert('test: ' + item);
      }

    $scope.clickTest = function() {
      alert('Example of infowindow with ng-click')
    };

    $scope.initialize();



});
