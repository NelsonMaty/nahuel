'use strict';

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
    dataFactory.getTitles = function (){
      return $http.get(urlBase + 'titles');
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
    };

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

/*
    //get a single title
    dataFactory.getTitle = function (id){
      return $http.get(urlBase + '/' + id);
    };

    //insert a new title
    dataFactory.insertTitles = function (title){
      return $http.post(urlBase, title);
    };

    //update an existent title
    dataFactory.updateTitle = function (title){
      return $http.put(urlBase + '/' + title.id, title);
    };

    //delete a given title
    dataFactory.deleteTitle = function (id){
      return $http.delete(urlBase + '/' + id);
    };
*/

    return dataFactory;
  }]
  );
