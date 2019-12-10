# NYCO Patterns Framework

Command line utility for NYC Opportunity Patterns ([ACCESS NYC Patterns](https://accesspatterns.cityofnewyork.us), [NYCO Patterns](https://nycopatterns.cityofnewyork.us)) + Cross-pattern utility library.

* 💅 Compiles stylesheets using [node-sass](https://github.com/sass/node-sass) and [PostCSS](https://postcss.org/).
* 🗞 Bundles JavaScript ES using [rollup.js](https://rollupjs.org/guide/en/).
* 🗜️ SVG icon optimizer and sprite generator using [svgo](https://github.com/svg/svgo) and [svgstore-cli](https://github.com/svgstore/svgstore-cli).
* ✨ Static site generator using [slm-lang](https://github.com/slm-lang).
* 🤓 Development environment using [Express.js](https://expressjs.com/).

Each major package accepts a [custom configuration file](https://github.com/CityOfNewYork/nyco-patterns-framework/tree/master/config). Additionally, this package can be extended with additional npm packages and custom [npm scripts](https://docs.npmjs.com/misc/scripts).

## Installation

    $ npm install @nycopportunity/patterns-framework --save-dev

    $ npm link @nycopportunity/patterns-framework

**$2** Copy the [./config](https://github.com/CityOfNewYork/nyco-patterns-framework/tree/master/config) directory into the root your pattern library.

**$3** If you are using any of the [optional dependencies](#optional-dependencies) used by the scripts in the <u>./config</u> directory you will need to install them manually.

**$4** *Recommended*. Add the following npm scripts to your Patterns Library;

    "scripts": {
      "start": "cross-env NODE_ENV=development cross-env PORT=7070 concurrently \"pttrn default -w\" \"pttrn serve -w\" -p \"none\"",
      "default": "cross-env NODE_ENV=production pttrn default",
      "version": "npm run default && git add .",
      "prepublishOnly": "git push && git push --tags",
      "publish": "cross-env NODE_ENV=production pttrn publish"
    },

**$5** Start the development server (assuming you've added the [npm scripts](#npm-scripts) above to your package.json);

    npm start

### NPM Scripts

The recommended [npm scripts](https://docs.npmjs.com/misc/scripts) create shortcuts for using the cli.

Command                         | Args              | Description
--------------------------------|-------------------|-
`start`                         |                   | Starts the development environment.
`run default`                   |                   | Runs a one-off compilation of all assets to the distribution directory.
`version {{major/minor/patch}}` | major/minor/patch | Runs the `default` script and creates a new release using [npm's semantic versioning command](https://docs.npmjs.com/cli/version).
`publish`                       |                   | Publish to the npm registry. This will run `prepublishOnly` and `publish` scripts in the recommended [npm scripts](#npm-scripts) above as well which push all tags to GitHub. Publishing requires running the `version` script before publishing.

## CLI

Individal commands can be executed using the `pttrn` command which maps to this package's bin script. Avaliable commands can be seen below.

    pttrn {{ command }}

Each script has corresponding configuration files in the **config/** directory.

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

### Make

Details about the make script to come. For now, refer to the documentation in the [ACCESS NYC Patterns > Developer Tools > Make Script documentation](https://accesspatterns.cityofnewyork.us/developer-tools#make-script).


## Optional dependencies

The following dependencies are optional as they are used by configuration files. If your pattern library uses them they will need to be added manually.

    autoprefixer
    chalk
    css-mqpacker
    cssnano
    eslint-config-google
    node-emoji
    rollup-plugin-babel
    rollup-plugin-buble
    rollup-plugin-commonjs
    rollup-plugin-node-resolve
    rollup-plugin-replace
    stylelint-config-standard
    tailwindcss

# Troubleshooting

* Some scripts require setting the `NODE_ENV` version to `production` or `development` in order to run.
* `npm link` creates a symlink to *node_modules/@nycopportunity/patterns-framework* in the global node folder. If you are using `nvm` to manage versions of node, be sure you are using the correct version of node in your project directory.

More details to come!

---

![The Mayor's Office for Economic Opportunity](NYCMOEO_SecondaryBlue256px.png)

[The Mayor's Office for Economic Opportunity](http://nyc.gov/opportunity) (NYC Opportunity) is committed to sharing open source software that we use in our products. Feel free to ask questions and share feedback. **Interested in contributing?** See our open positions on [buildwithnyc.github.io](http://buildwithnyc.github.io/). Follow our team on [Github](https://github.com/orgs/CityOfNewYork/teams/nycopportunity) (if you are part of the [@cityofnewyork](https://github.com/CityOfNewYork/) organization) or [browse our work on Github](https://github.com/search?q=nycopportunity).