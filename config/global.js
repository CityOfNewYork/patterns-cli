/**
 * Proposal Setup for Global Configuration. Example exists in make.js config
 */

const path = require('path');

/**
 * Config
 */

module.exports = {
  base: process.env.PWD,
  /**
   * Configuration path(s)
   */
  config: {
    __dirname: 'config',
    sass: 'sass.js',
    rollup: 'rollup.js'
  },
  /**
   * Distribution Path
   */
  dist: 'dist',
  /**
   * Source and Patterns path(s)/naming
   */
  src: {
    __dirname: 'src',
    elements: 'elements',
    components: 'components',
    objects: 'objects',
    utilities: 'utilities',
    views: 'views',
    scss: {
      __dirname: 'scss',
      config: 'config',
      imports: '_imports.scss',
      default: 'default.scss'
    },
    js: {
      __dirname: 'js',
      default: 'default.js'
    },
    svg: 'svg'
  },
  args: {
    notifications: '', // '--nondescript' or '--silent'
    linting: '',       // '--no-lint'
    pa11y: '',         // '--no-pa11y'
  }
};
