var Forms = (function () {
  'use strict';

  /**
   * Uses the Share API to t
   */

  var WebShare = function WebShare(s) {
    var this$1 = this;
    if (s === void 0) s = {};
    this.selector = s.selector ? s.selector : WebShare.selector;
    this.callback = s.callback ? s.callback : WebShare.callback;
    this.fallback = s.fallback ? s.fallback : WebShare.fallback;

    if (navigator.share) {
      // Remove fallback aria toggling attributes
      document.querySelectorAll(this.selector).forEach(function (item) {
        item.removeAttribute('aria-controls');
        item.removeAttribute('aria-expanded');
      }); // Add event listener for the share click

      document.querySelector('body').addEventListener('click', function (event) {
        if (!event.target.matches(this$1.selector)) {
          return;
        }

        this$1.element = event.target;
        this$1.data = JSON.parse(this$1.element.dataset.webShare);
        this$1.share(this$1.data);
      });
    } else {
      this.fallback();
    } // Execute the fallback


    return this;
  };
  /**
   * Web Share API handler
   *
   * @param {Object}dataAn object containing title, url, and text.
   *
   * @return{Promise}     The response of the .share() method.
   */


  WebShare.prototype.share = function share(data) {
    var this$1 = this;
    if (data === void 0) data = {};
    return navigator.share(data).then(function (res) {
      this$1.callback(data);
    }).catch(function (err) {
      if (process.env.NODE_ENV !== 'production') {
        console.dir(err);
      }
    });
  };
  /** The html selector for the component */


  WebShare.selector = '[data-js*="web-share"]';
  /** Placeholder callback for a successful send */

  WebShare.callback = function () {
    if (process.env.NODE_ENV !== 'production') {
      console.dir('Success!');
    }
  };
  /** Placeholder for the WebShare fallback */


  WebShare.fallback = function () {
    if (process.env.NODE_ENV !== 'production') {
      console.dir('Fallback!');
    }
  };

  return WebShare;

}());
