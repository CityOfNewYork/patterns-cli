'use strict';

/**
 * The Simple Toggle class. This will toggle the class 'active' and 'hidden'
 * on target elements, determined by a click event on a selected link or
 * element. This will also toggle the aria-hidden attribute for targeted
 * elements to support screen readers. Target settings and other functionality
 * can be controlled through data attributes.
 *
 * This uses the .matches() method which will require a polyfill for IE
 * https://polyfill.io/v2/docs/features/#Element_prototype_matches
 *
 * Basic Usage;
 *
 * javascript:
 *   new Toggle().init();
 *
 * Toggling Anchor links:
 *   <a data-js='toggle' href='#main-menu'>Menu</a>
 *   <div id='main-menu' aria-hidden='true'> ... </div>
 *
 * Toggling aria-control elements:
 *
 *   <button data-js='toggle' aria-controls='#main-menu' aria-pressed='false'>
 *      Menu
 *   </button>
 *   <div id='main-menu' aria-hidden='true'> ... </div>
 *
 * Create "Undo" Event (to close a dialogue);
 *   <a href='#main-menu' data-js='toggle' data-toggle-undo='#close'>Menu</a>
 *   <div id='main-menu' aria-hidden='true'>
 *     <a id="close">Close</a>
 *   </div>
 * @class
 */
class Toggle {
  /**
   * @constructor
   * @param  {object} s Settings for this Toggle instance
   * @return {object}   The class
   */
  constructor(s) {
    const body = document.querySelector('body');

    s = (!s) ? {} : s;

    this._settings = {
      selector: (s.selector) ? s.selector : Toggle.selector,
      namespace: (s.namespace) ? s.namespace : Toggle.namespace,
      inactiveClass: (s.inactiveClass) ? s.inactiveClass : Toggle.inactiveClass,
      activeClass: (s.activeClass) ? s.activeClass : Toggle.activeClass,
    };

    body.addEventListener('click', (event) => {
      if (!event.target.matches(this._settings.selector))
        return;

      event.preventDefault();

      this._toggle(event);
    });

    return this;
  }

  /**
   * Logs constants to the debugger
   * @param  {object} event  The main click event
   * @return {object}        The class
   */
  _toggle(event) {
    let el = event.target;
    let target = false;

    /** Anchor Links */
    target = (el.getAttribute('href')) ?
      document.querySelector(el.getAttribute('href')) : target;

    /** Toggle Controls */
    // console.dir(el.getAttribute('aria-controls'));
    target = (el.getAttribute('aria-controls')) ?
      document.querySelector(`#${el.getAttribute('aria-controls')}`) : target;

    /** Main Functionality */
    if (!target) return this;
    this.elementToggle(el, target);

    /** Undo */
    if (el.dataset[`${this._settings.namespace}Undo`]) {
      const undo = document.querySelector(
        el.dataset[`${this._settings.namespace}Undo`]
      );

      undo.addEventListener('click', (event) => {
        event.preventDefault();
        this.elementToggle(el, target);
        undo.removeEventListener('click');
      });
    }

    return this;
  }

  /**
   * The main toggling method
   * @param  {object} el     The current element to toggle active
   * @param  {object} target The target element to toggle active/hidden
   * @return {object}        The class
   */
  elementToggle(el, target) {
    if (this._settings.activeClass !== '') {
      el.classList.toggle(this._settings.activeClass);
      target.classList.toggle(this._settings.activeClass);
    }

    if (this._settings.inactiveClass !== '') {
      target.classList.toggle(this._settings.inactiveClass);
    }

    // Check the element for defined aria roles and toggle them if they exist
    for (let i = 0; i < Toggle.elAriaRoles.length; i++) {
      if (el.getAttribute(Toggle.elAriaRoles[i]))
        el.setAttribute(Toggle.elAriaRoles[i],
          !(el.getAttribute(Toggle.elAriaRoles[i]) === 'true'));
    }

    // Check the target for defined aria roles and toggle them if they exist
    for (let i = 0; i < Toggle.targetAriaRoles.length; i++) {
      if (target.getAttribute(Toggle.targetAriaRoles[i]))
        target.setAttribute(Toggle.targetAriaRoles[i],
          !(target.getAttribute(Toggle.targetAriaRoles[i]) === 'true'));
    }

    if (
      el.getAttribute('href') &&
      target.classList.contains(this._settings.activeClass))
    {
      window.location.hash = '';
      window.location.hash = el.getAttribute('href');
    }

    return this;
  }
}

/** @type {String} The main selector to add the toggling function to */
Toggle.selector = '[data-js*="toggle"]';

/** @type {String} The namespace for our data attribute settings */
Toggle.namespace = 'toggle';

/** @type {String} The hide class */
Toggle.inactiveClass = 'hidden';

/** @type {String} The active class */
Toggle.activeClass = 'active';

/** @type {Array} Aria roles to toggle true/false on the toggling element */
Toggle.elAriaRoles = ['aria-pressed', 'aria-expanded'];

/** @type {Array} Aria roles to toggle true/false on the target element */
Toggle.targetAriaRoles = ['aria-hidden'];

export default Toggle;