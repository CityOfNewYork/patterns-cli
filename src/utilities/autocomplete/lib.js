/* eslint-env browser */
'use strict';

import jaroWinkler from './jaroWinkler.js';
import memoize from './memoize.js';

/**
 * Autocomplete for autocomplete.
 * Forked and modified from https://github.com/xavi/miss-plete
 */
class Lib {
  /**
   * @param   {object} settings  Configuration options
   * @return  {this}             The class
   * @constructor
   */
  constructor(settings = {}) {
    this.settings = {
      'selector': settings.selector, // required
      'options': settings.options, // required
      'classname': settings.classname, // required
      'selected': (settings.hasOwnProperty('selected')) ?
        settings.selected : false,
      'score': (settings.hasOwnProperty('score')) ?
        settings.score : memoize(Autocomplete.score),
      'listItem': (settings.hasOwnProperty('listItem')) ?
        settings.listItem : Autocomplete.listItem,
      'getSiblingIndex': (settings.hasOwnProperty('getSiblingIndex')) ?
        settings.getSiblingIndex : Autocomplete.getSiblingIndex
    };

    this.scoredOptions = null;
    this.container = null;
    this.ul = null;
    this.highlighted = -1;

    this.SELECTORS = Autocomplete.selectors;
    this.STRINGS = Autocomplete.strings;
    this.MAX_ITEMS = Autocomplete.maxItems;

    window.addEventListener('keydown', (e) => {
      this.keydownEvent(e);
    });

    window.addEventListener('keyup', (e) => {
      this.keyupEvent(e);
    });

    window.addEventListener('input', (e) => {
      this.inputEvent(e);
    });

    let body = document.querySelector('body');

    body.addEventListener('focus', (e) => {
      this.focusEvent(e);
    }, true);

    body.addEventListener('blur', (e) => {
      this.blurEvent(e);
    }, true);

    return this;
  }

  /**
   * EVENTS
   */

  /**
   * The input focus event
   * @param   {object}  event  The event object
   */
  focusEvent(event) {
    if (!event.target.matches(this.settings.selector)) return;

    this.input = event.target;

    if (this.input.value === '')
      this.message('INIT');
  }

  /**
   * The input keydown event
   * @param   {object}  event  The event object
   */
  keydownEvent(event) {
    if (!event.target.matches(this.settings.selector)) return;
    this.input = event.target;

    if (this.ul)
      switch (event.keyCode) {
        case 13: this.keyEnter(event);
          break;
        case 27: this.keyEscape(event);
          break;
        case 40: this.keyDown(event);
          break;
        case 38: this.keyUp(event);
          break;
      }
  }

  /**
   * The input keyup event
   * @param   {object}  event  The event object
   */
  keyupEvent(event) {
    if (!event.target.matches(this.settings.selector))
      return;

    this.input = event.target;
  }

  /**
   * The input event
   * @param   {object}  event  The event object
   */
  inputEvent(event) {
    if (!event.target.matches(this.settings.selector))
      return;

    this.input = event.target;

    if (this.input.value.length > 0)
      this.scoredOptions = this.settings.options
        .map((option) => this.settings.score(this.input.value, option))
        .sort((a, b) => b.score - a.score);
    else
      this.scoredOptions = [];

    this.dropdown();
  }

  /**
   * The input blur event
   * @param   {object}  event  The event object
   */
  blurEvent(event) {
    if (event.target === window ||
          !event.target.matches(this.settings.selector))
      return;

    this.input = event.target;

    if (this.input.dataset.persistDropdown === 'true')
      return;

    this.remove();
    this.highlighted = -1;
  }

  /**
   * KEY INPUT EVENTS
   */

  /**
   * What happens when the user presses the down arrow
   * @param   {object}  event  The event object
   * @return  {object}         The Class
   */
  keyDown(event) {
    event.preventDefault();

    this.highlight((this.highlighted < this.ul.children.length - 1) ?
        this.highlighted + 1 : -1
      );

    return this;
  }

  /**
   * What happens when the user presses the up arrow
   * @param   {object}  event  The event object
   * @return  {object}         The Class
   */
  keyUp(event) {
    event.preventDefault();

    this.highlight((this.highlighted > -1) ?
        this.highlighted - 1 : this.ul.children.length - 1
      );

    return this;
  }

  /**
   * What happens when the user presses the enter key
   * @param   {object}  event  The event object
   * @return  {object}         The Class
   */
  keyEnter(event) {
    this.selected();
    return this;
  }

  /**
   * What happens when the user presses the escape key
   * @param   {object}  event  The event object
   * @return  {object}         The Class
   */
  keyEscape(event) {
    this.remove();
    return this;
  }

  /**
   * STATIC
   */

  /**
   * It must return an object with at least the properties 'score'
   * and 'displayValue.' Default is a Jaro–Winkler similarity function.
   * @param  {array}  value
   * @param  {array}  synonyms
   * @return {int}    Score or displayValue
   */
  static score(value, synonyms) {
    let closestSynonym = null;

    synonyms.forEach((synonym) => {
      let similarity = jaroWinkler(
          synonym.trim().toLowerCase(),
          value.trim().toLowerCase()
        );

      if (closestSynonym === null || similarity > closestSynonym.similarity) {
        closestSynonym = {similarity, value: synonym};
        if (similarity === 1) return;
      }
    });

    return {
      score: closestSynonym.similarity,
      displayValue: synonyms[0]
    };
  }

  /**
   * List item for dropdown list.
   * @param  {Number}  scoredOption
   * @param  {Number}  index
   * @return {string}  The a list item <li>.
   */
  static listItem(scoredOption, index, maxItems) {
    const normalizedIndex = index + 1; // start at 1

    const li = (normalizedIndex > maxItems) ?
      null : document.createElement('li');

    if (li) {
      li.setAttribute('role', 'option');
      li.setAttribute('tabindex', '-1');
      li.setAttribute('aria-selected', 'false');
    }

    li && li.appendChild(document.createTextNode(scoredOption.displayValue));

    return li;
  }

  /**
   * Get index of previous element.
   * @param  {array}   node
   * @return {number}  index of previous element.
   */
  static getSiblingIndex(node) {
    let index = -1;
    let n = node;

    do {
      index++; n = n.previousElementSibling;
    }
    while (n);

    return index;
  }

  /**
   * PUBLIC METHODS
   */

  /**
   * Display options as a list.
   * @return  {object} The Class
   */
  dropdown() {
    const documentFragment = document.createDocumentFragment();

    this.scoredOptions.every((scoredOption, i) => {
      let listItem = this.settings.listItem(scoredOption, i, this.MAX_ITEMS);

      listItem && documentFragment.appendChild(listItem);
      return !!listItem;
    });

    this.remove();
    this.highlighted = -1;

    if (documentFragment.hasChildNodes()) {
      const newUl = document.createElement('ul');

      newUl.setAttribute('role', 'listbox');
      newUl.setAttribute('tabindex', '0');
      newUl.setAttribute('id', this.SELECTORS.OPTIONS);

      newUl.addEventListener('mouseover', (event) => {
        if (event.target.tagName === 'LI')
          this.highlight(this.settings.getSiblingIndex(event.target));
      });

      newUl.addEventListener('mousedown', (event) =>
        event.preventDefault());

      newUl.addEventListener('click', (event) => {
        if (event.target.tagName === 'LI')
          this.selected();
      });

      newUl.appendChild(documentFragment);

      // See CSS to understand why the <ul> has to be wrapped in a <div>
      const newContainer = document.createElement('div');

      newContainer.className = this.settings.classname;
      newContainer.appendChild(newUl);

      this.input.setAttribute('aria-expanded', 'true');

      // Inserts the dropdown just after the <input> element
      this.input.parentNode.insertBefore(newContainer, this.input.nextSibling);
      this.container = newContainer;
      this.ul = newUl;

      this.message('TYPING', this.settings.options.length);
    }

    return this;
  }

  /**
   * Highlight new option selected.
   * @param   {Number}  newIndex
   * @return  {object}  The Class
   */
  highlight(newIndex) {
    if (newIndex > -1 && newIndex < this.ul.children.length) {
      // If any option already selected, then unselect it
      if (this.highlighted !== -1) {
        this.ul.children[this.highlighted].classList
          .remove(this.SELECTORS.HIGHLIGHT);
        this.ul.children[this.highlighted].removeAttribute('aria-selected');
        this.ul.children[this.highlighted].removeAttribute('id');

        this.input.removeAttribute('aria-activedescendant');
      }

      this.highlighted = newIndex;

      if (this.highlighted !== -1) {
        this.ul.children[this.highlighted].classList
          .add(this.SELECTORS.HIGHLIGHT);
        this.ul.children[this.highlighted]
          .setAttribute('aria-selected', 'true');
        this.ul.children[this.highlighted]
          .setAttribute('id', this.SELECTORS.ACTIVE_DESCENDANT);

        this.input.setAttribute('aria-activedescendant',
          this.SELECTORS.ACTIVE_DESCENDANT);
      }
    }

    return this;
  }

  /**
   * Selects an option from a list of items.
   * @return  {object} The Class
   */
  selected() {
    if (this.highlighted !== -1) {
      this.input.value = this.scoredOptions[this.highlighted].displayValue;
      this.remove();
      this.message('SELECTED', this.input.value);

      if (window.innerWidth <= 768)
        this.input.scrollIntoView(true);
    }

    // User provided callback method for selected option.
    if (this.settings.selected)
      this.settings.selected(this.input.value, this);

    return this;
  }

  /**
   * Remove dropdown list once a list item is selected.
   * @return  {object} The Class
   */
  remove() {
    this.container && this.container.remove();
    this.input.setAttribute('aria-expanded', 'false');

    this.container = null;
    this.ul = null;

    return this;
  }

  /**
   * Messaging that is passed to the screen reader
   * @param   {string}  key       The Key of the message to write
   * @param   {string}  variable  A variable to provide to the string.
   * @return  {object}            The Class
   */
  message(key = false, variable = '') {
    if (!key) return this;

    let messages = {
      'INIT': () => this.STRINGS.DIRECTIONS_TYPE,
      'TYPING': () => ([
          this.STRINGS.OPTION_AVAILABLE.replace('{{ NUMBER }}', variable),
          this.STRINGS.DIRECTIONS_REVIEW
        ].join('. ')),
      'SELECTED': () => ([
          this.STRINGS.OPTION_SELECTED.replace('{{ VALUE }}', variable),
          this.STRINGS.DIRECTIONS_TYPE
        ].join('. '))
    };

    document.querySelector(`#${this.input.getAttribute('aria-describedby')}`)
      .innerHTML = messages[key]();

    return this;
  }
}

/** Selectors for the Autocomplete class. */
Autocomplete.selectors = {
  'HIGHLIGHT': 'input-autocomplete__highlight',
  'OPTIONS': 'input-autocomplete__options',
  'ACTIVE_DESCENDANT': 'input-autocomplete__selected',
  'SCREEN_READER_ONLY': 'sr-only'
};

/**  */
Autocomplete.strings = {
  'DIRECTIONS_TYPE':
    'Start typing to generate a list of potential input options',
  'DIRECTIONS_REVIEW': [
      'Keyboard users can use the up and down arrows to ',
      'review options and press enter to select an option'
    ].join(''),
  'OPTION_AVAILABLE': '{{ NUMBER }} options available',
  'OPTION_SELECTED': '{{ VALUE }} selected'
};

/** Maximum amount of results to be returned. */
Autocomplete.maxItems = 5;

export default Autocomplete;
