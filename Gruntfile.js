module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-node-gyp');
  grunt.loadNpmTasks('grunt-contrib-watch');

  

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
    },
    watch: {
      dev: {
        files: ['src/*', 'test/*.js', 'index.js'],
        tasks: ['test']
      }
    }
  });

  

  grunt.registerTask('ci', ['mochaTest:ci']);
  grunt.registerTask('test', ['gyp', 'mochaTest:dev']);
  grunt.registerTask('default', ['test', 'watch']);
};
