'use strict';

import Lib from './lib';

/**
 * The Autocomplete class.
 */
class Autocomplete {
  /**
   * @param  {object} settings This could be some configuration options.
   *                           for the pattern module.
   * @constructor
   */
  constructor(settings = {}) {
    this.library = new Lib({
      options: (settings.hasOwnProperty('options'))
        ? settings.options : Autocomplete.options,
      selected: (settings.hasOwnProperty('selected'))
        ? settings.selected : false,
      selector: (settings.hasOwnProperty('selector'))
        ? settings.selector : Autocomplete.selector,
      classname: (settings.hasOwnProperty('classname'))
        ? settings.classname : Autocomplete.classname,
    });

    return this;
  }

  /**
   * Setter for the Autocomplete options
   * @param  {object} reset Set of array options for the Autocomplete class
   * @return {object} Autocomplete object with new options.
   */
  options(reset) {
    this.library.settings.options = reset;
    return this;
  }

  /**
   * Setter for the Autocomplete strings
   * @param  {object}  localizedStrings  Object containing strings.
   * @return {object} Autocomplete strings
   */
  strings(localizedStrings) {
    Object.assign(this.library.STRINGS, localizedStrings);
    return this;
  }
}

/** @type {array} Default options for the autocomplete class */
Autocomplete.options = [];

/** @type {string} The search box dom selector */
Autocomplete.selector = '[data-js="input-autocomplete__input"]';

/** @type {string} The classname for the dropdown element */
Autocomplete.classname = 'input-autocomplete__dropdown';

export default Autocomplete;
