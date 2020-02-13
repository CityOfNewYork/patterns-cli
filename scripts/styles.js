#!/usr/bin/env node

/**
 * Dependencies
 */

const chokidar = require('chokidar');
const alerts = require(`${process.env.PWD}/config/alerts`);
const modules = require(`${process.env.PWD}/config/sass`);
const postcss = require(`${__dirname}/postcss.js`);

/**
 * Process CLI args
 */

const argvs = process.argv.slice(2);
const args = {
  watch: (argvs.includes('-w') || argvs.includes('--watch'))
};

/**
 * Methods
 */

 /**
 * Run each task on the modules
 *
 * @param  {Array}  modules  The contents of config/sass.js
 */
const main = async (modules) => {
  // ***
  // TODO - desired pattern for variables and sass scripts;
  // await variables();
  // await sass.each(modules);
  // ***

  // Completed PostCSS async refactor
  await postcss.each(modules);

  console.log(`${alerts.success} Styles finished`);
};

/**
 * Our Chokidar Watcher
 *
 * @param {https://github.com/paulmillr/chokidar}
 */
const watcher = chokidar.watch(`${process.env.PWD}/src/**/*.scss`, {
  ignored: `${process.env.PWD}/src/**/_variables.scss`
});

// ***
// TODO - create module exports for all scripts, export
// them as the default into module.exports = {} and in
// the cli.js that includes this file use require method
// to import it as and execute it.
// ***
(async () => {
  try {
    if (args.watch) {
      watcher.on('change', (changed) => {
        let file = changed.replace(process.env.PWD, '');

        console.log(`${alerts.watching} Detected change on ${alerts.path(file)}`);

        // ***
        // TODO - Create a file matching method to check the changed file in the
        // collection of modules, then pass only that module to the main method;
        // ***

        main(modules);
      });

      console.log(`${alerts.watching} Styles watching ${alerts.ext('.scss')} in ${alerts.path('./src/')}`);
    } else {
      await main(modules);

      process.exit(0);
    }
  } catch (err) {
    console.log(`${alerts.error} Styles failed`);
  }
})();
