'use strict';

/**
 * @ngdoc function
 * @name nahuel11App.controller:TitleCtrl
 * @description
 * # TitleCtrl
 * Controller of the nahuel11App
 */
angular.module('nahuel11App')
.controller('TitleCtrl', ['$scope', 'dataFactory', 'toasty', '$routeParams', function ($scope, dataFactory, toasty, $routeParams) {

  /*-----------------------------------------
  -             Copy Title URL              -
  -----------------------------------------*/
  var baseURL = "http://172.16.248.229:9000/#/titles/";

  $scope.getTitleURL = function (){
    return baseURL + $scope.titleSelected.titleCode;
  };

  $('.copy-btn').tooltip({delay: { "hide": 200}});

  $scope.isFlashAvailable = function (){
    return ((typeof navigator.plugins != "undefined" && typeof navigator.plugins["Shockwave Flash"] == "object") 
      || (window.ActiveXObject && (new ActiveXObject("ShockwaveFlash.ShockwaveFlash")) != false));
  }

  var client = new ZeroClipboard($(".copy-btn"));
  client.on( "copy", function (event) {
    var clipboard = event.clipboardData;
    clipboard.setData( "text/plain", $scope.getTitleURL() );
  });
  client.on('aftercopy', function(event) {
    $('.tooltip .tooltip-inner').text('Copiado');
  });

  /*-----------------------------------------
  -             Route Title URL              -
  -----------------------------------------*/
  if (!!$routeParams.titleCode){ // title code provided by url (optional)
    var titleFilter = {};
    titleFilter.titleCode = $routeParams.titleCode;
    dataFactory.getTitles(titleFilter)
      .success(function(data) {
        if(data.length == 0)
          alert("No ha sido posible encontrar el título solicitado.");
        else{
          dataFactory.getResolutions(data[0])
            .success(function(resolutions){
              for (var i = 0; i < resolutions.length; i++) {
                resolutions[i].resolutionTypeName = resolutions[i].resolutionTypeName.replace(/resolución/ig, '');
              };
              $scope.resolutions = resolutions;
              $scope.titleSelected = data[0];
              $('#viewTitleModal').modal('show');
            })
            .error(function (error){
              console.log("Unable to load title data." + error.message);
            });
        }
      })
      .error(function (error){
        console.log("Unable to load title data." + error.message);
    });
  }

  /*-----------------------------------------
  -          Key events handling            -
  -----------------------------------------*/
  $(document).ready(function () {
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

  $scope.searchOnEnter = function(keyEvent){
    if (keyEvent.which === 13){
      $scope.searchTitles();
    }
  };



  // Filtering variables
  $scope.query = ""; 
  $scope.auSelectedSubtree = [];
  $scope.careerType = "";
  $scope.career = "";
  $scope.titleType = "";
  $scope.resolutionType = "";
  $scope.titleStates = [];
  $scope.titleSelected = {};
  $scope.titleClicked = {};

  $scope.showResultText = false;


  $scope.buildStringQuery = function(){
    $scope.query="";
    $scope.resolutionType = $('#searchResolutionType option:selected').val();
    $scope.careerType     = $('#searchCareerType option:selected').val();
    $scope.titleType      = $('#searchTitleType option:selected').val();

    $scope.titleStates = $('#searchTitleState').val();

    if(!!$scope.academicUnitCode){
      $scope.query += "unidad académica: ";
      $scope.query += $scope.academicUnit +"; ";
    }

    if(!!$scope.careerType){
      $scope.query += "tipo de carrera: ";
      $scope.query += $scope.careerType +"; ";
    }
    if(!!$scope.career){
      $scope.query += "carrera: ";
      $scope.query += $scope.career +"; ";
    }
    if(!!$scope.titleType){
      $scope.query += "tipo de título: ";
      $scope.query += $scope.titleType +"; ";
    }
    if(!!$scope.title){
      $scope.query += "título: ";
      $scope.query += $scope.title +"; ";
    }
    if(!!$scope.resolutionType){
      $scope.query += "tipo de resolución: ";
      $scope.query += $scope.resolutionType +"; ";
    }
    if(!!$scope.resolutionNumber){
      $scope.query += "número de resolución: ";
      $scope.query += $scope.resolutionNumber +"; ";
    }
    if(!!$scope.resolutionYear){
      $scope.query += "año de resolución: ";
      $scope.query += $scope.resolutionYear +"; ";
    }
    if(!!$scope.titleStates){
      $scope.query += "estados:";
      $scope.titleStates.forEach(
        function(stateCode){
          $scope.query += " " + stateCode;
        }
      );
      $scope.query += "; ";
    }

    $scope.searchTitles();
  };

  $scope.clearSearch = function(){
    $scope.query = ""; //clear the text
    $scope.showResultText = false;
    $scope.academicUnitCode = "";
    $scope.searchTitles(); //get all titles
    document.getElementById("inputSearchText").focus();// make the input ready for typing
  };

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

  $scope.showEditModal = function(){
    $('#editModal').modal('show');
  };

  $scope.openAddResolutionModal = function(){
    $scope.resolution = {};
    $('select[name=selectResolutionType]').val(''); // selecting default option
    $('.selectpicker').selectpicker('refresh'); //refreshing (visually) the selectpickers
    $('#editModal').modal('hide');
    $('#addResModal').modal('show');
  };

  $scope.openShareLinkModal = function(){
    $('#editModal').modal('hide');
    $('#shareLinkModal').modal('show');
  };

  //select the link text after the modal has been shown
  $('#shareLinkModal').on('shown.bs.modal', function(){
    $('#inputTitleURL').select();
    $('#inputTitleURL').focus();
  });

  $scope.selectLink = function(){
    $('#inputTitleURL').select();
  };

  $scope.isMissingData = function(title){
    return (!title.titleMode || !title.academicUnit || !title.titleType || 
      !title.careerName  || !title.state || !title.institutionName);
  };

  $scope.getMissingDataMessage = function(title){
    var message = 
    "<div style=\"padding-top:4px;\">"+
      "Información faltante: "+ 
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

  $scope.openEditModal =function(title){

    //if the advanced search panel is shown, do not open the modal.
    if (window.getComputedStyle($('#panel')[0]).getPropertyValue('display') != "none"){
      return;
    }

    $scope.titleClicked = title;
    $.extend(true, $scope.titleSelected, title);                // creating a 'working copy'
    $('select[name=selectTitleState]').val(title.state);        // selecting title state
    $('select[name=selectTitleMode]').val(title.titleModeCode); // selecting title mode
    $('select[name=selectTitleType]').val(title.titleTypeCode); // selecting title type

    //refreshing (visually) the selectpickers
    $('#selectTitleState').selectpicker('refresh');
    $('#selectTitleMode').selectpicker('refresh');
    $('#selectTitleType').selectpicker('refresh');

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

  //splitter initializer
  $scope.initSplitter = function(){
    $('#mainSplitter').jqxSplitter({ width: "100%", height: "auto", 
        panels: [{ size:  "20%"}]});
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
    //open the search panel when the arrow is clicked
    $("#flip").click(function(event){
      $("#panel").slideToggle(300);

      $('select[name=searchResolutionType]').val($scope.resolutionType);
      $('#searchResolutionType').selectpicker('refresh');

      $('select[name=searchTitleType]').val($scope.titleType);
      $('#searchTitleType').selectpicker('refresh');

      $('select[name=searchCareerType]').val($scope.careerType);
      $('#searchCareerType').selectpicker('refresh');
      
      $('select[name=searchTitleState]').val($scope.titleStates);
      $('#searchTitleState').selectpicker('refresh');
    });

    //close the search panel if clicked outside of it
    $(document).on('click', function(event) {
      // if (!$(event.target).closest('.dropdown-menu').length)
      //   return;

      if (!$(event.target).closest('#panel').length) { 
        if (!$(event.target).closest('#flip').length ){
          if (!$(event.target).closest('li').length){
            $("#panel").slideUp(300);
          }
        }
      }

    });
  };
  
  // initialize jQuery widgets when the content is loaded
  $scope.$watch('$viewContentLoaded', function(){
    $scope.initSearchPanel();
    $scope.initSplitter();

  });

  /*-----------------------------------------
    - ACADEMCIT UNIT TREE RELATED FUNCTIONS -
    -----------------------------------------*/

  //function used to explore a node (and all its children recursively)
  $scope.formatNode = function(node){

    node["text"] = node.name;     //renaming the "name" key
    delete node.name;

    var data = {"name": node.text, "code": node.code };
    if(!!!node.children){
      data.isCareer = true;
    }
    else{
      data.isCareer = false;
    }

    node["data"] = data;
    delete node.code;

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
        $scope.formatNode(child);
      });
  }

  // It will reformat the au tree sent by the webservice, 
  // so that the jsTree component can comprehend it.
  $scope.jsTreeFormatter = function(tree){
    tree.forEach(
      function(node){
        $scope.formatNode(node);
      });
    return;
  };

  //a safe wrapper for angular's apply function.
  $scope.safeApply = function(fn) {
    var phase = this.$root.$$phase;
    if(phase == '$apply' || phase == '$digest') {
      if(fn && (typeof(fn) === 'function')) {
        fn();
      }
    } else {
      this.$apply(fn);
    }
  };

  // tree component initializer
  $scope.initTree = function(){
  $('#jstree_demo_div').jstree({
    "plugins" : [ "wholerow" ],
    "core" : {
      "multiple" : false, // multiple nodes selection not allowed.
      "check_callback": true,
      "data" : [
        {
          text : "Universidad Nacional de Córdoba",
          state : {opened : true, selected:true},
          icon : "fa fa-th-list",
          children:$scope.hierarchy
        }
      ] //root node
    }
  });
   // tree click listener
    $('#jstree_demo_div').on("select_node.jstree", function (e, data) {

      //using angular's apply, since jstree is not an angular component.
      $scope.safeApply(function(){ 

        $scope.query = "";

        if (data.node.parent == "#"){ //if clicked on root node, clear filters.
          $scope.clearSearch();
          return;
        }

        var searchRequest = {};

        // if clicked on an academic unit
        if(!data.node.data.isCareer){ 
          $scope.academicUnit = data.node.text;
          //checking if not already filtered by academic unit
          var auStringPosition = $scope.query.indexOf("unidad académica:");
          if(auStringPosition<0) 
            $scope.query = "unidad académica: " + $scope.academicUnit +";";
          else{
            $scope.query = 
              $scope.query.slice(0, $scope.query.indexOf(":", auStringPosition)+1) 
              + " " + $scope.academicUnit +
              $scope.query.slice($scope.query.indexOf(";", auStringPosition), $scope.query.length) ;
          }
          $scope.academicUnitCode = data.node.data.code;
          $scope.career = "";
          searchRequest.academicUnitCode = data.node.data.code;
        }

        // if clicked on a career
        else{
          var careerStringPosition = $scope.query.indexOf("carrera:");
          if(careerStringPosition<0) // if not already filtered by career
            $scope.query = "carrera: " + data.node.text +";";
          else{
            $scope.query = 
              $scope.query.slice(0, $scope.query.indexOf(":", careerStringPosition)+1) 
              + " " + data.node.text +
              $scope.query.slice($scope.query.indexOf(";", careerStringPosition), $scope.query.length) ;
          }
          $scope.academicUnitCode = "";
          $scope.career = data.node.text;
          searchRequest.careerCode = data.node.data.code;
        }

        $scope.careerType = "";
        $scope.titleType = "";
        $scope.title = "";
        $scope.resolutionYear = "";
        $scope.resolutionNumber = "";
        $scope.resolutionType = "";
        $scope.titleStates = "";

        //requesting titles
        dataFactory.getTitles(searchRequest)
            .success(function(data) {
              $scope.titleTable = data;
              $scope.showResultText = true;
            })
            .error(function (error){
              console.log("Unable to load titles data." + error.message);
            });
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
    $scope.careerType = "";
    $scope.career = "";
    $scope.titleType = "";
    $scope.title = "";
    $scope.resolutionNumber = "";
    $scope.resolutionYear = "";
    $scope.resolutionType = "";
    
    $('select[name=searchResolutionType]').val("");
    $('#searchResolutionType').selectpicker('refresh');

    $('select[name=searchTitleType]').val("");
    $('#searchTitleType').selectpicker('refresh');

    $('select[name=searchCareerType]').val("");
    $('#searchCareerType').selectpicker('refresh');
    
    $('select[name=searchTitleState]').val("");
    $('#searchTitleState').selectpicker('refresh');

    $scope.titleStates = [];

  };

  $scope.searchTitles = function () {

    var paramsMapping = {
      'institución':'institution',
      'tipo de carrera':'careerType',
      'carrera':'career',
      'tipo de título':'titleType',
      'título':'title',
      'tipo de resolución':'resolutionType',
      'año de resolución':'resolutionYear',
      'número de resolución':'resolutionNumber',
      'estados':'titleStates'
    };

   //clear advanced search fields
    $scope.careerType = "";
    $scope.career = "";
    $scope.titleType = "";
    $scope.title = "";
    $scope.resolutionYear = "";
    $scope.resolutionNumber = "";
    $scope.resolutionType = "";
    $scope.titleStates = "";

    var searchFilters = {};
    var searchParams = $scope.query.split(';');

    // array cleaning, get rid off empty strings
    for (var i = searchParams.length - 1; i >= 0; i--) {
      searchParams[i] = searchParams[i].trim();
      if(!!!searchParams[i]){
        searchParams.splice(i, 1); //remove the element
      }
    };

    //if not an advanced search
    if (searchParams.length == 1 && (searchParams[0].split(':').length != 2)){
      searchFilters.contains = searchParams[0];
    }
    
    // else, build the json request
    else{
      searchParams.forEach(function(param){
        // split key and value
        var key_val = param.split(':');
        if(key_val.length == 2){
          var key = paramsMapping[key_val[0].trim()];
          var val = key_val[1].trim();
          //if is a valid key, add it to the req
          if(!!key){
            searchFilters[key] = val;
            $scope[key] = val; //updating advanced search field
          }
        }
      });

      // if no academicUnit is present then reset the tree selection
      if(!!!$scope.academicUnitCode){
        if($("#jstree_demo_div").jstree("get_selected")[0] != 'j1_1'){
          $("#jstree_demo_div").jstree("deselect_node", $("#jstree_demo_div").jstree("get_selected")[0]); // deselect current node
          $("#jstree_demo_div").jstree("select_node", 'j1_1');
          $("#jstree_demo_div").jstree("close_all");
          $("#jstree_demo_div").jstree("open_node", 'j1_1', false, false); //no animation
        }
      }
      else{ //there is an academic unit selected. search it by code
        searchFilters.academicUnitCode = $scope.academicUnitCode;
      }
    }

    //special case, title states selector
    $scope.titleStates = $scope.titleStates.trim();
    if(!!$scope.titleStates)
      $scope.titleStates = $scope.titleStates.split(/\s+/);
    if(!!$scope.titleStates.length){
      $('select[name=searchTitleState]').val($scope.titleStates);
    }

    $('select[name=searchResolutionType]').val($scope.resolutionType);
    $('select[name=searchTitleType]').val($scope.titleType);
    $('select[name=searchCareerType]').val($scope.careerType);
    dataFactory.getTitles(searchFilters)
    .success(function(data) {
      $scope.titleTable = data;
      $("#panel").slideUp(0); // Hide the search panel
      if($scope.query.trim() != "")
        $scope.showResultText = true;
      else
        $scope.showResultText = false;
    })
    .error(function (error){
      console.log("Unable to load titles data." + error.message);
      $("#panel").slideUp(0); // Hide the search panel

    });
  };

  $scope.saveTitleChanges = function(){
    $scope.titleSelected.state = $('#selectTitleState option:selected').val();     //reading state value
    $scope.titleSelected.titleType = $('#selectTitleType option:selected').val();  //reading type value
    $scope.titleSelected.titleMode = $('#selectTitleMode option:selected').val();  //reading mode value

    if(!$scope.titleSelected.state){
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
