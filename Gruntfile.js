/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

module.exports = function (grunt) {
  // load all grunt tasks matching the `grunt-*` pattern
  require('load-grunt-tasks')(grunt);

  var pkg = grunt.file.readJSON('package.json');

  grunt.initConfig({
    pkg: pkg,
    pkgReadOnly: pkg
  });

  // load local Grunt tasks
  grunt.loadTasks('tasks');

  grunt.registerTask('build',
    'Build compressed resources',
    ['clean', 'lint', 'copy', 'uglify', 'bytesize']);

  grunt.registerTask('test',
    'Run tests',
    ['mocha']);

  grunt.registerTask('lint',
    'Alias for jshint and jscs tasks',
    ['jshint', 'jscs']);

  grunt.registerTask('default',
    ['build']);

  grunt.registerTask('doc',
    ['markdox']);

  grunt.registerTask('release',
    ['build', 'bump-only', 'changelog', 'bump-commit', 'doc', 'buildcontrol']);
};
