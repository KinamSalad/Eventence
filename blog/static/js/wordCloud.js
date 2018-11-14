/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _wbxWordCloud = __webpack_require__(1);

	angular.module('wordCloud', ['wbxWordCloud']);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _wordService = __webpack_require__(2);

	var _wbxWordCloudDirective = __webpack_require__(3);

	/**
	 * Created by Harel on 24/07/2016.
	 */


	angular.module('wbxWordCloud', []).service('wordService', _wordService.wordService).directive('wbxWordCloud', _wbxWordCloudDirective.wbxWordCloud);

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * Created by Harel on 08/06/2016.
	 */

	var wordService = exports.wordService = function () {
	  wordService.$inject = ["$q", "$http"];
	  function wordService($q, $http) {
	    'ngInject';

	    _classCallCheck(this, wordService);

	    this.$q = $q;

	    this.http = $http;

	    this.selectionMode = '';

	    this.hoveredMode = '';



	    this.fontMin = 12, this.fontMax = 32;
	  }

	  // get delimiters from config file


	  _createClass(wordService, [{
	    key: 'getConfig',
	    value: function getConfig(configPath, configParams) {
	      var defer = this.$q.defer();
	      if (angular.isUndefined(configParams)) {
	        configPath = angular.isDefined(configPath) ? configPath : this.getCurrentDirectory();
	        this.http.get(configPath + '/../../../json2').then(function (response) {
	          defer.resolve(response.data);
	        }, function (response) {
	          // Error callback
	          defer.resolve("Error"); // Reject
	        });
	      } else {
	          return configParams;
	        }

	      return defer.promise;
	    }
	  }, {
	    key: 'setText',
	    value: function setText(data, append, selectedWords) {

	      function handleTextData(config) {
	        var parsedData = that.wordService.dataToWordsArr(config.delimiters, that.text); // get the delimiters
	        parsedData = that.wordService.spliceMaxWords(parsedData, config.maxWords);
	        that.initCloud(parsedData, selectedWords);
	        that.runListeners('updateData', parsedData);
	      }

	      // append data to this.text
	      if (append && this.text != null && this.text != "" && angular.isDefined(data)) {
	        this.text = this.text.concat(data);
	      } else {
	        this.text = data;
	      }
	      var that = this;

	      that.wordService.$q.when(that.wordService.getConfig(this.config.configUrl, this.config.configParams)).then(handleTextData);
	    }
	  }, {
	    key: 'setListener',
	    value: function setListener(eventName, callback) {
	      function unHookEvent() {
	        this.events.splice(this.index, 1);
	        this.events = null;
	        this.index = null;
	      }

	      if (angular.isUndefined(this.events)) {
	        this.events = {};
	      }

	      if (angular.isUndefined(this.events[eventName])) {
	        this.events[eventName] = [];
	      }

	      return unHookEvent.bind({ events: this.events[eventName], index: this.events[eventName].push(callback) - 1 });
	    }

	    // Bellow 2 function relate to API

	  }, {
	    key: 'onSelect',
	    value: function onSelect(allWords, selectedWordId) {

	      var that = this,
	          words = allWords,
	          theWord = words[selectedWordId].text;

	      if (window.event.ctrlKey) {
	        _.forEach(words, function (w) {
	          if (theWord === w.text) {
	            if (w.selected) d3.select('#p' + w.id).classed("selected", true);else d3.select('#p' + w.id).classed("selected", false);
	          } else {
	            var flag = theWord == w.text ? true : w.selected;
	            d3.select('#p' + w.id).classed("selected", flag);
	          }
	        });
	      } else {
	        _.forEach(words, function (w) {
	          if (w.text == theWord && w.selected) {
	            d3.select('#p' + w.id).classed("selected", true);
	            that.selectionMode = true;
	          } else {
	            d3.select('#p' + w.id).classed("selected", false);
	          }
	        });
	      }
	      //Now if any word still selected apply the selection class even after deselect event
	      var selectionMode = [];
	      for (var i = 0; i < words.length; i++) {
	        if (words[i].selected) {
	          selectionMode.push("selected");
	        }
	      }
	      d3.select(this.elem).classed("selection-mode", selectionMode.length > 0);
	    }
	  }, {
	    key: 'onHover',
	    value: function onHover(allWords, hoveredWordId) {
	      // we want to hover/unhover the allWords[hoveredWordId]
	      //so to find full correlation and regardless the order in DOM we need to correlate between Id and Dom element
	      //
	      d3.select('#p' + hoveredWordId).classed("hovered", allWords[hoveredWordId].hovered);
	      d3.select(this.elem).classed("hover-mode", allWords[hoveredWordId].hovered);
	    }
	  }, {
	    key: 'runListeners',
	    value: function runListeners(eventName, data, arr) {
	      if (angular.isUndefined(this.events) || angular.isUndefined(this.events[eventName])) {
	        return;
	      }

	      _.forEach(this.events[eventName], function (event) {
	        event(data, arr);
	      });
	    }

	    /**
	     * @description parse the data:
	     *              1) Gets delimiters and parse it to regex
	     *              2) Use the regex delimiters to push each word into matchedWords array
	     *              3) For each word in matchedWords push it into stats array ,
	     *                and define the correspond id, size(frequency),
	     *                children (identical words in matchedWords by index).
	     *              4) Do wordService.data=stats and return stats
	     * @param delimiters
	     * @param newData
	     * @returns {Array}
	     */

	  }, {
	    key: 'setDelimiters',
	    value: function setDelimiters(delimiters) {
	      var t = "",
	          pattern;
	      if (angular.isDefined(delimiters)) {

	        var delimitersArr = delimiters.join('');
	        pattern = new RegExp('[\\s' + delimitersArr + ']+');







	      } else pattern = 99; // 99 --> no delimiter , will be handle in setMatchWords()

	      return pattern;
	    }
	  }, {
	    key: 'setMatchWords',
	    value: function setMatchWords(text, pattern) {
	      this.matchedWords = [];
	      if (pattern == 99) {
	        //no delimiters - use all the delimiters to delimiter
	        pattern = /([A-Z]||[a-z])\w+/g;
	      }
	      if (text.constructor.name == "String") {
	        var splitedWords = text.split(pattern);
	        _.remove(splitedWords, function (word) {
	          return word == "";
	        });
	        this.matchedWords.push(splitedWords); // takes each word from text and put them into elements in array
	      } else if (text.constructor.name == "Array") {
	          for (var i = 0; i < text.length; i++) {
	            var _splitedWords = text[i].toString().split(pattern);
	            _.remove(_splitedWords, function (word) {
	              return word == "";
	            });
	            this.matchedWords.push(_splitedWords); //.match(pattern)); // takes each word from text and put them into elements in array
	          }
	        }
	      return this.matchedWords;
	    }
	  }, {
	    key: 'setStats',
	    value: function setStats(matchedWords) {
	      var stats = [],
	          wordId = -1;
	      matchedWords.forEach(function (word, index) {
	        if (angular.isDefined(word) && word != null) {
	          word.forEach(function (elm) {
	            var obj = _.find(stats, { text: elm });
	            if (obj != undefined) {
	              //if word already exist, increase its size and push it occurrence in the array (children)
	              obj.size += 1;
	              obj.children.push(index);
	            } else {
	              // otherwise, push the word to array
	              stats.push({ text: elm, id: ++wordId, size: 1, children: [index] });
	            }
	          });
	        }
	      });

	      this.data = stats;
	      return this.data;
	    }
	  }, {
	    key: 'dataToWordsArr',
	    value: function dataToWordsArr(delimiters, newData) {

	      var pattern = this.setDelimiters(delimiters);
	      var matchedWords = this.setMatchWords(newData, pattern);
	      this.setStats(matchedWords);

	      return this.data; // this.data has : size = the number of occurrences in cloud, children : the indexes of the sentences where the word appears .
	    }
	  }, {
	    key: 'spliceMaxWords',
	    value: function spliceMaxWords(data, maxWords) {
	      if (maxWords && data.length > maxWords) {
	        var data = _.sortBy(data, "size");
	        data = _.reverse(data);
	        data = data.splice(0, maxWords);
	        return data;
	      }
	      return data;
	    }
	  }, {
	    key: 'calcFontSize',
	    value: function calcFontSize(id) {
	      var arr = [];

	      for (var i = 0; i < this.data.length; i++) {
	        arr[i] = this.data[i].size;
	      }
	      this.maxTagged = Math.max.apply(Math, arr);
	      this.minTagged = Math.min.apply(Math, arr);

	      var size = this.data[id].children.length == this.minTagged ? this.fontMin : this.data[id].children.length / this.maxTagged * (this.fontMax - this.fontMin) + this.fontMin;

	      return size;
	    }
	  }, {
	    key: 'getRate',
	    value: function getRate(id) {
	      while (!isNaN(id)) {
	        return (this.data[id].children.length / this.maxTagged).toFixed(2);
	      }
	    }
	  }, {
	    key: 'getCurrentDirectory',
	    value: function getCurrentDirectory() {
	      //@@ Dev Version @@
	      /*  var scripts = document.getElementsByTagName("script"), i;
	       for (i = 0; i < scripts.length; i++) {
	       if (scripts[i].src.search(/index.module.js/i) > 0) {
	       break;
	       }
	       }


	         var currentScriptPath = scripts[i].src;*/
	      // var resCurrentDirectory = currentScriptPath.substring(0, currentScriptPath.lastIndexOf("/app/") + 1);

	      // Build Version :
	      var resCurrentDirectory = document.getElementsByTagName("script")[0].baseURI;
	      return resCurrentDirectory;
	    }
	  }]);

	  return wordService;
	}();

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	exports.wbxWordCloud = wbxWordCloud;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * Created by Harel on 05/06/2016.
	 */
	function wbxWordCloud() {
	  'ngInject';

	  var directive = {
	    templateUrl: 'app/components/wordCloud/wordCloud.html',
	    controller: WordCloudController,
	    controllerAs: 'vm',
	    scope: {
	      words: '=',
	      config: "=wordCloudConfig"
	    },
	    replace: true,
	    bindToController: true,
	    link: linkFunc

	  };

	  function linkFunc(scope, element, attr, ctrl) {
	    // element = div of the wordCloud

	    ctrl.onInit();

	    scope.$on("$destroy,", function () {
	      ctrl.element = null;
	      console.log("wordCloud directive destroyed");
	    });
	  }

	  return directive;
	}

	var WordCloudController = function () {
	  WordCloudController.$inject = ["wordService", "$element"];
	  function WordCloudController(wordService, $element) {
	    'ngInject';

	    _classCallCheck(this, WordCloudController);

	    this.count = 0;
	    var that = this;
	    this.element = $element;
	    this.wordService = wordService;
	    this.runListeners = this.wordService.runListeners.bind(this);
	    this.onInit = function onInit() {
	      /* setup the API
	       The purpose of the next 10 lines is to set API to any external directive that want to adapt the cloud so it can use setText or setListener.
	       bind(this):
	       The wordCloudApi is outing 2 functions and with binding this so it will use 'this' in the functions as the specific scope
	       and will not use the parent scope.
	       */
	      that.wordCloudApi = {
	        setText: that.wordService.setText.bind(this),
	        setListener: that.wordService.setListener.bind(this),
	        onSelect: that.wordService.onSelect.bind(this),
	        onHover: that.wordService.onHover.bind(this),
	        deselectAll: that.deselectAll.bind(this),
	        getCloudWords: that.getCloudWords.bind(this)
	      };

	      /* notify parent about onInit
	       The validation is to check if there is in the external directive has the init function before we send to it the Api
	       the 'config' var will be the external controller .
	       */
	      if (angular.isDefined(that.config) && angular.isFunction(that.config.initCloud)) {
	        that.config.initCloud(that.wordCloudApi);
	        that.configUrl = that.config.configUrl;
	        that.configParams = that.config.configParams;
	      } else console.log("no initCloud define in external controller");
	    };
	    this.selectedWords = [];
	    $element.on("$destroy", function () {
	      console.log("wordCloud controller destroyed");
	    });
	  }

	  _createClass(WordCloudController, [{
	    key: 'getCloudWords',
	    value: function getCloudWords() {
	      return _.cloneDeep(this.data);
	    }
	  }, {
	    key: 'defineCloud',
	    value: function defineCloud(data) {
	      var that = this;

	      that.elem = that.element[0];

	      /* that.w = that.elem.clientWidth;  // check if matter using that than $element that.element.parent().width();
	       that.h = that.element.parent().parent().height();*/
	      that.w = that.elem.clientWidth; // check if matter using that than $element
	      that.h = that.elem.clientHeight;





























	      that.colors = ["#9FA8DA", "#7986CB", "#5C6BC0", "#3F51B5", "#3949AB", "#303F9F", "#283593", "#1A237E"];

	      that.color = d3.scale.linear().domain([that.wordService.fontMin, that.wordService.fontMax]).range([that.colors[0], that.colors[7]]);

	      that.divideBy = 1;










	    }
	  }, {
	    key: 'mouseHovered',
	    value: function mouseHovered(d) {
	      this.cloud.select('#p' + d.id).classed("hovered", !d.hovered);
	      d3.select(this.element[0]).classed("hovered-mode", !d.hovered);
	      this.runListeners('onHover', d);
	    }
	  }, {
	    key: 'mouseOut',
	    value: function mouseOut(d) {
	      this.cloud.select('#p' + d.id).classed("hovered", !d.hovered);
	      d3.select(this.element[0]).classed("hovered-mode", !d.hovered);
	      this.runListeners('onHover', d);
	    }
	  }, {
	    key: 'clicked',
	    value: function clicked(d) {

	      var that = this.that;

	      that.clickFlag = true; //a flag to know that was click on a word and to not propagate the event to the deselectAll event







	      // CTRL click handling :
	      if (window.event.ctrlKey || this.isCtrl) {
	        // this.ctrl for testing
	        if (that.cloud.select('#p' + d.id).classed("selected") /*d.selected*/) {
	            _.remove(that.selectedWords, d);
	            that.cloud.select('#p' + d.id).classed("selected", !that.cloud.select('#p' + d.id).classed("selected") /*!d.selected*/);
	            if (that.selectedWords.length == 0) {
	              d3.select(that.elem).classed("selection-mode", that.cloud.select('#p' + d.id).classed("selected") /*!d.selected*/);
	            }
	            that.runListeners('onSelect', d, that.selectedWords);
	          } else {
	          that.selectedWords.push(d);
	          that.cloud.select('#p' + d.id).classed("selected", !that.cloud.select('#p' + d.id).classed("selected") /*!d.selected*/);
	          d3.select(that.elem).classed("selection-mode", that.cloud.select('#p' + d.id).classed("selected") /*!d.selected*/);
	          that.runListeners('onSelect', d, that.selectedWords);
	        }
	      }
	      // single click handling :
	      else {
	          /*  _.forEach( that.data, function(item){
	           item.selected = false;
	           });*/
	          var flag = that.cloud.select('#p' + d.id).classed("selected"); // d.selected;

	          that.cloud.selectAll('text').classed('selected', false);



	          that.selectedWords.splice(0, that.selectedWords.length);
	          that.selectedWords.push(d);

	          that.cloud.select('#p' + d.id).classed("selected", !flag);
	          d3.select(that.elem).classed("selection-mode", !flag);
	          if (angular.isDefined(that.runListeners)) {
	            // for testing
	            that.runListeners('onSelect', d, undefined); // undefined array in case of single select
	          }
	        }
	      that.clickFlag = true;
	      //console.log("clicked: "+ that.clickFlag);
	    }
	  }, {
	    key: 'inDeselectAll',
	    value: function inDeselectAll() {
	      // click outside words cause unselect
	      //for each  selected item, unselect it.
	      //console.log("inDeselectAll: "+ this.clickFlag);
	      if (!this.clickFlag) {
	        this.cloud.selectAll('.selected').classed('selected', false);
	        d3.select(this.elem).classed("selection-mode", false);
	        this.runListeners('onSelect', undefined);
	      }
	      this.clickFlag = false;
	    }
	  }, {
	    key: 'deselectAll',
	    value: function deselectAll() {
	      // click outside words cause unselect
	      //for each  selected item, unselect it.
	      this.cloud.selectAll('.selected').classed('selected', false);
	      d3.select(this.elem).classed("selection-mode", false);

	    }
	  }, {
	    key: 'draw',
	    value: function draw() {
	      var that = this;
	      that.cloud.attr("transform", "translate(" + that.w / 2 + "," + that.h / 2 + ")scale(" + that.scale + ")") // re translate
	      .selectAll("text").data(that.data).enter().append("text").attr("id", function (d) {
	        return "p" + d.id;
	      }).transition().duration(500).attr("text-anchor", "middle").attr("transform", function (d) {
	        return "translate(" + [d.x, d.y] + ")";
	      }).each(function (d) {
	        d3.select(this).on("click", that.clicked.bind({ that: that }));
	      }).each(function (d) {
	        d3.select(this).on("mouseover", that.mouseHovered.bind(that));
	      }).each(function () {
	        d3.select(this).on("mouseout", that.mouseOut.bind(that));
	      }).attr('opacity', 1).style("font-size", function (d) {
	        return d.size + "px";
	      }).style("font-family", "'Noto Sans Hebrew', 'roboto'").style("fill", function (d) {
	        return that.color(d.size);
	      }).text(function (d, i) {
	        return d.text;
	      });
	    }

	    /**
	     * @description Sets the cloud and the layout
	     *              1) Gets data and define dimensions of the cloud by defineCloud
	     *              2) remove existing cloud to avoid multiplication of the cloud (in case of inserting new words to existing cloud) (test there is only one cloud in teh div)
	     *              3) appends alot of attrs to the cloud (test if all of them exist)
	     *              4) appends alot of attrs to the layout (test if all of them exist)
	     *              5) dispatching draw() (test if it was dispatched)
	     *
	     * @param data
	     * @returns --
	     */

	  }, {
	    key: 'initCloud',
	    value: function initCloud(data, selectedWords) {

	      var that = this;

	      this.defineCloud(data);
	      // When isInitialized -->  remove cloud , otherwise --> append layout to the existing svg and g
	      if (this.cloud) {
	        this.cloud = null;
	        //d3.select(that.elem.childNodes[0]).remove();  // the div of the any wordCloud is has 2 childNodes: #text and SVG . by removing svg we adding it to the same div.
	        d3.select(that.elem).select("svg").remove();
	        that.elem = null;
	      }
	      that.elem = that.element[0];

	      this.data = data;
	      var innerThat = that;

	      that.scale = 1;

	      var maxSize = _.maxBy(innerThat.data, 'size').size;

	      this.cloud = d3.select(that.elem).append("svg").attr("viewBox", "0 0 " + that.w + " " + that.h + "").attr("preserveAspectRatio", "xMidYMid meet").on('click', that.inDeselectAll.bind(that)).append("g").attr("transform", "translate(" + that.w / 2 + "," + that.h / 2 + ")scale(" + that.scale + ")").attr("margin", "auto");

	      that.scale = 1;
	      this.layout = d3.layout.cloud().size([that.w / that.divideBy, that.h / that.divideBy]).words(that.data).timeInterval(Infinity).padding(2).rotate(function () {
	        return 0;
	      }).font("'Noto Sans Hebrew', 'roboto'").spiral('rectangular').text(function (d) {
	        return d.text;
	      }).fontSize(function (d) {
	        return d.size / maxSize * 20 + 12;

	      }).on("end", innerThat.draw.bind(innerThat)) // when the layout has finished attempting to place all words an "end" event is dispatched
	      .start();

	      var flag = false;
	      //d3.select(this.elem).classed("selection-mode",  selectedWords && selectedWords.length > 0);
	      if (selectedWords) {
	        // && selectedWords.length > 0) {//if we get selected words
	        this.cloud.selectAll("text").classed("selected", function (d) {
	          var isExist = _.indexOf(selectedWords, d.text) != -1;
	          if (isExist) flag = true;
	          return isExist;
	        });
	        d3.select(this.elem).classed("selection-mode", flag);
	      }
	    }
	  }]);

	  return WordCloudController;
	}();

/***/ }
/******/ ]);
angular.module("wbxWordCloud").run(["$templateCache", function($templateCache) {$templateCache.put("app/components/wordCloud/wordCloud.html","<div id=wordCloud class=\"word-cloud color\" ng-class=\"{\'selection-mode\': vm.selectionMode,\'hover-mode\':vm.hoveredMode}\"></div>");}]);
//# sourceMappingURL=../maps/scripts/app-1e6b864caa.js.map
