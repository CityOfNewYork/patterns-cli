const path = require('path');
const fs = require('fs');

/**
 * Return a resolved module. It will first look for the file in a patterns
 * project, if not found it will use the framework file instead. If it exists
 * in neither an error will be thrown.
 *
 * @param   {String}   file   The file to resolve
 * @param   {Boolean}  req    Require the file or return a string
 * @param   {Boolean}  cache  Require from cache or delete cache
 *
 * @return  {Module}          The resolved module
 */
module.exports = (file = '', req = true, cache = true) => {
  try {
    let pwd = path.join(process.env.PWD, file);
    let local = path.join(__dirname, '../../', file);
    let resolved = (
        fs.existsSync(`${pwd}.js`) ||
        fs.existsSync(`${pwd}.json`) ||
        fs.existsSync(`${pwd}`)
      ) ? require.resolve(pwd) : require.resolve(local);

    if (!cache) {
      delete require.cache[resolved];
    }

    return (req) ? require(resolved) : resolved;
  } catch (error) {
    console.dir(error);
  }
};