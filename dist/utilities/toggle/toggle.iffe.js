var Toggle = (function () {
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
   * @class
   */

  var Toggle = function Toggle(s) {
    var this$1 = this; // Create an object to store existing toggle listeners (if it doesn't exist)

    if (!window.hasOwnProperty(Toggle.callback)) {
      window[Toggle.callback] = [];
    }

    s = !s ? {} : s;
    this.settings = {
      selector: s.selector ? s.selector : Toggle.selector,
      namespace: s.namespace ? s.namespace : Toggle.namespace,
      inactiveClass: s.inactiveClass ? s.inactiveClass : Toggle.inactiveClass,
      activeClass: s.activeClass ? s.activeClass : Toggle.activeClass,
      before: s.before ? s.before : false,
      after: s.after ? s.after : false
    }; // Store the element for potential use in callbacks

    this.element = s.element ? s.element : false;

    if (this.element) {
      this.element.addEventListener('click', function (event) {
        this$1.toggle(event);
      });
    } else {
      // If there isn't an existing instantiated toggle, add the event listener.
      if (!window[Toggle.callback].hasOwnProperty(this.settings.selector)) {
        var body = document.querySelector('body');

        for (var i = 0; i < Toggle.events.length; i++) {
          var tggleEvent = Toggle.events[i];
          body.addEventListener(tggleEvent, function (event) {
            if (!event.target.matches(this$1.settings.selector)) {
              return;
            }

            this$1.event = event;
            var type = event.type.toUpperCase();

            if (this$1[event.type] && Toggle.elements[type] && Toggle.elements[type].includes(event.target.tagName)) {
              this$1[event.type](event);
            }
          });
        }
      }
    } // Record that a toggle using this selector has been instantiated. This
    // prevents double toggling.


    window[Toggle.callback][this.settings.selector] = true;
    return this;
  };
  /**
   * Click event handler
   *
   * @param{Event}eventThe original click event
   */


  Toggle.prototype.click = function click(event) {
    this.toggle(event);
  };
  /**
   * Input/select/textarea change event handler. Checks to see if the
   * event.target is valid then toggles accordingly.
   *
   * @param{Event}eventThe original input change event
   */


  Toggle.prototype.change = function change(event) {
    var valid = event.target.checkValidity();

    if (valid && !this.isActive(event.target)) {
      this.toggle(event); // show
    } else if (!valid && this.isActive(event.target)) {
      this.toggle(event); // hide
    }
  };
  /**
   * Check to see if the toggle is active
   *
   * @param{Object}elThe toggle element (trigger)
   */


  Toggle.prototype.isActive = function isActive(el) {
    var active = false;

    if (this.settings.activeClass) {
      active = el.classList.contains(this.settings.activeClass);
    } // if () {
    // Toggle.elementAriaRoles
    // Add catch to see if element aria roles are toggled
    // }
    // if () {
    // Toggle.targetAriaRoles
    // Add catch to see if target aria roles are toggled
    // }


    return active;
  };
  /**
   * Get the target of the toggle element (trigger)
   *
   * @param{Object}elThe toggle element (trigger)
   */


  Toggle.prototype.getTarget = function getTarget(el) {
    var target = false;
    /** Anchor Links */

    target = el.hasAttribute('href') ? document.querySelector(el.getAttribute('href')) : target;
    /** Toggle Controls */

    target = el.hasAttribute('aria-controls') ? document.querySelector("#" + el.getAttribute('aria-controls')) : target;
    return target;
  };
  /**
   * The toggle event proxy for getting and setting the element/s and target
   *
   * @param{Object}eventThe main click event
   *
   * @return {Object}       The class
   */


  Toggle.prototype.toggle = function toggle(event) {
    var this$1 = this;
    var el = event.target;
    var target = false;
    var focusable = [];
    event.preventDefault();
    target = this.getTarget(el);
    /** Focusable Children */

    focusable = target ? target.querySelectorAll(Toggle.elFocusable.join(', ')) : focusable;
    /** Main Functionality */

    if (!target) {
      return this;
    }

    this.elementToggle(el, target, focusable);
    /** Undo */

    if (el.dataset[this.settings.namespace + "Undo"]) {
      var undo = document.querySelector(el.dataset[this.settings.namespace + "Undo"]);
      undo.addEventListener('click', function (event) {
        event.preventDefault();
        this$1.elementToggle(el, target);
        undo.removeEventListener('click');
      });
    }

    return this;
  };
  /**
   * The main toggling method for attributes
   *
   * @param{Object}  el       The current element to toggle active
   * @param{Object}  target   The target element to toggle active/hidden
   * @param{NodeList}focusableAny focusable children in the target
   *
   * @return {Object}        The class
   */


  Toggle.prototype.elementToggle = function elementToggle(el, target, focusable) {
    var this$1 = this;
    if (focusable === void 0) focusable = [];
    var i = 0;
    var attr = '';
    var value = ''; // Get other toggles that might control the same element

    var others = document.querySelectorAll("[aria-controls=\"" + el.getAttribute('aria-controls') + "\"]"); // Store elements for potential use in callbacks

    this.element = el;
    this.target = target;
    this.others = others;
    this.focusable = focusable;
    /**
     * Toggling before hook
     */

    if (this.settings.before) {
      this.settings.before(this);
    }
    /**
     * Toggle Element and Target classes
     */


    if (this.settings.activeClass) {
      el.classList.toggle(this.settings.activeClass);
      target.classList.toggle(this.settings.activeClass); // If there are other toggles that control the same element

      if (others) {
        others.forEach(function (other) {
          if (other !== el) {
            other.classList.toggle(this$1.settings.activeClass);
          }
        });
      }
    }

    if (this.settings.inactiveClass) {
      target.classList.toggle(this.settings.inactiveClass);
    }
    /**
     * Target Element Aria Attributes
     */


    for (i = 0; i < Toggle.targetAriaRoles.length; i++) {
      attr = Toggle.targetAriaRoles[i];
      value = target.getAttribute(attr);

      if (value != '' && value) {
        target.setAttribute(attr, value === 'true' ? 'false' : 'true');
      }
    }
    /**
     * Hide the Toggle Target's focusable children from focus.
     * If an element has the data-attribute 'data-toggle-tabindex', use that
     * as the default tab index of the element.
     */


    focusable.forEach(function (el) {
      var tabindex = el.getAttribute('tabindex');

      if (tabindex === '-1') {
        var dataDefault = el.getAttribute("data-" + Toggle.namespace + "-tabindex");

        if (dataDefault) {
          el.setAttribute('tabindex', dataDefault);
        } else {
          el.removeAttribute('tabindex');
        }
      } else {
        el.setAttribute('tabindex', '-1');
      }
    });
    /**
     * Jump to Target Element (if Toggle Element is an anchor link).
     */

    if (el.hasAttribute('href')) {
      // Reset the history state, this will clear out
      // the hash when the jump item is toggled closed.
      history.pushState('', '', window.location.pathname + window.location.search); // Target element toggle.

      if (target.classList.contains(this.settings.activeClass)) {
        window.location.hash = el.getAttribute('href');
        target.setAttribute('tabindex', '-1');
        target.focus({
          preventScroll: true
        });
      } else {
        target.removeAttribute('tabindex');
      }
    }
    /**
     * Toggle Element (including multi toggles) Aria Attributes
     */


    for (i = 0; i < Toggle.elAriaRoles.length; i++) {
      attr = Toggle.elAriaRoles[i];
      value = el.getAttribute(attr);

      if (value != '' && value) {
        el.setAttribute(attr, value === 'true' ? 'false' : 'true');
      } // If there are other toggles that control the same element


      if (others) {
        others.forEach(function (other) {
          if (other !== el && other.getAttribute(attr)) {
            other.setAttribute(attr, value === 'true' ? 'false' : 'true');
          }
        });
      }
    }
    /**
     * Toggling complete hook.
     */


    if (this.settings.after) {
      this.settings.after(this);
    }

    return this;
  };
  /** @type  {String}  The main selector to add the toggling function to */


  Toggle.selector = '[data-js*="toggle"]';
  /** @type  {String}  The namespace for our data attribute settings */

  Toggle.namespace = 'toggle';
  /** @type  {String}  The hide class */

  Toggle.inactiveClass = 'hidden';
  /** @type  {String}  The active class */

  Toggle.activeClass = 'active';
  /** @type  {Array}  Aria roles to toggle true/false on the toggling element */

  Toggle.elAriaRoles = ['aria-pressed', 'aria-expanded'];
  /** @type  {Array}  Aria roles to toggle true/false on the target element */

  Toggle.targetAriaRoles = ['aria-hidden'];
  /** @type  {Array}  Focusable elements to hide within the hidden target element */

  Toggle.elFocusable = ['a', 'button', 'input', 'select', 'textarea', 'object', 'embed', 'form', 'fieldset', 'legend', 'label', 'area', 'audio', 'video', 'iframe', 'svg', 'details', 'table', '[tabindex]', '[contenteditable]', '[usemap]'];
  /** @type  {Array}  Key attribute for storing toggles in the window */

  Toggle.callback = ['TogglesCallback'];
  /** @type  {Array}  Default events to to watch for toggling. Each must have a handler in the class and elements to look for in Toggle.elements */

  Toggle.events = ['click', 'change'];
  /** @type  {Array}  Elements to delegate to each event handler */

  Toggle.elements = {
    CLICK: ['A', 'BUTTON'],
    CHANGE: ['SELECT', 'INPUT', 'TEXTAREA']
  };

  return Toggle;

}());
