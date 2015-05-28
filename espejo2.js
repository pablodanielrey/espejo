var app = angular.module('espejoApp',[]);

app.controller('EspejoCtrl',
  function($scope,$interval) {

      $scope.s1 = 0;
      $scope.s2 = 0;

      $scope.error = function() {
        // nada no me importa. come torta.
        alert('No se pudo obtener la camara');
      }


      /*
        carga el video y inicializa el canvas.
        inicializa el timer para dibujar los frames.
      */
      $scope.setearVideoUrl = function(media) {
        var video = document.querySelector('video');
        video.src = window.URL.createObjectURL(media);
      }


      $scope.boton = function() {
        $scope.setearCamara();
      }

      $scope.imagen = ['img2.jpg','img3.jpg'];
      $scope.imagenIndex = 0;

      $scope.sliderCambio = function() {
        var img = document.getElementById('imagen');
        img.style.opacity = $scope.s1;
        img.src = $scope.imagen[$scope.imagenIndex];
        $scope.imagenIndex = ($scope.imagenIndex + 1) % 2;

        /*
        img = document.getElementById('imagen2');
        img.style.opacity = $scope.s2;
        */

      }

      /*
        Configura y da inicio al stream de la camara
      */
      $scope.setearCamara = function() {
        navigator.webkitGetUserMedia({video:true, audio:false}, $scope.setearVideoUrl, $scope.error);
      }


  }
);
