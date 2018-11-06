#!/usr/bin/env node
// Use the Gruntfile in this package's root, not from the dir where the script was run
process.argv.push('--gruntfile');
process.argv.push(__dirname + '/../Gruntfile.js');
require('grunt-cli/bin/grunt');

