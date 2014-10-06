'use strict';

/**
 * @ngdoc function
 * @name nahuel11App.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the nahuel11App
 */
angular.module('nahuel11App')
  .controller('MainCtrl', function ($scope) {

  	//hardcoded study centers, replace with a REST call
    $scope.studyCenters = [
      {'id' : '1',
       'type':'Pública',
       'level':'Universidad',
  	   'acronym':'UNC',
  	   'name':'Universidad Nacional de Córdoba',
  	   'country':'Argentina'
  	  },
  	  {'id' : '2',
  	   'type':'Privada',
       'level':'Universidad',
  	   'acronym':'IUA',
  	   'name':'Instituto Universitario Aeronáutico',
  	   'country':'Argentina'
  	  },
  	  {'id' : '3',
  	   'type':'Pública',
       'level':'Colegio',
  	   'acronym':'CNM',
  	   'name':'Colegio Nacional de Monserrat',
  	   'country':'Argentina'
  	  },
  	  {'id' : '4',
  	   'type':'Privada',
       'level':'Universidad',
  	   'acronym':'INSA',
  	   'name':'Institut National des Sciences Apliquées',
  	   'country':'Francia'
  	  },
  	  {'id' : '5',
  	   'type':'Privada',
       'level':'Universidad',
  	   'acronym':'UCC',
  	   'name':'Universidad Católica de Córdoba',
  	   'country':'Argentina'
  	  },
  	  {'id' : '6',
  	   'type':'Privada',
       'level':'Universidad',
  	   'acronym':'UP',
  	   'name':'Universidad de Palermo',
  	   'country':'Argentina'
  	  },
  	  {'id' : '7',
  	   'type':'Pública',
       'level':'Universidad',
  	   'acronym':'UBA',
  	   'name':'Universidad de Buenos Aires',
  	   'country':'Argentina'
  	  },
  	  {'id' : '8',
  	   'type':'Pública',
       'level':'Universidad',
  	   'acronym':'UNIFESP',
  	   'name':'Universidad Federal de San Pablo',
  	   'country':'Brasil'
  	  }
    ];

	//clear search criteria
  	$scope.clearFilter = function () {
  		$scope.searched = null;
  		$scope.isCollapsed = true;
  		
  	};

  	//study center selected from table
  	$scope.selectedCenterId = null;
  	$scope.setSelected = function (idSelected) {
  		$scope.selectedCenterId = idSelected;
  		$scope.btnState = ''
  	};

  	//button state
  	$scope.btnState = 'disabled';

  	//search panel state
  	$scope.isCollapsed = true;

  	//pagination
  	$scope.maxSize = 5;
  	$scope.totalItems = 175;
  	$scope.currentPage = 1;

  	$scope.setPage = function (pageNo) {
  		$scope.currentPage = pageNo;
  	};

  });
