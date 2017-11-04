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



   $scope.sendMessage = function (banter) {

     banter = banter.replace(/[<>]/g, '');
     console.log(banter);
     /**
      * Bridget
      *
      *
      */
     var hash = md5("318"+banter+"mp3655689925862905831bbe60297db080c85d6b6df29fcf9");
     console.log(hash);
     var url = 'http://www.vocalware.com/tts/gen.php?EID=3&LID=1&VID=8&TXT='+banter+'&EXT=mp3&FX_TYPE=&FX_LEVEL=&ACC=6556899&API=2586290&SESSION=&HTTP_ERR=&CS='+hash;
     /**
      * Misaki
      *
      *var hash = md5("3123"+banter+"mp3655689925862905831bbe60297db080c85d6b6df29fcf9");
      console.log(hash);
      var url = 'http://www.vocalware.com/tts/gen.php?EID=3&LID=12&VID=3&TXT='+banter+'&EXT=mp3&FX_TYPE=&FX_LEVEL=&ACC=6556899&API=2586290&SESSION=&HTTP_ERR=&CS='+hash;
      *

      */

     console.log(url);
     // $.fileDownload(url)
     // .done(function () { console.log('File download a success!'); })
     //.fail(function () { console.log('File download failed!'); });

     //sayText(banter,3,1,3);
     var audio = new Audio(url);
     audio.addEventListener("ended", function(){
       $scope.recordMessage();
     });
     audio.play()
   };
    $scope.continue = false;
    var recognition;
    //Only cacluate number types
    function calculate(schema1,schema2) {
      var ret = {};
      for (var key in schema1) {
        if (schema1.hasOwnProperty(key) && schema2.hasOwnProperty(key)) {
          var obj = schema1[key];
          var obj2 = schema2[key];
          if(typeof obj === "number" && !isNaN(obj) && typeof obj2 === "number" && !isNaN(obj2)) {
            ret[key] = obj+obj2;
          }
          else if( key == 'TEXT' && Array.isArray(obj) && Array.isArray(obj2))
          {
            ret[key] = obj.concat(obj2);
          }
          else {
            if(typeof obj === 'object' && typeof obj2 === 'object') {
              ret[key] = calculate(obj,obj2);
            }
            else {
              ret[key] = obj;
            }
          }
        }
      }
      return ret;
    }
    /* finds the intersection of
     * two arrays in a simple fashion.
     *
     * PARAMS
     *  a - first array, must already be sorted
     *  b - second array, must already be sorted
     *
     * NOTES
     *
     *  Should have O(n) operations, where n is
     *    n = MIN(a.length(), b.length())
     */
    function intersect_safe(a, b) {
      var ai = 0, bi = 0;
      var result = [];
      /*console.log(a);
      console.log(b);*/
      for(var i =0; i< a.length;i++)
      {

        for(var j =0; j< b.length;j++)
        {
          /*console.log(a[i]);
          console.log(b[j]);
          console.log("eval: "+(a[i]==b[j]));*/
          if(a[i]==b[j])
            result.push(a[ai]);
        }
      }
      /*
      while (ai < a.length) {

        while (bi < b.length) {
          {
            console.log(a[ai]);
            console.log(b[bi]);
            console.log(a[ai]==b[bi]);
            if (String(a[ai]) == String(b[bi])) {
              result.push(a[ai]);

            }

            bi++;
          }
          ai++;
        }

        return result;
      }*/
      return result;
    }
    function distance(schema1,schema2) {
      var ret = {};
      var length = 0;
      var interArray = intersect_safe(schema1['TEXT'], schema2['TEXT']);
      var distMult = interArray.length*50 +1;

      console.log("DISTANCE MULTIPLIER = "+distMult);

      for (var key in schema1) {
        if (schema1.hasOwnProperty(key) && schema2.hasOwnProperty(key)) {
          var obj = schema1[key];
          var obj2 = schema2[key];
          if(typeof obj === "number" && !isNaN(obj) && typeof obj2 === "number" && !isNaN(obj2)) {
            if(Math.abs(schema1['SENT'] - schema2['SENT']) < 0.3)
              ret[key] = Math.abs(obj-obj2);
          }
          /*
          else if( key == 'TEXT' && Array.isArray(obj) && Array.isArray(obj2))
          {
            console.log("LEMMAs: ");
            console.log(obj);
            console.log(obj2);
            ret[key] = obj.concat(obj2);
          }


           else if(typeof obj === "string" && typeof obj2 === "string" )
           {
           if(obj == obj2)
           distMult-=5;
           }
           */
          else {
            if(typeof obj === 'object' && typeof obj2 === 'object') {
              ret[key] = calculate(obj,obj2);
            }
            else {
              ret[key] = obj;
            }
          }
        }
      }//

      var dist = 0;
      for (var key in ret) {
        if (ret.hasOwnProperty(key)) {
          if(typeof ret[key] === "number" && !isNaN(ret[key])) {
            dist += ret[key];
          }

          length++;
        }
      }
      if(length)
        dist = dist / distMult;
      return dist;
    }
    var delay = ( function() {
      var timer = 0;
      return function(callback, ms) {
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
      };
    })();
    $scope.convos = [];
    $scope.evaluate = function(input)
    {
      $scope.getAnnotationInput(input);


    };
    $scope.readPage = function(input){
      var req = {
        method: 'GET',
       // url: 'http://transcripts.foreverdreaming.org/viewtopic.php?f=104&t=31211',
        url: 'http://transcripts.foreverdreaming.org/viewtopic.php?f=464&t=22993',
        headers: {
          'Content-Type': "text/html"
        }
      };

      $http(req)
        .success(function (data, status, headers, config) {
          $scope.convos = [];
          var ps = $(data).find('p');

          var i = 0;                     //  set your counter to 1

          function myLoop () {           //  create a loop function
            setTimeout(function () {    //  call a 3s setTimeout when the loop is called
             $scope.getAnnotation(
               {
                q: $(ps[i]).text(),
                a: $(ps[i+1]).text()
              },
               i
             );        //  your code here
              i++;                     //  increment the counter
              if (i < (Math.min(100, ps.length -1))) {            //  if the counter < 10, call the loop function
                myLoop();             //  ..  again which will trigger another
              }
              else{

              }//  ..  setTimeout()
            }, 10)
          }

          myLoop();                      //  start the loop

          //Get the file contents
          /*var txtFile = "test.txt";

          var blob = null;
          var xhr = new XMLHttpRequest();
          xhr.open("GET", "txtFile");
          xhr.responseType = "blob";
          xhr.onload = function()
          {
            blob = xhr.response;
            LoadAndDisplayFile(blob)
          };
          xhr.send();*/




          /*var txtFile = "/tmp/test2.txt";
          var file = new File(txtFile,"write");
          var str = JSON.stringify(convos);

          log("opening file...");
          file.open();
          log("writing file..");
          file.writeline(str);
          file.close();*/

          /*
          console.log(convos);

          var centroid = $scope.getAnnotation(input);
          var best_QA = {};

          var j = 0;                     //  set your counter to 1

          function myLoop () {           //  create a loop function
            setTimeout(function () {    //  call a 3s setTimeout when the loop is called
              var dist  = distance(centroid, $scope.getAnnotation(convos[j].q));
              if(best_QA.dist)
              {
                if(dist <= best_QA.dist)
                {
                  best_QA = {
                    QA: convos[j],
                    dist: dist
                  }
                }

              }else {
                best_QA = {
                  QA: convos[j],
                  dist: dist
                }
              }
              j++;                     //  increment the counter
              if (j < convos.length) {            //  if the counter < 10, call the loop function
                myLoop();             //  ..  again which will trigger another
              }                        //  ..  setTimeout()
              else
              {
           console.log("BEST QA:");
           console.log(best_QA);
              }
            }, 600)
          }

          myLoop();

*/
        });


    };
    $scope.trunc = function(dataset, nlp, index)
    {
      var info = nlp.tokens[index];
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

      dataset.TEXT.push(info.lemma.toLowerCase());
      dataset.SENT = nlp.sentiment.score * 1;
    };
    $scope.getAnnotationInput = function(text)
    {
      //wait(100);
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

          var name = '';
          for(var i = 0; i < nlp.sentences.length; i++)
          {
            name += ' ' + nlp.sentences[i].text.content;
          }
          var array = [];
          for(var i = 0; i < nlp.tokens.length; i++)
          {

            var dataset = {
              TEXT:[]
            };

            $scope.trunc(dataset, nlp, i);
            array.push(dataset);
          }

          console.log(array);
          var normal = {};
          if(array.length > 0)
            normal = array[0];
          for(var j =1;j< array.length;j++)
          {
            normal = calculate(normal,array[j]);
          }
          var newValue = {
            'text': name,
            'values': normal
          };
          console.log(newValue);

          var centroid = normal;
          var best_QA = {};
          console.log("CENTROID: ");
          console.log(centroid);
          var j = 0;                     //  set your counter to 1

          function myLoop () {           //  create a loop function
            setTimeout(function () {    //  call a 3s setTimeout when the loop is called
              var dist  = distance(centroid, $scope.convos[j].q.values);
              console.log("DIST: "+j + " "+dist);
              if(best_QA.dist)
              {
                if(dist <= best_QA.dist)
                {
                  best_QA = {
                    QA: $scope.convos[j],
                    dist: dist
                  }
                }

              }else {
                best_QA = {
                  QA: $scope.convos[j],
                  dist: dist
                }
              }
              j++;                     //  increment the counter
              if (j < $scope.convos.length) {            //  if the counter < 10, call the loop function
                myLoop();             //  ..  again which will trigger another
              }                        //  ..  setTimeout()
              else
              {
                console.log("BEST QA:");
                console.log(best_QA);
                console.log(best_QA.QA.q.text);
                console.log(best_QA.QA.a);
                $scope.sendMessage(best_QA.QA.a);
              }
            }, 0)
          }

          myLoop();
          return newValue;
        })
        .error(function (data, status, header, config) {
          $scope.ResponseDetails = "Data: " + data +
            "<hr />status: " + status +
            "<hr />headers: " + header +
            "<hr />config: " + config;
          console.log($scope.ResponseDetails);

        });

    };
    /*function wait(ms){
      var start = new Date().getTime();
      var end = start;
      while(end < start + ms) {
        end = new Date().getTime();
      }
    }*/

    $scope.getAnnotation = function(QA, index)
    {
      //wait(100);
      var text = QA.q;
       // text = $("#usermsg").val();
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

          var name = '';
          for(var i = 0; i < nlp.sentences.length; i++)
          {
            name += ' ' + nlp.sentences[i].text.content;
          }
          var array = [];
          for(var i = 0; i < nlp.tokens.length; i++)
          {
            var dataset = {
              TEXT: []
            };
            $scope.trunc(dataset, nlp, i);

            array.push(dataset);
          }

          console.log(array);
          var normal = {};
          if(array.length > 0)
            normal = array[0];
          for(var j =1;j< array.length;j++)
          {
            normal = calculate(normal,array[j]);
          }
          var newValue = {
            'text': name,
            'values': normal
          };
          console.log(newValue);
          //$("#analyze").html(JSON.stringify(array));
          /*if(lang!="en")
           {
           $scope.gTranslate(data, "en");
           }*/
          QA = {
            q: newValue,
            a: QA.a
          };
          $scope.convos.push(QA);
          if(index >= 9)
          {
            console.log($scope.convos);
            var str = JSON.stringify($scope.convos);

            //Save the file contents as a DataURI
            var dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(str);

            //Write it as the href for the link
            var link = document.getElementById('link').href = dataUri;

          }
          return newValue;
        })
        .error(function (data, status, header, config) {
          $scope.ResponseDetails = "Data: " + data +
            "<hr />status: " + status +
            "<hr />headers: " + header +
            "<hr />config: " + config;
          console.log($scope.ResponseDetails);

        });

    };

    $scope.readPage();
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
          $scope.getAnnotationInput(event.results[0][0].transcript);
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
          $scope.getAnnotationInput(event.results[0][0].transcript);
          //$scope.sendMessage();
        };

        recognition.onerror = function(e) {
          setTimeout(function(){recognition.start();console.log("Error. Starting again.");}, 1000);
        };
      }


    };
  });
