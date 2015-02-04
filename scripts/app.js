'use strict';

var nahuel11App = 
angular
  .module('nahuel11App', [
    'ngRoute',
    'ui.bootstrap',
    'ng-context-menu',
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/titles.html',
        controller: 'TitleCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .factory('dataFactory', ['$http', function($http){
    
    var urlBase = 'http://localhost:8080/api/';
    var dataFactory = {};

    //get all titles
    dataFactory.getTitles = function (searchFilters){
      searchFilters = searchFilters || {}; // Null parameter case
      return $http.get(urlBase + 'titles', {params:searchFilters});
    };

    //get institutions
    dataFactory.getInstitutions = function (){
      return $http.get(urlBase + 'institutions');
    };

    //get all academic units
    dataFactory.getAcademicUnits = function (){
      return $http.get(urlBase + 'academicUnits');
    };

    //get all career types
    dataFactory.getCareerTypes = function (){
      return $http.get(urlBase + 'careerTypes');
    };// array of filters filled by the user (it could potentially be empty

    //get all title types
    dataFactory.getTitleTypes = function (){
      return $http.get(urlBase + 'titleTypes');
    };

    //get all careers
    dataFactory.getCareers = function (){
      return $http.get(urlBase + 'careers');
    };

    //get all resolution types
    dataFactory.getResolutionTypes = function (){
      return $http.get(urlBase + 'resolutionTypes');
    };

    return dataFactory;
  }]
  );
