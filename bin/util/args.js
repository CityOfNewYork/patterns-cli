/** Process CLI args */

const argvs = process.argv.slice(2);

/**
 * Dictionary
 */

const dict = [
  {
    flags: ['-w', '--watch'],
    name: 'watch',
    description: 'Trigger a command\'s watch mode. Process devModules by setting NODE_ENV=development (applies to Rollup and Sass modules only).'
  },
  {
    flags: ['-nd', '--nondescript'],
    name: 'nondescript',
    description: 'Silence the write notification for commands. All other notifications will display.'
  },
  {
    flags: ['-s', '--silent'],
    name: 'silent',
    description: 'Silence all notifications. Only error notifications will display.'
  },
  {
    flags: ['-nl', '--no-lint'],
    name: 'nolint',
    description: 'Disable linting on styles and scripts.'
  },
  {
    flags: ['-np', '--no-pa11y'],
    name: 'nopa11y',
    description: 'Disable pa11y linting on html files.'
  }
];

const args = {};

dict.forEach(d => {
  args[d.name] = d.flags.some(f => argvs.includes(f))
});

args.notify = !(args.silent);

module.exports = {
  args: args,
  dict: dict
};