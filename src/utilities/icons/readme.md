# Icons

The Icons Utility fetches an SVG sprite onto the page for displaying icons. This will cache the request and keep the page load down.

## Usage

    import Icons from '@nycopportunity/patterns-framework/src/utilities/icons/icons';

    new Icons();

    // or

    new Icons('path/to/icons.svg');

The script expects the icon sprite path to be `./icons.svg` (relative to the displayed page). To overwrite this, pass a path to the method. This uses the `fetch` method which will require a polyfill for IE11 (and other older browser) support. The script does not ship with a polyfill by default.