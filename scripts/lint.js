#!/usr/bin/env node

if (process.env.NODE_ENV !== 'production') process.exit();

const package = require(`${process.env.PWD}/package.json`);
const alerts = require(`${process.env.PWD}/config/alerts`);
const stylelint = require('stylelint');
const eslint = require('eslint').CLIEngine;
const nodemon = require('nodemon');

const argvs = process.argv.slice(2);

const args = {
  watch: (argvs.includes('-w') || argvs.includes('--watch'))
};

if (args.watch) {
  nodemon(`-e scss,js -w ${process.env.PWD}/src/ -x ${__dirname}/lint.js`);

  console.log(`${alerts.watching} Linters watching ${alerts.ext('.scss')} and ${alerts.ext('.js')} in ${alerts.path('./src/')}`);
} else {
  let eslinter = new eslint(package.eslintConfig).executeOnFiles(['src/**/**/*.js']);

  if (eslinter.errorCount) {
    console.log('');
    console.log(`${alerts.scripts} ESLint`);

    eslinter.results.forEach((item) => {
      console.log(`${alerts.path(item.filePath.replace(process.env.PWD, ''))}`);

      item.messages.forEach((msg) => {
        console.log(`${msg.line}:${msg.column} ${msg.message} (${msg.ruleId})`);
      });
    });

    console.log('');
  }

  stylelint.lint({
    files: 'src/**/**/*.scss',
    config: package.stylelintConfig
  }).then((data) => {
    if (data.errored) {
      console.log(`${alerts.styles} StyleLint`);

      JSON.parse(data.output).forEach((item) => {
        if (item.errored) {
          console.log(`${alerts.path(item.source.replace(process.env.PWD, ''))}`);
          item.warnings.forEach((warning) => {
            console.log(`${warning.line}:${warning.column} ${warning.text}`);
          });
        }
      });

      console.log('');
    }
  });
}