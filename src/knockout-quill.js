import Quill from 'quill';

const default_options = {
  theme: "snow",
  styles: false,
  modules: {}
};
const quill_map = new WeakMap();

ko.bindingHandlers.quill = {

  init(element, valueAccessor, allBindings) {
    const html_observable = valueAccessor();
    const focus_observable = ko.isObservable(allBindings.get('quill_has_focus')) && allBindings.get('quill_has_focus') || null;

    if (!ko.isObservable(html_observable))
      throw new Error("key to the 'quill' binding must be an observable");

    const options = Object.assign({}, default_options, allBindings.get('quill_options'));
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
    const quill = new Quill(element, options);
    quill_map.set(element, quill);

    // Set the quill editor's initial content to the current value of the
    // provided observable
    quill.setHTML(ko.unwrap(html_observable) || "");

    // If text changes and cursor is not in the text area, update the observable
    // If text changes and curor is still in the text area, we'll update the
    // observable when the cursor leaves (see: `quill.on('selection-change')`)
    quill.on('text-change', (delta) => {
      quill.getSelection() || html_observable(quill.getHTML());
    });

    // Make sure we update the observables when the editor contents change.
    quill.on("selection-change", range => {
      // range looks like: `{start: Number, end: Number}`
      // range.start === range.end <=> nothing selected

      if (range) { // cursor is in the text area

        // make sure focus observable is true but don't trigger an update
        focus_observable(true);

      } else { // cursor just left the selection area

        focus_observable(false);

        const current_value = quill.getHTML();

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
    focus_observable && focus_observable.subscribe(is_focused => {
      if (is_focused) {
        // set cursor to the last spot if the focus observable is truthy
        const length = quill.getLength();
        !quill.getSelection() && quill.setSelection(length, length);
      }
      else {
        // remove the cursor if the focus observable is falsey
        quill.getSelection() && quill.setSelection(null);
      }
    });

    // Destroy our quill when the element is removed from the DOM
    ko.utils
      .domNodeDisposal
      .addDisposeCallback(element, () => quill.destroy());
  },

  update(element, valueAccessor, allBindings) {
    const html_observable = valueAccessor();
    const quill = quill_map.get(element);

    // Get the user's current selection range(s)
    const selection = quill.getSelection();

    // Set the content of the quill editor to the current value of the
    // provided observable
    quill.setHTML(ko.unwrap(html_observable) || "");

    // Reset the selection ranges to what the user initially had selected
    quill.setSelection(selection);
  }

};
