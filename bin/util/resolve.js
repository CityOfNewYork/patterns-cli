const path = require('path');
const fs = require('fs');

/**
 * Return a resolved module. It will first look for the file in a patterns
 * project, if not found it will use the framework file instead. If it exists
 * in neither an error will be thrown.
 *
 * @param   {String}  file  The file to resolve
 *
 * @return  {Module}        The resolved module
 */
module.exports = (file = '', req = true) => {
  let pwd = path.join(process.env.PWD, file);
  let local = path.join(__dirname, '../../', file);
  let resolved = (
      fs.existsSync(`${pwd}.js`) ||
      fs.existsSync(`${pwd}.json`) ||
      fs.existsSync(`${pwd}`)
    ) ? require.resolve(pwd) : require.resolve(local);

  return (req) ? require(resolved) : resolved;
};