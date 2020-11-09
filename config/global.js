/**
 * Proposal Setup for Global Configuration. Example exists in make.js config
 */

module.exports = {
  /**
   * Project Base Path
   */

  base: process.env.PWD,

  /**
   * Project Entrypoints
   */

  entrypoints: {
    styles: 'default.scss',
    imports: '_imports.scss',
    config: 'config',
    scripts: 'default.js'
  },

  directories: [
    /**
     * Configuration Path(s)
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
     * Distribution Path
     */

    {
      __dirname: 'dist'
    },

    /**
     * Source and Patterns path(s)/naming
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
          __dirname: 'svgs',
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
   */

  args: {
    notifications: '', // '--nondescript -nd' or '--silent'
    linting: '',       // '--no-lint -nl'
    pa11y: '',         // '--no-pa11y -np'
  }
};
