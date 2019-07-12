/**
 * Dependencies
 */

const Fs = require('fs');
const Path = require('path');
const Postcss = require('postcss');
const alerts = require('../config/alerts');
const config = require('../config/postcss');
const modules = require('../config/styles');

/**
 * Init
 */
function run(module) {
  let bundle = Path.join(__dirname, '../', module.outDir, module.outFile);

  Fs.readFile(bundle, (err, css) => {
    Postcss(config.plugins)
      .process(css, {
        from: bundle,
        to: bundle
      })
      .then(result => {
        Fs.writeFile(bundle, result.css, (err) => {
          if (err) {
            console.log(`${alerts.error} ${err}`);
          } else {
            console.log(`${alerts.success} PostCss processed ${module.outDir}${module.outFile}`);
          }
        });
      });
  });
}

if (process.env.NODE_ENV === 'development') {
  modules.forEach(function(module) {
    if (module.devModule) {
      run(module);
    }
  });
} else {
  modules.forEach(run);
}
