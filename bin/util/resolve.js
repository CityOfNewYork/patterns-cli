const path = require('path');
const fs = require('fs');

/**
 * ES Module support. Import returns a promise that must be loaded synchronously
 *
 * @param  {String}  file  Resolved module path to import
 *
 * @return {Module}
 */
const es = async (file) => {
  let resolved = await import(file);

  return (resolved.default) ? resolved.default : resolved;
};

/**
 * Return a resolved module. It will first look for the file in a patterns
 * project, if not found it will use the framework file instead. If it exists
 * in neither an error will be thrown. Supports ES modules with .mjs extension
 * through th edynamic import() method. Using ES modules has a few caveats as
 * noted in the Node.js documentation for ES import.
 *
 * @param   {String}   file   The file to resolve
 * @param   {Boolean}  req    Include the file or return a string
 * @param   {Boolean}  cache  Require from cache or delete cache (CJS only)
 *
 * @return  {Module}          The resolved module
 */
module.exports = (file = '', req = true, cache = true) => {
  try {
    let pwd = path.join(process.env.PWD, file);
    let local = path.join(__dirname, '../../', file);
    let resolved = '';

    let isEs = (
      file.includes('.mjs') ||
      fs.existsSync(pwd + '.mjs') ||
      fs.existsSync(local + '.mjs')
    );

    /**
     * ES Module Import
     *
     * Module import does not support require.resolve or cache clearing.
     */

    if (isEs) {
      resolved = fs.existsSync(`${pwd}`) ? pwd : local;

      if (req) resolved = es(resolved);

    /**
     * CommonJS Require
     */

    } else {
      resolved = (
        fs.existsSync(pwd + '.js') ||
        fs.existsSync(pwd + '.json') ||
        fs.existsSync(pwd)
      ) ? require.resolve(pwd) : require.resolve(local);

      if (!cache) {
        delete require.cache[resolved];
      }

      if (req) resolved = require(resolved);
    }

    return resolved;
  } catch (error) {
    console.dir(error);
  }
};