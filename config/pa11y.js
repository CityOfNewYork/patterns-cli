/**
 * Configuration options for pa11y
 *
 * @param  {String}  url  https://github.com/pa11y/pa11y#configuration
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