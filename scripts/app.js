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
  });
