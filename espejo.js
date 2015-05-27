var app = angular.module('espejoApp',[]);

app.controller('EspejoCtrl',
  function($scope,$interval) {

      $scope.s1 = 0;
      $scope.image1 = null;
      $scope.width = 0;
      $scope.height = 0;
      $scope.video = null;
      $scope.canvas = null;
      $scope.ctx = null;
      $scope.image = null;


      $scope.error = function() {
        // nada no me importa. come torta.
      }

      /*
        cargar en el context la imagen para guardarla en una variable dentro del scope.
      */
      $scope.loadImage1Data = function() {
        var image = document.querySelector('img');
        $scope.ctx.drawImage(image,0,0);
        var image1 = $scope.ctx.getImageData(0,0,image.width,image.height);
        $scope.image1 = image1;
      }


      /*
        carga el video y inicializa el canvas.
        inicializa el timer para dibujar los frames.
      */
      $scope.setearVideoUrl = function(media) {
        $scope.video = document.querySelector('video');
        $scope.video.src = window.URL.createObjectURL(media);

        $scope.canvas = document.getElementById('canvas');
        $scope.width = $scope.canvas.width;
        $scope.height = $scope.canvas.height;
        $scope.ctx = $scope.canvas.getContext('2d');

        $scope.loadImage1Data();

        $interval($scope.drawFrame,100);
      }


      /*
        hace le blend de las 2 imágenes
      */
      $scope.blend = function(frame,fi,image,ii) {
        for (var i = 0; i < image.length; i++) {
          frame[i] = (frame[i] * fi) + (image[i] * ii);
        }
      }

      /*
        Dibuja el frame
      */
      $scope.drawFrame= function() {
        $scope.ctx.drawImage($scope.video, 0, 0, $scope.width, $scope.height);
        var frame = $scope.ctx.getImageData(0, 0, $scope.width, $scope.height);
        var bi = $scope.s1;
        var fi = 1.0 - $scope.s1;
        $scope.blend(frame.data,fi,$scope.image1.data,bi);
        $scope.ctx.putImageData(frame,0,0);
      }

      /*
        Configura y da inicio al stream de la camara
      */
      $scope.setearCamara = function() {
        navigator.webkitGetUserMedia({video:true, audio:false}, $scope.setearVideoUrl, $scope.error);
      }


  }
);
