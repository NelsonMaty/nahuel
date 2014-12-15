'use strict';

/**
 * @ngdoc overview
 * @name nahuel11App
 * @description
 * # nahuel11App
 *
 * Main module of the application.
 */
angular
  .module('nahuel11App', [
    'ngAnimate',
    'ngResource',
    'ngRoute',
    'ui.bootstrap',
    'ng-context-menu',
    'ui.tree'
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
