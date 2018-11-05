var weatherApp = angular.module('weatherApp', ['ngRoute','ngResource']);

weatherApp.config(function ($routeProvider){
    $routeProvider
    .when('/', {
        templateUrl: 'pages/home.htm',
        controller: 'homeController'
    })
    .when('/forecast', {
        templateUrl: 'pages/forecast.htm',
        controller: 'forecastController'
    })
    .when('/forecast/:days', {
        templateUrl: 'pages/forecast.htm',
        controller: 'forecastController'
    })
});

weatherApp.controller('homeController',['$scope', 'weatherService', function($scope, weatherService){
    $scope.city = weatherService.city;
    
    $scope.$watch('city', function(){
        weatherService.city = $scope.city;
    });
}]);

weatherApp.controller('forecastController',['$scope', '$resource', '$routeParams', '$log', 'weatherService', function($scope, $resource, $routeParams, $log, weatherService){
    $scope.city = weatherService.city;
    $scope.weatherAPI = $resource('https://api.openweathermap.org/data/2.5/forecast?&appid=45612469786aba39c7564f03d04d0d84', 
                                  { callback: "JSON_CALLBACK"}, 
                                  { get: { method: "JSONP"}});
    
    $scope.days = $routeParams.days || 4; // default to 5 days.
    
    $scope.weatherResult = $scope.weatherAPI.get({ "q": $scope.city, "cnt": $scope.days});
    
    $log.info($scope.weatherResult);
    
    $scope.convertToCelcius = function(degK) {
        
        return Math.round(degK - 273.15);
    }
    
    $scope.convertToDate = function(dt) {
        
        return new Date(dt * 1000);
    }
    
    
}]);

weatherApp.service('weatherService', function(){
    self.city = '';
});

// sample service call
// http://api.openweathermap.org/data/2.5/weather?q=Brampton,uk&appid=45612469786aba39c7564f03d04d0d84