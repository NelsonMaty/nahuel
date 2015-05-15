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

  	//hardcoded data, replace with a REST call
    $scope.nelson = [
      {'id' : '1',
  	   'acronym':'UNC',
  	   'name':'Universidad Nacional de Córdoba',
  	   'country':
  	   	 {'name':'Argentina',
  	   	  'iso2' : 'ar'
  		 }
  	  },
  	  {'id' : '2',
  	   'acronym':'IUA',
  	   'name':'Instituto Universitario Aeronáutico',
  	   'country':
  	   	 {'name':'Argentina',
  	   	  'iso2' : 'ar'
  		 }
  	  },
  	  {'id' : '3',
  	   'acronym':'CNM',
  	   'name':'Colegio Nacional de Monserrat',
  	   'country':
  	   	 {'name':'Argentina',
  	   	  'iso2' : 'ar'
  		 }
  	  },
  	  {'id' : '8',
  	   'acronym':'UNIFESP',
  	   'name':'Universidad Federal de San Pablo',
  	   'country':
  	   	 {'name':'Brasil',
  	   	  'iso2' : 'br'
  		 }
  	  },
  	  {'id' : '5',
  	   'acronym':'UCC',
  	   'name':'Universidad Católica de Córdoba',
  	   'country':
  	   	 {'name':'Argentina',
  	   	  'iso2' : 'ar'
  		 }
  	  },
  	  {'id' : '6',
  	   'acronym':'UP',
  	   'name':'Universidad de Palermo',
  	   'country':
  	   	 {'name':'Argentina',
  	   	  'iso2' : 'ar'
  		 }
  	  },
  	  {'id' : '7',
  	   'acronym':'UBA',
  	   'name':'Universidad de Buenos Aires',
  	   'country':
  	   	 {'name':'Argentina',
  	   	  'iso2' : 'ar'
  		 }
  	  },
  	  {'id' : '4',
  	   'acronym':'INSA',
  	   'name':'Institut National des Sciences Apliquées',
  	   'country':
  	   	 {'name':'Francia',
  	   	  'iso2' : 'fr'
  		 }
  	  }
    ];
    $scope.countries = [
      {'name':'Argentina',
        'iso2' : 'ar'
      },
      {'name':'Brasil',
        'iso2': 'br'
      },
      {'name':'Francia',
       'iso2' : 'fr'
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

    $scope.removeElement = function (idToBeRemoved) {
      var i;
      for (i = 0; i < $scope.studyCenters.length; ++i) {
        if ($scope.studyCenters[i].id == idToBeRemoved){
          $scope.studyCenters.splice(i,1);
        }
      }
      
    }

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
