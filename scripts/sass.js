/**
 * Dependencies
 */

const Sass = require('node-sass');
const Path = require('path');
const Fs = require('fs');
const modules = require('../config/styles');
const mkdirp = require('mkdirp');
const alerts = require('../config/alerts');

/**
 * Init
 */

function write(module) {
  let outDir = Path.join(__dirname, '../', module.outDir);
  let name = module.outFile;
  Sass.render(module, (err, result) => {
    if (err) {
      console.log(`${alerts.error} ${err.formatted}`);
    } else {
      Fs.writeFile(`${outDir}${name}`, result.css, (err) => {
        if (err) {
          console.log(`${alerts.error} ${err}`);
        } else {
          console.log(`${alerts.success} Sass compiled to ${module.outDir}${name}`);
        }
      });
    }
  });
}

function run(module) {
  let outDir = Path.join(__dirname, '../', module.outDir);
  if (!Fs.existsSync(outDir)) {
    mkdirp(outDir, (err) => {
      if (err) {
        console.error(`${alerts.error} ${err}`);
      } else {
        write(module);
      }
    });
  } else {
    write(module);
  }
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
