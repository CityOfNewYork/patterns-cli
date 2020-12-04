/**
 * Pa11y configuration. Refer to the package for details on the available options.
 *
 * @source https://github.com/pa11y/pa11y#configuration
 *
 * @type {Object}
 */
module.exports = {
  standard: 'WCAG2AA',
  runners: [
    'axe',
    'htmlcs'
  ],
  hideElements: [
    '[data-pa11y="disable"]'
  ]
};