'use strict';

/**
 * Tracking bus for Google analytics and Webtrends.
 */
class Track {
  constructor(s) {
    const body = document.querySelector('body');

    s = (!s) ? {} : s;

    this._settings = {
      selector: (s.selector) ? s.selector : Track.selector,
    };

    this.desinations = Track.destinations;

    body.addEventListener('click', (event) => {
      if (!event.target.matches(this._settings.selector))
        return;

      let key = event.target.dataset.trackKey;
      let data = JSON.parse(event.target.dataset.trackData);

      this.track(key, data);
    });

    return this;
  }

  /**
   * Tracking function wrapper
   *
   * @param  {String}      key   The key or event of the data
   * @param  {Collection}  data  The data to track
   *
   * @return {Object}            The final data object
   */
  track(key, data) {
    // Set the path name based on the location
    const d = data.map(el => {
        if (el.hasOwnProperty(Track.key))
          el[Track.key] = `${window.location.pathname}/${el[Track.key]}`
        return el;
      });

    let wt = this.webtrends(key, d);
    let ga = this.gtag(key, d);

    /* eslint-disable no-console */
    if (process.env.NODE_ENV !== 'production')
      console.dir({'Track': [wt, ga]});
    /* eslint-enable no-console */

    return d;
  };

  /**
   * Data bus for tracking views in Webtrends and Google Analytics
   *
   * @param  {String}      app   The name of the Single Page Application to track
   * @param  {String}      key   The key or event of the data
   * @param  {Collection}  data  The data to track
   */
  view(app, key, data) {
    let wt = this.webtrends(key, data);
    let ga = this.gtagView(app, key);

    /* eslint-disable no-console */
    if (process.env.NODE_ENV !== 'production')
      console.dir({'Track': [wt, ga]});
    /* eslint-enable no-console */
  };

  /**
   * Push Events to Webtrends
   *
   * @param  {String}      key   The key or event of the data
   * @param  {Collection}  data  The data to track
   */
  webtrends(key, data) {
    if (
      typeof Webtrends === 'undefined' ||
      typeof data === 'undefined' ||
      !this.desinations.includes('webtrends')
    )
      return false;

    let event = [{
      'WT.ti': key
    }];

    if (data[0] && data[0].hasOwnProperty(Track.key))
      event.push({
        'DCS.dcsuri': data[0][Track.key]
      });
    else
      Object.assign(event, data);

    // Format data for Webtrends
    let wtd = {argsa: event.flatMap(e => {
      return Object.keys(e).flatMap(k => [k, e[k]]);
    })};

    // If 'action' is used as the key (for gtag.js), switch it to Webtrends
    let action = data.argsa.indexOf('action');

    if (action) data.argsa[action] = 'DCS.dcsuri';

    // Webtrends doesn't send the page view for MultiTrack, add path to url
    let dcsuri = data.argsa.indexOf('DCS.dcsuri');

    if (dcsuri)
      data.argsa[dcsuri + 1] = window.location.pathname + data.argsa[dcsuri + 1];

    /* eslint-disable no-undef */
    if (typeof Webtrends !== 'undefined')
      Webtrends.multiTrack(wtd);
    /* eslint-disable no-undef */

    return ['Webtrends', wtd];
  };

  /**
   * Push Click Events to Google Analytics
   *
   * @param  {String}      key   The key or event of the data
   * @param  {Collection}  data  The data to track
   */
  gtag(key, data) {
    if (
      typeof gtag === 'undefined' ||
      typeof data === 'undefined' ||
      !this.desinations.includes('gtag')
    )
      return false;

    let uri = data.find((element) => element.hasOwnProperty(Track.key));

    let event = {
      'event_category': key
    };

    /* eslint-disable no-undef */
    gtag(Track.key, uri[Track.key], event);
    /* eslint-enable no-undef */

    return ['gtag', Track.key, uri[Track.key], event];
  };

  /**
   * Push Screen View Events to Google Analytics
   *
   * @param  {String}  app  The name of the application
   * @param  {String}  key  The key or event of the data
   */
  gtagView(app, key) {
    if (
      typeof gtag === 'undefined' ||
      typeof data === 'undefined' ||
      !this.desinations.includes('gtag')
    )
      return false;

    let view = {
      app_name: app,
      screen_name: key
    };

    /* eslint-disable no-undef */
    gtag('event', 'screen_view', view);
    /* eslint-enable no-undef */

    return ['gtag', Track.key, 'screen_view', view];
  };
}

/** @type {String} The main selector to add the tracking function to */
Track.selector = '[data-js*="track"]';

/** @type {String} The main event tracking key to map to Webtrends DCS.uri */
Track.key = 'event';

/** @type {Array} What destinations to push data to */
Track.destinations = [
  'webtrends',
  'gtag'
];

export default Track;