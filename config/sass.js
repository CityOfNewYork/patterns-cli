/**
 * Dependencies
 */

// ...

/**
 * Config
 */

const sass = {
  sourceMapEmbed: true,
  precision: 2,
  includePaths: [
    './node_modules/nyco-patterns/src/',
    './src',
    './node_modules'
  ]
};

/**
 * Our pattern style modules
 */

module.exports = [
  {
    file: './src/scss/site-default.scss',
    outDir: './dist/styles/',
    outFile: 'site-default.css',
    sourceMapEmbed: sass.sourceMapEmbed,
    precision: sass.precision,
    includePaths: sass.includePaths,
    devModule: true // This needs to be set if we want the module to be compiled during development
  },
  {
    file: './src/utilities/spinner/_spinner.scss',
    outDir: './dist/utilities/spinner/',
    outFile: 'spinner.css',
    sourceMapEmbed: sass.sourceMapEmbed,
    precision: sass.precision,
    includePaths: sass.includePaths
  },
  {
    file: './src/utilities/toggle/_toggle.scss',
    outDir: './dist/utilities/toggle/',
    outFile: 'toggle.css',
    sourceMapEmbed: sass.sourceMapEmbed,
    precision: sass.precision,
    includePaths: sass.includePaths
  }
];
