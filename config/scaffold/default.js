'use strict';

// import {{ Pattern }} from '../{{ type }}/{{ pattern }}/{{ pattern }}';
/** import pattern modules here as they are written */

/**
 * Methods for the main Patterns instance.
 */
class Default {
  constructor() {
    if (process.env.NODE_ENV != 'production')
      console.dir('@pttrn Development Mode'); // eslint-disable-line no-console
  }

  // Sample method
  // /**
  //  * API for the {{ Pattern }} {{ type }}.
  //  *
  //  * @param  {Object}  config  A configuration object.
  //  *
  //  * @return {Object}          {{ Pattern }} instance.
  //  */
  // {{ pattern }}(config) {
  //   return new {{ Pattern }}(config);
  // }

  /** add pattern APIs here as they are written */
}

export default Default;
