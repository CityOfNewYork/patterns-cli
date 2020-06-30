/**
 * Templates
 *
 * Templates are stored in the config/make directory. These are the templates
 * used for the different filetypes. There are a few template variables that
 * are interpolated in by the make.js script;
 *
 * {{ type }}     The pattern type defined by the command, will either be
 *                "elements", "objects", "utilities".
 * {{ prefix }}   The pattern prefix, will be defined by the type and prefixes
 *                in the prefixes constant below.
 * {{ pattern }}  The lower case name of the pattern.
 * {{ Pattern }}  The uppercase name of the pattern.
 *
 * Each template must have a filename defined in the files constant below, as
 * well as a path to where it should be written (default pattern files including
 * 'markup', 'markdown', and 'style' do not need a specific path).
 */

/**
 * Dependencies
 */

const path = require('path');
const resolve = require(path.join(__dirname, '../', 'bin/util/resolve'));
const g = resolve('config/global');
const alerts = resolve('config/alerts');

/**
 * Constants
 */

const SRC = g.src.__dirname;
const CONFIG = g.config.__dirname;

/**
 * Configuration
 */

/**
 * @const  {Array}  patterns  Pattern specific files.
 *
 * Template keys in this list will be written to the patterns directory in
 * "src/{{ type }}/{{ pattern }}/". If a template is not included here it
 * must have a path defined in the paths constant. For example the following
 * files will be written for the Accordion Component:
 *
 * src/component/accordion/accordion.scss
 * src/component/accordion/accordion.slm
 * src/component/accordion/accordion.md
 * src/component/accordion/accordion.js
 * src/component/accordion/readme.md
 */
const patterns = [
  'style',
  'markup',
  'markdown',
  'script',
  'readme'
];

/**
 * @const  {Array}  optional  Optional files.
 *
 * Templates in this list will be flagged as optional with a yes/no question
 * asking if the should be made. Files here must either be included in the
 * patterns constant or have a path defined in the paths constant.
 *
 * "? Make a config file for accordion? y/n ↵"
 */
const optional = [
  'config',
  'view',
  'script',
  'readme'
];

/**
 * @const  {Object}  pefixes  Pattern prefixes.
 *
 * The list of prefixes for each pattern type. These will/can be used in the
 * pattern's file templates. For example, in the style file template:
 *
 * .{{ prefix }}-accordion { }
 *
 * Will render ...
 *
 * .c-accordion { }
 */
const prefixes = {
  elements: '',
  components: 'c-',
  objects: 'o-',
  utilities: ''
};

/**
 * @const  {Object}  files  File name templates.
 *
 * This is the template for the file name of each template. There must be a
 * filename for each template in the list above. Variables will be parsed the
 * same way they are for the template file contents.
 */
const files = {
  markup: '{{ pattern }}.slm',
  markdown: '{{ pattern }}.md',
  style: '_{{ pattern }}.scss',
  script: '{{ pattern }}.js',
  readme: 'readme.md',
  config: '_{{ pattern }}.scss',
  view: '{{ pattern }}.slm'
};

/**
 * @const  {Object}  dirs  The main project directory names.
 *
 * This is a list of directories for the make script to reference. Changing
 * them  will change where things are written. If you want to create a custom
 * directory to write files to, it should be added here.
 */
const dirs = {
  base: g.base,
  src: g.src.__dirname,
  config: g.src.scss.config,
  view: g.src.views
};

/**
 * @const  {Object}  paths  The main project directory paths.
 *
 * This is a list of paths where templates will be written. Default templates
 * such as markup, markdown, and style as well as templates defined in the
 * patterns constant above will be written to the patterns path defined in
 * this constant. If there is a custom template not included in the patterns
 * constant above it must have a path defined here.
 *
 * These paths also accept the same variables as the templates above.
 */
const paths = {
  config: path.join(dirs.src, dirs.config),
  view: path.join(dirs.src, dirs.view),
  // Represents the path for templates defined in the patterns constant.
  pattern: path.join(dirs.src, '{{ type }}', '{{ pattern }}'),
  // The paths below are used in the messages constant.
  scss: `./${path.join(SRC, g.src.scss.__dirname, g.src.scss.default)}`,
  sass: `./${path.join(CONFIG, g.config.sass)}`,
  js: `./${path.join(SRC, g.src.js.__dirname, g.src.js.default)}`,
  rollup: `./${path.join(CONFIG, g.config.rollup)}`
};

/**
 * @const  {Object}  messages
 *
 * These messages will be shown for the file type they are associated with (by
 * their key).
 */
const messages = {
  style: [
    '\n',
    `${alerts.styles} Import the ${alerts.str.string('{{ pattern }}')} styleheet `,
    `into the ${alerts.str.path(paths.scss)} file (recommended). Add the `,
    `${alerts.str.string('{{ pattern }}')} styleheet to ${alerts.str.path(paths.sass)} `,
    'to create an independent distribution (optional).',
    '\n'
  ],
  script: [
    '\n',
    `${alerts.scripts} Import the ${alerts.str.string('{{ pattern }}')} script `,
    `into the ${alerts.str.path(paths.js)} file and create a public function `,
    `for it in the main class (recommended). Add the `,
    `${alerts.str.string('{{ pattern }}')} script to ${alerts.str.path(paths.rollup)} `,
    `to create an independent distribution (optional).`,
    '\n'
  ]
};

module.exports = {
  files: files,
  optional: optional,
  prefixes: prefixes,
  dirs: dirs,
  paths: paths,
  patterns: patterns,
  messages: messages
};
