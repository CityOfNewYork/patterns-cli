/**
 * Config
 *
 * @type {Object}
 */
const sass = {
  sourceMapEmbed: true,
  includePaths: [
    `${process.env.PWD}/src/`,
    `${process.env.PWD}/node_modules/`
  ]
};

/**
 * Sass Export
 *
 * @type {Array}
 */
module.exports = [
  {
    file: './src/scss/default.scss',
    outDir: './dist/styles/',
    outFile: 'default.css',
    sourceMapEmbed: sass.sourceMapEmbed,
    includePaths: sass.includePaths,
    devModule: true // This needs to be set if we want the module to be compiled during development
  }
];
