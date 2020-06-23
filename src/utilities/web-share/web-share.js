'use strict';

/**
 * Uses the Share API to t
 */
class WebShare {
  /**
   * @constructor
   */
  constructor(s = {}) {
    this.selector = (s.selector) ? s.selector : WebShare.selector;

    this.callback = (s.callback) ? s.callback : WebShare.callback;

    this.fallback = (s.fallback) ? s.fallback : WebShare.fallback;

    if (navigator.share) {
      // Remove fallback aria toggling attributes
      document.querySelectorAll(this.selector).forEach(item => {
        item.removeAttribute('aria-controls');
        item.removeAttribute('aria-expanded');
      });

      // Add event listener for the share click
      document.querySelector('body').addEventListener('click', event => {
        if (!event.target.matches(this.selector))
          return;

        this.element = event.target;

        this.data = JSON.parse(this.element.dataset.webShare);

        this.share(this.data);
      });
    } else
      this.fallback(); // Execute the fallback

    return this;
  }

  /**
   * Web Share API handler
   *
   * @param   {Object}  data  An object containing title, url, and text.
   *
   * @return  {Promise}       The response of the .share() method.
   */
  share(data = {}) {
    return navigator.share(data)
      .then(res => {
        this.callback(data);
      }).catch(err => {
        if (process.env.NODE_ENV !== 'production')
          console.dir(err);
      });
  }
}

/** The html selector for the component */
WebShare.selector = '[data-js*="web-share"]';

/** Placeholder callback for a successful send */
WebShare.callback = () => {
  if (process.env.NODE_ENV !== 'production')
    console.dir('Success!');
};

/** Placeholder for the WebShare fallback */
WebShare.fallback = () => {
  if (process.env.NODE_ENV !== 'production')
    console.dir('Fallback!');
}

export default WebShare;
