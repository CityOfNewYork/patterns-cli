/**
 * Global configuration
 *
 * @type {Object}
 */
module.exports = {
  /**
   * Main project directories
   *
   * @type {String}
   */
  base: process.env.PWD,
  src: 'src',
  dist: 'dist',

  /**
   * Project entrypoints. These are used by other files to determine defaults.
   * They must also have a reference in the directories configuration below.
   *
   * @type {Object}
   */
  entry: {
    styles: 'scss/default.scss',
    imports: 'scss/_imports.scss',
    config: 'config',
    scripts: 'js/default.js',
    name: 'Default',
    views: 'views',
    svg: 'svg'
  },

  /**
   * Directories to scaffold. The scaffold command will create the filesystem
   * configured here and use files in the ./scaffold directory as the contents
   * for files described here.
   *
   * @type {Object}
   */
  directories: [
    /**
     * Configuration path(s)
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
     * Distribution directory
     *
     * @type {Object}
     */
    {
      __dirname: 'dist'
    },

    /**
     * Source and patterns path(s)/naming
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

  // /**
  //  * Default arguments
  //  *
  //  * @type {Object}
  //  */
  // args: {
  //   notifications: '', // '--nondescript -nd' or '--silent'
  //   linting: '',       // '--no-lint -nl'
  //   pa11y: '',         // '--no-pa11y -np'
  // }
};
