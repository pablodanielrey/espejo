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

      $scope.accel = {};
      $scope.accelg = {};
      $scope.rotation = {};
      $scope.interval = 0;


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


      $scope.boton = function() {
        $scope.setearCamara();
        $scope.configurarMovimiento();
      }

      /*
        Configura y da inicio al stream de la camara
      */
      $scope.setearCamara = function() {
        navigator.webkitGetUserMedia({video:true, audio:false}, $scope.setearVideoUrl, $scope.error);
      }


      $scope.convertAccelToBlend = function() {
        var suma = 0.0;
        suma = $scope.accel.x / 10 + $scope.accel.y / 10 + $scope.accel.z / 10;
        suma = suma + $scope.accelg.x / 10 + $scope.accelg.y / 10 + $scope.accelg.z / 10;
        suma = suma + $scope.rotation.alpha / 10 + $scope.rotation.beta / 10 + $scope.rotation.gamma / 10;
        $scope.s1 = Math.min(Math.abs(suma),1.0);

      }


      $scope.deviceMotionHandler = function(eventData) {
        $scope.$apply(function() {
          // Grab the acceleration from the results
          var accel = eventData.acceleration;
          $scope.accel = accel;

          var accelg = eventData.accelerationIncludingGravity;
          $scope.accelg = accelg;

          var rotation = eventData.rotationRate;
          $scope.rotation = rotation;

          $scope.interval = eventData.interval;

          $scope.convertAccelToBlend();
        });
      }

      $scope.deviceOrientationHandler = function(eventData) {
        $scope.$apply(function() {
          $scope.rotation = eventData;
        });
      }


      $scope.configurarMovimiento = function() {
        /*
        if (window.DeviceOrientationEvent) {
          window.addEventListener('deviceorientation', $scope.deviceMotionHandler, false);
        } else {
          alert('No se soporta el device orientation');
        }
        */

        if (window.DeviceMotionEvent) {
          window.addEventListener('devicemotion', $scope.deviceMotionHandler, false);
        } else {
          alert('no soporta device motion');
        }
      }

  }
);
