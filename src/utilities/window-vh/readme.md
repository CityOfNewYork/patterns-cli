# Window Vh

The Window Vh Utility sets the css variable `--100vh` to the size of the window's inner height. This is a workaround for mobile Safari's `100vh` value extending beyond the viewport height. Attaches event listeners to `window.load` and `window.resize` to refresh the value.

## Usage

### JavaScript

    import WindowVh from '@nycopportunity/patterns-framework/src/utilities/window-vh/window-vh';

    new WindowVh();

### Configuration

Pass a different property to set the window's inner height to.

    new WindowVh({property: '--window-vh'});

    // or

    windowVh = new WindowVh();
    windowVh.property = '--window-vh';