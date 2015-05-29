var app = angular.module('espejoApp',[]);

app.controller('EspejoCtrl',
  function($scope,$interval) {

      $scope.s1 = 0;
      $scope.video = null;

      $scope.imagenes = ['mujer1.fw.png','mujer2.fw.png','mujer1.fw.png','mujer2.fw.png','mujer1.fw.png','mujer2.fw.png'];
      $scope.imagenesl = $scope.imagenes.length;
      $scope.indiceImagen1 = 0;
      $scope.indiceImagen2 = 1;

      $scope.usarAccelx = false;
      $scope.usarAccely = false;
      $scope.usarAccelz = false;
      $scope.accel = { x: 0, y: 0, z: 0 };

      $scope.usarAccelgx = false;
      $scope.usarAccelgy = true;
      $scope.usarAccelgz = false;
      $scope.accelg = { x: 0, y: 0, z: 0 };

      $scope.usarRotationA = false;
      $scope.usarRotationB = false;
      $scope.usarRotationG = false;
      $scope.rotation = {
        alpha:0,
        beta:0,
        gamma:0
      };

      $scope.im = 4;

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
        $scope.setearCambioDeImagenes();
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




      /*
        ESTE METODO TIENEN QUE MODIFICAR PARA LOGRAR LA CONVERSION DE VALORES A LOS
        SLIDERS.
        PUEDEN USAR SUMAS, RESTAS, MULTIPLICACIONES, ETC.
      */

      $scope.convertAccelToBlend = function() {
        var im = $scope.im;
        var suma = 0.0;

        if ($scope.usarAccelx) {
          suma = $scope.accel.x / im;
        }
        if ($scope.usarAccely) {
          suma = $scope.accel.y / im;
        }
        if ($scope.usarAccelz) {
          suma = $scope.accel.z / im;
        }


        if ($scope.usarAccelgx) {
          suma = suma + $scope.accelg.x / im;
        }
        if ($scope.usarAccelgy) {
          suma = suma + $scope.accelg.y / im;
        }
        if ($scope.usarAccelgz) {
          suma = suma + $scope.accelg.z / im;
        }


        if ($scope.usarRotationA) {
          suma = suma + $scope.rotation.alpha / im;
        }
        if ($scope.usarRotationB) {
          suma = suma + $scope.rotation.beta / im;
        }
        if ($scope.usarRotationG) {
          suma = suma + $scope.rotation.gamma / im;
        }

        if (suma > 0) {
          $scope.s1 = Math.min(Math.abs(suma),1.0);

        } else {
          $scope.s2 = Math.min(Math.abs(suma),1.0);
        }
      }


      $scope.setearCambioDeImagenes = function() {
        $interval(function() {
          $scope.changeImagen1();
          $scope.changeImagen2();
        }, 1000 * 5);
      }


      $scope.changeImagen1 = function() {
        $scope.indiceImagen1 = ($scope.indiceImagen1 + 1) % $scope.imagenes.length;
        var img = document.getElementById('imagen1');
        img.src = $scope.imagenes[$scope.indiceImagen1];
      }


      $scope.changeImagen2 = function() {
        $scope.indiceImagen2 = ($scope.indiceImagen2 + 1) % $scope.imagenes.length;
        var img = document.getElementById('imagen2');
        img.src = $scope.imagenes[$scope.indiceImagen2];
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
