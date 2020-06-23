# Web Share

The Web Share Utility invokes the [`navigator.share()`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share) api when the toggling element is clicked using data set to the `data-web-share` attribute. A callback can be set for when a successful share is made and a fallback function can be set for when the browser does not support `navigator.share()`.

## Usage

### JavaScript

    import WebShare from '@nycopportunity/patterns-framework/src/web-share/web-share';

    new WebShare({
      callback: () => {
        // Designate a callback function for a successful share here
      },
      fallback: () => {
        // Designate a fallback method for browsers that do not support the Web Share API here
      }
    });

### Markup

    <button data-js="web-share" data-web-share='{"title":"Page Title","text":"Description to of the shared content.","url":"https://url/to/share"}'>
      Share
    </button>