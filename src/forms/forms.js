'use strict';

/**
 * Utilities for Form components
 * @class
 */
class Forms {
  /**
   * The Form constructor
   * @return {object} The class
   */
  constructor() {
    /** Strings can be passed to the constructor */
    this.STRINGS = Forms.strings;

    return this;
  }

  /**
   * Takes a a string and returns whether or not the string is a valid email
   * by using native browser validation if available. Otherwise, does a simple
   * Regex test.
   * @param {string} email
   * @return {boolean}
   */
  validateEmail(email) {
    const input = document.createElement('input');
    input.type = 'email';
    input.value = email;

    return typeof input.checkValidity === 'function' ?
      input.checkValidity() : /\S+@\S+\.\S+/.test(email);
  }

  /**
   * Map toggled checkbox values to an input.
   * @param  {Object} event The parent click event.
   * @return {Element}      The target element.
   */
  joinValues(event) {
    if (!event.target.matches('input[type="checkbox"]'))
      return;

    if (!event.target.closest('[data-js-join-values]'))
      return;

    let el = event.target.closest('[data-js-join-values]');
    let target = document.querySelector(el.dataset.jsJoinValues);

    target.value = Array.from(
        el.querySelectorAll('input[type="checkbox"]')
      )
      .filter((e) => (e.value && e.checked))
      .map((e) => e.value)
      .join(', ');

    return target;
  }

  /**
   * A simple form validation class that uses native form validation. It will
   * add appropriate form feedback for each input that is invalid and native
   * localized browser messaging.
   *
   * See https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Form_validation
   * See https://caniuse.com/#feat=form-validation for support
   *
   * @param  {Event}         event The form submission event.
   * @return {Event/Boolean}       The original event or false if invalid.
   */
  valid(event) {
    event.preventDefault();

    let validity = event.target.checkValidity();
    let elements = event.target.querySelectorAll('input[required="true"]');

    for (let i = 0; i < elements.length; i++) {
      // Remove old messaging if it exists
      let el = elements[i];
      let container = el.parentNode;
      let message = container.querySelector('.error-message');

      container.classList.remove('error');
      if (message) message.remove();

      // If this input valid, skip messaging
      if (el.validity.valid) continue;

      // Create the new error message.
      message = document.createElement('div');

      // Get the error message from localized strings.
      if (el.validity.valueMissing &&
        this.STRINGS.VALID_REQUIRED) {
        message.innerHTML = this.STRINGS.VALID_REQUIRED;
      } else if (!el.validity.valid &&
        this.STRINGS[`VALID_${el.type.toUpperCase()}_INVALID`]) {
        let stringKey = `VALID_${el.type.toUpperCase()}_INVALID`;
        message.innerHTML = this.STRINGS[stringKey];
      } else {
        message.innerHTML = el.validationMessage;
      }

      message.setAttribute('aria-live', 'polite');
      message.classList.add('error-message');

      // Add the error class and error message.
      container.classList.add('error');
      container.insertBefore(message, container.childNodes[0]);
    }

    return (validity) ? event : validity;
  }

  /**
   * A function to assign pre localized strings to the class.
   * @param  {object} localizedStrings A dictionairy of strings in the format
   *                                   'VALID_REQUIRED': 'This is required',
   *                                   'VALID_{{ TYPE }}_INVALID': 'Invalid'
   * @return {class}                   The object class
   */
  strings(localizedStrings) {
    Object.assign(this.STRINGS, localizedStrings);

    return this;
  }
}

/**
 * A dictionairy of strings in the format.
 * {
 *   'VALID_REQUIRED': 'This is required',
 *   'VALID_{{ TYPE }}_INVALID': 'Invalid'
 * }
 */
Forms.strings = {};

export default Forms;