'use strict';

/**
 * @ngdoc function
 * @name nahuel11App.controller:TitleCtrl
 * @description
 * # TitleCtrl
 * Controller of the nahuel11App
 */
angular.module('nahuel11App')
.controller('TitleCtrl', ['$scope', 'dataFactory', function ($scope, dataFactory) {

  $scope.query = ""; //string used for filtering purposes

  $scope.initTree = function(){
    $('#jstree_demo_div').jstree({
      "plugins" : ["contextmenu"],
      "contextmenu": {
        "items": function ($node) {
            return {
                "Create": {
                    "label": "Crear",
                    "action": function (obj) {
                        this.create(obj);
                    }
                },
                "Rename": {
                    "label": "Renombrar",
                    "action": function (obj) {
                        this.rename(obj);
                    }
                },
                "Delete": {
                    "label": "Eliminar",
                    "action": function (obj) {
                        this.remove(obj);
                    }
                }
            };
        }
      },
      "core" : {
        "multiple" : false, // multiple nodes selection not allowed.
        "check_callback": true,
        "data" : [
            {
                id:"ajson0", parent : "#",
                text : "Todas las carreras",
                state : {opened : true},
                icon : "fa fa-th-list"
            },
            { 
              id : "ajson1", parent : "ajson0",
              text : "Facultad de Ciencias Médicas",
              state : {opened : false},
              icon : "fa fa-university"
            },

            { 
              id : "ajson2", parent : "ajson1",
              text : "Escuela de Enfermería",
              state : {opened : false},
              icon : "fa fa-university"
            },

            { 
              id : "ajson3", parent : "ajson2",
              text : "Enfermería",
              state : {opened : false},
              icon : "fa fa-graduation-cap"
            },

            { 
              id : "ajson8", parent : "ajson1",
              text : "Medicina",
              state : {opened : false},
              icon : "fa fa-graduation-cap"
            },

            { 
              id : "ajson9", parent : "ajson1",
              text : "Licenciatura en Fonoaudiología",
              state : {opened : false},
              icon : "fa fa-graduation-cap"
            },

            { 
              id : "ajson6", parent : "ajson0",
              text : "Facultad de Artes",
              state : {opened : false},
              icon : "fa fa-university"
            },

            { 
              id : "ajson10", parent : "ajson6",
              text : "Tecnicatura en Luthería",
              state : {opened : false},
              icon : "fa fa-graduation-cap"
            },
         ]
      }
    });

   // Click listener
    $('#jstree_demo_div').on("changed.jstree", function (e, data) {
      $scope.$apply(function(){
        if (data.node.parent != "#")
          $scope.query = data.node.text;
        else
          $scope.query = "";
      });
    });
  }

  $scope.titleTable = [];
  getTitles();
  function getTitles() {
    dataFactory.getTitles()
      .success(function(data) {
        $scope.titleTable = data;
      })
      .error(function (error){
        console.log("Unable to load titles data." + error.message);
      });
  }

  $scope.countStates = function(stateValue) {
    var count = 0;
    for (var i = 0; i < $scope.titleTable.length; i++) { 
      if($scope.titleTable[i].state == stateValue){
        count = count + 1;
      }
    }
    return count;
  }

  $scope.countCareers = function() {
    return $scope.titleTable.length;
  }

  $scope.initSearchPanel = function() {
    $("#flip").click(function(){
      $("#panel").slideToggle();
    });
  }
  
  $scope.initClosePanelButton = function() {
    $(".search-widget .close").click(function(){
      $("#panel").slideToggle();
    });
  }

  $scope.institution = "";
  $scope.institutions = [];
  getInstitutions();
  function getInstitutions() {
    dataFactory.getInstitutions()
      .success(function(data) {
        $scope.institutions = data;
      })
      .error(function (error){
        console.log("Unable to load titles data." + error.message);
      });
  }

  $scope.au = "";
  $scope.aus = [];
  getAcademicUnits();
  function getAcademicUnits() {
    dataFactory.getAcademicUnits()
      .success(function(data) {
        $scope.aus = data;
      })
      .error(function (error){
        console.log("Unable to load titles data." + error.message);
      });
  }

  $scope.ct = "";
  $scope.cts = [];
  getCareerTypes();
  function getCareerTypes() {
    dataFactory.getCareerTypes()
      .success(function(data) {
        $scope.cts = data;
      })
      .error(function (error){
        console.log("Unable to load titles data." + error.message);
      });
  }

  $scope.career = "";
  $scope.careers = [];
  getCareers();
  function getCareers() {
    dataFactory.getCareers()
      .success(function(data) {
        $scope.careers = data;
      })
      .error(function (error){
        console.log("Unable to load titles data." + error.message);
      });
  }

  $scope.titleType = "";
  $scope.ttypes = [];
  getTitleTypes();
  function getTitleTypes() {
    dataFactory.getTitleTypes()
      .success(function(data) {
        $scope.ttypes = data;
      })
      .error(function (error){
        console.log("Unable to load titles data." + error.message);
      });
  }

  $scope.resType= "";
  $scope.resTypes = [];
  getResolutionTypes();
  function getResolutionTypes() {
    dataFactory.getResolutionTypes()
      .success(function(data) {
        $scope.resTypes = data;
      })
      .error(function (error){
        console.log("Unable to load titles data." + error.message);
      });
  }

}]);