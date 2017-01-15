# Knockout Quill Binding Forked

This binding adds a [quill](http://quilljs.com/) WYSIWYG and binds it to a [Knockout.js](http://knockoutjs.com/) observable.

## What's New
This fork has been updated to work with Quill v 1.1.9 

* Removed Deprecated Quill Methods such as `.setHtml()` and `.getHtml()` 
* Removed Observable tracking when text fields become in focus and out of focus. 


## Demo

Check out the [demo](http://immense.js.org/knockout-quill) to get a quick idea of how it works and how to use it.

## Installation

The knockout-quill binding is available as a [Bower](http://bower.io/) package and as an [npm](https://www.npmjs.com/) package.

To install with Bower:

`bower install knockout-quill-binding`

Or, to install with npm:

`npm install --save knockout-quill-binding`

## Usage

It is expected that `Quill` and `ko` are both accessible globally on your page.

Include the `knockout-quill.js` JavaScript file then bind an observable like so:

```html
<input type='text' data-bind='quill: observable'>
```

Refer to the [demo](http://immense.js.org/knockout-quill) page for detailed usage instructions.

## Building

To build knockout-quill from the ECMAScript2015 source, do the following in a Node.js enabled environment:

```
npm install
npm run compile
```

## License

The knockout-pickadate binding is released under the MIT License. Please see the LICENSE file for details.
