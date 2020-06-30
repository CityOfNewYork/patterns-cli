module.exports = {
  /**
   * ES Lint Configuration
   *
   * @param  {String}  url  https://eslint.org
   */
  eslint: {
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
  },
  /**
   * Stylelint
   *
   * @param  {String}  url  https://stylelint.io
   */
  stylelint: {
    extends: 'stylelint-config-standard',
    rules: {
      'no-missing-end-of-source-newline': null,
      'at-rule-no-unknown': [true, {
        'ignore': ['use', 'tailwind']
      }]
    }
  }
};