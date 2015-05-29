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

      $scope.accel = { x: 0, y: 0, z: 0 };

      $scope.accelg = { x: 0, y: 0, z: 0 };

      $scope.rotation = {
        alpha:0,
        beta:0,
        gamma:0
      };

      $scope.interval = 0;

      $scope.error = function() {
        // nada no me importa. come torta.
        alert('No se pudo obtener la camara');
      }

      $scope.setearVideoUrl = function(media) {
        $scope.video = document.querySelector('video');
        $scope.video.src = window.URL.createObjectURL(media);
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




      $scope.sliderCambio1 = function() {
        var img1 = document.getElementById('imagen1');
        img1.style.opacity = $scope.s1;
      }

      $scope.sliderCambio2 = function() {
        var img2 = document.getElementById('imagen2');
        img2.style.opacity = $scope.s2;
      }



      $scope.convertAccelToBlend = function() {
        var suma = 0.0;
        suma = $scope.accel.x / 10 + $scope.accel.y / 10 + $scope.accel.z / 10;
        suma = suma + $scope.accelg.x / 10 + $scope.accelg.y / 10 + $scope.accelg.z / 10;
        suma = suma + $scope.rotation.alpha / 10 + $scope.rotation.beta / 10 + $scope.rotation.gamma / 10;
        $scope.s1 = Math.min(Math.abs(suma),1.0);
        $scope.s2 = Math.min(Math.abs(suma),1.0);
      }


      $scope.deviceMotionHandler = function(eventData) {
        $scope.$apply(function() {

          var accel = eventData.acceleration;
          $scope.accel = accel;

          var accelg = eventData.accelerationIncludingGravity;
          $scope.accelg = accelg;

          var rotation = eventData.rotationRate;
          $scope.rotation = rotation;

          $scope.interval = eventData.interval;

          $scope.convertAccelToBlend();
          $scope.sliderCambio1();
          $scope.sliderCambio2();
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
