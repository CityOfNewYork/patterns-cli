/**
 * @class  Set the the css variable '--100vh' to the size of the Window's inner height.
 */
class WindowVh {
  /**
   * @constructor  Set event listeners
   */
  constructor(s = {}) {
    this.property = (s.property) ? s.property : WindowVh.property;

    window.addEventListener('load', () => {this.set()});

    window.addEventListener('resize', () => {this.set()});

    return this;
  }

  /**
   * Sets the css variable property
   */
  set() {
    document.documentElement.style
      .setProperty(this.property, `${window.innerHeight}px`);
  }
}

/** @param  {String}  property  The css variable string to set */
WindowVh.property = '--100vh';

export default WindowVh;
