'use strict';

/**
 * The Icon module
 * @class
 */
class Icons {
  /**
   * @constructor
   * @param  {String} path The path of the icon file
   * @return {object} The class
   */
  constructor(path) {
    path = (path) ? path : Icons.path;

    fetch(path)
      .then((response) => {
        if (response.ok)
          return response.text();
        else
          // eslint-disable-next-line no-console
          if (process.env.NODE_ENV !== 'production')
            console.dir(response);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        if (process.env.NODE_ENV !== 'production')
          console.dir(error);
      })
      .then((data) => {
        const sprite = document.createElement('div');
        sprite.innerHTML = data;
        sprite.setAttribute('aria-hidden', true);
        sprite.setAttribute('style', 'display: none;');
        document.body.appendChild(sprite);
      });

    return this;
  }
}

/** @type {String} The path of the icon file */
Icons.path = 'svg/icons.svg';

export default Icons;
