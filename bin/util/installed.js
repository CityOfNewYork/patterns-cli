const path = require('path');
const fs = require('fs');

module.exports = (pkg) => {
  return fs.existsSync(path.join(process.env.PWD, 'node_modules', pkg));
};
