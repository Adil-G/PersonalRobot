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

    const CHATBOT_ID = '754';//'754';60401
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
         data.message.message = data.message.message.replace(/[<>]/g, '');
         console.log(data.message.message);
        /**
         * Bridget
         *
         *var hash = md5("318"+data.message.message+"mp3655689925862905831bbe60297db080c85d6b6df29fcf9");
         console.log(hash);
         var url = 'http://www.vocalware.com/tts/gen.php?EID=3&LID=1&VID=8&TXT='+data.message.message+'&EXT=mp3&FX_TYPE=&FX_LEVEL=&ACC=6556899&API=2586290&SESSION=&HTTP_ERR=&CS='+hash;
        */

         /**
          * Misaki
          *
          *
          *

          */
         var hash = md5("3123"+data.message.message+"mp3655689925862905831bbe60297db080c85d6b6df29fcf9");
         console.log(hash);
         var url = 'http://www.vocalware.com/tts/gen.php?EID=3&LID=12&VID=3&TXT='+data.message.message+'&EXT=mp3&FX_TYPE=&FX_LEVEL=&ACC=6556899&API=2586290&SESSION=&HTTP_ERR=&CS='+hash;
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
    $scope.getAnnotation = function(text)
    {
      if(!text)
        text = $("#usermsg").val();
      var headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Origin': 'http://localhost:8101',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
        'Content-Type': 'application/json',
        'Accept': 'text/html'
      };
      //var data = $.param({"text":phrase,"lang":lang}
      //);

      var config = {
        headers : {
          'Content-Type': 'text/html'
        }
      };
      var req = {
        method: 'POST',
        url: 'https://infinite-river-38310.herokuapp.com/',
        headers: {
          'Content-Type': "application/json"
        },
        data: {"text":text,"lang":"en"}
      };
      $http(req)
        .success(function (nlp, status, headers, config) {
          $scope.PostDataResponse = nlp;
          console.log(nlp);
          var name = nlp.sentences[0].text.content;
          var array = [];
          for(var i = 0; i < nlp.tokens.length; i++)
          {
            var info = nlp.tokens[i];
            var dataset = {};
            // Dummy
            //dataset.tag  = +(info.partOfSpeech.tag  == 'tag');
            // Text
            //dataset.beginOffset = info.text.beginOffset;
            // Tag
            dataset.UNKNOWN  = +(info.partOfSpeech.tag  == 'UNKNOWN');
            dataset.ADJ  = +(info.partOfSpeech.tag  == 'ADJ');
            dataset.ADP  = +(info.partOfSpeech.tag  == 'ADP');
            dataset.ADV  = +(info.partOfSpeech.tag  == 'ADV');
            dataset.CONJ  = +(info.partOfSpeech.tag  == 'CONJ');
            dataset.DET  = +(info.partOfSpeech.tag  == 'DET');
            dataset.NOUN  = +(info.partOfSpeech.tag  == 'NOUN');
            dataset.NUM  = +(info.partOfSpeech.tag  == 'NUM');
            dataset.PRON  = +(info.partOfSpeech.tag  == 'PRON');
            dataset.PRT  = +(info.partOfSpeech.tag  == 'PRT');
            dataset.PUNCT  = +(info.partOfSpeech.tag  == 'PUNCT');
            dataset.VERB  = +(info.partOfSpeech.tag  == 'VERB');
            dataset.X  = +(info.partOfSpeech.tag  == 'X');
            dataset.AFFIX  = +(info.partOfSpeech.tag  == 'AFFIX');
            // Aspect
            dataset.ASPECT_UNKNOWN  = +(info.partOfSpeech.aspect  == 'ASPECT_UNKNOWN');
            dataset.PERFECTIVE  = +(info.partOfSpeech.aspect  == 'PERFECTIVE');
            dataset.IMPERFECTIVE  = +(info.partOfSpeech.aspect  == 'IMPERFECTIVE');
            dataset.PROGRESSIVE  = +(info.partOfSpeech.aspect  == 'PROGRESSIVE');
            // Case
            dataset.CASE_UNKNOWN  = +(info.partOfSpeech.case  == 'CASE_UNKNOWN');
            dataset.ACCUSATIVE  = +(info.partOfSpeech.case  == 'ACCUSATIVE');
            dataset.ADVERBIAL  = +(info.partOfSpeech.case  == 'ADVERBIAL');
            dataset.COMPLEMENTIVE  = +(info.partOfSpeech.case  == 'COMPLEMENTIVE');
            dataset.DATIVE  = +(info.partOfSpeech.case  == 'DATIVE');
            dataset.GENITIVE  = +(info.partOfSpeech.case  == 'GENITIVE');
            dataset.INSTRUMENTAL  = +(info.partOfSpeech.case  == 'INSTRUMENTAL');
            dataset.LOCATIVE  = +(info.partOfSpeech.case  == 'LOCATIVE');
            dataset.NOMINATIVE  = +(info.partOfSpeech.case  == 'NOMINATIVE');
            dataset.OBLIQUE  = +(info.partOfSpeech.case  == 'OBLIQUE');
            dataset.PARTITIVE  = +(info.partOfSpeech.case  == 'PARTITIVE');
            dataset.PREPOSITIONAL  = +(info.partOfSpeech.case  == 'PREPOSITIONAL');
            dataset.REFLEXIVE_CASE  = +(info.partOfSpeech.case  == 'REFLEXIVE_CASE');
            dataset.RELATIVE_CASE  = +(info.partOfSpeech.case  == 'RELATIVE_CASE');
            dataset.VOCATIVE  = +(info.partOfSpeech.case  == 'VOCATIVE');
            // Form
            dataset.FORM_UNKNOWN  = +(info.partOfSpeech.form  == 'FORM_UNKNOWN');
            dataset.ADNOMIAL  = +(info.partOfSpeech.form  == 'ADNOMIAL');
            dataset.AUXILIARY  = +(info.partOfSpeech.form  == 'AUXILIARY');
            dataset.COMPLEMENTIZER  = +(info.partOfSpeech.form  == 'COMPLEMENTIZER');
            dataset.FINAL_ENDING  = +(info.partOfSpeech.form  == 'FINAL_ENDING');
            dataset.GERUND  = +(info.partOfSpeech.form  == 'GERUND');
            dataset.REALIS  = +(info.partOfSpeech.form  == 'REALIS');
            dataset.IRREALIS  = +(info.partOfSpeech.form  == 'IRREALIS');
            dataset.SHORT  = +(info.partOfSpeech.form  == 'SHORT');
            dataset.LONG  = +(info.partOfSpeech.form  == 'LONG');
            dataset.ORDER  = +(info.partOfSpeech.form  == 'ORDER');
            dataset.SPECIFIC  = +(info.partOfSpeech.form  == 'SPECIFIC');
            // Gender
            dataset.GENDER_UNKNOWN  = +(info.partOfSpeech.gender  == 'GENDER_UNKNOWN');
            dataset.FEMININE  = +(info.partOfSpeech.gender  == 'FEMININE');
            dataset.MASCULINE  = +(info.partOfSpeech.gender  == 'MASCULINE');
            dataset.NEUTER  = +(info.partOfSpeech.gender  == 'NEUTER');
            // Moood
            dataset.MOOD_UNKNOWN  = +(info.partOfSpeech.mood  == 'MOOD_UNKNOWN');
            dataset.CONDITIONAL_MOOD  = +(info.partOfSpeech.mood  == 'CONDITIONAL_MOOD');
            dataset.IMPERATIVE  = +(info.partOfSpeech.mood  == 'IMPERATIVE');
            dataset.INDICATIVE  = +(info.partOfSpeech.mood  == 'INDICATIVE');
            dataset.INTERROGATIVE  = +(info.partOfSpeech.mood  == 'INTERROGATIVE');
            dataset.JUSSIVE  = +(info.partOfSpeech.mood  == 'JUSSIVE');
            dataset.SUBJUNCTIVE  = +(info.partOfSpeech.mood  == 'SUBJUNCTIVE');
            // Number
            dataset.NUMBER_UNKNOWN  = +(info.partOfSpeech.number  == 'NUMBER_UNKNOWN');
            dataset.SINGULAR  = +(info.partOfSpeech.number  == 'SINGULAR');
            dataset.PLURAL  = +(info.partOfSpeech.number  == 'PLURAL');
            dataset.DUAL  = +(info.partOfSpeech.number  == 'DUAL');
            // Person
            dataset.PERSON_UNKNOWN  = +(info.partOfSpeech.person  == 'PERSON_UNKNOWN');
            dataset.FIRST  = +(info.partOfSpeech.person  == 'FIRST');
            dataset.SECOND  = +(info.partOfSpeech.person  == 'SECOND');
            dataset.THIRD  = +(info.partOfSpeech.person  == 'THIRD');
            dataset.REFLEXIVE_PERSON  = +(info.partOfSpeech.person  == 'REFLEXIVE_PERSON');
            // Proper
            dataset.PROPER_UNKNOWN  = +(info.partOfSpeech.proper  == 'PROPER_UNKNOWN');
            dataset.PROPER  = +(info.partOfSpeech.proper  == 'PROPER');
            dataset.NOT_PROPER  = +(info.partOfSpeech.proper  == 'NOT_PROPER');
            // Reciprocity
            dataset.RECIPROCITY_UNKNOWN  = +(info.partOfSpeech.reciprocity  == 'RECIPROCITY_UNKNOWN');
            dataset.RECIPROCAL  = +(info.partOfSpeech.reciprocity  == 'RECIPROCAL');
            dataset.NON_RECIPROCAL  = +(info.partOfSpeech.reciprocity  == 'NON_RECIPROCAL');
            // Tense
            dataset.TENSE_UNKNOWN  = +(info.partOfSpeech.tense  == 'TENSE_UNKNOWN');
            dataset.CONDITIONAL_TENSE  = +(info.partOfSpeech.tense  == 'CONDITIONAL_TENSE');
            dataset.FUTURE  = +(info.partOfSpeech.tense  == 'FUTURE');
            dataset.PAST  = +(info.partOfSpeech.tense  == 'PAST');
            dataset.PRESENT  = +(info.partOfSpeech.tense  == 'PRESENT');
            dataset.IMPERFECT  = +(info.partOfSpeech.tense  == 'IMPERFECT');
            dataset.PLUPERFECT  = +(info.partOfSpeech.tense  == 'PLUPERFECT');
            // Voice
            dataset.VOICE_UNKNOWN  = +(info.partOfSpeech.voice  == 'VOICE_UNKNOWN');
            dataset.ACTIVE  = +(info.partOfSpeech.voice  == 'ACTIVE');
            dataset.CAUSATIVE  = +(info.partOfSpeech.voice  == 'CAUSATIVE');
            dataset.PASSIVE  = +(info.partOfSpeech.voice  == 'PASSIVE');
            // DependencyEdge
            dataset.headTokenIndex = info.dependencyEdge.headTokenIndex;
            // Label
            dataset.UNKNOWN   = +(info.dependencyEdge.label  == 'UNKNOWN');
            dataset.ABBREV   = +(info.dependencyEdge.label  == 'ABBREV');
            dataset.ACOMP   = +(info.dependencyEdge.label  == 'ACOMP');
            dataset.ADVCL   = +(info.dependencyEdge.label  == 'ADVCL');
            dataset.ADVMOD   = +(info.dependencyEdge.label  == 'ADVMOD');
            dataset.AMOD   = +(info.dependencyEdge.label  == 'AMOD');
            dataset.APPOS   = +(info.dependencyEdge.label  == 'APPOS');
            dataset.ATTR   = +(info.dependencyEdge.label  == 'ATTR');
            dataset.AUX   = +(info.dependencyEdge.label  == 'AUX');
            dataset.AUXPASS   = +(info.dependencyEdge.label  == 'AUXPASS');
            dataset.CC   = +(info.dependencyEdge.label  == 'CC');
            dataset.CCOMP   = +(info.dependencyEdge.label  == 'CCOMP');
            dataset.CONJ   = +(info.dependencyEdge.label  == 'CONJ');
            dataset.CSUBJ   = +(info.dependencyEdge.label  == 'CSUBJ');
            dataset.CSUBJPASS   = +(info.dependencyEdge.label  == 'CSUBJPASS');
            dataset.DEP   = +(info.dependencyEdge.label  == 'DEP');
            dataset.DET   = +(info.dependencyEdge.label  == 'DET');
            dataset.DISCOURSE   = +(info.dependencyEdge.label  == 'DISCOURSE');
            dataset.DOBJ   = +(info.dependencyEdge.label  == 'DOBJ');
            dataset.EXPL   = +(info.dependencyEdge.label  == 'EXPL');
            dataset.GOESWITH   = +(info.dependencyEdge.label  == 'GOESWITH');
            dataset.IOBJ   = +(info.dependencyEdge.label  == 'IOBJ');
            dataset.MARK   = +(info.dependencyEdge.label  == 'MARK');
            dataset.MWE   = +(info.dependencyEdge.label  == 'MWE');
            dataset.MWV   = +(info.dependencyEdge.label  == 'MWV');
            dataset.NEG   = +(info.dependencyEdge.label  == 'NEG');
            dataset.NN   = +(info.dependencyEdge.label  == 'NN');
            dataset.NPADVMOD   = +(info.dependencyEdge.label  == 'NPADVMOD');
            dataset.NSUBJ   = +(info.dependencyEdge.label  == 'NSUBJ');
            dataset.NSUBJPASS   = +(info.dependencyEdge.label  == 'NSUBJPASS');
            dataset.NUM   = +(info.dependencyEdge.label  == 'NUM');
            dataset.NUMBER   = +(info.dependencyEdge.label  == 'NUMBER');
            dataset.P   = +(info.dependencyEdge.label  == 'P');
            dataset.PARATAXIS   = +(info.dependencyEdge.label  == 'PARATAXIS');
            dataset.PARTMOD   = +(info.dependencyEdge.label  == 'PARTMOD');
            dataset.PCOMP   = +(info.dependencyEdge.label  == 'PCOMP');
            dataset.POBJ   = +(info.dependencyEdge.label  == 'POBJ');
            dataset.POSS   = +(info.dependencyEdge.label  == 'POSS');
            dataset.POSTNEG   = +(info.dependencyEdge.label  == 'POSTNEG');
            dataset.PRECOMP   = +(info.dependencyEdge.label  == 'PRECOMP');
            dataset.PRECONJ   = +(info.dependencyEdge.label  == 'PRECONJ');
            dataset.PREDET   = +(info.dependencyEdge.label  == 'PREDET');
            dataset.PREF   = +(info.dependencyEdge.label  == 'PREF');
            dataset.PREP   = +(info.dependencyEdge.label  == 'PREP');
            dataset.PRONL   = +(info.dependencyEdge.label  == 'PRONL');
            dataset.PRT   = +(info.dependencyEdge.label  == 'PRT');
            dataset.PS   = +(info.dependencyEdge.label  == 'PS');
            dataset.QUANTMOD   = +(info.dependencyEdge.label  == 'QUANTMOD');
            dataset.RCMOD   = +(info.dependencyEdge.label  == 'RCMOD');
            dataset.RCMODREL   = +(info.dependencyEdge.label  == 'RCMODREL');
            dataset.RDROP   = +(info.dependencyEdge.label  == 'RDROP');
            dataset.REF   = +(info.dependencyEdge.label  == 'REF');
            dataset.REMNANT   = +(info.dependencyEdge.label  == 'REMNANT');
            dataset.REPARANDUM   = +(info.dependencyEdge.label  == 'REPARANDUM');
            dataset.ROOT   = +(info.dependencyEdge.label  == 'ROOT');
            dataset.SNUM   = +(info.dependencyEdge.label  == 'SNUM');
            dataset.SUFF   = +(info.dependencyEdge.label  == 'SUFF');
            dataset.TMOD   = +(info.dependencyEdge.label  == 'TMOD');
            dataset.TOPIC   = +(info.dependencyEdge.label  == 'TOPIC');
            dataset.VMOD   = +(info.dependencyEdge.label  == 'VMOD');
            dataset.VOCATIVE   = +(info.dependencyEdge.label  == 'VOCATIVE');
            dataset.XCOMP   = +(info.dependencyEdge.label  == 'XCOMP');
            dataset.SUFFIX   = +(info.dependencyEdge.label  == 'SUFFIX');
            dataset.TITLE   = +(info.dependencyEdge.label  == 'TITLE');
            dataset.ADVPHMOD   = +(info.dependencyEdge.label  == 'ADVPHMOD');
            dataset.AUXCAUS   = +(info.dependencyEdge.label  == 'AUXCAUS');
            dataset.AUXVV   = +(info.dependencyEdge.label  == 'AUXVV');
            dataset.DTMOD   = +(info.dependencyEdge.label  == 'DTMOD');
            dataset.FOREIGN   = +(info.dependencyEdge.label  == 'FOREIGN');
            dataset.KW   = +(info.dependencyEdge.label  == 'KW');
            dataset.LIST   = +(info.dependencyEdge.label  == 'LIST');
            dataset.NOMC   = +(info.dependencyEdge.label  == 'NOMC');
            dataset.NOMCSUBJ   = +(info.dependencyEdge.label  == 'NOMCSUBJ');
            dataset.NOMCSUBJPASS   = +(info.dependencyEdge.label  == 'NOMCSUBJPASS');
            dataset.NUMC   = +(info.dependencyEdge.label  == 'NUMC');
            dataset.COP   = +(info.dependencyEdge.label  == 'COP');
            dataset.DISLOCATED   = +(info.dependencyEdge.label  == 'DISLOCATED');
            dataset.ASP   = +(info.dependencyEdge.label  == 'ASP');
            dataset.GMOD   = +(info.dependencyEdge.label  == 'GMOD');
            dataset.GOBJ   = +(info.dependencyEdge.label  == 'GOBJ');
            dataset.INFMOD   = +(info.dependencyEdge.label  == 'INFMOD');
            dataset.MES   = +(info.dependencyEdge.label  == 'MES');
            dataset.NCOMP   = +(info.dependencyEdge.label  == 'NCOMP');

            array.push(dataset);
          }

          console.log(array);
          $("#analyze").html(JSON.stringify(array));
          /*if(lang!="en")
           {
           $scope.gTranslate(data, "en");
           }*/
        })
        .error(function (data, status, header, config) {
          $scope.ResponseDetails = "Data: " + data +
            "<hr />status: " + status +
            "<hr />headers: " + header +
            "<hr />config: " + config;
          console.log($scope.ResponseDetails);

        });

    };


    $scope.recordMessage = function()
    {
      if (window.cordova) {
        // running on device/emulator
        recognition = new SpeechRecognition();
        recognition.lang = 'en-US';//ja-JP
        recognition.interimResults = false;
        recognition.maxAlternatives = 5;
        recognition.continuos = true;
        recognition.start();

        recognition.onresult = function(event) {
          console.log('You said: ', event.results[0][0].transcript);
          $("#usermsg").val(event.results[0][0].transcript);
          $scope.getAnnotation(event.results[0][0].transcript);
          //$scope.sendMessage();
        };

        recognition.onerror = function(e) {
          setTimeout(function(){recognition.start();console.log("Error. Starting again.");}, 1000);
        };
      } else {
        // running in dev mode
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 5;
        recognition.continuos = true;
        recognition.start();

        recognition.onresult = function(event) {
          console.log('You said: ', event.results[0][0].transcript);
          $("#usermsg").val(event.results[0][0].transcript);
          $scope.getAnnotation(event.results[0][0].transcript);
          //$scope.sendMessage();
        };

        recognition.onerror = function(e) {
          setTimeout(function(){recognition.start();console.log("Error. Starting again.");}, 1000);
        };
      }


    };
  });
