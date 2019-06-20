var Forms = (function () {
  'use strict';

  /**
   * Utilities for Form components
   * @class
   */

  var Forms = function Forms() {
    return this;
  };
  /**
   * Takes a a string and returns whether or not the string is a valid email
   * by using native browser validation if available. Otherwise, does a simple
   * Regex test.
   * @param {string} email
   * @return {boolean}
   */


  Forms.prototype.validateEmail = function validateEmail(email) {
    var input = document.createElement('input');
    input.type = 'email';
    input.value = email;
    return typeof input.checkValidity === 'function' ? input.checkValidity() : /\S+@\S+\.\S+/.test(email);
  };
  /**
   * Map toggled checkbox values to an input.
   * @param{Object} event The parent click event.
   * @return {Element}    The target element.
   */


  Forms.prototype.joinValues = function joinValues(event) {
    if (!event.target.matches('input[type="checkbox"]')) {
      return;
    }

    if (!event.target.closest('[data-js-join-values]')) {
      return;
    }

    var el = event.target.closest('[data-js-join-values]');
    var target = document.querySelector(el.dataset.jsJoinValues);
    target.value = Array.from(el.querySelectorAll('input[type="checkbox"]')).filter(function (e) {
      return e.value && e.checked;
    }).map(function (e) {
      return e.value;
    }).join(', ');
    return target;
  };
  /**
   * A simple form validation class that uses native form validation. It will
   * add appropriate form feedback for each input that is invalid and native
   * localized browser messaging.
   *
   * See https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Form_validation
   * See https://caniuse.com/#feat=form-validation for support
   *
   * @param{Event}       event The form submission event.
   * @return {Event/Boolean}     The original event or false if invalid.
   */


  Forms.prototype.valid = function valid(event) {
    event.preventDefault();
    var validity = event.target.checkValidity();
    var elements = event.target.querySelectorAll('input[required="true"]');

    for (var i = 0; i < elements.length; i++) {
      // Remove old messaging if it exists
      var el = elements[i];
      var container = el.parentNode;
      var message = container.querySelector('.error-message');
      container.classList.remove('error');

      if (message) {
        message.remove();
      } // If this input valid, skip messaging


      if (el.validity.valid) {
        continue;
      } // Create the new error message.


      message = document.createElement('div'); // Get the error message from localized strings.

      if (el.validity.valueMissing) {
        message.innerHTML = Utility.localize('VALID_REQUIRED');
      } else if (!el.validity.valid) {
        message.innerHTML = Utility.localize("VALID_" + el.type.toUpperCase() + "_INVALID");
      } else {
        message.innerHTML = el.validationMessage;
      }

      message.setAttribute('aria-live', 'polite');
      message.classList.add('error-message'); // Add the error class and error message.

      container.classList.add('error');
      container.insertBefore(message, container.childNodes[0]);
    }

    return validity ? event : validity;
  };

  return Forms;

}());
