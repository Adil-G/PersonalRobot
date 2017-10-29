// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
  .directive('myEnter', function () {
    return function (scope, element, attrs) {
      element.bind("keydown keypress", function (event) {
        if(event.which === 13) {
          scope.$apply(function (){
            scope.$eval(attrs.myEnter);
          });

          event.preventDefault();
        }
      });
    };
  })
  .controller('Talk', function($scope,$ionicPlatform,$state, $ionicLoading, $ionicPopup,$timeout, $http, $q) {

    const CHATBOT_ID = '60401';
    function convertToSlug(Text)
    {
      return Text
        .toLowerCase()
        .replace(/[^\w ]+/g,'')
        .replace(/ +/g,'-')
        ;//https://www.personalityforge.com/api/chat/?apiKey=HUMaqFTuSmD6MJwj&chatBotID=145553&message=hello&externalID=3sdf94skdlfjv3&firstName=corpius4&lastName=Blank&gender=m
    }



   $scope.sendMessage = function () {
     var req = {
       method: 'POST',
       url: 'https://www.personalityforge.com/api/chat/?apiKey=HUMaqFTuSmD6MJwj&chatBotID='+CHATBOT_ID+'&message='+convertToSlug($("#usermsg").val())+'&externalID=3sdf94skdlfjv3&firstName=corpius4&lastName=Blank&gender=m',
       headers: {
         'Content-Type': "application/json"
       }
     };
     $http(req)
       .success(function (data, status, headers, config) {
         $scope.PostDataResponse = data;
         console.log(data.message.message);
         var hash = md5("318"+data.message.message+"mp3655689925862905831bbe60297db080c85d6b6df29fcf9");
         console.log(hash);
         var url = 'http://www.vocalware.com/tts/gen.php?EID=3&LID=1&VID=8&TXT='+data.message.message+'&EXT=mp3&FX_TYPE=&FX_LEVEL=&ACC=6556899&API=2586290&SESSION=&HTTP_ERR=&CS='+hash;

         req.url = url;
         console.log(url);
        // $.fileDownload(url)
         // .done(function () { console.log('File download a success!'); })
          //.fail(function () { console.log('File download failed!'); });

         //sayText(data.message.message,3,1,3);
         var audio = new Audio(url);
         audio.addEventListener("ended", function(){
           $scope.recordMessage();
         });
         audio.play()

       })
       .error(function (data, status, header, config) {
         $scope.ResponseDetails = "Data: " + data +
           "<hr />status: " + status +
           "<hr />headers: " + header +
           "<hr />config: " + config;
         console.log($scope.ResponseDetails);
       });
   };
    $scope.continue = false;
    var recognition;
    $scope.recordMessage = function()
    {
      if (window.cordova) {
        // running on device/emulator
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 5;
        recognition.continuos = true;
        recognition.start();

        recognition.onresult = function(event) {
          console.log('You said: ', event.results[0][0].transcript);
          $("#usermsg").val(event.results[0][0].transcript);
          $scope.sendMessage();
        };

        recognition.onerror = function(e) {
          setTimeout(function(){recognition.start();console.log("Error. Starting again.");}, 1000);
        };
      } else {
        // running in dev mode
        recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 5;
        recognition.continuos = true;
        recognition.start();

        recognition.onresult = function(event) {
          console.log('You said: ', event.results[0][0].transcript);
          $("#usermsg").val(event.results[0][0].transcript);
          $scope.sendMessage();
        };

        recognition.onerror = function(e) {
          setTimeout(function(){recognition.start();console.log("Error. Starting again.");}, 1000);
        };
      }


    };
  });
