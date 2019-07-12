const concurrently = require('concurrently');
const PORT = process.env.PORT || '7000';
const prefix = '[sync]';

concurrently([
  `node_modules/.bin/browser-sync start --files \"src\" --no-open --no-ui --reload-delay 2000 --proxy \"http://localhost:${PORT}\"`
], {
  prefix: prefix
});