var grunt = require('grunt')
var zip = require('./lib')

var options = grunt.file.readYAML('zip_options.yaml')

zip(options)