# Spinner

The Spinner Utility is a generic animation used to indicate a process or loading period.

## Usage

The Spinner uses CSS animation so the spinner stylesheet should be imported.

    @use '@nycopportunity/patterns-framework/src/utilities/spinner/spinner';

### Markup

Either copy and paste the following spinner markup into your document...

    <svg class='spinner' viewBox='0 0 24 24' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'>
      <circle class='spinner__path' cx='12' cy='12' r='10' fill='none'></circle>
    </svg>

### JavaScript

... or programatically add the Spinner markup using the included script.

    import Spinner from '@nycopportunity/patterns-framework/src/utilities/spinner/spinner';

    let el = document.querySelector('[data-js="my-loading-container"]');
    let spinner = new Spinner();
    let loading = document.createElement('div');

    loading.appendChild(spinner);
    el.appendChild(loading);

### Styling

The spinner `spinner__path` element is set to accept the `currentColor` of it's parent meaning any color attribute styling will be inherited.
