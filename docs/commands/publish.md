[← Table of Contents](../../docs.md#table-of-contents)

# Publish

The following [npm scripts](https://docs.npmjs.com/misc/scripts) are required for publishing

    "scripts": {
      "default": "cross-env NODE_ENV=production pttrn default",
      "version": "npm run default && git add .",
      "prepublishOnly": "git push && git push --tags",
      "publish": "cross-env NODE_ENV=production pttrn publish"
    },

A new release version needs to be created before publishing to **npm**. The npm script above will pre-compile the entire library in `production` mode and add it to the version commit created by [npm's version command](https://docs.npmjs.com/cli/version).

    npm version {{ major/minor/patch }}

Then use [npm's publish command](https://docs.npmjs.com/cli/publish) to push to GitHub and publish to the registery.

    npm publish
