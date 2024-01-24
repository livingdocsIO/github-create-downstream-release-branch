#!/usr/bin/env node
const argv = require('yargs')
  .demandOption(['gh-token', 'owner', 'repo'])
  .option('branch', {
    description: 'release branch name',
    type: 'string',
    demandOption: true
  })
  .option('tag', {
    description: 'create release branch based from a tag, if option not passed, it takes the highest tag automatically', // eslint-disable-line max-len
    type: 'string'
  })
  .help(false)
  .version(false)
  .argv
const run = require('./index')

run(argv)
  .then((response) => {
    console.log(`The release branch ${response.url} has been created sucessfully.`) // eslint-disable-line max-len
  })
  .catch((e) => {
    console.log(e.message)
    process.exit(1)
  })
