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

  $scope.countState = function(stateValue) {
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
      $("#panel").slideToggle(300);
    });
  }
  
  $scope.initClosePanelButton = function() {
    $(".search-widget .close").click(function(){
      $("#panel").slideToggle(300);
    });
  }

/**********************************
 *     Web services functions     *
 **********************************/
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

  $scope.titleStateSearch = {1:false,3:true,4:false,5:false,6:false,};

  $scope.searchTitles = function () {
    $("#panel").slideToggle(300); // Hide the search panel

    var searchFilters = {};
    if(!!$scope.institution)
      searchFilters.institution = $scope.institution;
    if(!!$scope.au)
      searchFilters.academicUnit = $scope.au;
    if(!!$scope.ct)
      searchFilters.careerType = $scope.ct;
    if(!!$scope.career)
      searchFilters.career = $scope.career;
    if(!!$scope.titleType)
      searchFilters.titleType = $scope.titleType;
    if(!!$scope.title)
      searchFilters.title = $scope.title;
    if(!!$scope.resType)
      searchFilters.resolutionType = $scope.resType;
    if(!!$scope.resNro)
      searchFilters.resolutionNumber = $scope.resNro;
    if(!!$scope.resYear)
      searchFilters.resolutionYear = $scope.resYear;
    searchFilters.titleStates = $scope.titleStateSearch;

    dataFactory.getTitles(searchFilters)
    .success(function(data) {
      $scope.titleTable = data;
    })
      .error(function (error){
        console.log("Unable to load titles data." + error.message);
      });
  }

}]);