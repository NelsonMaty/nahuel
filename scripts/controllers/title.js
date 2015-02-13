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

  // Filtering variables
  $scope.query = ""; 
  $scope.auSelected = "";
  $scope.auSelectedSubtree = [];
  $scope.institution = "";
  $scope.au = "";
  $scope.ct = "";
  $scope.career = "";
  $scope.titleType = "";
  $scope.resType= "";
  $scope.titleStateSearch = {1:false,3:true,4:false,5:false,6:false,};

  // Table filter by node selection
  $scope.criteriaMatch = function() {
    return function(item) {
      if ($scope.auSelected == "")
        return true; // No academic unit selected
      var index = $scope.auSelectedSubtree.indexOf(item.careerName);
      if (index == -1){
        return false;
      }
      return true;
    }
  };

  //splitter initializer
  $scope.initSplitter = function(){
    $('#mainSplitter').jqxSplitter({ width: "100%", height: "87.5%", panels: [{ size: 310 }]});
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

  /*-----------------------------------------
    - ACADEMCIT UNIT TREE RELATED FUNCTIONS -
    -----------------------------------------*/

  //function used to explore a node (and all its children recursively)
  $scope.traverseNode = function(node){

    node["text"] = node.name;     //renaming the "name" key
    delete node.name;

    node["icon"] = "fa fa-university"; //adding icon to the node

    //1st base case, node with no children attr
    if (!!!node.children){
      node["icon"] = "fa fa-graduation-cap"; //setting the career icon
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

  // It will reformat the au tree, 
  // so that the jsTree component can comprehend it.
  $scope.jsTreeFormatter = function(tree){
    tree.forEach(
      function(node){
        $scope.traverseNode(node);
      });
    return;
  }

  // builds an array of titles (leaves)
  $scope.buildSubtreeArray = function (node){
    //base case: leaf node
    if (node.children.length == 0){ 
      $scope.auSelectedSubtree.push(node.text); 
      return;
    }
    node.children.forEach(function(entry){
      $scope.buildSubtreeArray(
        $('#jstree_demo_div').jstree(true).get_node('#'+entry+''));
    });
  };

  // tree component initializer
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
          $scope.auSelectedSubtree = [];
          $scope.buildSubtreeArray(data.node);
        }
        else{
          $scope.auSelectedSubtree = [];
          $scope.auSelected = "";
        }
      });
    });
  }

  /*-----------------------------------------
    -      BACKEND RELATED FUNCTIONS        -
    -----------------------------------------*/

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

  $scope.cleanSearchFields = function () {
    $scope.query = ""; 
    $scope.institution = "";
    $scope.au = "";
    $scope.ct = "";
    $scope.career = "";
    $scope.titleType = "";
    $scope.title = "";
    $scope.resType= "";
    $scope.resNro = "";
    $scope.resYear = "";
    $scope.titleStateSearch = {1:false,3:true,4:false,5:false,6:false,};
    dataFactory.getTitles()
    .success(function(data) {
      $scope.titleTable = data;
    })
    .error(function (error){
      console.log("Unable to load titles data." + error.message);
    });
  }

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
