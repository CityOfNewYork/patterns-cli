const path = require('path');

module.exports = {
  'src': path.join(process.env.PWD, 'src'),
  'dist': path.join(process.env.PWD, 'dist'),
  'entry': 'entry',
  'ext': '.ext'
};
