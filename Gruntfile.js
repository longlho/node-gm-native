module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-node-gyp');

  grunt.initConfig({
    mochaTest: {
      ci: {
        src: ['test/*.js'],
        options: {
          timeout: 5000,
          reporter: 'xunit-file'
        }
      },
      dev: {
        src: ['test/test.*.js'],
        options: {
          timeout: 5000,
          reporter: 'spec'
        }
      }
    },
    gyp: {
      addon: {}
    }
  });

  

  grunt.registerTask('ci', ['mochaTest:ci']);
  grunt.registerTask('test', ['gyp', 'mochaTest:dev']);
  grunt.registerTask('default', ['test']);
};
