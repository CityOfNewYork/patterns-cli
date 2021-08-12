# Patterns CLI

### Make, develop, and publish!

A front-end CLI for managing static design pattern libraries. Created and maintained by [**@NYCOpportunity**](https://github.com/NYCOpportunity). For examples of what the CLI can create and manage, look at our existing pattern libraries; [Working NYC Patterns](https://cityofnewyork.github.io/nyco-wnyc-patterns), [NYCO Patterns](https://nycopatterns.cityofnewyork.us), [ACCESS NYC Patterns](https://accesspatterns.cityofnewyork.us), and [Growing Up NYC Patterns](https://github.com/NYCOpportunity/growingupnyc-patterns). Essentially, the CLI is a static generator with the following extra features.

* 📦 Creates and organizes component libraries using a [design system methodology](#design-system-methodology).

* 🌈 Manages [design tokens](#design-tokens) in JSON format amd works well with [Tailwindcss](https://tailwindcss.com/).

* ⚛️ Agnostic of existing JavaScript Frameworks. Use it to manage a customized component library or extend the default module templates to build out Vanilla ES, [React](https://reactjs.org/), [Vue.js](https://vuejs.org/), or [Svelte](https://svelte.dev/) components.

* 🚀 Scripts for publishing a pattern library to [npm](https://www.npmjs.com/) for open sourcing and integration into multiple digital products.

* 🤸 Ensures accessibility during development by linting rendered HTML with [Pa11y](https://pa11y.org/).

* ⚙️ Highly configurable and pluggable for a particular project's needs.

#### Background

This project started to make building and documenting accessible, CSS–first, and framework–free pattern libraries quick, easy, and fun, doing so without task runners and a minimal amount of JavaScript to tie it all together. It does this very well, and over time it has grown into a build system of its own, so acknowledging this as an in-house alternative is essential. Other pattern build systems with more extensive community support also exist and are well worth a look. These include [Storybook.js](https://storybook.js.org/), [Fractal](https://fractal.build/), [Pattern Lab](https://patternlab.io/), and possibly more.

## I want to

* [Browse the features](#features).

* [View the documentation](#contents).

* [Quick start a new project](#scaffold-command). Run the following command.

```shell
$ npx @nycopportunity/pttrn scaffold && npm install
```

## Features

### ✨ Make module-based patterns

The CLI has several commands, including `make`, for quickly generating new pattern modules using file templates.

```shell
$ npx pttrn make component accordion

✨ Created ./src/components/accordion/accordion.slm
✨ Created ./src/components/accordion/accordion.md
✨ Created ./src/components/accordion/_accordion.scss
```

Templates can be extended to create files to support the framework of your choosing.

### Design System Methodology

All design pattern source code will be organized into four directories: **Elements**, **Components**, **Objects**, and **Utilities** (by default). The CLI takes care of the organization for you, creating the necessary files based on configurable templates.

```
📂 src
├ 📁 elements
├ 📂 components
  └ 📂 accordion
    ├ accordion.slm   - Markup
    ├ accordion.js    - JavaScript
    ├ _accordion.scss - Styling
    ├ accordion.md    - Documentation
    └ readme.md       - Developer Usage
├ 📁 objects
└ 📁 utilities
```

### 🔌 Demonstrate and document markup once

Write dynamic and reusable markup used to create live demonstrations and document markup once using [slm-lang](https://github.com/slm-lang) (an HTML template language inspired by Pug).

```pug
- this.accordion = {}
- this.accordion.id = this.createId()
- this.accordion.active = true

- if (typeof accordion !== 'undefined')
  - this.accordion = Object.assign(this.accordion, accordion);

article class='c-accordion'
  header class='c-accordion__header'
    /! { @data-js        "accordion" initalizes the Accordion toggle }
    /! { @aria-controls  Targets the Accordion body }
    /! { @aria-expanded  Indicates if the Accordion body is open or not }
    button class='c-accordion__toggle w-full text-start print:hidden ${this.accordion.active ? 'active' : ''}' data-js='accordion' aria-controls='aria-c-${this.accordion.id}' aria-expanded='${this.accordion.active.toString()}'
      span class='c-accordion__heading mt-0' id='aria-lb-${this.accordion.id}'
        span = this.accordion.title

      span class='c-accordion__toggle-active'
        svg class='icon-wnyc-ui' aria-hidden='true'
          use xlink:href='#icon-wnyc-ui-chevron-down'

        span class='sr-only' hide this list

      span class='c-accordion__toggle-inactive'
        svg class='icon-wnyc-ui' aria-hidden='true'
          use xlink:href='#icon-wnyc-ui-chevron-up'

        span class='sr-only' show this list

  /! { @id               Target of the Accordion toggle. Must match the "aria-controls" attribute of the toggling button }
  /! { @role             Indicates an area of significance }
  /! { @aria-labelledby  Associates the Accordion body with the header text }
  /! { @aria-hidden      Indicates if the Accordion body is open or not }
  div id='aria-c-${this.accordion.id}' role='region' class='c-accordion__body bg-scale-3 print:active hidden:overflow animated ${this.accordion.active ? 'active' : 'hidden'}' aria-labelledby='aria-lb-${this.accordion.id}' aria-hidden='${this.accordion.active ? 'false' : 'true'}'
    div class='c-accordion__padding'
      = this.accordion.body
```

### 💅 Style using [Dart Sass](https://sass-lang.com/dart-sass)

Dart Sass has many perks such as module-based dependencies. Additionally, CSS post-processing can be customized with [PostCSS](https://postcss.org/) plugins. [LibSass](https://sass-lang.com/libsass) is also supported if desired.

```scss
// Dependencies
@use 'config/dimensions';
@use 'config/media';
@use 'config/interaction';

// Declarations
.c-accordion {
  margin: 0 0 dimensions.$spacing-base;
}

.c-accordion__header {
  padding: dimensions.$spacing-base;
}

.c-accordion__heading {
  flex: 1;
  font-weight: bold;
  margin: 0;
}

.c-accordion__toggle {
  text-decoration: underline;
  display: inline-flex;
  align-items: center;

  * {
    @include interaction.disable-pointer-events
  }
}

.c-accordion__toggle-active,
.c-accordion__toggle-inactive {
  align-items: center;
}

.c-accordion__toggle-active {
  display: none;
  visibility: hidden;

  .c-accordion__toggle.active & {
    @include interaction.disable-pointer-events;
    display: inline-flex;
    visibility: visible
  }
}

.c-accordion__toggle-inactive {
  @include interaction.disable-pointer-events;
  display: inline-flex;
  visibility: visible;

  .c-accordion__toggle.active & {
    display: none;
    visibility: hidden
  }
}

.c-accordion__padding {
  padding: dimensions.$spacing-base
}

.c-accordion__padding > *:last-child {
  margin-bottom: 0
}
```

### 🤸 Lint for accessibility issues using Pa11y

[Pa11y CI](https://github.com/pa11y/pa11y-ci) will run tests and provide suggestions for accessibility compliance.

```shell
⏳ Running Pa11y CI on ./dist/web-share.html
🤸 Pa11y suggestions for ./dist/web-share.html
<pre><code>import WebShare from '@ny...</pre>
axe     error   Ensure that scrollable region has keyboard access (https://dequeuniversity.com/rules/axe/3.5/scrollable-region-focusable?application=axeAPI)  scrollable-region-focusable

⏳ Running Pa11y CI on ./dist/utility.html
🤸 Pa11y suggestions for ./dist/utility.html
<a class="ms-3 btn btn-secondary btn-link" href="#next-steps">Next steps</a>
htmlcs  error   This link points to a named anchor "next-steps" within the document, but no anchor exists with that name.  G124.NoSuchID

⏳ Running Pa11y CI on ./dist/text-controller.html
✨ No Pa11y suggestions for ./dist/text-controller.html
⏳ Running Pa11y CI on ./dist/tables.html
🤸 Pa11y suggestions for ./dist/tables.html
<table class="table-headers-first-column"><thead>...</table>
htmlcs  error   The relationship between td elements and their associated th elements is not defined. Use either the scope attribute on th elements, or the headers attribute on td elements.  H63

<table class="table-headers-sticky"><thead>...</table>
htmlcs  error   The relationship between td elements and their associated th elements is not defined. Use either the scope attribute on th elements, or the headers attribute on td elements.  H63

⏳ Running Pa11y CI on ./dist/selects.html
🤸 Pa11y suggestions for ./dist/selects.html
<select id="ba1a47a76758b" name="" required="true"><option sele...</select>
axe     error   Form elements must have labels (https://dequeuniversity.com/rules/axe/3.5/label?application=axeAPI)  label

<select id="ba1a47a76758b" name="" required="true"><option sele...</select>
htmlcs  error   This select element does not have a name available to an accessibility API. Valid names are: label element, title undefined, aria-label undefined, aria-labelledby undefined.  WCAG2AA.Principle4.Guideline4_1.4_1_2.H91.Select.Name

<select id="ba1a47a76758b" name="" required="true"><option sele...</select>
htmlcs  error   This form field should be labelled in some way. Use the label element (either with a "for" attribute or wrapped around the form field), or "title", "aria-label" or "aria-labelledby" attributes as appropriate.  WCAG2AA.Principle1.Guideline1_3.1_3_1.F68
```

### 🗞 Script using ES module syntax.

Library scripts are bundled using [rollup.js](https://rollupjs.org/guide/en/). Use the [library of utility ES modules](https://github.com/CityOfNewYork/patterns-scripts) to help keep scripting DRY.

```javascript
'use strict';

import Toggle from '@nycopportunity/pttrn-scripts/src/toggle/toggle';

/**
 * The Accordion module
 *
 * @class
 */
class Accordion {
  /**
   * @constructor
   *
   * @return  {object}  The instantiated accordion component
   */
  constructor() {
    this.toggle = new Toggle({
      selector: Accordion.selector
    });

    return this;
  }
}

/** @type {String} The dom selector for the module */
Accordion.selector = '[data-js*="accordion"]';

export default Accordion;
```

### ⚫ Manage design tokens in JavaScript

[Design Tokens](#design-tokens) are compiled to a Sass map and can be imported into a [Tailwindcss](https://tailwindcss.com/docs/installation#create-your-tailwind-config-file) config for creating a single source between JavaScript, Sass files, and CSS utilities.

```javascript
module.exports = {
  'output': '"./src/config/_tokens.scss"',
  'border': {
    'width': '3px',
    'style': 'solid',
    'radius': '16px'
  },
  'color': {
    'white': '#FFF',
    'blue': '#284CCA',
    'red': '#FC5D52',
    'gray': '#E6E8EC'
  },
  'font-family': {
    'system': ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Oxygen-Sans', 'Ubuntu', 'Cantarell', '"Helvetica Neue"', 'sans-serif'],
    'monospace': 'monospace'
  },
  'font': {
    'body': 'system',
    'pre': 'monospace'
  },
  'font-weight': {
    'body': 'normal',
    'pre': 'normal'
  },
  'font-style': {
    'body': 'normal',
    'pre': 'normal'
  },
  'font-size': {
    'body': '1em',
    'pre': '0.9em'
  },
  'line-height': {
    'body': '1.2',
    'pre': '1.5'
  },
  'grid': '8px', // 8px grid system
  'typography': {
    'small': '16px',
    'mobile': '18px',
    'tablet': '20px',
    'desktop': '22px'
  }
};
```

### 🗜️ Optimize and generate SVG sprites

Uses [svgo](https://github.com/svg/svgo) to optimize individual svgs and [svgstore-cli](https://github.com/svgstore/svgstore-cli) to concatenate an SVG sprite for rendering icons and vector graphics.

```shell
🗜️  Svgs in ./src/svg/shape-c.svg out ./dist/svg/pttrn-shape-c.svg
🗜️  Svgs in ./src/svg/shape-b.svg out ./dist/svg/pttrn-shape-b.svg
🗜️  Svgs in ./src/svg/shape-a.svg out ./dist/svg/pttrn-shape-a.svg
🗜️  Svgs in ./src/svg/select-chevrons.svg out ./dist/svg/pttrn-select-chevrons.svg
🗜️  Svgs in ./src/svg/option-radio.svg out ./dist/svg/pttrn-option-radio.svg
🗜️  Svgs in ./src/svg/option-checkbox.svg out ./dist/svg/pttrn-option-checkbox.svg
🗜️  Svgs in ./src/svg/logo-standard.svg out ./dist/svg/pttrn-logo-standard.svg
🗜️  Svgs in ./src/svg/logo-stacked.svg out ./dist/svg/pttrn-logo-stacked.svg
🗜️  Svgs in ./src/svg/logo-partnership.svg out ./dist/svg/pttrn-logo-partnership.svg
🗜️  Svgs in ./src/svg/logo-nyc.svg out ./dist/svg/pttrn-logo-nyc.svg
🗜️  Svgs in ./src/svg/logo-google-translate.svg out ./dist/svg/pttrn-logo-google-translate.svg
📦 Svgs sprite written to ./dist/svg/svgs.svg
✨ Svgs finished
```

### 👀 Watch and serve assets

Watch for file changes using [Chokidar](https://github.com/paulmillr/chokidar) and serve distributed static assets to a local development environment using [Express.js](https://expressjs.com/).

```shell
$ npm start

> @nycopportunity/pttrn-starter@0.1.0 start @nycopportunity/pttrn-starter
> cross-env NODE_ENV=development cross-env PORT=7070 concurrently "pttrn default -w" "pttrn serve -w" -p "none"

👀 Serve watching ./dist/**/*.html, ./dist/css/*.css, ./dist/js/*.js
🤓 Serving ./dist/ to http://localhost:7070
👀 Slm watching ./config/slm.js, ./src/**/*.slm, ./src/**/*.md
👀 Svgs watching ./src/svg/**/*.svg
👀 Rollup watching ./config/rollup.js, ./src/**/*.js
👀 Styles watching ./src/**/*.scss, ./config/tokens.js, ./config/tailwindcss.js
```

### No config or custom build

Each major feature uses a [configuration file](config) for adjusting the settings of every CLI script. Additionally, the package can be extended with other npm packages and custom [npm scripts](https://docs.npmjs.com/misc/scripts).

```
├ 📂 config         - Configuration directory
  ├ 📂 make          - Templates for pattern files created by the make command
    ├ style.scss       - Sass Stylesheet template
    ├ markup.slm       - Markup template
    ├ markdown.md      - Usage, design specs, and other documentation
    ├ config.scss      - Sass variable and mixin storage
    ├ script.js        - JavaScript module template
    ├ readme.md        - Technical documentation such as JavaScript usage or installation
    └ view.slm         - View template for displaying the demonstration and documentation
  ├ make.js          - Make command settings
  ├ alerts.js        - Configure the icons and colors of alerts in the output
  ├ global.js        - Global paths and directories
  ├ lint.js          - ESLint and Style Lint
  ├ pa11y.js         - Settings for Pa11y linting
  ├ postcss.js       - PostCSS settings and plugins
  ├ publish.js       - Publish settings
  ├ rollup.js        - Rollup.js settings
  ├ sass.js          - Sass and Sass Module settings
  ├ slm.js           - slm-lang templating system settings
  ├ svgs.js          - Svg sprite settings for svgo and svgstore
  ├ tailwindcss.js   - Tailwindcss config file
  └ tokens.js        - Design tokens and json-to-scss settings
├ 📁 dist          - Static distribution directory
└ 📁 src           - Source directory
```

## Contents

* [Installation](#installation)
* [Guide: Start from scratch](#start-from-scratch)
  * [`make` command](#make-command)
  * [The file specs](#the-file-specs)
  * [Styles](#styles)
  * [Scripts](#scripts)
  * [Views](#views)
  * [Serve](#serve)
* [Guide: `scaffold` command](#scaffold-command)
* [Guide: `start` command](#start-command)
* [Guide: `publish` command](#publish-command)
* [Demo Source](#demo-source)
* [CLI](#cli)
  * [Executing the binary](#executing-the-binary)
  * [Commands](#commands): [`default`](#default), [`styles`](#styles), [`tokens`](#tokens), [`sass`](#sass), [`postcss`](#postCSS), [`rollup`](#rollup), [`lint`](#lint), [`slm`](#slm), [`pa11y`](#pa11y), [`svgs`](#svgs), [`scaffold`](#scaffold), [`make`](#make), [`serve`](#serve), [`publish`](#publish)
  * [Flags](#flags)
  * [Alerts](#alerts)
  * [Custom Commands](#custom-commands)
  * [NPM Scripts](#npm-scripts)
* [Guide: Adding Tailwindcss](#adding-tailwindcss)
* [Guide: Creating a new `make` command template](#creating-a-new-make-command-template)
* [Optional dependencies](#optional-dependencies)
* [Supporting Packages](#supporting-packages)

## Installation

**$1** Install as a normal dependency in a project.

```shell
$ npm install @nycopportunity/pttrn
```

If you need to start a new project you can run `npm init -y` before installing.

## Start from scratch

[... or quickly scaffold a new project](#scaffold-command)

### `make` command

**$2** Make a pattern by running `npx pttrn make {{ element/component/object/utility }} {{ pattern }}`

```shell
$ npx pttrn make component accordion

✨ Created ./src/components/accordion/accordion.slm
✨ Created ./src/components/accordion/accordion.md
✨ Created ./src/components/accordion/_accordion.scss

💅 Include the accordion stylesheet in your main Sass entry point. To create an independent distribution (optional) add the accordion stylesheet to your Sass configuration.

❓ Make a config file for accordion? y/n ↵
```

What just happened?

1. The make script has made required files for styling and documenting a component for you based on a few templates included with the Framework;
1. reminded you to add the stylesheet module to the global default stylesheet so it's compiled accordingly;
1. and prompted to create any of the other optional files specific to the accordion. If you decide not to make any of these files initially, they can be made by rerunning the `npx pttrn make component accordion {{ file }}` command. For the sake of this demonstration answer "yes" (y) to all of the questions.

```shell
✨ ./src/config/_accordion.scss was made.

❓ Make a view file for accordion? y/n ↵ y
✨ ./src/views/accordion.slm was made.

❓ Make a script file for accordion? y/n ↵ y
✨ ./src/components/accordion/accordion.js was made.

🌈 Import the accordion script into your main JavaScript entry point file and create a public function for it in the default class. To create an independent distribution (optional) add the accordion script to your Rollup configuration.

❓ Make a readme file for accordion? y/n ↵ y
✨ ./src/components/accordion/readme.md was made.
```

### The file specs

* **.slm** - files are used to define markup of the component using [slm-lang](https://github.com/slm-lang) that has a syntax inspired by Pug. It is also the HTML template language for all views in a Patterns Framework project
* **.md** - files are markdown files used to store the documentation of the pattern. Here you would describe types, variations, use cases, etc
* **.scss** - files are used to style the pattern. All Pattern Framework project styling is module-based
* **config** - A Sass configuration file where variables, mixins, functions, and other dependencies can be stored
* **view** - A static view template where the pattern may be demonstrated and documentation can be rendered
* **script** - An ES Module for JavaScript-enhanced patterns
* **readme** - A markdown file where the pattern documentation is written

### Styles

**$3** Create the default Sass entry point and add the newly created accordion component stylesheet to it.

```shell
$ mkdir -p src/scss && touch src/scss/default.scss
$ echo "@use 'components/accordion/accordion';" >> src/scss/default.scss
```

Open up **./src/components/accordion/_accordion.scss**. It will have the following contents:

```scss
/**
 * Accordion
 */

// Dependencies
@use 'config/tokens' as *;
// @use 'config/accordion';

// Declarations
.c-accordion { }
```

Edit the file as you wish (or change the background property to red; `background-color:red`). Be sure to add style attributes to the selector otherwise it will not compile. Then, run the following command:

```
$ npx pttrn styles
⚫ Tokens in @pttrn/config/tokens.js out ./src/config/_tokens.scss
🤓 Lint suggestions for ./src/scss/default.scss
💅 Sass in ./src/scss/default.scss out ./dist/css/default.css
💅 PostCSS on ./dist/css/default.css
✨ Styles finished
```

What just happened?

1. The default tokens configuration from the CLI were compiled to Sass.
1. StyleLint was run on the default Sass entry point.
1. The default Sass entry point was compiled to CSS.
1. PostCSS was run on the default CSS stylesheet.

Open up **./dist/css/default.css** to see the compiled stylesheet.

### Scripts

**$4** Create the default JavaScript entry point and add the newly created accordion component stylesheet to it.

```shell
$ mkdir -p src/js && touch src/js/default.js
```

Copy and paste the following into **./src/js/default.js**. This creates the main class that will have an API for the accordion module instantiation.

```javascript
import Accordion from '../components/accordion/accordion';

class Default {
  constructor() {
    if (process.env.NODE_ENV != 'production')
      console.dir('@pttrn Development Mode');

    return this;
  }

  accordion() {
    return new Accordion();
  }
};

export default Default;
```

Open up **./src/components/accordion/accordion.js**. It will have the following contents:

```javascript
'use strict';

class Accordion {
  /**
   * @param  {Object}  settings  This could be some configuration options.
   *                             for the pattern module.
   * @param  {Object}  data      This could be a set of data that is needed
   *                             for the pattern module to render.
   * @constructor
   */
  constructor(settings, data) {
    this.data = data;

    this.settings = settings;

    return this;
  }
}

/** @param  {String}  selector  The main selector for the pattern */
Accordion.selector = '[data-js*="accordion"]';

export default Accordion;
```

The contents of this file are optional, however, using class-based ES modules makes scoping JavaScript-enhanced patterns easier to scope. Edit the file as you wish and run:

```shell
$ npx pttrn rollup
🤓 ESLint suggestions for ./src/js/default.js
6:7     warn    Unexpected console statement. no-console
🗞️ Rollup in src/js/default.js out dist/js/default.js
✨ Rollup finished
```

What just happened? The default ES entry point from the CLI was linted and compiled in the iife format for browsers.

### Views

**$5** Create a layout for you pattern views.

```shell
$ mkdir -p src/slm/layouts && touch src/slm/layouts/default.slm
```

Copy and paste the following **slm** into the **src/slm/layouts/default.slm** file. Edit the file as you wish...

```pug
doctype html
html lang='en'
  head
    meta charset='utf-8'
    meta http-equiv='X-UA-Compatible' content='IE=edge'
    meta name='viewport' content='width=device-width, initial-scale=1'

    title My Patterns

    link rel='stylesheet' href='css/default.css'

  body
    header
      h1 My Patterns

    main
      = content('main')

    footer
      - let date = new Date();
      - let opts = {year: 'numeric', month: 'long', day: 'numeric'};
      p = `Last updated ${date.toLocaleDateString('en-US', opts)}`

    script src='js/default.js'

    javascript:
      let MyPatterns = new Default();

    = content('scripts')

    / The reload script. This should not be compile during production builds
    / @source https://www.npmjs.com/package/reload
    - if this.process.env.NODE_ENV !== 'production'
      script src='/reload/reload.js'
```

You'll need to instantiate the Accordion module in the default entry point class. Open **./src/views/accordion.slm** and add to the scripts block...

```

= content('scripts')

```

... the following script tag...

```
= content('scripts')
  javascript:
    MyPatterns.accordion();
```

... then run the command:

```shell
$ npx pttrn slm
✨ Slm in ./src/views/accordion.slm out ./dist/accordion.html
⏳ Running Pa11y CI on ./dist/accordion.html
✨ No Pa11y suggestions for ./dist/accordion.html
✨ Slm finished
```

What just happened?

1. The Accordion view **slm** file was compiled to HTML.
1. The command triggered the [Pa11y CI](https://github.com/pa11y/pa11y-ci) to lint the HTML output for accessibility issues. Linting for accessibility issues is a helpful perk of the CLI. No issues here!

Open up **./dist/accordion.html** to see the compiled accordion view.

### Serve

**$6** Start the development server to see view your work.

```shell
$ npx pttrn serve
🤓 Serving ./dist/ to http://localhost:7000
```

Open up **http://localhost:7000/accordion** to see the Accordion Component page. Want to make a change? For development purposes we'll want to run the server as well as watch scripts and reload when changes are made. The CLI uses [Concurrently](https://www.npmjs.com/package/concurrently) to run multiple commands so the binary is available to execute in the same way. Combine the `default` command with the `serve` command. Adding the `-w` or `--watch` flag enable change detection on both commands:

```shell
$ npx concurrently 'pttrn -w' 'pttrn serve -w'
[1] 👀 Serve watching ./dist/**/*.html, ./dist/**/*.css, ./dist/**/*.js
[1] 🤓 Serving ./dist/ to http://localhost:7000
[0] 👀 Slm watching @pttrn/config/slm.js, ./src/**/*.slm, ./src/**/*.md
[0] 👀 Svgs watching ./src/svg/**/*.svg
[0] 👀 Rollup watching @pttrn/config/rollup.js, ./src/**/*.js
[0] 👀 Styles watching ./src/**/*.scss, @pttrn/config/tokens.js, @pttrn/config/tailwindcss.js
```

What just happened? The default watching processes have been announced. Once you save a change to the file Chokidar will detect it and run default style tasks and reload the development server. Make a change to any file such as the **./src/components/accordion/accordion.scss**.

```shell
[0] 👀 Detected change on ./src/components/accordion/_accordion.scss
[0] ⚫ Tokens in @pttrn/config/tokens.js out src/config/_tokens.scss
[0] 🤓 Lint suggestions for ./src/scss/default.scss
[0] 💅 Sass in ./src/scss/default.scss out dist/css/default.css
[0] 💅 PostCSS on dist/css/default.css
[0] 👀 Serve reloading
```

The change was detected and the style scripts were run.

[Back to table of contents ^](#contents)

## `scaffold` command

The `scaffold` command will create a minimal base project with the following:

* A **package.json** file with the recommended [NPM Scripts](#npm-scripts) and this package as a development dependency.
* CSS only Details Component
* Configuration files for Tokens, Rollup.js, Sass, and Tailwindcss
* Simple Sass library
* Single page static demo site

If you are running the command in an empty directory or without a **package.json** file, run `$ npx @nycopportunity/pttrn scaffold` then run `$ npm install`. If `@nycopportunity/pttrn` is already installed as a dependency of your project's **package.json** file you can run the following command.

```shell
$ npx pttrn scaffold

./package.json already exists.
✨ ./src was made.
✨ ./src/views was made.
✨ ./src/views/index.slm was made.
✨ ./src/utilities was made.
✨ ./src/utilities/typography was made.
✨ ./src/utilities/typography/_typography.scss was made.
✨ ./src/utilities/tailwindcss was made.
✨ ./src/utilities/tailwindcss/_tailwindcss.scss was made.
✨ ./src/utilities/padding was made.
✨ ./src/utilities/padding/_padding.scss was made.
✨ ./src/utilities/color was made.
✨ ./src/utilities/color/_color.scss was made.
✨ ./src/svg was made.
✨ ./src/svg/a-perfect-heart.svg was made.
✨ ./src/svg/a-perfect-heart-red.svg was made.
✨ ./src/slm was made.
✨ ./src/slm/layouts was made.
✨ ./src/slm/layouts/default.slm was made.
✨ ./src/scss was made.
✨ ./src/scss/default.scss was made.
✨ ./src/scss/_imports.scss was made.
✨ ./src/objects was made.
✨ ./src/js was made.
✨ ./src/js/default.js was made.
✨ ./src/elements was made.
✨ ./src/elements/base was made.
✨ ./src/elements/base/_base.scss was made.
✨ ./src/elements/base/_base-first-last.scss was made.
✨ ./src/config was made.
✨ ./src/config/_type.scss was made.
✨ ./src/config/_tokens.scss was made.
✨ ./src/config/_grid.scss was made.
✨ ./src/config/_get.scss was made.
✨ ./src/config/_border.scss was made.
✨ ./src/components was made.
✨ ./src/components/details was made.
✨ ./src/components/details/details.slm was made.
✨ ./src/components/details/details.md was made.
✨ ./src/components/details/_details.scss was made.
✨ ./dist was made.
✨ ./config was made.
✨ ./config/tokens.js was made.
✨ ./config/tailwindcss.js was made.
✨ ./config/sass.js was made.
✨ ./config/rollup.js was made.
```

Then run the following to start the development server and start making.

```shell
$ npx concurrently 'pttrn -w' 'pttrn serve -w' -p 'none'

👀 Serve watching ./dist/**/*.html, ./dist/**/*.css, ./dist/**/*.js
🤓 Serving ./dist/ to http://localhost:7000
👀 Slm watching ./config/slm.js, ./src/**/*.slm, ./src/**/*.md
👀 Svgs watching ./src/svg/**/*.svg
👀 Rollup watching ./config/rollup.js, ./src/**/*.js
👀 Styles watching ./src/**/*.scss, ./config/tokens.js, ./config/tailwindcss.js
```

[Back to table of contents ^](#contents)

## `start` command

Add this `start` script in your **package.json** file to create a shorthand for the development server command.

```json
"scripts": {
  "start": "cross-env NODE_ENV=development cross-env PORT=7000 concurrently \"pttrn -w\" \"pttrn serve -w\" -p \"none\""
}
```

This will hook into npm script's default start command for your project. Once this script is in place starting the server and watching files becomes can be done with the following command:

```shell
$ npm start

> patterns-demo@1.0.0 start patterns-demo
> cross-env NODE_ENV=development cross-env PORT=7000 concurrently "pttrn default -w" "pttrn serve -w" -p "none"

👀 Serve watching ./dist/**/*.html, ./dist/**/*.css, ./dist/**/*.js
🤓 Serving ./dist/ to http://localhost:7070
👀 Slm watching @pttrn/config/slm.js, ./src/**/*.slm, ./src/**/*.md
👀 Svgs watching ./src/svg/**/*.svg
👀 Rollup watching @pttrn/config/rollup.js, ./src/**/*.js
👀 Styles watching ./src/**/*.scss, @pttrn/config/tokens.js, @pttrn/config/tailwind.js
```

[Back to table of contents ^](#contents)

## `publish` command

Before publishing, you'll need to have Git initialized for your project. The following lines will do just that and add prevent **/node_modules** from being committed to your project. You can skip these steps if you already have this setup.

```shell
$ git init
$ touch .gitignore
$ echo '/node_modules' >> .gitignore
```

You will also need a remote git repository with the repository settings, specifically the URL, are configured in your **package.json** file. Below is an example:

```json
"repository": {
  "type": "git",
  "url": "https://github.com/CityOfNewYork/patterns-demo.git"
}
```

Adding the `version`, `prepublishOnly`, and `publish` scripts in your **package.json** file will create shorthands for quickly versioning and publishing your library on **npmjs.org**.

```json
"scripts": {
  "version": "pttrn && git add .",
  "prepublishOnly": "git push && git push --tags",
  "publish": "cross-env NODE_ENV=production pttrn publish"
}
```

You will want to start from a reasonable version number in your **package.json** file if starting a new project. Open it up and set the `version` value to `0.0.0`.

```json
"version": "0.0.0"
```

Then you can make the first commit by staging the working directory and committing.

```shell
$ git add .
$ git commit -m 'init'
```

When versioning your library you can pass `major`, `minor`, `patch`, or `prerelease` as the argument following [semantic versioning](https://semver.org/).

```shell
$ npm version minor
v0.1.0

> patterns-demo@0.1.0 version patterns-demo
> pttrn default && git add .

✨ Slm in ./src/views/accordion.slm out ./dist/accordion.html
🤸 Running Pa11y CI on ./dist/accordion.html
🗞️ Rollup in src/js/default.js out dist/js/default.js
✨ Rollup finished
⚫ Tokens in @pttrn/config/tokens.js out src/config/_tokens.scss
🤓 Lint suggestions for ./src/scss/default.scss
💅 Sass in ./src/scss/default.scss out dist/css/default.css
🤸 No Pa11y suggestions for ./dist/accordion.html
✨ Slm finished
💅 PostCSS on dist/css/default.css
✨ Styles finished
```

... then publish to [npm](https://www.npmjs.com/) for integration in other projects...

```shell
$ npm publish

> patterns-demo@0.1.0 prepublishOnly .
> git push && git push --tags

Enumerating objects: 5, done.
Counting objects: 100% (5/5), done.
Delta compression using up to 4 threads
Compressing objects: 100% (3/3), done.
Writing objects: 100% (3/3), 379 bytes | 379.00 KiB/s, done.
Total 3 (delta 2), reused 0 (delta 0)
remote: Resolving deltas: 100% (2/2), completed with 2 local objects.
To https://github.com/CityOfNewYork/patterns-demo
   40e700a9..330cbad2  master -> master
Everything up-to-date
npm notice
npm notice 📦  patterns-demo@0.1.0
npm notice === Tarball Contents ===
npm notice 71B   dist/css/default.css
npm notice 1.1kB dist/accordion.html
npm notice 590B  src/components/accordion/accordion.js
npm notice 2.5kB dist/js/default.js
npm notice 127B  src/js/default.js
npm notice 1.6kB package.json
npm notice 87B   src/components/accordion/accordion.md
npm notice 99B   readme.md
npm notice 585B  src/components/accordion/readme.md
npm notice 186B  src/components/accordion/_accordion.scss
npm notice 198B  src/config/_accordion.scss
npm notice 771B  src/config/_tokens.scss
npm notice 40B   src/scss/default.scss
npm notice 69B   src/components/accordion/accordion.slm
npm notice 421B  src/views/accordion.slm
npm notice 843B  src/slm/layouts/default.slm
npm notice 232B  dist/svg/svgs.svg
npm notice === Tarball Details ===
npm notice name:          patterns-demo
npm notice version:       0.1.0
npm notice package size:  4.6 kB
npm notice unpacked size: 9.5 kB
npm notice shasum:        47e2e2063c731c9c2b24841cce4288d457cf75c6
npm notice integrity:     sha512-gXB4U+AJhlGDo[...]O/CzKHv1LUz4w==
npm notice total files:   17
npm notice

> patterns-demo@0.1.0 publish .
> cross-env NODE_ENV=production pttrn publish

🤓 Publishing to origin; https://github.com/CityOfNewYork/patterns-demo.git
✨ Published to GitHub Pages
+ patterns-demo@0.1.0
```

[Back to table of contents ^](#contents)

## Demo Source

The source code of the demo for the previous guides can be found in the [Patterns Demo repository](https://github.com/CityOfNewYork/patterns-demo).

[Back to table of contents ^](#contents)

<!-- ## Quick Starter

The [Patterns Starter](https://github.com/CityOfNewYork/patterns-starter) makes it much quicker to initialize a new project.

In a new project directory run;

```shell
$ npm init @nycopportunity/pttrn-starter
Need to install the following packages:
  @nycopportunity/create-pttrn-starter
Ok to proceed? (y) y
Installing @nycopportunity/pttrn...
Scaffolding the project...
Running the initial build...
You're all set! Add the recommended npm scripts https://github.com/CityOfNewYork/patterns-cli#npm-scripts to your package.json then run "npm start"
```

You may need to add a **package.json** file if it wasn't created by running `npm init` then add the [recommended NPM Scripts](#npm-scripts).

[Back to table of contents ^](#contents) -->

## CLI

### Executing the binary

The key to using the CLI is executing the **.pttrn** binary created in the **node_modules/.bin** directory when you install this module in your project. There are a few ways to execute the local binary;

**$A** Use [npx](https://www.npmjs.com/package/npx) before every `pttrn` command. For most cases, this is the most convenient option as demonstrated in the getting started guide above.

```shell
$ npx pttrn {{ command }}
```

**$B** Create an alias to the binary in your shell environment configuration file (such as *.profile* or *.bash_profile*)

```shell
alias pttrn="./node_modules/.bin/pttrn"
```

Then running commands can be done like so:

```shell
$ pttrn {{ command }}
```

**$C** Or, add an npm script to your *package.json* file. npm will always execute local binaries referenced in the script block.

```json
"scripts": {
  "pttrn": "pttrn"
}
```

Then running commands can be done like so:

```shell
$ npm run pttrn {{ command }}
```

### Commands

The basic pattern for commands is as follows:

```shell
$ {{ ENVIRONMENT_VARIABLE }}={{ value }} npx pttrn {{ command }} {{ flag }}
```

Every command is configured with one or a series of JavaScript files inside the [./config](config/) directory. The CLI will check to see if there is a custom configuration file in the local **./config** directory of the project first. If it doesn't exist it will use the [default configuration file in the CLI package](config/). Project configurations can be used to pass in additional and custom options to each package that the CLI uses. Below the packages used and default configurations are described in more detail.

- [`default`](#default)
- [`styles`](#styles)
- [`tokens`](#tokens)
- [`sass`](#sass)
- [`postcss`](#postCSS)
- [`rollup`](#rollup)
- [`lint`](#lint)
- [`slm`](#slm)
- [`pa11y`](#pa11y)
- [`svgs`](#svgs)
- [`scaffold`](#scaffold)
- [`make`](#make)
- [`serve`](#serve)
- [`publish`](#publish)

Optional [flags](#flags) can be passed to the commands for signaling watching and log settings. The log settings are universal so they aren't represented in the command tables below.

[Custom commands](#custom-commands) have been newly introduced and are described below.

---

#### Default

Command          | Flags | Configuration | `NODE_ENV`
-----------------|-------|---------------|-
`default` or ` ` | `-w`  | n/a           | `production` or `development`

Synchronously runs this series of commands; `styles`, `rollup`, `slm`, and `svgs` respectfully and described below.

Back to [commands ^](#commands) | [table of contents ^](#contents)

---

#### Styles

Command  | Flags | Configuration | `NODE_ENV`
---------|-------|---------------|-
`styles` | `-w`  | n/a           | `production` or `development`

Synchronously runs this series of commands; `tokens`, `sass`, and `postcss` respectfully and described below.

Back to [commands ^](#commands) | [table of contents ^](#contents)

---

#### Tokens

Command  | Flags | Configuration
---------|-------|-
`tokens` | n/a   | [tokens.js](config/tokens.js)

Uses [JSON-TO-SCSS](https://github.com/rlapoele/json-to-scss) to convert design tokens defined in [./config/tokens.js](config/tokens.js) into **./src/config/_tokens.scss**. Tokens can be custom values for your Sass library as well as be values mapped directly to tokens in the Tailwindcss configuration (if used by your project). CSS variables can also be used in the token configuration. Note, other Tailwindcss configuration options, such as variants and modules should be configured in the `tailwindcss` configuration.

Settings for [JSON-TO-SCSS](https://github.com/rlapoele/json-to-scss) are set at the root level of the export and include setting the file output and specific transformation options. Refer to the source for available options.

A custom `tokens` configuration is highly recommended (if not required) for any patterns library that uses the CLI to manage unique design tokens.

Back to [commands ^](#commands) | [table of contents ^](#contents)

---

#### Sass

Command | Flags | Configuration                                                                                | `NODE_ENV`
--------|-------|----------------------------------------------------------------------------------------------|-
`sass`  | `-nl` | [sass.js](config/sass.js) | `production` or `development`

Uses [Dart Sass](https://github.com/sass/dart-sass) to compile Sass modules defined in the `sass` configuration into CSS. It will use [Node Sass](https://github.com/sass/node-sass) in place of Dart Sass if it is required in a project's **package.json** file. By default, it will compile the default Sass entry point [./src/scss/default.js](config/scaffold/default.scss). If `NODE_ENV` is set to `development` only the modules with the attribute `devModule: true` will be compiled.

A custom `sass` configuration could be used to add additional Sass modules to compile.

Back to [commands ^](#commands) | [table of contents ^](#contents)

---

#### PostCSS

Command   | Flags | Configuration
----------|-------|-
`postcss` | n/a   | [postcss.js](config/postcss.js) [tailwindcss.js](config/tailwindcss.js)

Runs [PostCSS](https://postcss.org/) on CSS modules defined in the `sass` configuration. [PostCSS plugins](https://github.com/postcss/postcss#plugins) are defined in the configuration. By default, PostCSS is configured to use the plugins [cssnano](https://cssnano.co/) and, if installed in your project, [Tailwindcss](https://tailwindcss.com/). The command will use the [./config/tailwindcss.js](config/tailwindcss.js) file where a custom [Tailwindcss configuration](https://tailwindcss.com/docs/configuration) would live. Learn more about [adding tailwindcss in the guide below](#adding-tailwindcss).

A custom `postcss` configuration could be used to configure PostCSS and add additional plugins needed for a particular project.

A custom `tailwindcss` configuration can easily import values from the configuration of the `tokens` to generate Tailwindcss utilities.

Back to [commands ^](#commands) | [table of contents ^](#contents)

---

#### Rollup

Command  | Flags      | Configuration                           | `NODE_ENV`
---------|------------|-----------------------------------------|-
`rollup` | `-w` `-nl` | [rollup.js](config/rollup.js) | `production` or `development`

Runs [Rollup.js](https://rollupjs.org/) on an array of ES modules defined in the `rollup` configuration and bundles them into a self-executing function (iife). By default, it will bundle the default JavaScript entry point [./src/js/default.js](config/scaffold/default.js). [Rollup.js plugins](https://github.com/rollup/plugins) included with the default `rollup` configuration include the following:

* [Replace](https://github.com/rollup/plugins/tree/master/packages/replace) for replacing `process.env.NODE_ENV` in scripts with the `NODE_ENV` environment variable passed through the command.
* [Node Resolve](https://github.com/rollup/plugins/tree/master/packages/node-resolve) for resolving module imports from the **./node_modules** directory.

##### NODE_ENV

The value `development` will affect the command directly by compiling only the modules with the attribute `devModule: true` (the default entry point module is a development module).

Other ES modules in your library can use the `process.env.NODE_ENV` for things such as logging to the console during development. Say the following line appears in an ES module:

```javascript
if (process.env.NODE_ENV != 'production')
  console.dir('A development only log');
```

If `NODE_ENV` is set any value other than `production` the statement above will appear in the output like the following:

```javascript
{
  console.dir('A development only log');
}
```

If `NODE_ENV` is set to `production` then the statement will not appear at all.

##### Internet Explorer 11 Support

IE 11 is no longer supported. If you absolutely must support it you will need to install and configure [Rollup Plugin Bublé](https://github.com/rollup/plugins/tree/master/packages/buble) or [Rollup Plugin Babel](https://github.com/rollup/plugins/tree/master/packages/babel) and configure them in your project.

A custom `rollup` configuration could be used to add additional output modules to support additional JavaScript environments, such as NodeJS, as well as utilize additional Rollup plugins needed for a particular project.

Back to [commands ^](#commands) | [table of contents ^](#contents)

---

#### Lint

Command | Flags | Configuration
--------|-------|-
`lint`  | n/a   | [lint.js](config/lint.js)

Uses [ESLint](https://eslint.org/) and [stylelint](https://stylelint.io/) to lint JavaScript and Sass files in the **./src/** directory. Linting suggestions are logged to the terminal. The default `lint` configuration uses [Google's JavaScript style guide](https://github.com/google/eslint-config-google) and [stylelint's standard config](https://github.com/stylelint/stylelint-config-standard) with a few additional rules.

A custom `lint` configuration could be used to change or extend the linting standards of a project.

Back to [commands ^](#commands) | [table of contents ^](#contents)

---

#### Slm

Command | Flags      | Configuration                     | `NODE_ENV`
--------|------------|-----------------------------------|-
`slm`   | `-w` `-np` | [slm.js](config/slm.js) | `production` or `development`

Uses [Slm](https://github.com/slm-lang/slm) to compile Slm pages from the **./src/views/** directory to static HTML pages in the **./dist** directory. Slm files serve as the template language for site documentation and HTML spec for patterns. The output is run through [JS Beautifier](https://github.com/beautify-web/js-beautify) for human-readable markup. The Slm parser is extended with a method that includes Markdown files compiled by [Marked](https://marked.js.org/). The default `slm` configuration passes configuration options to these packages as well as global variables described below.

##### Views

The default entry-point for Slm views exist in the **./src/views/** directory. Files in this directory will be treated as pages and compiled to the **./dist/** directory. Sub-directories are supported for nested pages. Slm extras, such as partials and layouts, can be placed in the **./src/slm/** directory.

```
├ 📂 src/            - Source directory
  ├ 📂 slm/          - Slm extras
    ├ 📁 partials/
    └ 📁 layouts/
  ├ 📂 views/        - Slm views
    ├ 📂 newsletter  - Sub-directory
      └ index.slm
    ├ index.slm      - Homepage
    ├ accordion.slm  - Accordion demo page
    └ buttons.slm    - Buttons demo page
    └ ...
  └ ...
```

Running `npx pttrn slm` would compile the files in the source above to the static distribution described below.

```
├ 📂 dist/
  ├ 📂 newsletter
    └ index.html
  ├ index.html
  ├ accordion.html
  └ buttons.html
  └ ...
```

##### Include

The include method, `this.include()`, accepts a single path argument of a file to be included. It will return the compiled HTML output of the file. Prefixing the method with the single equals sign `=` will escape the returned HTML enabling it to be rendered within a `pre` tag as a code demonstration on the page.

```pug
= this.include('components/accordion/accordion.slm');
```

The double equals sign `==` will prevent HTML escaping and render the HTML as a valid element to be rendered by the browser.

```pug
== this.include('components/accordion/accordion.slm');
```

Passing an **.md** file path without escaping will render the markdown file as HTML.

```pug
== this.include('components/accordion/accordion.md');
```

The `slm` command only supports Slm and Markdown files so other file types included by this method will be rendered "as is."

Markdown files can also include Slm and other Markdown files using the following tag:

```markdown
include{{ path/to/file.slm }}
```

##### Variables

The default `slm` configuration passes global variables to use in Slm templates. These include the **package.json**, [./config/global.js](config/global.js), and [./config/tokens.js](config/tokens.js) files. Additionally, the `NODE_ENV` is also passed to templates.

```pug
= this.package
= this.global
= this.tokens
= this.process.env.NODE_ENV
```

Variables are also available to Markdown files using the following tag:

```pug
{{ this.package }}
{{ this.global }}
{{ this.tokens }}
{{ this.process.env.NODE_ENV }}
```

A custom `slm` configuration could be used to be used to pass additional data and methods to the view templates as well as further configure JS Beautify and Marked.

Back to [commands ^](#commands) | [table of contents ^](#contents)

---

#### Pa11y

Command | Flags | Configuration
--------|-------|-
`pa11y` | n/a   | [pa11y.js](config/pa11y.js)

Uses [Pa11y](https://github.com/pa11y/pa11y) to test the static output of HTML files in the **./dist** directory for accessibility issues. Issues are logged to the terminal. The default `pa11y` configuration uses the WCAG AA [accessibility standard](https://github.com/pa11y/pa11y#standard-string), aXe-core, and HTML CodeSniffer as [test runners](https://github.com/pa11y/pa11y#runners), and adds the selector `[data-pa11y="disable"]` to that can be used to [hide elements](https://github.com/pa11y/pa11y#hideelements-string) that shouldn't be tested in the static output.

A custom `pa11y` configuration could be used to enable or disable many of the available [configuration options for Pa11y](https://github.com/pa11y/pa11y#configuration).

Back to [commands ^](#commands) | [table of contents ^](#contents)

---

#### Svgs

Command | Flags | Configuration
--------|-------|-
`svgs`  | `-w`  | [svgs.js](config/svgs.js)

Uses [svgo](https://github.com/svg/svgo) to optimize SVGs in the **./src/svg/** directory and saves them in the **./dist/svg** directory. Then, it uses [svgstore](https://github.com/svgstore/svgstore) to create an SVG sprite in the **./dist/svg/svgs.svg** file of all the optimized SVGs. The `svg` configuration passes svg file name prefix and svg sprite name settings to each package.

A custom `svgs` configuration could be used to modify the svg file prefix, svg sprite name, and configuration options for [svgo](https://github.com/svg/svgo#what-it-can-do) and [svgstore](https://github.com/svgstore/svgstore#options).

Back to [commands ^](#commands) | [table of contents ^](#contents)

---

#### Scaffold

Command    | Flags | Configuration
-----------|-------|-
`scaffold` | n/a   | [global.js](config/global.js) [scaffold/*](config/scaffold/)

As described in the [Scaffold guide](#scaffold-command) above this command will initialize a minimal base project with the following:

* CSS only Details Component
* Configuration files for Tokens, Rollup.js, Sass, and Tailwindcss
* Simple Sass library
* Single page static demo site

The `scaffold` command relies on the `global.js` configuration that describes the default filesystem and entry points for a project. It also relies on file templates in the [./config/scaffold/](config/scaffold/) directory to source the contents of files described in the system.

A custom `scaffold` configuration could be used to change the output of the starter filesystem and the contents of files for a project.

Back to [commands ^](#commands) | [table of contents ^](#contents)

---

#### Make

Command | Arguments                  | Flags | Configuration
--------|----------------------------|-------|-
`make`  | `type`* `name`* `template` | n/a   | [make.js](config/make.js) [make/*](config/make/)

Creates pattern directories and files using paths and variables defined in the `make` configuration with file contents defined in the [./config/make](config/make/) directory as described in the [`make` command guide](#make-command). It will not permit overwriting pattern files if they already exist.

*denotes required arguments.

##### Arguments

- `type` _required_ - Determines where in the filesystem patterns will be stored. One of; `element`, `component`, `object`, or `utility`
- `pattern` _required_ - Name of the pattern
- `template` _optional_ - If included the third argument can be used to create a single template from the [./config/make](config/make/) directory. By default, all files will be made.

A custom `make` configuration could be used to add custom files with predefined templates in the [./config/make](config/make/) directory. The CLI currently supports CSS and ES module-based libraries out-of-the-box, however, with custom make templates, it could be extended to make [Vue.js](https://vuejs.org/), [React](https://reactjs.org/), [Svelte](https://svelte.dev/), or other component type files.

Refer to the guide on [creating a new `make` command template](#creating-a-new-make-command-template) for details.

Back to [commands ^](#commands) | [table of contents ^](#contents)

---

#### Serve

Command | Flags | Configuration | `PORT`
--------|-------|---------------|-
`serve` | `-w`  | n/a           | Any port number (ex; `8080`)

Uses [Express](https://expressjs.com/) to serve static files in the **./dist/** directory. By default, it runs on port `7000`. The `serve` command doesn't have a configuration file, however, the port number can be configured through the environment variable `PORT`.

Back to [commands ^](#commands) | [table of contents ^](#contents)

---

#### Publish

Command   | Flags | Configuration | `NODE_ENV`*
----------|-------|---------------|-
`publish` | n/a   | [publish.js](config/publish.js)  | `production` or `development`

Uses [gh-pages](https://github.com/tschaub/gh-pages) to stand up the static output in the **./dist** directory to the [GitHub Pages](https://pages.github.com/) branch of your project's remote repository. The default `publish` configuration *requires* the `NODE_ENV=production` environment variable to push to the package repository URL defined in the **package.json** file.

A custom `publish` configuration could be used to push to different remote GitHub Pages repositories.

Back to [commands ^](#commands) | [table of contents ^](#contents)

---

### Flags

Flag&nbsp; | Non&nbsp;abbreviated&nbsp;Flag | Description
-----------|--------------------------------|-
`-w`       | `--watch`                      | Use Chokidar to watch for changes on concerned source files and run their scripts when changes are detected.
`-nd`      | `--nondescript`                | Silence detailed logging (such as file writing writing) for commands. All other logs (such as script start and success) will display. **This can be used on all commands**.
`-s`       | `--silent`                     | Disable all logging output. Note, some output will always log such as linting and errors. **This can be used on all commands**.
`-nl`      | `--no-lint`                    | Disable ESLint and stylelint. This only works the `rollup` and `sass` command respectively. Running `npx pttrn lint -nl` will not effect.
`-np`      | `--no-pa11y`                   | Disable Pa11y linting. This only works for the `slm` command. Running `npx pttrn pa11y -np` command will not effect.

[Back to table of contents ^](#contents)

### Alerts

[Node Emoji](https://github.com/omnidan/node-emoji#readme) and [Chalk](https://github.com/chalk/chalk) are used to illustrate the logging alert output. The emoji symbols and colors can be modified or removed with a custom [./config/alerts.js](config/alerts.js) configuration file.

<!-- ### ES Configuration

You may have noticed the `scaffold` command will create a `.config/rollup.mjs` configuration file. [Node.js has stable support of the ECMAScript module spec](https://nodejs.org/api/esm.html) and they can be imported into CommonJS (Node modules). The configuration script will resolve ES modules with the **.mjs** extension over **.js** files, however, use of ES module configuration hasn't been fully tested with all of the commands. -->

[Back to table of contents ^](#contents)

### Custom Commands

As the commands above will look for a custom configuration file for each command in the **./config** directory of your project the CLI will also resolve custom command scripts in the **./bin** directory of your project. A [sample script](bin/_sample.js) is included in this repo and can be used to start the creation of a custom command. The bare minimum a command script should include is a `run()` method.

```javascript
const cnsl = require('@nycopportunity/pttrn/bin/util/console');
const alerts = require('@nycopportunity/pttrn/config/alerts');

module.exports = {
  run: () => {
    cnsl.describe(`${alerts.success} My custom command`);
  }
};
```

For example, a custom script named **bin/custom.js** that exports the `run()` method above can be executed with the CLI by running

```shell
$ npx pttrn custom
✨ My custom command
```

Custom commands can use [other packages](https://www.npmjs.com/) that are not integrated in this project and reuse the CLI [scripts](bin/), [utilities](bin/util/), or [default configuration](config/). Custom commands can also be packaged, published, and shared between projects. Below are a few published custom command plugins.

Plugin                                                                              | Description
------------------------------------------------------------------------------------|-
[Patterns Plugin Feather](https://github.com/CityOfNewYork/patterns-plugin-feather) | Compile a [Feather icon](https://feathericons.com/) sprite from the Feather package into the dist directory.
[Patterns Plugin Twig](https://github.com/CityOfNewYork/patterns-plugin-twig)       | Will compile Twig view templates effectively replacing the default Slm compiler with [Twig.js](https://github.com/twigjs/twig.js/).

[Back to table of contents ^](#contents)

### NPM Scripts

The recommended [npm scripts](https://docs.npmjs.com/misc/scripts) below create shortcuts for using the CLI and hook into other npm methods to make starting, versioning, and publishing more convenient. They can be modified to suit the needs of a particular project. Add them to your project's *package.json* file.

```json
"scripts": {
  "start": "cross-env NODE_ENV=development concurrently \"pttrn -w\" \"pttrn serve -w\" -p \"none\"",
  "version": "npm run default && git add .",
  "prepublishOnly": "git push && git push --tags",
  "publish": "cross-env NODE_ENV=production pttrn publish",
  "default": "cross-env NODE_ENV=production pttrn"
}
```

Then each script can be run using the following outline:

```shell
$ npm run {{ script }} {{ arg }}
```

Except for `start`, `version`, and `publish` which hook into default npm commands.

```shell
$ npm {{ start / version / publish }} {{ arg }}
```

Script           | Description
-----------------|-
`start`          | Hooks into the [npm-start](https://docs.npmjs.com/cli/v6/commands/npm-start) script to concurrently run the `default` and `serve` commands in watching mode for development.
`version`        | Hooks into the [npm-version](https://docs.npmjs.com/cli/v6/commands/npm-version) script to commit a production-ready distribution and semantic version tag for publishing. It accepts an argument describing the version number to increment such as `patch`, `minor`, `major`, or `prerelease`.
`prepublishOnly` | Hooks into the [npm `prepublishOnly` script](https://docs.npmjs.com/misc/scripts) to push the latest distribution and semantic version tag to the remote repository for publishing.
`publish`        | Hooks into the [npm-publish](https://docs.npmjs.com/cli/v6/commands/npm-publish) script to push the contents of the **./dist** folder in the remote repositories GitHub Pages branch.
`default`        | Runs the `default` command in production mode to build a production-ready distribution.

Below is an explainer of each script's contents.

Back to [NPM scripts](#npm-scripts) | [table of contents ^](#contents)

#### Start

* `cross-env` - A package for the support of setting environment variables across terminal platforms.
* `NODE_ENV=development` - Sets the node environment variable to `development`.
* `PORT=7000` - Sets the development server port environment variable to `7000`.
* `concurrently` - A node.js package for running multiple commands in the same session.
* `pttrn -w` - Runs the default pttrn command in watch mode.
* `pttrn serve -w` - Runs the serve pttrn command for starting the development server.
* `-p "none"` - This is a flag for Concurrently that removes the process prefix (`[0]`) from the log.

Back to [NPM scripts](#npm-scripts) | [table of contents ^](#contents)

#### Version

- `pttrn` - This is the same as `npx pttrn default`. It will run the CLI executable in the local **./node_modules** directory.
- `git add .` - This stages the working directory for a commit. Since it runs after the `default` command anything compiled will be committed to the release.

Back to [NPM scripts](#npm-scripts) | [table of contents ^](#contents)

#### prepublishOnly

- `git push` - This will push the committed release files to the origin repository.
- `git push --tags` - This will push the committed release tag to the origin repository.

Back to [NPM scripts](#npm-scripts) | [table of contents ^](#contents)

#### Publish

- `cross-env NODE_ENV=production` - This sets the `NODE_ENV` variable to `production` for the next command.
- `pttrn publish` - Takes the contents of the **./dist** directory and commits it to the `gh-pages` branch to create a [GitHub Pages](https://pages.github.com) site using the [gh-pages](https://github.com/tschaub/gh-pages) package.

Back to [NPM scripts](#npm-scripts) | [table of contents ^](#contents)

## Adding Tailwindcss

From [Tailwindcss](https://tailwindcss.com);

> ### Rapidly build modern websites without ever leaving your HTML.
> A utility-first CSS framework packed with classes like flex, pt-4, text-center, and rotate-90 that can be composed to build any design, directly in your markup.

CSS utilities make it easier for developers who do not actively maintain your pattern library to create designs with components that aren't available in your stylesheet. They can also be used to modify existing components for different contexts. Tailwindcss ships as a dependency with the CLI but it needs to be configured and included in your project.

### Step 1: Create your configuration file

The `scaffold` command creates a [./config/tailwindcss.js](config/tailwindcss.js). If not using the `scaffold` command, create your configuration file:

```shell
$ touch config/taiwindcss.js
```

In the configuration file, you can import your **./config/tokens.js** configuration and include design tokens from your project in the Tailwindcss configuration. You may also use the default configuration if desired.

```javascript
/**
 * Dependencies
 */

const tokens = require('tokens');
const tailwindcss = require('tailwindcss/defaultConfig');

/**
 * Config
 */

module.exports = {
...
```

#### Further reference

* [Tailwindcss step reference](https://tailwindcss.com/docs/installation#create-your-configuration-file)
* [Tailwindcss configuration documentation](https://tailwindcss.com/docs/configuration)

### Step 2: Include Tailwindcss in your CSS

All that's needed to include Tailwindcss in your stylesheet is to add the `@` directives somewhere in your stylesheet.

```scss
@tailwind components;
@tailwind utilities;
```

You may notice this does not include the `@tailwind base` tag which adds some base styling for Tailwindcss utilities. They aren't required and they can interfere with the styling of other patterns in your stylesheet. Use them at your discretion.

These directives can be added anywhere but we recommend keeping them in the **./src/utilites** directory. The `scaffold` command creates a module directory for these directives automatically: **./src/utilities/tailwindcss**. If not using the `scaffold` command the directory and stylesheet can be added with the following `make` command:

```shell
$ npx pttrn make utility tailwindcss style
```

Below are sample contents of the stylesheet from the `scaffold` command. Copy and paste them into the stylesheet if using the `make` command above.

```scss
/**
 * Tailwindcss
 */

// This injects all of Tailwind's utility classes, generated based on your
// config file. View docs for usage; https://tailwindcss.com/docs/

// @tailwind base; // Uncomment this to use Tailwindcss base styles. These may interfere with existing styles.
@tailwind components;
@tailwind utilities;
```

Now, in the stylesheet entry point, include the **_tailwindcss.scss** stylesheet.

```scss
@forward 'utilities/tailwindcss/tailwindcss';
```

PostCSS will inject Tailwindcss styles into your stylesheet.

#### Further reference

* [Tailwindcss step reference](https://tailwindcss.com/docs/installation#include-tailwind-in-your-css)

### Step 3: Optional. Configure PostCSS

The CLI already configures PostCSS to inject Tailwindcss styles where the directives are included in the stylesheet. You may, however, want to further configure PostCSS, you can create a custom **./config/postcss.js** file to modify the PostCSS plugins used in your project.

Additionally, you may want to create a Tailwindcss only distribution for inclusion in other projects. This can be done by adding new distribution modules to the **./config/sass.js** configuration. The example below creates a CDN and browser friendly CSS file and a project friendly Sass file:

```javascript
module.exports = [
  {
    file: `${process.env.PWD}/src/scss/default.scss`,
    outDir: `${process.env.PWD}/dist/styles/`,
    outFile: 'default.css',
    sourceMapEmbed: sass.sourceMapEmbed,
    includePaths: sass.includePaths,
    devModule: true // This needs to be set if we want the module to be compiled during development
  },
  {
    file: `${process.env.PWD}/src/utilities/tailwindcss/_tailwindcss.scss`,
    outDir: `${process.env.PWD}/dist/styles/`,
    outFile: 'tailwindcss.css', // CDN and browser friendly CSS file
    sourceMapEmbed: sass.sourceMapEmbed,
    includePaths: sass.includePaths,
  },
  {
    file: `${process.env.PWD}/src/utilities/tailwindcss/_tailwindcss.scss`,
    outDir: `${process.env.PWD}/dist/styles/`,
    outFile: '_tailwindcss.scss', // Project friendly Sass file
    sourceMapEmbed: sass.sourceMapEmbed,
    includePaths: sass.includePaths,
  }
];
```

### Step 4: Optional (but recommended). Purge CSS

Purge CSS will read static files and remove CSS from a stylesheet that isn't being used by those files. This is recommended for projects where the pattern library will be integrated. However, for a Pattern Library, you will want to have all of the utilities present in the stylesheet. See the [optimizing for production Tailwindcss guide](https://tailwindcss.com/docs/optimizing-for-production).

[Back to table of contents ^](#contents)

## Creating a new `make` command template

Custom templates can be created by the make script by creating a custom `make` configuration, modifying the settings, and adding a new template file in the [./config/make/](config/make/) directory. These are the steps that would need to be taken to include a [React](https://reactjs.org/) component template in the list of files created by the `make` command.

### Step 1: Template contents

First, a new base template would be defined in the **./config/make/react.jsx**;

```jsx
class {{ Pattern }} extends React.Component {
  render() {
    return (
      <div>
        Hello {this.props.name}!
      </div>
    );
  }
}

ReactDOM.render(
  <{{ Pattern }} name="World" />,
  document.getElementById('js-{{ pattern }}')
);
```

#### Template Variables

Within the template string, there are a handful of variables referencing the pattern that will be replaced when the template is compiled. They are denoted by double brackets `{{  }}`;

* `{{ type }}` - The pattern type defined by the command, will either be `elements`, `objects`, `utilities`.
* `{{ prefix }}` - The pattern prefix, will either be `o-` for objects or `c-` for components.
* `{{ pattern }}` - The lower case name of the pattern.
* `{{ Pattern }}` - The uppercase name of the pattern.

### Step 2: Filename

Next, provide a filename in the `files` export attribute. Filenames use the same template variables above.

```javascript
files: {
  'react': '{{ pattern }}.jsx'
}
```

### Step 3: Is it optional?

Next, if it is an optional template then add `react` to the `optional` export attribute. This will generate a prompt to create the file with a yes/no question when running the make script.

```javascript
optional: [
  'react'
]
```

### Step 4: Where to write the template

Next, if the template should be written to every new pattern's dedicated module directory (ex; **src/{{ type }}/{{ pattern }}/**) then add `react` to the `patterns` export attribute. This is the default for most templates except views and Sass config.

```javascript
patterns: [
  'react'
]
```

If you do not add `react` to the `patterns` export attribute, then you must provide a path you would like it written to in the `paths` export attribute. Below would write the new `react` template to the **./src/js/** directory.

```javascript
paths: {
  'react': path.join(global.src, 'js', 'react')
}
```

[Back to table of contents ^](#contents)

## Optional Dependencies

The CLI ships with several optional dependencies.

* Rollup Plugin Node Resolve
* Rollup Plugin Replace
* Chalk
* Cross ENV
* cssnano
* ESLint Config Google
* Node Emoji
* Stylelint Config Standard
* Tailwindcss

To omit these packages to keep your project lean, use the `--no-optional` flag when installing.

```shell
$ npm install @nycopportunity/pttrn --no-optional
```

These dependencies are required by the default configuration or recommended npm scripts. If your project is relying on many of the Framework's default configurations or you want to model your project to closely resemble the original configuration then it is recommended to include them in your project.

[Back to table of contents ^](#contents)

## Supporting Packages

Other packages to help support pattern library development.

Package                                                               | Description
----------------------------------------------------------------------|-
[Patterns Scripts](https://github.com/CityOfNewYork/patterns-scripts) | A set of common utility ES modules to help keep scripting DRY and support accessibility.
[Patterns Demo](https://github.com/CityOfNewYork/patterns-demo)       | Source code for the starter project created in the ["start from scratch" guide](#start-from-scratch).
[Patterns Docs](https://github.com/CityOfNewYork/patterns-docs)       | Reusable documentation for pattern libraries created with the CLI.
[Patterns Test](https://github.com/CityOfNewYork/patterns-test)       | Testing repository for the CLI.

### Plugins

Refer to [custom commands](#custom-commands) on how to create plugins.

Plugin                                                                              | Description
------------------------------------------------------------------------------------|-
[Patterns Plugin Feather](https://github.com/CityOfNewYork/patterns-plugin-feather) | Compile a [Feather icon](https://feathericons.com/) sprite from the Feather package into the dist directory.
[Patterns Plugin Twig](https://github.com/CityOfNewYork/patterns-plugin-twig)       | Will compile Twig view templates effectively replacing the default Slm compiler with [Twig.js](https://github.com/twigjs/twig.js/).

[Back to table of contents ^](#contents)

---

![The Mayor's Office for Economic Opportunity](NYCMOEO_SecondaryBlue256px.png)

[The Mayor's Office for Economic Opportunity](http://nyc.gov/opportunity) (NYC Opportunity) is committed to sharing open-source software that we use in our products. Feel free to ask questions and share feedback. **Interested in contributing?** See our open positions on [buildwithnyc.github.io](http://buildwithnyc.github.io/). Follow our team on [Github](https://github.com/orgs/CityOfNewYork/teams/nycopportunity) (if you are part of the [@cityofnewyork](https://github.com/CityOfNewYork/) organization) or [browse our work on Github](https://github.com/search?q=nycopportunity).