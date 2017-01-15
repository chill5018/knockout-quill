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

    if (!ko.isObservable(html_observable))
      throw new Error("key to the 'quill' binding must be an observable");

    // see if user has set quill_options
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
    quill.clipboard.dangerouslyPasteHTML(ko.unwrap(html_observable) || "");

    // If text changes and cursor is not in the text area, update the observable
    // If text changes and curor is still in the text area, we'll update the
    // observable when the cursor leaves (see: `quill.on('selection-change')`)
    quill.on('text-change', (delta) => {
      // quill.getSelection() || html_observable(quill.root.innerHTML);
      html_observable(quill.root.innerHTML);
    });

  },

  update(element, valueAccessor, allBindings) {
    const html_observable = valueAccessor();
    const quill = quill_map.get(element);

    if (quill.root.innerHTML !== ko.unwrap(html_observable)) {
      // Get the user's current selection range(s)
      // const selection = quill.getSelection();

      // Set the content of the quill editor to the current value of the
      // provided observable
      quill.clipboard.dangerouslyPasteHTML(ko.unwrap(html_observable) || "");

      // Reset the selection ranges to what the user initially had selected
      // quill.setSelection(selection);
    }
  }

};
