/**
 * Created by michaelsilliman on 7/4/15.
 */
angular.module('starter')


    .factory('MapService', ['$http', '$q', '$rootScope', function($http, $q, $rootScope) {

        return {

            doNullOperation: function () {
                console.log("doNullOperation");

                var authToken = $rootScope.currentUser.token;

                var request = $http({
                    method: "get",
                    url: this.getUrl('Null/'),
                    headers: {'Authorization': authToken}
                });

                return (request.then(this.handleSuccess, this.handleError));
            },


            getCampground: function(id) {

                console.log("getCampground: id=" + id);

            },

            getCampgroundsByLoc: function(long, lat, dist) {
                console.log("getCampgroundsByLoc: loca="+ long + "," + lat + " " + " dist=" + dist);


                var endpointUri = this.getUrl('find?geo=' + long + ',' + lat + '&maxDistance=' + dist);

                var request = $http({
                    method: "get",
                    url: endpointUri
                });

                return (request.then(this.handleSuccess, this.handleError));
            },

            getUrl: function (topic) {
                return 'http://mapservices.azurewebsites.net/api/' + topic;
            },

            handleSuccess: function (response) {
                return response.data;
            },

            handleError: function (response) {
                if (
                    !angular.isObject(response.data) || !response.data.message
                ) {

                    return ( $q.reject("An unknown error occurred.") );
                }

                // Otherwise, use expected error message.
                return ( $q.reject(response.data.message) );
            }
    }
}]);