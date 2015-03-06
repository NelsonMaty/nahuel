'use strict';

/**
 * @ngdoc function
 * @name nahuel11App.controller:TitleCtrl
 * @description
 * # TitleCtrl
 * Controller of the nahuel11App
 */
angular.module('nahuel11App')
.controller('TitleCtrl', ['$scope', 'dataFactory', 'toasty', function ($scope, dataFactory, toasty) {

  angular.element(document).ready(function () {
      $(".numeric-input").keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
             // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) || 
             // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
                 // let it happen, don't do anything
                 return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
      });
    });

  $scope.resolutions = [];
  $scope.resolution = {};

  $scope.submitResolution = function(){

    $scope.resolution.resolutionTypeCode = $('#selectResolutionType option:selected').val(); //reading resolution type selected
    if(!$scope.resolution.resolutionTypeCode ){
      toasty.pop.warning({
        title: 'Dato Faltante',
        msg: 'Seleccione un tipo de resolución',
        timeout: 6000,
        showClose: true,
      });
      return;
    }

    dataFactory.getResolution($scope.resolution)
      .success(function(data){
        // Shrinking the resolution type label a bit
        data.resolution.resolutionTypeName = data.resolution.resolutionTypeName.replace('Resolución', 'Res.'); 
        $scope.resolutions.push(data.resolution); // adding resolution to array
      })
      .error(function (error){
        toasty.pop.error({
          title: 'Error',
          msg: 'No ha sido posible obtener la resolución.',
          timeout: 5000,
          showClose: true,
        });
      });
    $('#editModal').modal('show');
    $('#addResModal').modal('hide');
  };

  $scope.cancelResolution = function(){
    $('#editModal').modal('show');
    $('#addResModal').modal('hide');
  };

  $scope.openAddResolutionModal = function(){
    $scope.resolution = {};
    console.log($scope.resolution);
    $('select[name=selectResolutionType]').val(''); // selecting default option
    $('.selectpicker').selectpicker('refresh'); //refreshing (visually) the selectpickers
    $('#editModal').modal('hide');
    $('#addResModal').modal('show');
  };

  $scope.isMissingData = function(title){
    return (!title.titleMode || !title.academicUnit || !title.titleType || 
      !title.careerName  || !title.state || !title.institutionName);
  };

  $scope.getMissingDataMessage = function(title){
    var message = 
    "<div style=\"padding-top:4px;\">"+
      "Datos no definidos: "+
    "</div>"+
    "<ul style="+
      "\"list-style-type: square;"+
        "text-align: left;"+
        "padding-left:30;"+
        "padding-right:7;\";>";

    if(!title.institutionName)
      message+="<li>Institución Educativa</li>"
    if(!title.academicUnit)
      message+="<li>Unidad Académica</li>"
    if(!title.careerName)
      message+="<li>Nombre de Carrera</li>"
    if(!title.titleMode)
      message+="<li>Modalidad</li>"
    if(!title.titleType)
      message+="<li>Tipo de Título</li>"
    if(!title.state)
      message+="<li>Estado de Título</li>"

    message+="</ul>";
    return message;
  }
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
  $scope.titleStateSearch = {1:false,2:false,3:true,4:false,5:false,};
  $scope.titleSelected = {};
  $scope.titleClicked = {};

  $scope.openEditModal =function(title){
    $scope.titleClicked = title;
    $.extend(true, $scope.titleSelected, title); // creating a 'working copy'
    $('select[name=selectTitleState]').val(title.state);    // selecting title state
    $('select[name=selectTitleMode]').val(title.titleModeCode); // selecting title mode
    $('select[name=selectTitleType]').val(title.titleTypeCode); // selecting title type
    $('.selectpicker').selectpicker('refresh'); //refreshing (visually) the selectpickers
    dataFactory.getResolutions(title)
      .success(function(data) {
        $scope.resolutions = data;
        $scope.resolutions.forEach(function(res){
          // Shrinking the resolution type label a bit
          res.resolutionTypeName = res.resolutionTypeName.replace('Resolución', 'Res.'); 
        });
      })
      .error(function(error) {
      console.log("Unable to load titles data." + error.message);
    });
    $('#editModal').modal('show');
  };

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
    $('#mainSplitter').jqxSplitter({ width: "100%", height: "87.5%", 
        panels: [{ size: 310}]});
  };

  $scope.countState = function(stateValue) {
    var count = 0;
    for (var i = 0; i < $scope.titleTable.length; i++) { 
      if($scope.titleTable[i].state == stateValue){
        count = count + 1;
      }
    }
    return count;
  };

  $scope.countCareers = function() {
    return $scope.titleTable.length;
  }

  $scope.initSearchPanel = function() {
    $("#flip").click(function(){
      $("#panel").slideToggle(300);
      event.stopPropagation();
    });
    $('html').click(function() {
      $("#panel").slideUp(300);
    });
    $('#panel').click(function(event){
      event.stopPropagation();
    });
  };
  
  $scope.initClosePanelButton = function() {
    $(".search-widget .close").click(function(){
      $("#panel").slideToggle(300);
    });
  };

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
  };

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

  $scope.tmodes = [];
  getTitleModes();
  function getTitleModes() {
    dataFactory.getTitleModes()
      .success(function(data) {
        $scope.tmodes = data;
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
  };

  $scope.cleanSearchFields = function () {
    $scope.query = ""; 
    $scope.institution = "";
    $scope.au = "";
    $scope.ct = "";
    $scope.career = "";
    $scope.titleType = "";
    $scope.title = "";
    $scope.resType= {};
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
  };

  $scope.searchTitles = function () {
    $("#panel").slideToggle(300); // Hide the search panel
    //$('#jstree_demo_div').jstree('select_node', 'j1_1') // Select root node on the tree
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
      searchFilters.resolutionType = $scope.resType.resolutionTypeName;
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
  };

  $scope.saveTitleChanges = function(){
    $scope.titleSelected.state = $('#selectTitleState option:selected').val();     //reading state value
    $scope.titleSelected.titleType = $('#selectTitleType option:selected').val();  //reading type value
    $scope.titleSelected.titleMode = $('#selectTitleMode option:selected').val();  //reading mode value

    if(!$scope.titleSelected.state ){
      toasty.pop.warning({
        title: 'Dato Faltante',
        msg: 'Debe seleccionar un estado actual para el título',
        timeout: 5000,
        showClose: true,
      });
      return;
    }

    if(!$scope.titleSelected.titleType ){
      toasty.pop.warning({
        title: 'Dato Faltante',
        msg: 'Debe seleccionar un tipo para el título',
        timeout: 5000,
        showClose: true,
      });
      return;
    }

    if(!$scope.titleSelected.titleMode ){
      toasty.pop.warning({
        title: 'Dato Faltante',
        msg: 'Debe seleccionar una modalidad para el título',
        timeout: 5000,
        showClose: true,
      });
      return;
    }

    $scope.titleSelected.resolutions = [];
    $scope.resolutions.forEach(
      function(res){
        $scope.titleSelected.resolutions.push(res.resolutionId);
      });

    dataFactory.updateTitle($scope.titleSelected)
      .success(function(data, status){
        toasty.clear();
        $.extend(true, $scope.titleClicked, data.updatedTitle); // reflecting changes on the title table
        toasty.pop.success({
          title: "Cambios guardados",
          timeout: 3500,
          showClose: true,
          onClick: function(toasty) {
            toasty.msg = 'El título "' + $scope.titleSelected.titleName+ '" ha sido actualizado exitosamente.' ;
            toasty.timeout = 5000;
          }
        });
      })
      .error(function(){
        toasty.pop.error({
          title: 'Error',
          msg: 'No ha sido posible registrar los cambios.',
          timeout: 10000,
          showClose: true,
        });
      });
    $('#editModal').modal('hide');
  };

}]);
