#!/usr/bin/env node

'use strict';

/**
 * Dependencies
 */

const fs = require('fs');
const path = require('path');

const slm = require('slm').compile;
const beautify = require('js-beautify').html;
const marked = require('marked');
const chokidar = require('chokidar');

const pa11y = require(`${__dirname}/pa11y`);
const args = require(`${__dirname}/util/args`).args;
const cnsl = require(`${__dirname}/util/console`);
const resolve = require(`${__dirname}/util/resolve`);

const alerts = resolve('config/alerts');
const CONFIG = resolve('config/slm');

/**
 * Constants
 */

const SOURCE = path.join(process.env.PWD, CONFIG.src);
const DIST = path.join(process.env.PWD, CONFIG.dist);
const BASE_PATH = `${SOURCE}`;
const VIEWS = `${BASE_PATH}/${CONFIG.views}`;

const EXT = '.slm';
const GLOBS = [
  `${SOURCE}/**/*${EXT}`,
  `${SOURCE}/**/*.md`
];

/**
 * Our Chokidar Watcher
 *
 * @param  {Source}  url  https://github.com/paulmillr/chokidar
 */
const watcher = chokidar.watch(GLOBS, {
  usePolling: false,
  awaitWriteFinish: {
    stabilityThreshold: 750
  }
});

/**
 * Write the html file to the distribution folder
 *
 * @param  {String}  file  The file source
 * @param  {Object}  data  The data to pass to the file
 */
const write = async (file, data) => {
  try {
    let dist = file.replace(EXT, '.html').replace(VIEWS, DIST);
    let src = file.replace(process.env.PWD, '.');
    let local = dist.replace(process.env.PWD, '.');

    if (!fs.existsSync(path.dirname(dist))){
      fs.mkdirSync(path.dirname(dist));
    }

    if (CONFIG.beautify) {
      data = beautify(data, CONFIG.beautify);
    }

    fs.writeFileSync(dist, data);

    cnsl.describe(`${alerts.success} Slm compiled ${alerts.str.path(src)} to ${alerts.str.path(local)}`);

    return dist;
  } catch (err) {
    cnsl.error(`Slm (write): ${err.stack}`);
  }
}

/**
 * Update marked renderer with slm compiler.
 * Intended to replace the mrkdwnslm() method of including slm files in Markdown
 * however this implementation of the renderer doesn't appear to be correct.
 */

// const renderer = (CONFIG.marked.hasOwnProperty('renderer')) ?
//   CONFIG.marked.renderer : new marked.Renderer();
//
// renderer.slm = (data) => {
//   let blocks = data.match(/include{{(.*)}}/g);
//
//   console.log(blocks);
// };

// CONFIG.marked.renderer = renderer;

/**
 * Set marked options from config
 */

marked.setOptions(CONFIG.marked);


const mrkdwn = {
  /**
   * Replace code blocks with the desired slm template
   *
   * @param   {Object}  data  File contents
   *
   * @return  {String}        File contents with compiled slm
   */
  slm: function(data) {
    let blocks = data.match(/include{{\s*[/\w\.]+\s*}}/g);

    if (blocks) {
      blocks.forEach(element => {
        let file = element.replace('include{{', '').replace('}}', '').trim();

        file = `${SOURCE}/${file}`;

        let src = fs.readFileSync(file, 'utf-8');

        let compiled = slm(src, {
          filename: path,
          basePath: BASE_PATH,
          useCache: false
        })(CONFIG);

        data = data.replace(element, compiled);
      });
    }

    return data;
  },
  /**
   * Replace mustache like variables with localized vars
   *
   * @param   {String}  data  Compiled markdown
   *
   * @return  {String}        Markdown with interpreted variables
   */
  vars: function(data) {
    let blocks = data.match(/{{\s*[\w\.]+\s*}}/g);

    if (blocks) {
      blocks.forEach(element => {
        if (element.includes('this.')) {
          let variable = element.replace('{{', '').replace('}}', '')
            .replace('this.', '').trim().split('.');

          let obj = CONFIG;

          while (variable.length) {
            obj = obj[variable.shift()];
          }

          data = data.replace(element, obj);
        }
      });
    }

    return data;
  }
};

/**
 * Include a file in a template
 *
 * @param  {String}  file   The relative path of the file
 *
 * @return {String}         The compiled file
 */
const include = (file) => {
  let data = file;
  let extname = path.extname(file);

  // Assume file is slm if extension isn't specified
  if (extname === '') {
    extname = EXT;
    file = file + extname;
  }

  let handler = extname.replace('.', '');

  // Set includes base path (source)
  let dir = SOURCE;

  file = path.join(dir, file);

  // Pass file to the compile handler
  if (compile.hasOwnProperty(handler)) {
    data = compile[handler](file);
  } else {
    data = compile['default'](file);

    cnsl.notify(`${alerts.info} Slm (include): no handler exists for ${extname} files. Rendering as is.`);
  }

  return data;
};

/**
 * Comiling methods
 */
const compile = {
  /**
   * Read a slm file and compile it to html, return the data.
   *
   * @param  {String}  file  The path of the file
   * @param  {String}  dir   The base directory of the file
   *
   * @return {String}        The compiled html
   */
  slm: (file, dir = BASE_PATH) => {
    try {
      if (!fs.existsSync(file)) {
        return '';
      }

      let src = fs.readFileSync(file, 'utf-8');

      // Make the include method available to templates
      CONFIG.include = include;

      let data = slm(src, {
          filename: file,
          basePath: dir,
          useCache: false
        })(CONFIG);

      if (CONFIG.beautify) {
        data = beautify(data, CONFIG.beautify);
      }

      return data;
    } catch (err) {
      cnsl.error(`Slm failed (compile.slm): ${err.stack}`);
    }
  },
  /**
   * Read a markdown file and compile it to html, return the data.
   *
   * @param  {String}  file  Path to the file to compile
   *
   * @return {String}        The compiled html
   */
  md: (file) => {
    try {
      if (!fs.existsSync(file)) {
        return '';
      }

      let md = fs.readFileSync(file, 'utf-8');

      md = marked(md);

      md = mrkdwn.slm(md);

      md = mrkdwn.vars(md);

      return md;
    } catch (err) {
      cnsl.error(`Slm failed (compile.md): ${err.stack}`);
    }
  },
  /**
   * Read a file and return it's contents.
   *
   * @param  {String}  file  Path to the file to compile
   *
   * @return {String}        The file contents
   */
  default: (file) => {
    try {
      if (!fs.existsSync(file)) {
        return '';
      }

      return fs.readFileSync(file, 'utf-8');
    } catch (err) {
      cnsl.error(`Slm failed (compile.default): ${err.stack}`);
    }
  }
};

// const ignore

/**
 * The main function to execute on files
 *
 * @param  {String}  file  The path of the file to read
 */
const main = async (file) => {
  if (file.includes(EXT)) {
    let compiled = await compile.slm(file);

    let dist = await write(file, compiled);

    if (!args.nopa11y) await pa11y.main(dist);

    return dist;
  }
}

/**
 * Read a specific file or if it's a directory, read all of the files in it
 *
 * @param  {String}  file  A single file or directory to recursively walk
 * @param  {String}  dir   The base directory of the file
 */
const walk = async (file, dir = VIEWS) => {
  file = (file.includes(dir)) ? file : path.join(dir, file);

  if (file.includes(EXT)) {
    await main(file);
  } else if (!CONFIG.blacklist.some(folder => file.includes(folder))) {
    try {
      let files = fs.readdirSync(file, 'utf-8');

      for (let i = files.length - 1; i >= 0; i--) {
        await walk(files[i], file);
      }
    } catch (err) {
      cnsl.error(`Slm failed (walk): ${err.stack}`);
    }
  }
};

/**
 * Tne runner for single commands and the watcher
 *
 * @param  {String}  dir  The base directory of the file
 */
const run = async (dir = VIEWS) => {
  try {
    let views = fs.readdirSync(dir).filter(view => view.includes(EXT));

    // Watcher command
    if (args.watch) {
      watcher.on('change', async changed => {
        if (process.env.NODE_ENV === 'development') {
          // Create local reference to log
          let local = changed.replace(process.env.PWD, '');

          // Check if the changed file is in the base views directory
          // let isView = views.some(view => changed.includes(view));

          // Check the parent directory of the changed file
          let hasView = views.some(view => {
            let pttrn = path.basename(view, EXT);

            return (
               path.dirname(changed).includes(pttrn) &&
              !path.dirname(changed).includes(VIEWS)
            );
          });

          // Check that the file is in the views directory
          let inViews = changed.includes(VIEWS);

          cnsl.watching(`Detected change on ${alerts.str.path(`.${local}`)}`);

          // Run the single compiler task if the changed file is a view or has a view
          // if (isView || hasView) {
          let pttrn = path.basename(path.dirname(changed));
          let view = path.join(dir, pttrn + EXT);

          changed = (hasView) ? view : changed;

          if (hasView || inViews) {
            main(changed);
          } else {
          // Walk if the changed file is in the views directory
          // such as a layout template or partial
            await walk(dir);
          }
        } else {
          await walk(dir);
        }
      });

      cnsl.watching(`Slm watching ${alerts.str.ext(GLOBS.map(g => g.replace(process.env.PWD, '.')).join(', '))}`);
    } else {
      await walk(dir);

      cnsl.success(`Slm finished`);

      process.exit(0);
    }
  } catch (err) {
    cnsl.error(`Slm failed (run): ${err.stack}`);
  }
};

/** @type {Object} Export our methods */
module.exports = {
  main: main,
  run: run,
  config: CONFIG
};
