'use strict';

/**
 * The Spinner module
 *
 * @class
 */
class Spinner {
  /**
   * The Spinner constructor
   *
   * @constructor
   */
  constructor(settings = {}) {
    this.class = (settings.hasOwnProperty('class'))
      ? settings.class : Spinner.class;

    this.viewbox = (settings.hasOwnProperty('viewbox'))
      ? settings.viewbox : Spinner.viewbox;

    this.fill = (settings.hasOwnProperty('fill'))
      ? settings.fill : Spinner.fill;

    return this.create();
  }

  /**
   * Programatically create the Spinner SVG and return the DOM element.
   *
   * @return  {DOM}  The Spinner SVG
   */
  create() {
    this.el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

    this.el.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
    this.el.setAttribute('viewBox', this.viewbox);
    this.el.setAttribute('version', '1.1');
    this.el.setAttribute('class', `spinner ${this.class}`);

    this.circle.setAttribute('cx', '12');
    this.circle.setAttribute('cy', '12');
    this.circle.setAttribute('r', '10');
    this.circle.setAttribute('fill', this.fill);
    this.circle.setAttribute('class', 'spinner__path');

    this.el.appendChild(this.circle);

    return this.el;
  }
}

Spinner.class = 'icon-4';

Spinner.viewbox = '0 0 24 24';

Spinner.fill = 'none';

export default Spinner;