# Copy

Copy value of an input to the clipboard.

## Usage

### JavaScript

    import Copy from '@nycopportunity/patterns-framework/src/utilities/copy/copy';

    new Copy();

### Markup

    <input data-copy-target="copy-url" type="text" value="https://myurl" />

    <button aria-pressed="false" data-copy="copy-url" data-js="copy">
      Copy to Clipboard
    </button>