# Tooltips

The Tooltip Utility visually reveals supplementary text for an element and uses the `aria-describedby` attribute to associate the content for screen readers.

## Usage

### JavaScript

    import Tooltips from '@nycopportunity/patterns-framework/src/tooltips/tooltips';

    let elements = document.querySelectorAll(Tooltips.selector);

    elements.forEach(element => {
      new Tooltips(element);
    });

### Markup

    <button aria-describedby="aria-db-tooltip-age" data-js="tooltip" type="button">
      Here’s why we are asking.
    </button>

    <div id="aria-db-tooltip-age">
      <p>Many benefit programs are meant for people of a specific age group. Sharing your age will help us choose the programs that will be most helpful to you right now. The information you share for the purposes of public benefits screening will be anonymous.</p>
    </div>
