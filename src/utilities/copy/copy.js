'use strict';

/**
 * Copy to Clipboard Helper
 */
class Copy {
  /**
   * Add event listeners
   *
   * @constructor
   */
  constructor() {
    // Set attributes
    this.selector = Copy.selector;

    this.aria = Copy.aria;

    this.notifyTimeout = Copy.notifyTimeout;

    // Select the entire text when it's focused on
    document.querySelectorAll(Copy.selectors.TARGETS).forEach(item => {
      item.addEventListener('focus', () => this.select(item));
      item.addEventListener('click', () => this.select(item));
    });

    // The main click event for the class
    document.querySelector('body').addEventListener('click', event => {
      if (!event.target.matches(this.selector))
        return;

      this.element = event.target;

      this.element.setAttribute(this.aria, false);

      this.target = this.element.dataset.copy;

      if (this.copy(this.target)) {
        this.element.setAttribute(this.aria, true);

        clearTimeout(this.element['timeout']);

        this.element['timeout'] = setTimeout(() => {
          this.element.setAttribute(this.aria, false);
        }, this.notifyTimeout);
      }
    });

    return this;
  }

  /**
   * The click event handler
   *
   * @param   {String}  target  Content of target data attribute
   *
   * @return  {Boolean}         Wether copy was successful or not
   */
  copy(target) {
    let selector = Copy.selectors.TARGETS.replace(']', `="${target}"]`);

    let input = document.querySelector(selector);

    this.select(input);

    if (navigator.clipboard && navigator.clipboard.writeText)
      navigator.clipboard.writeText(input.value);
    else if (document.execCommand)
      document.execCommand('copy');
    else
      return false;

    return true;
  }

  /**
   * Handler for the text selection method
   *
   * @param   {Object}  input  The input with content to select
   */
  select(input) {
    input.select();

    input.setSelectionRange(0, 99999);
  }
}

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

export default Copy;
