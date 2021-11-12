/**
 * Lint configuration
 *
 * @type {Object}
 */
module.exports = {
  /**
   * ESLint configuration. Refer to the package for details on the available options.
   *
   * @source https://eslint.org/docs/user-guide/configuring
   * @source https://github.com/google/eslint-config-google
   *
   * @type {Object}
   */
  eslint: {
    overrideConfig: {
      extends: 'google',
      env: {
        browser: true,
        es6: true
      },
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
      },
      rules: {
        'no-console': 1,
        'one-var': 0,
        'comma-dangle': 0,
        'curly': [
          'error',
          'multi'
        ]
      }
    }
  },

  /**
   * stylelint configuration. Refer to the package for details on the available options.
   *
   * @source https://stylelint.io/user-guide/configure
   *
   * @type {Object}
   */
  stylelint: {
    customSyntax: 'postcss-scss',
    extends: 'stylelint-config-standard',
    rules: {
      'color-hex-case': 'upper',
      'string-quotes': 'single',
      'no-missing-end-of-source-newline': null,
      'at-rule-no-unknown': [true, {
        'ignoreAtRules': ['use', 'forward', 'tailwind', 'function', 'return', 'mixin']
      }]
    }
  }
};