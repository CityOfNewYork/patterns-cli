const path = require('path');
const fs = require('fs');

module.exports = (pkg) => {
  return fs.existsSync(path.join(__dirname, '../../', 'node_modules', pkg));
};
