# NYCO Patterns Framework

## Installation

    $ npm install @nycopportunity/patterns-framework --save-dev

    $ npm link @nycopportunity/patterns-framework

Add the [./config](https://github.com/CityOfNewYork/nyco-patterns-framework/tree/master/config) directory to the root your pattern library.

If you are using any of the [optional dependencies](#optional-dependencies) used by the scripts in the <u>./config</u> directory you will need to install them manually.

**Recommended**. Add the following npm scripts to your Patterns Library;

    "scripts": {
      "start": "cross-env NODE_ENV=development cross-env PORT=7070 concurrently \"pttrn default -w\" \"pttrn serve -w\" -p \"none\"",
      "preversion": "cross-env NODE_ENV=production pttrn default",
      "prepublishOnly": "cross-env NODE_ENV=production pttrn default",
      "publish": "cross-env NODE_ENV=production pttrn publish"
    },

Start the development server (assuming you've added the npm scripts above to your package.json);

    npm start

[CLI commands](#commands) can be executed using the `pttrn` command. Avaliable commands can be seen below.

    pttrn {{ command }}

Versioning uses the default `npm version` command. This will run the `preversion` command in the recommended NPM Scripts.

    npm version {{ major/minor/patch }}

Publishing to the registry uses the default `npm publish` command. This will run `prepublishOnly` and `publish` commands in the recommended NPM Scripts above as well. Publishing requires a new tag/version before publishing.

    npm publish

**Upgrading a current NYC Opportunity Patterns Library**

Once the framework is installed as a dependency of the library you can delete the <u>.app/</u> directory and remove any dependencies from the library listed in the framework's [package.json](https://github.com/CityOfNewYork/nyco-patterns-framework/blob/master/package.json) dependency object. Keep in mind, you will need to keep any [optional dependencies](#optional-dependencies) that the library is using. These may include specific plugins for Rollup and Vue.

Remove **rollup-plugin-eslint** from the <u>./config/rollup.js</u> file if used. Linting is now done through a corresponding [Script](#scripts). Update esLint configuration in the <u>./package.json</u> file

A few configuration files were renamed to keep parity with their corresponding [Scripts](#scripts) name. Rename <u>./config/styles.js</u> to <u>./config/sass.js</u> and rename <u>./config/site.js</u> to <u>./config/slm.js</u>.

## Scripts

The Patterns Framework is a Node.js application that uses various libraries—including [Express](https://expressjs.com/), Rollup.js, Sass, PostCSS, Nodemon, and Concurrently to run a development server and build tasks for Style, JavaScript, SVG, and static page views. This is all managed via the cli command `pttrn {{ script }}` and [npm scripts](https://docs.npmjs.com/misc/scripts) in the package.json. Configuration for the application can be found in the **config/** directory.

### Commands

Command     | Configuration                      | Optional&nbsp;Flags | Description
------------|------------------------------------|---------------------|-
`default`   |                                    | -w -n               | Lints files then asynchronously runs the _scripts_, _styles_, _svg_, and _build_ scripts (detailed below).
`serve`     |                                    | -w -n               | Starts and Express app that serves the static files in the <u>./dist/</u> directory.
`make`      | <u>make.js</u>                     |                     | Starts a survey prompt for creating a new pattern using templates defined in the configuration. [More details below](#make).
`lint`      | <u>package.json</u>                |                     | Lints JS and SASS files in the <u>./src/</u> directory using the `eslintConfig` and `stylelintConfig` objects in the <u>package.json</u> file.
`rollup `   | <u>rollup.js</u>                   | -w -n               | Runs Rollup.js, compiling pattern scripts defined in the configuration from ES Modules into CommonJS and/or iffe modules.
`styles`    |                                    | -w                  | Syncronously runs the _variables_, _sass_, and _postcss_ scripts (detailed below).
`variables` | <u>variables.js</u>                | -w -n               | Converts <u>./config/variables.js</u> into <u>./src/config/_variables.scss</u>.
`sass`      | <u>sass.js</u>                     |                     | Processes pattern Sass stylesheets defined in the configuration into CSS.
`postcss`   | <u>sass.js</u>, <u>postcss.js</u>  |                     | Runs PostCSS on Patterns CSS stylesheets defined in the <u>./config/sass.js</u> into CSS. PostCSS plugins are defined in the configuration.
`svgs`      |                                    | -w -n               | Optimizes SVGS in the <u>./src/svg/</u> directory into the <u>./dist/svg</u> directory and creates an svg sprite for library icons in the <u>./dist/icons.svg</u> file.
`slm`       | <u>variables.js</u>, <u>slm.js</u> | -w                  | Compiles Slm Lang files in <u>./src/views/</u> directory into static .html pages in the <u>./dist</u> directory.
`locals`    | <u>variables.js</u>, <u>slm.js</u> |                     | This isn't a CLI script but it exports the local variables for the Slm Lang templates.
`publish`   | <u>publish.js</u>                  |                     | Publishes the <u>./dist</u> directory to the `gh-pages` branch of the repository.

### Flags

Flag | Full&nbsp;Flag | Description
-----|----------------|-
`-w` | `--watch`      | Use [Nodemon](https://www.npmjs.com/package/nodemon) to watch source files and rerun the command when changes are made.
`-n` | `--noisy`      | Some commands use [ShellJS](https://www.npmjs.com/package/shelljs) to execute other command line tasks. By default, their native output is silenced by configuring ShellJS to execute commands silently. This will allow those commands to show their native output.

## Make

Details about the make script to come. For now, refer to the documentation in the [ACCESS NYC Patterns, Developer Tools, Make Script documentation](https://accesspatterns.cityofnewyork.us/developer-tools#make-script).

## Optional dependencies

The following dependencies are optional as they are used by configuration files. If your pattern library uses them they will need to be added manually.

    "autoprefixer": "^9.6.1",
    "chalk": "^2.4.2",
    "css-mqpacker": "^7.0.0",
    "cssnano": "^4.1.10",
    "eslint-config-google": "^0.13.0",
    "node-emoji": "^1.10.0",
    "rollup-plugin-babel": "^4.3.3",
    "rollup-plugin-buble": "^0.19.8",
    "rollup-plugin-commonjs": "^10.0.1",
    "rollup-plugin-node-resolve": "^5.2.0",
    "rollup-plugin-replace": "^2.2.0",
    "stylelint-config-standard": "^18.2.0",
    "tailwindcss": "^1.0.5"

More details to come!