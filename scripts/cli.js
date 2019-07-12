#!/usr/bin/env node

let script = process.argv.splice(2, 1);

let commands = {
  "start": "cross-env NODE_ENV=development cross-env PORT=$npm_package_config_port concurrently \"npm run *:watch\" \"npm run serve\" \"npm run sync\"",
  "start:production": "cross-env NODE_ENV=production cross-env PORT=$npm_package_config_port concurrently \"npm run *:watch\" \"npm run serve\" \"npm run sync\"",
  "predeploy": "cross-env NODE_ENV=production concurrently \"npm run svgs\" \"npm run styles\" \"npm run scripts\" \"npm run build\"",
  "serve": "cross-env PORT=$npm_package_config_port node .app/serve.js --ext slm --watch src",
  "build": "cross-env VARS=$npm_package_config_vars node .app/build.js",
  "build:watch": "nodemon -e slm,md --watch src -x 'npm run build'",
  "publish": "npm run build && cross-env NODE_ENV=production node .app/publish.js",
  "publish:development": "npm run build && cross-env NODE_ENV=development node .app/publish.js",

  // "scripts": "rollup -c ./config/rollup.js",
  // "scripts:watch": "rollup -c ./config/rollup.js -w",

  "sync": "browser-sync start --files \"src\" --no-open --no-ui --reload-delay 2000 --proxy \"http://localhost:$npm_package_config_port\"",

  // "styles": "npm run styles:variables && npm run styles:sass && npm run styles:postcss",
  // "styles:variables": "node .app/variables.js",
  // "styles:sass": "node .app/sass.js",
  // "styles:postcss": "node .app/postcss.js",
  // "styles:watch": "nodemon --ext scss --watch src --ignore _variables.scss -x \"npm run styles\"",

  "svgs": "npm run svgs:optimize && npm run svgs:symbol",
  "svgs:optimize": "svgo -f ./src/svg -o ./dist/svg --disable=convertPathData",
  "svgs:symbol": "svgstore -o ./dist/icons.svg ./dist/svg/*.svg --inline",
  "svgs:watch": "nodemon --ext svg --watch ./src/svg -x \"npm run svgs\"",

  "design:sketch": "html-sketchapp --viewports.Desktop 1024x768 --file dist/sketch.html --out-dir dist/design/sketch",
  "make": "node .app/make.js"
};

require(`./${script}.js`);