#!/usr/bin/env node

/**
 * Dependencies
 */

const slm = require('slm').compile;
const Path = require('path');
const Fs = require('fs');
const prettier = require('prettier');
const escape = require('escape-html');
const markdown = require('markdown').markdown;
const chokidar = require('chokidar');
const alerts = require(`${process.env.PWD}/config/alerts`);

/**
 * Constants
 */

const SOURCE = Path.join(process.env.PWD, 'src/');
const BASE_PATH = `${SOURCE}/views`;
const VIEWS = 'src/views/';
const DIST = 'dist/';
const WHITELIST = ['partials', 'layouts', 'section'];
const LOCALS = require('./locals');

const argvs = process.argv.slice(2);
const args = {
  watch: (argvs.includes('-w') || argvs.includes('--watch'))
};

/**
 * Our Chokidar Watcher
 *
 * @param  {Source}  url  https://github.com/paulmillr/chokidar
 */
const watcher = chokidar.watch([
  './src/**/*.slm',
  './src/**/*.md',
  './views/**/*.slm'
], {
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
 * @param  {string} filename - the filename to write
 * @param  {object} data     - the data to pass to the file
 */
function fnWrite(filename, path, data) {
  let rename = `${filename.split('.')[0]}.html`;
  let distPath = path.replace(VIEWS, DIST);
  let distFile = Path.join(distPath, rename);
  let local = Path.join(DIST, rename);

  Fs.writeFile(distFile, data, err => {
    if (err) {
      console.log(`${alerts.error} ${err}`);
      return;
    }

    console.log(`${alerts.success} Slm compiled to ${alerts.path('./' + local)}`);
  });
}

/**
 * Replace code blocks with the desired slm template
 * @param  {string} filename - the filename to write
 * @param  {object} data     - the data to pass to the file
 */
function fnCode(filename, path, data) {
  let blocks = data.match(/code{{(.*)}}/g);
  if (blocks) {
    blocks.forEach(function (element, index) {
      let file = element.replace('code{{', '').replace('}}', '').trim();
      let path = `${SOURCE}${file}`;
      let src = Fs.readFileSync(path, 'utf-8');
      let compiled = slm(src, {
        filename: path
      })(LOCALS);
      data = data.replace(element, escape(prettier.format(compiled, LOCALS.site.prettier)));
    });
    fnMarkdown(filename, path, data);
  } else {
    fnMarkdown(filename, path, data);
  }
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
    md.forEach(function (element, index) {
      let file = element.replace('md{{', '').replace('}}', '').trim();
      let path = `${SOURCE}${file}`;
      if (Fs.existsSync(path)) {
        let src = Fs.readFileSync(path, 'utf-8');
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
 * @param  {string} filename - the filename to write
 * @param  {object} data     - the data to pass to the file
 */
function fnSlm(filename, path, data) {
  let blocks = data.match(/slm{{(.*)}}/g);
  if (blocks) {
    blocks.forEach(function (element, index) {
      let file = element.replace('slm{{', '').replace('}}', '').trim();
      let path = `${SOURCE}${file}`;
      let src = Fs.readFileSync(path, 'utf-8');
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
 * @param  {string} filename - the filename to write
 * @param  {object} data     - the data to pass to the file
 */
function fnStr(filename, path, data) {
  let blocks = data.match(/str{{(.*)}}/g);
  if (blocks) {
    blocks.forEach(function (element, index) {
      let file = element.replace('str{{', '').replace('}}', '').trim();
      let path = `${SOURCE}${file}`;
      let src = Fs.readFileSync(path, 'utf-8');
      data = data.replace(element, src);
    });
    fnWrite(filename, path, data);
  } else {
    fnWrite(filename, path, data);
  }
}

/**
 * Read the the individual file in the directory
 * @param  {string} filename     - the path of the file
 * @param  {function} fnCallback - the callback function after read
 */
function fnReadFile(filename, path, fnCallback) {
  let fullPath = Path.join(path, filename);
  if (Fs.existsSync(fullPath)) {
    Fs.readFile(fullPath, 'utf-8', (err, src) => {
      if (err) {
        console.log(`${alerts.error} ${err}`);
        return;
      }
      let compiled = slm(src, {
        filename: fullPath,
        basePath: BASE_PATH,
        useCache: false
      })(LOCALS);
      fnCallback(filename, path, prettier.format(compiled, LOCALS.site.prettier));
    });
  } else {
    console.log(`${alerts.error} Slm failed: ${fullPath} needs to be created.`);
  }
}

/**
 * Read a specific file or if it's a directory, reread all of the files in it.
 * @param  {string} err   - the error from reading the directory, if any
 * @param  {array}  files - the list of files in the directory
 */
function fnReadFiles(files, path) {
  for (let i = files.length - 1; i >= 0; i--) {
    if (files[i].indexOf('.slm') > -1) {
      fnReadFile(files[i], path, fnCode);
    } else if (WHITELIST.indexOf(files[i]) === -1) {
      fnReadDir(Path.join(path, files[i]));
    }
  }
}

/**
 * Extracts the filename
 * @param  {string} path - The full path of the file
 * @return {null}        - The name of the file
 */
function fnExtractFile(path){
  let file = path.split('\/');

  if(path.indexOf('/views/') > -1){
    return file[file.length - 1];
  } else {
    return file[file.length - 2] + '.slm';
  }
}

/**
 * Read the file or views directory
 * @param  {string} path - The path of the directory or file to read
 * @return {null}        - Only returns null if there is an error
 */
function fnReadDir(path) {
  const extensions = ['.slm', '.md'];
  if (extensions.some(ext => path.includes(ext))) {
    let file = fnExtractFile(path);
    fnReadFile(file, Path.join(process.env.PWD, VIEWS), fnCode);
  } 
  else {
    Fs.readdir(path, 'utf-8', (err, files) => {
      if (err) {
        console.log(`${alerts.error} ${err}`);
        return;
      }
      fnReadFiles(files, path);
    });
  }
}

/**
 * Init
 */
if (args.watch) {
  watcher.on('change', (path) => {
    console.log(`${alerts.watching} Detected change on ${path}`);

    if ((path.indexOf(VIEWS) > -1) && (path.split(VIEWS).pop().indexOf('\/') > -1)) {
      path = Path.join(process.env.PWD, VIEWS);
    } else {
      path = Path.join(process.env.PWD, path);
    }
    fnReadDir(path);
  });
} else {
  fnReadDir(Path.join(process.env.PWD, VIEWS));
}
