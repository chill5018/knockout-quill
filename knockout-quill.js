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

	var _quill = __webpack_require__(1);

	var _quill2 = _interopRequireDefault(_quill);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var default_options = {
	  theme: "snow",
	  styles: false,
	  modules: {}
	};
	var quill_map = new WeakMap();

	ko.bindingHandlers.quill = {
	  init: function init(element, valueAccessor, allBindings) {
	    var html_observable = valueAccessor();
	    var focus_observable = ko.isObservable(allBindings.get('quill_has_focus')) && allBindings.get('quill_has_focus') || null;

	    if (!ko.isObservable(html_observable)) throw new Error("key to the 'quill' binding must be an observable");

	    // see if user has set quill_options
	    var options = Object.assign({}, default_options, allBindings.get('quill_options'));

	    // see if the user has enabled the toolbar module
	    allBindings.has('quill_toolbar') && Object.assign(options.modules, {
	      toolbar: {
	        container: ko.unwrap(allBindings.get('quill_toolbar'))
	      }
	    });

	    // see if the user has enabled the link tooltip
	    allBindings.has('quill_link_tooltip') && Object.assign(options.modules, {
	      "link-tooltip": ko.unwrap(allBindings.get('quill_link_tooltip'))
	    });

	    // see if the user has enabled the image tooltip
	    allBindings.has('quill_image_tooltip') && Object.assign(options.modules, {
	      "image-tooltip": ko.unwrap(allBindings.get('quill_image_tooltip'))
	    });

	    // see if the user has set a specific theme
	    allBindings.has('quill_theme') && Object.assign(options, {
	      theme: ko.unwrap(allBindings.get('quill_theme'))
	    });

	    // see if the user has set any specific styles
	    allBindings.has('quill_styles') && Object.assign(options, {
	      styles: ko.unwrap(allBindings.get('quill_styles'))
	    });

	    // Initialize the quill editor and store it in the quill map
	    var quill = new _quill2.default(element, options);
	    quill_map.set(element, quill);

	    // Set the quill editor's initial content to the current value of the
	    // provided observable
	    quill.setHTML(ko.unwrap(html_observable) || "");

	    // If text changes and cursor is not in the text area, update the observable
	    // If text changes and curor is still in the text area, we'll update the
	    // observable when the cursor leaves (see: `quill.on('selection-change')`)
	    quill.on('text-change', function (delta) {
	      quill.getSelection() || html_observable(quill.getHTML());
	    });

	    // Make sure we update the observables when the editor contents change.
	    quill.on("selection-change", function (range) {
	      // range looks like: `{start: Number, end: Number}`
	      // range.start === range.end <=> nothing selected

	      if (range) {
	        // cursor is in the text area

	        // make sure focus observable is true but don't trigger an update
	        focus_observable(true);
	      } else {
	        // cursor just left the selection area

	        focus_observable(false);

	        var current_value = quill.getHTML();

	        if (current_value === "<div><br></div>") {
	          // Quill likes to set empty panes to "<div><br></div>"; detect it and
	          // update the observable to null
	          html_observable(null);
	        } else {
	          // update the observable to current editor contents
	          html_observable(current_value);
	        }
	      }
	    });

	    // when focus observable changes
	    focus_observable && focus_observable.subscribe(function (is_focused) {
	      if (is_focused) {
	        // set cursor to the last spot if the focus observable is truthy
	        var length = quill.getLength();
	        !quill.getSelection() && quill.setSelection(length, length);
	      } else {
	        // remove the cursor if the focus observable is falsey
	        quill.getSelection() && quill.setSelection(null);
	      }
	    });

	    // Destroy our quill when the element is removed from the DOM
	    ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
	      return quill.destroy();
	    });
	  },
	  update: function update(element, valueAccessor, allBindings) {
	    var html_observable = valueAccessor();
	    var quill = quill_map.get(element);

	    if (quill.getHTML() !== ko.unwrap(html_observable)) {
	      // Get the user's current selection range(s)
	      var selection = quill.getSelection();

	      // Set the content of the quill editor to the current value of the
	      // provided observable
	      quill.setHTML(ko.unwrap(html_observable) || "");

	      // Reset the selection ranges to what the user initially had selected
	      quill.setSelection(selection);
	    }
	  }
	};

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = Quill;

/***/ }
/******/ ]);