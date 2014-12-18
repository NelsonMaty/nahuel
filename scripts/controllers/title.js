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
      $scope.query = ""; //string used for filtering 

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
                text : "Todos las carreras",
                state : {opened : false},
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
      { 'academicUnit': 'Escuela de Enfermería',
        'careerCode': '00002',
        'careerName':'Enfermería',
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