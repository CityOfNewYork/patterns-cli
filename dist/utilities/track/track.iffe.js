var Track = (function () {
  'use strict';

  /**
   * Tracking bus for Google analytics and Webtrends.
   */

  var Track = function Track(s) {
    var this$1 = this;
    var body = document.querySelector('body');
    s = !s ? {} : s;
    this._settings = {
      selector: s.selector ? s.selector : Track.selector
    };
    this.desinations = Track.destinations;
    body.addEventListener('click', function (event) {
      if (!event.target.matches(this$1._settings.selector)) {
        return;
      }

      var key = event.target.dataset.trackKey;
      var data = JSON.parse(event.target.dataset.trackData);
      this$1.track(key, data);
    });
    return this;
  };
  /**
   * Tracking function wrapper
   *
   * @param{String}    key The key or event of the data
   * @param{Collection}dataThe data to track
   *
   * @return {Object}          The final data object
   */


  Track.prototype.track = function track(key, data) {
    // Set the path name based on the location
    var d = data.map(function (el) {
      if (el.hasOwnProperty(Track.key)) {
        el[Track.key] = window.location.pathname + "/" + el[Track.key];
      }

      return el;
    });
    var wt = this.webtrends(key, d);
    var ga = this.gtag(key, d);
    /* eslint-disable no-console */

    if (process.env.NODE_ENV !== 'production') {
      console.dir({
        'Track': [wt, ga]
      });
    }
    /* eslint-enable no-console */


    return d;
  };
  /**
   * Data bus for tracking views in Webtrends and Google Analytics
   *
   * @param{String}    app The name of the Single Page Application to track
   * @param{String}    key The key or event of the data
   * @param{Collection}dataThe data to track
   */

  Track.prototype.view = function view(app, key, data) {
    var wt = this.webtrends(key, data);
    var ga = this.gtagView(app, key);
    /* eslint-disable no-console */

    if (process.env.NODE_ENV !== 'production') {
      console.dir({
        'Track': [wt, ga]
      });
    }
    /* eslint-enable no-console */

  };
  /**
   * Push Events to Webtrends
   *
   * @param{String}    key The key or event of the data
   * @param{Collection}dataThe data to track
   */

  Track.prototype.webtrends = function webtrends(key, data) {
    if (typeof Webtrends === 'undefined' || typeof data === 'undefined' || !this.desinations.includes('webtrends')) {
      return false;
    }

    var event = [{
      'WT.ti': key
    }];

    if (data[0] && data[0].hasOwnProperty(Track.key)) {
      event.push({
        'DCS.dcsuri': data[0][Track.key]
      });
    } else {
      Object.assign(event, data);
    } // Format data for Webtrends


    var wtd = {
      argsa: event.flatMap(function (e) {
        return Object.keys(e).flatMap(function (k) {
          return [k, e[k]];
        });
      })
    }; // If 'action' is used as the key (for gtag.js), switch it to Webtrends

    var action = data.argsa.indexOf('action');

    if (action) {
      data.argsa[action] = 'DCS.dcsuri';
    } // Webtrends doesn't send the page view for MultiTrack, add path to url


    var dcsuri = data.argsa.indexOf('DCS.dcsuri');

    if (dcsuri) {
      data.argsa[dcsuri + 1] = window.location.pathname + data.argsa[dcsuri + 1];
    }
    /* eslint-disable no-undef */


    if (typeof Webtrends !== 'undefined') {
      Webtrends.multiTrack(wtd);
    }
    /* eslint-disable no-undef */


    return ['Webtrends', wtd];
  };
  /**
   * Push Click Events to Google Analytics
   *
   * @param{String}    key The key or event of the data
   * @param{Collection}dataThe data to track
   */

  Track.prototype.gtag = function gtag$1(key, data) {
    if (typeof gtag === 'undefined' || typeof data === 'undefined' || !this.desinations.includes('gtag')) {
      return false;
    }

    var uri = data.find(function (element) {
      return element.hasOwnProperty(Track.key);
    });
    var event = {
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
   * @param{String}appThe name of the application
   * @param{String}keyThe key or event of the data
   */

  Track.prototype.gtagView = function gtagView(app, key) {
    if (typeof gtag === 'undefined' || typeof data === 'undefined' || !this.desinations.includes('gtag')) {
      return false;
    }

    var view = {
      app_name: app,
      screen_name: key
    };
    /* eslint-disable no-undef */

    gtag('event', 'screen_view', view);
    /* eslint-enable no-undef */

    return ['gtag', Track.key, 'screen_view', view];
  };
  /** @type {String} The main selector to add the tracking function to */


  Track.selector = '[data-js*="track"]';
  /** @type {String} The main event tracking key to map to Webtrends DCS.uri */

  Track.key = 'event';
  /** @type {Array} What destinations to push data to */

  Track.destinations = ['webtrends', 'gtag'];

  return Track;

}());
