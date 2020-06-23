var Forms = (function () {
  'use strict';

  /**
   * Copy to Clipboard Helper
   */

  var Copy = function Copy() {
    var this$1 = this; // Set attributes

    this.selector = Copy.selector;
    this.aria = Copy.aria;
    this.notifyTimeout = Copy.notifyTimeout; // Select the entire text when it's focused on

    document.querySelectorAll(Copy.selectors.TARGETS).forEach(function (item) {
      item.addEventListener('focus', function () {
        return this$1.select(item);
      });
      item.addEventListener('click', function () {
        return this$1.select(item);
      });
    }); // The main click event for the class

    document.querySelector('body').addEventListener('click', function (event) {
      if (!event.target.matches(this$1.selector)) {
        return;
      }

      this$1.element = event.target;
      this$1.element.setAttribute(this$1.aria, false);
      this$1.target = this$1.element.dataset.copy;

      if (this$1.copy(this$1.target)) {
        this$1.element.setAttribute(this$1.aria, true);
        clearTimeout(this$1.element['timeout']);
        this$1.element['timeout'] = setTimeout(function () {
          this$1.element.setAttribute(this$1.aria, false);
        }, this$1.notifyTimeout);
      }
    });
    return this;
  };
  /**
   * The click event handler
   *
   * @param {String}targetContent of target data attribute
   *
   * @return{Boolean}       Wether copy was successful or not
   */


  Copy.prototype.copy = function copy(target) {
    var selector = Copy.selectors.TARGETS.replace(']', "=\"" + target + "\"]");
    var input = document.querySelector(selector);
    this.select(input);

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(input.value);
    } else if (document.execCommand) {
      document.execCommand('copy');
    } else {
      return false;
    }

    return true;
  };
  /**
   * Handler for the text selection method
   *
   * @param {Object}inputThe input with content to select
   */


  Copy.prototype.select = function select(input) {
    input.select();
    input.setSelectionRange(0, 99999);
  };
  /** The main element selector */


  Copy.selector = '[data-js*="copy"]';
  /** Class selectors */

  Copy.selectors = {
    TARGETS: '[data-copy-target]'
  };
  /** Button aria role to toggle */

  Copy.aria = 'aria-pressed';
  /** Timeout for the "Copied!" notification */

  Copy.notifyTimeout = 1500;

  return Copy;

}());
