const concurrently = require('concurrently');
const env = [
  'node_modules/.bin/cross-env NODE_ENV=development',
  'node_modules/.bin/cross-env PORT=$npm_package_config_port'
].join(' ');

concurrently([
  `${env} npm run *:watch`,
  `${env} npm run serve`,
  `${env} npm run sync`
]);