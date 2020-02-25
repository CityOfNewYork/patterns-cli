#!/usr/bin/env node

/**
 * Dependencies
 */

const slm = require('slm').compile;
const path = require('path');
const fs = require('fs');
const prettier = require('prettier');
const escape = require('escape-html');
const markdown = require('markdown').markdown;
const chokidar = require('chokidar');
const alerts = require(`${process.env.PWD}/config/alerts`);

/**
 * Constants
 */

const SOURCE = path.join(process.env.PWD, 'src/');
const BASE_PATH = `${SOURCE}/views`;
const VIEWS = 'src/views/';
const DIST = 'dist/';
const WHITELIST = ['partials', 'layouts', 'section'];
const LOCALS = require('./locals');
const EXTENSIONS = ['.slm', '.md'];
const GLOBS = [
  './src/**/*.slm',
  './src/**/*.md',
  './views/**/*.slm'
];

const argvs = process.argv.slice(2);
const args = {
  watch: (argvs.includes('-w') || argvs.includes('--watch'))
};

/**
 * Our Chokidar Watcher
 *
 * @param  {Source}  url  https://github.com/paulmillr/chokidar
 */
const watcher = chokidar.watch(GLOBS.map(glob => path.join(process.env.PWD, glob)), {
  usePolling: false,
  awaitWriteFinish: {
    stabilityThreshold: 750
  }
});

/**
 * Functions
 */

/**
 * Write the html file to the distribution folder
 *
 * @param  {String}  filename  The filename to write
 * @param  {String}  folder
 * @param  {Object}  data      The data to pass to the file
 */
function fnWrite(filename, folder, data) {
  let rename = `${filename.split('.')[0]}.html`;
  let distPath = folder.replace(VIEWS, DIST);
  let distFile = path.join(distPath, rename);
  let local = path.join(DIST, rename);

  fs.writeFile(distFile, data, err => {
    if (err) {
      console.log(`${alerts.error} ${err}`);
      return;
    }

    console.log(`${alerts.success} Slm compiled to ${alerts.path('./' + local)}`);
  });
}

/**
 * Replace code blocks with the desired slm template
 *
 * @param  {String}  filename  the filename to write
 * @param  {Object}  data      the data to pass to the file
 */
const includeCode = async (filename, path, data) => {
  let blocks = data.match(/code{{(.*)}}/g);

  if (blocks) {
    blocks.forEach(element => {
      let file = element.replace('code{{', '').replace('}}', '').trim();
      let path = `${SOURCE}${file}`;
      let src = fs.readFileSync(path, 'utf-8');
      let compiled = slm(src, {
        filename: path
      })(LOCALS);

      data = data.replace(element, escape(prettier.format(compiled, LOCALS.site.prettier)));
    });

    // fnMarkdown(filename, path, data);
  } else {
    // fnMarkdown(filename, path, data);
  }

  return data;
}

/**
 * Replace Markdown blocks with the desired md template
 * @param  {string} filename - the filename to write
 * @param  {string} path     - [description]
 * @param  {object} data     - the data to pass to the file
 */
function fnMarkdown(filename, path, data) {
  let md = data.match(/md{{(.*)}}/g);

  if (md) {
    md.forEach(element => {
      let file = element.replace('md{{', '').replace('}}', '').trim();
      let path = `${SOURCE}${file}`;

      if (fs.existsSync(path)) {
        let src = fs.readFileSync(path, 'utf-8');
        let compiled = markdown.toHTML(src, 'Maruku');

        data = data.replace(element, prettier.format(compiled, LOCALS.site.prettier));
      } else {
        data = data.replace(element, '');
      }
    });

    fnSlm(filename, path, data);
  } else {
    fnSlm(filename, path, data);
  }
}

/**
 * Replace code blocks with the desired slm template
 *
 * @param  {string}  filename  The filename to write
 * @param  {object}  data      The data to pass to the file
 */
function fnSlm(filename, path, data) {
  let blocks = data.match(/slm{{(.*)}}/g);

  if (blocks) {
    blocks.forEach(element => {
      let file = element.replace('slm{{', '').replace('}}', '').trim();
      let path = `${SOURCE}${file}`;
      let src = fs.readFileSync(path, 'utf-8');
      let compiled = slm(src, {
        filename: path
      })(LOCALS);

      data = data.replace(element, prettier.format(compiled, LOCALS.site.prettier));
    });

    fnStr(filename, path, data);
  } else {
    fnStr(filename, path, data);
  }
}

/**
 * Replace string blocks with the desired template
 *
 * @param  {String}  Filename  The filename to write
 * @param  {Object}  Data      The data to pass to the file
 */
function fnStr(filename, path, data) {
  let blocks = data.match(/str{{(.*)}}/g);

  if (blocks) {
    blocks.forEach(element => {
      let file = element.replace('str{{', '').replace('}}', '').trim();
      let path = `${SOURCE}${file}`;
      let src = fs.readFileSync(path, 'utf-8');

      data = data.replace(element, src);
    });

    fnWrite(filename, path, data);
  } else {
    fnWrite(filename, path, data);
  }
}

/**
 * Read the the individual file in the directory
 *
 * @param  {String}    filename    The path of the file
 * @param  {Function}  fnCallback  The callback function after read
 */
const readFile = async (dir, file) => {
  let fullPath = path.join(dir, file);

  try {
    // if (fs.existsSync(fullPath)) {
    let src = fs.readFileSync(fullPath, 'utf-8');

    // if (err) {
    //   console.log(`${alerts.error} ${err}`);

    //   return;
    // }

    return slm(src, {
      filename: fullPath,
      basePath: BASE_PATH,
      useCache: false
    })(LOCALS);
    // callback(filename, dir, prettier.format(compiled, LOCALS.site.prettier));

  } catch (err) {
    console.log(`${alerts.error} Slm failed (readFile): ${err}.`);
  }
};

/**
 * Read a specific file or if it's a directory, reread all of the files in it.
 *
 * @param  {String}  err    The error from reading the directory, if any
 * @param  {Array}   files  The list of files in the directory
 */
const readFiles = (files, path) => {
  for (let i = files.length - 1; i >= 0; i--) {
    if (files[i].indexOf('.slm') > -1) {
      readFile(files[i], path, fnCode);
    } else if (WHITELIST.indexOf(files[i]) === -1) {
      main(path.join(path, files[i]));
    }
  }
};

/**
 * Extracts the filename
 *
 * @param   {String}  path  The full path of the file
 *
 * @return  {null}          The name of the file
 */
const extractFile = (file) => {
  file = file.split('\/');

  if (file.indexOf('/views/') > -1) {
    return file[file.length - 1];
  } else {
    return file[file.length - 2] + '.slm';
  }
};

/**
 * Read the file or views directory
 *
 * @param   {String}  file  The path of the directory or file to read
 *
 * @return  {null}          Only returns null if there is an error
 */
const main = async (file) => {
  if (EXTENSIONS.some(ext => file.includes(ext))) {
    dir = path.join(process.env.PWD, VIEWS);
    file = path.basename(file);

    let compiled = await readFile(dir, file);
    let data = await includeCode(file, dir, prettier.format(compiled, LOCALS.site.prettier));

    console.log(data);
  } else {
    fs.readdir(file, 'utf-8', (err, files) => {
      if (err) {
        console.log(`${alerts.error} ${err}`);

        return;
      }

      readFiles(files, file);
    });
  }
}

/**
 * Tne runner for single commands and the watcher
 */
const run = async () => {
  try {
    if (args.watch) {
      watcher.on('change', (changed) => {
        let local = changed.replace(process.env.PWD, '');

        console.log(`${alerts.watching} Detected change on ${alerts.path(`.${local}`)}`);

        if ((changed.indexOf(VIEWS) > -1) && (changed.split(VIEWS).pop().indexOf('\/') > -1)) {
          changed = path.join(process.env.PWD, VIEWS);
        }

        main(changed);
      });

      console.log(`${alerts.watching} Slm watching ${alerts.ext(GLOBS.join(', '))}`);
    } else {
      await main(path.join(process.env.PWD, VIEWS));
    }
  } catch (err) {
    console.log(`${alerts.error} Slm failed (run): ${err}`);
  }
};

/** @type  {Object}  Export our methods */
module.exports = {
  'main': main,
  'run': run,
  // 'config': config,
  // 'options': options,
  // 'modules': modules
};
