[← Table of Contents](../docs.md#table-of-contents)

# Installation

This document describes the installation of the patterns framework. Pattern libraries created using the framework can use the same installation instructions.

* [NPM Install](#npm-install)
* [Download](#download)
* [CDN](#cdn)
* [Sass](#sass)
  * [tailwindcss](#tailwindcss)
  * [Asset Paths and CDN](#asset-paths-and-cdn)
  * [Include Paths](#include-paths)
* [Scripts](#scripts)
  * [ES Module Import](#es-module-import)
  * [IFFE](#iffe)
  * [Global Pattern Script](#global-pattern-script)

## NPM Install

There are a few options when integrating the Pattern Framework, and pattern libraries built using the framework, but using NPM Install is recommended.

    $ npm install @nycopportunity/{{ pattern framework or library }}

## Download

Optionally, you may download an archive of the repository to include in your project.

## CDN

Compiled styles and scripts in the **/dist** folder of the GitHub repository can be imported on the page using a CDN such as [JsDelivr](https://www.jsdelivr.com). For example, the CDN link of the v0.1.0 default stylesheet for ACCESS NYC Patterns:

    https://cdn.jsdelivr.net/gh/cityofnewyork/access-nyc-patterns@v0.1.0/dist/styles/site-default.css

Include this link in the `<head>` of your html document.

    <link href="https://cdn.jsdelivr.net/gh/cityofnewyork/access-nyc-patterns@v0.1.0/dist/styles/site-default.css" rel="stylesheet">

Learn more about the different ways to use JsDelivr on it’s [feature page](https://www.jsdelivr.com/features). All Patterns are distributed with their own styles and script dependencies in the **/dist** folder. For example, all of the "Accordion" dependencies would live in the **/dist/components/accordion** folder.

Keep in mind, there are regular releases to the patterns which follow semantic versioning. You can keep up-to-date with [new releases on each repository's releases page](https://help.github.com/en/github/receiving-notifications-about-activity-on-github/watching-and-unwatching-releases-for-a-repository).

## Sass

Sass stylesheets for any pattern can be imported into a project from the source directory.

    @import 'node_modules/{{ pattern framework or library }}/src/components/accordion/accordion';


### Specificity

The majority of patterns share the same filename for the Sass and JavaScript (if a pattern uses JavaScript). It may be necessary to specify that you need to import the Sass file for [React](https://reactjs.org/) (or other) applications.

    @import 'node_modules/{{ pattern framework or library }}/src/components/accordion/_accordion.scss';

### tailwindcss

Importing tailwindcss is an exception **tailwindcss** because it is compiled to a Sass file in the _dist_ directory...

    @import 'node_modules/{{ pattern framework or library }}/dist/styles/_tailwindcss.scss';

... and a CSS file in the distribution folder:

    <link href="https://cdn.jsdelivr.net/gh/cityofnewyork/{{ pattern framework or library }}@{{ version }}/dist/styles/tailwindcss.css" rel="stylesheet">

### Asset Paths and CDN

The styles use the `url()` for loading webfonts, images, and svgs. By default, it is set to look for asset directories one directory up from the distributed stylesheet so the directory structure of your application is expected to look like so:

    styles/site-default.scss
    images/..
    fonts/..
    svg/..

However, you can set the path to a different path that includes all of these files using the `$cdn` variable.

    // $cdn: '../'; (default)
    $cdn: 'path/to/assets/';

This variable should be placed above all of your imports of the pattern Sass files. The CDN can be set to another local path (such as an absolute path), or, it can be set to the remote url within the `$variables` map.

This default uses [jsDelivr](https://www.jsdelivr.com/) to pull the assets from the patterns GitHub repository and the tag of the installed version. ex;

    @import 'config/variables';
    $cdn: map-get($variables, 'cdn');

These are the default paths to the different asset types within the asset folder. Uncomment and set to override their defaults.

    $path-to-fonts: 'fonts/';
    $path-to-images: 'images/';
    $path-to-svg: 'svg/';

This is recommended for [Webpack](https://webpack.js.org/) projects using the [css-loader](https://webpack.js.org/loaders/css-loader) because Webpack will try to import the asset into your distributed stylesheet. If you don't want to change the `$cdn` variable it is recommended for to disable the [url / image-set functions handling with a boolean](https://webpack.js.org/loaders/css-loader/#boolean).

### Resolving Paths to Patterns

You can add the string `'node_modules/@nycopportunity/{{ pattern framework or library }}/src'` to your "resolve" or "include" paths which will allow you to write the shorthand path;

    @import 'components/accordion/accordion';

or

    @import 'components/accordion/_accordion.scss';

For example; the [node-sass](https://github.com/sass/node-sass) `includePaths` option which is array of paths that attempt to resolve your `@import` declarations.

    Sass.render({
        file: './src/scss/site-default.scss',
        outFile: 'site-default.css',
        includePaths: [
          './node_modules',
          './node_modules/@nycopportunity/{{ pattern framework or library }}/src'
        ]
      }, (err, result) => {
        Fs.writeFile(`./dist/styles/site-default.css`, result.css);
      }
    });

Similar to the the [gulp-sass](https://www.npmjs.com/package/gulp-sass) `includePaths` option.

    gulp.task('sass', () => {
      return gulp.src('./sass/**/*.scss')
        .pipe(sass.({includePaths: [
          'node_modules',
          'node_modules/@nycopportunity/{{ pattern framework or library }}/src'
        ]})).pipe(gulp.dest('./css'));
    });

[Webpack](https://webpack.js.org/) can be configured with the [resolve > modules](https://webpack.js.org/configuration/resolve/#resolvemodules) option.

    module.exports = {
      //...
      resolve: {
        modules: [
          './node_modules',
          './node_modules/@nycopportunity/{{ pattern framework or library }}/src'
        ]
      }
    };

## Scripts

The JavaScript source is written as ES Modules, and using [Rollup.js](https://rollupjs.org), individual components with JavaScript dependencies are distributed as IFFE functions. Depending on your project, you can import either of these. Below are examples of importing only the accordion component and initializing it.

### ES Module Import

    import Accordion from 'src/components/accordion/accordion';
    new Accordion();

### IFFE

    <script src="dist/components/accordion.iffe.js"></script>
    <script type="text/javascript">
      new Accordion();
    </script>

**Note** You can also use IFFE modules through the CDN installation method without needing using NPM to install in your project.

### Global Pattern Script

You may also import the main patterns script with all of the dependencies in it. This script is exported as an IFFE function so it doesn't need to be compiled but you may want to uglify it. Components must be initialized individually.

    <script src="dist/scripts/{{ main }}.js"></script>
    <script type="text/javascript">
      var patterns = new {{ Main }}();
      patterns.accordion();
    </script>

The main JavaScript import file in the source will show how each component needs to be initialized if it isn't specified in the pattern's documentation.
