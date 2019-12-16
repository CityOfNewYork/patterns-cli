# Track

Tracking bus for Google Analytics event tracking and Webtrends multitrack. If global gtag or Webtrends functions are not present this will not send.

## Usage

    import Track from '@nycopportunity/patterns-framework/src/utilities/track/track';

    new Track();

This will initialize basic tracking for links with the `data-js="track"` attribute. An event key as well as data must be passed and should be set to the attributes `data-track-key` and `data-track-data`. The data should be structured as an array of objects;

    [
      {
        "event": "sample-event"
      }
    ]

You can pass any data you would like. However, for Webtrends multitrack a basic click event must have the `event` attribute set, if it does not exist the event will not register.

Additionally, the script will add the path name to the `event`. For example, the `event` for the sample click tracking demo on this page is set to "sample-event" so the script will prepend "track" which is the `window.location.path`. It would then pass "track/sample-event" to Webtrends and Google Analytics.

Below are examples of passing events to the tracking methods directly;

    let track = new Track();

    // Tracking Click Events
    track.click("Track Click", [
      {"event": "track-click"}
    ]);

This uses the `.matches()` method which will require a polyfill for IE11 (and other older browser) support. The utility does not ship with a polyfill by default. See [Element Prototype Matches on MDN](https://polyfill.io/v2/docs/features/#Element_prototype_matches) for a suitable polyfill.