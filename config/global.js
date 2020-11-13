/**
 * Global Configuration
 *
 * @type {Object}
 */
module.exports = {
  /**
   * Main Project Directories
   *
   * @type {String}
   */
  base: process.env.PWD,
  src: 'src',
  dist: 'dist',

  /**
   * Project Entrypoints
   *
   * @type {Object}
   */
  entry: {
    styles: 'scss/default.scss',
    imports: 'scss/_imports.scss',
    config: 'config',
    scripts: 'js/default.js',
    name: 'Default',
    views: 'views'
  },

  /**
   * Directories to scaffold
   *
   * @type {Object}
   */
  directories: [
    /**
     * Configuration Path(s)
     *
   * @type {Object}
     */
    {
      __dirname: 'config',
      files: [
        'rollup.mjs',
        'sass.js',
        'tailwindcss.js',
        'tokens.js'
      ]
    },

    /**
     * Distribution Directory
     *
     * @type {Object}
     */
    {
      __dirname: 'dist'
    },

    /**
     * Source and Patterns path(s)/naming
     *
     * @type {Object}
     */
    {
      __dirname: 'src',
      directories: [
        {
          __dirname: 'components',
          directories: [
            {
              __dirname: 'details',
              files: [
                '_details.scss',
                'details.md',
                'details.slm'
              ]
            }
          ]
        },
        {
          __dirname: 'config',
          files: [
            '_border.scss',
            '_get.scss',
            '_grid.scss',
            '_tokens.scss',
            '_type.scss'
          ]
        },
        {
          __dirname: 'elements',
          directories: [
            {
              __dirname: 'base',
              files: [
                '_base-first-last.scss',
                '_base.scss'
              ]
            }
          ]
        },
        {
          __dirname: 'js',
          files: [
            'default.js'
          ]
        },
        {
          __dirname: 'objects'
        },
        {
          __dirname: 'scss',
          files: [
            '_imports.scss',
            'default.scss'
          ]
        },
        {
          __dirname: 'slm',
          directories: [
            {
              __dirname: 'layouts',
              files: [
                'default.slm'
              ]
            }
          ]
        },
        {
          __dirname: 'svg',
          files: [
            'a-perfect-heart-red.svg',
            'a-perfect-heart.svg'
          ]
        },
        {
          __dirname: 'utilities',
          directories: [
            {
              __dirname: 'color',
              files: [
                '_color.scss'
              ]
            },
            {
              __dirname: 'padding',
              files: [
                '_padding.scss'
              ]
            },
            {
              __dirname: 'tailwindcss',
              files: [
                '_tailwindcss.scss'
              ]
            },
            {
              __dirname: 'typography',
              files: [
                '_typography.scss'
              ]
            }
          ]
        },
        {
          __dirname: 'views',
          files: [
            'index.slm'
          ]
        }
      ]
    }
  ],

  /**
   * Default arguments
   *
   * @type {Object}
   */
  args: {
    notifications: '', // '--nondescript -nd' or '--silent'
    linting: '',       // '--no-lint -nl'
    pa11y: '',         // '--no-pa11y -np'
  }
};
