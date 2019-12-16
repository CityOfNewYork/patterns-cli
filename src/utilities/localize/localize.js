'use strict';

/**
 * For translating strings, there is a global LOCALIZED_STRINGS array that
 * is defined on the HTML template level so that those strings are exposed to
 * WPML translation. The LOCALIZED_STRINGS array is composed of objects with a
 * `slug` key whose value is some constant, and a `label` value which is the
 * translated equivalent. This function takes a slug name and returns the
 * label.
 *
 * @param  {string} slug
 *
 * @return {string} localized value
 */
export default function(slug) {
  let text = slug || '';

  const strings = window.LOCALIZED_STRINGS || [];
  const match = strings.filter(
    (s) => (s.hasOwnProperty('slug') && s['slug'] === slug) ? s : false
  );

  return (match[0] && match[0].hasOwnProperty('label')) ? match[0].label : text;
};