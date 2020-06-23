# Copy

Copy value of an input to the clipboard. It will focus on the input an toggle the aria pressed attribute of the toggling button to indicate a successful copy.

## Usage

### JavaScript

    import Copy from '@nycopportunity/patterns-framework/src/utilities/copy/copy';

    new Copy();

### Markup

    <input data-copy-target="copy-url" type="text" value="https://myurl" />

    <button aria-pressed="false" data-copy="copy-url" data-js="copy">
      Copy to Clipboard
    </button>