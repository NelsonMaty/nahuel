'use strict';

/**
 * @ngdoc function
 * @name nahuel11App.controller:TitleCtrl
 * @description
 * # TitleCtrl
 * Controller of the nahuel11App
 */
angular.module('nahuel11App')
  .controller('TitleCtrl', function ($scope) {

	/*Tree hardcoded data*/
	$scope.titleTree = [
     {'id' : '1',
       'title':'Facultad de Ciencias Médicas',
       'nodeType': 'academicUnit',
       'items':
  	   	 [{'id':'11',
  	   	  'title' : 'Escuela de Enfermeria',
  	   	  'nodeType': 'academicUnit',
  	   	  'items':
  	   	  	[{
  	   	  		'id':'111',
  	   	  		'title' : 'Carrera 1',
  	   	  		'nodeType': 'career',
  	   	  		'items':
  	   	  		[{
  	   	  			'id':'1111',
  	   	  			'title' : 'Título 1',
  	   	  			'nodeType': 'title',
  	   	  			'items':[]
  	   	  		},
  	   	  		{
  	   	  			'id':'1111',
  	   	  			'title' : 'Título 2',
  	   	  			'nodeType': 'title',
  	   	  			'items': []
  	   	  		}]  
  	   	  	}]
  		 }]
  	  },
  	  {'id' : '2',
  	   'title':'Facultad de Artes',
  	   'nodeType': 'academicUnit',
  	   'items': []
  	  }
    ];
    
    $scope.titleTable = [
    	{ 'academicUnit': 'Facultad de Ciencias Médicas',
    	  'careerCode': '00001',
    	  'careerName':'Medicina',
    	  'titleCode':'12',
    	  'titleName': 'Médico',
    	  'titleType': 'Tipo 1',
    	  'careerMode': 'Presencial',
    	  'state': '1'
    	},
    	{ 'academicUnit': 'Escuela de Enfermeria',
    	  'careerCode': '00002',
    	  'careerName':'Enfermeria',
    	  'titleCode':'15',
    	  'titleName': 'Enfermero',
    	  'titleType': 'Tipo 1',
    	  'careerMode': 'Semi Presencial',
    	  'state': '2'
    	},
    	{ 'academicUnit': 'Facultad de Ciencias Médicas',
    	  'careerCode': '00003',
    	  'careerName':'Licenciatura en Fonoaudiología',
    	  'titleCode':'11',
    	  'titleName': 'Licenciado en Fonoaudiología',
    	  'titleType': 'Tipo 2',
    	  'careerMode': 'Presencial',
    	  'state': '3'
    	},
    	{ 'academicUnit': 'Facultad de Artes',
    	  'careerCode': '00004',
    	  'careerName':'Tecnicatura Universitaria en Fotografía',
    	  'titleCode':'17',
    	  'titleName': 'Tecnico Universitario en Fotografía',
    	  'titleType': 'Tipo 3',
    	  'careerMode': 'A distancia',
    	  'state': '4'
    	},
    	{ 'academicUnit': 'Facultad de Artes',
    	  'careerCode': '00005',
    	  'careerName':'Tecnicatura en Luthería',
    	  'titleCode':'19',
    	  'titleName': 'Maestro Técnico Profesional de Luthería',
    	  'titleType': 'Tipo 1',
    	  'careerMode': 'Presencial',
		  'state': '5'
    	},
    	{ 'academicUnit': 'Facultad de Artes',
    	  'careerCode': '00005',
    	  'careerName':'Tecnicatura en Luthería',
    	  'titleCode':'19',
    	  'titleName': 'Técnico en Luthería',
    	  'titleType': 'Tipo 1',
    	  'careerMode': 'Presencial',
		  'state': '5'
    	}
    ];

    $scope.countStates = function(stateValue) {
    	var count = 0;
		for (var i = 0; i < $scope.titleTable.length; i++) { 
    		if($scope.titleTable[i].state == stateValue){
    			count = count + 1;
    		}
		}
		return count;
    }

  });