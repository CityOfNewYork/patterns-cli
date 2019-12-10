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
const nodemon = require('nodemon');
const alerts = require(`${process.env.PWD}/config/alerts`);

/**
 * Constants
 */

const SOURCE = Path.join(process.env.PWD, 'src/');
const BASE_PATH = `${SOURCE}/views`;
const VIEWS = 'src/views/';
const DIST ='dist/';
const WHITELIST = ['partials', 'layouts', 'section'];
const LOCALS = require('./locals');
const ARGS = process.argv.slice(2);

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

  Fs.writeFile(distFile, data, err => {
    if (err) {
      console.log(`${alerts.error} ${err}`);
      return;
    }
    distFile = distFile.replace(Path.join(__dirname, '../'), '');

    console.log(`${alerts.success} Slm compiled to ${alerts.path('./' + distFile)}`);
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
    blocks.forEach(function(element, index) {
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
    md.forEach(function(element, index) {
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
    blocks.forEach(function(element, index) {
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
    blocks.forEach(function(element, index) {
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
  Fs.readFile(fullPath, 'utf-8', (err, src) => {
    if (err) {
      console.log(`${alerts.error} ${err}`);
      return;
    }
    let compiled = slm(src, {
      filename: fullPath,
      basePath: BASE_PATH
    })(LOCALS);
    fnCallback(filename, path, prettier.format(compiled, LOCALS.site.prettier));
  });
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
 * Read the views directory
 * @param  {string} path - The path of the directory to read
 * @return {null}        - Only returns null if there is an error
 */
function fnReadDir(path) {
  Fs.readdir(path, 'utf-8', (err, files) => {
    if (err) {
      console.log(`${alerts.error} ${err}`);
      return;
    }
    fnReadFiles(files, path);
  });
}

/**
 * Init
 */
if (ARGS.includes('-w') || ARGS.includes('--watch')) {
  nodemon(`-e slm,md -w ${process.env.PWD}/src -x ${__dirname}/slm.js`);

  console.log(`${alerts.watching} Slm watching ${alerts.ext('.slm')} and ${alerts.ext('.md')} in ${alerts.path('./src/')}`);
} else {
  fnReadDir(Path.join(process.env.PWD, VIEWS));
}
