# NYCO Patterns Framework

## Installation

    $ npm install @nycopportunity/patterns-framework --save-dev

    $ npm link @nycopportunity/patterns-framework

Add the [./config](https://github.com/CityOfNewYork/nyco-patterns-framework/tree/master/config) directory to the root your pattern library.

Optionally, but recommended, add the following npm scripts to your Patterns Library;

    "scripts": {
      "start": "cross-env NODE_ENV=development cross-env PORT=7070 concurrently \"pttrn default -w\" \"pttrn serve -w\" -p \"none\"",
      "preversion": "cross-env NODE_ENV=production pttrn default",
      "prepublishOnly": "cross-env NODE_ENV=production pttrn default",
      "publish": "cross-env NODE_ENV=production pttrn publish"
    },

Start the development server (assuming you've added the npm scripts above to your package.json);

    npm start

## Scripts

The Patterns Framework is a Node.js application that uses various libraries—including Express, Rollup.js, Node Sass, Nodemon, and Concurrently run a development server and build tasks for Style, JavaScript, SVG, and Views. This is all managed via [npm scripts](https://docs.npmjs.com/misc/scripts) in the package.json and the cli command `pttrn {{ script }}`. Configuration for the various scripts can be found in the **config/** directory.

    $ pttrn default

    $ pttrn scripts

    $ pttrn styles

    $ pttrn svgs

    $ pttrn build

    $ pttrn serve

    $ pttrn publish

More details to come!