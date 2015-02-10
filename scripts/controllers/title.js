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

  $scope.auSelectedSubtree = [];

  $scope.initSplitter = function(){
    $('#mainSplitter').jqxSplitter({ width: "100%", height: "87.5%", panels: [{ size: 310 }]});
  }

  $scope.traverseNode = function(node){
    //renaming the "name" key
    node["text"] = node.name;
    delete node.name;

    //adding icon to the node
    node["icon"] = "fa fa-university";

    //1st base case, node with no children attr
    if (!!!node.children){
      //setting the career icon
      node["icon"] = "fa fa-graduation-cap";
      return;
    }

    //2nd base case, academic unit with no children
    if (node.children.length == 0)
      return;

    node.children.forEach(
      function(child){
        $scope.traverseNode(child);
      });
  }

  $scope.jsTreeFormatter = function(tree){
    tree.forEach(
      function(node){
        $scope.traverseNode(node);
      });
    return;
  }

  $scope.query = ""; //string used for filtering purposes
  $scope.auSelected = "";
  $scope.hierarchy= [];
  getAcademicUnitsHierarchy();
  function getAcademicUnitsHierarchy() {
    dataFactory.getAcademicUnitsHierarchy()
      .success(function(data) {
        $scope.hierarchy = data;
        $scope.jsTreeFormatter($scope.hierarchy);
        $scope.initTree();
      })
      .error(function (error){
        console.log("Unable to load titles data." + error.message);
      });
  }

  $scope.buildSubtreeArray = function (node){
    console.log(node.children.length);
    node.children.forEach(function(entry){
      console.log($('#jstree_demo_div').jstree(true).get_node('#'+entry+'').text);
      //$('#jstree_demo_div').jstree(true).get_node('#'+entry+'').text
    });
    /*node.children.forEach(
      function(child_id) {
        console.log($('#' + child_id ));
      }
    );*/
  };

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
            text : "Todas las carreras",
            state : {opened : true},
            icon : "fa fa-th-list",
            children:$scope.hierarchy
          }
        ]
      }
    });

   // Click listener
    $('#jstree_demo_div').on("changed.jstree", function (e, data) {
      $scope.$apply(function(){
        if (data.node.parent != "#"){
          $scope.auSelected = data.node.text;
          $scope.buildSubtreeArray(data.node);
        }
        else{
          $scope.auSelectedSubtree = [];
          $scope.auSelected = "";
        }
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

  $scope.criteriaMatch = function() {
    return function(item) {
      if ($scope.auSelected == "")
        return true; // No academic unit selected
      return false;
    }
  };

}]);
