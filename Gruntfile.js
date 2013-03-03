module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;' +
      ' Licensed <%= pkg.license %> */\n',
    concat: {
      options: {
        stripBanners: true,
        banner: '<%= banner %>'        
      },
      dist: {
        src: 'dist/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    docco: {
      options: {
        output: 'docs/'
      },
      src: ['src/**/*.js']
    },    
    jshint: {
      options: {
        jshintrc: '.jshintrc',
      },
      src: ['src/**/*.js']
    },
    requirejs: {
      compile: {
        options: {
          out: 'dist/<%= pkg.name %>.js',
          name: '<%= pkg.name %>',
          optimize: 'none',
          paths: {
            i18n: 'src/<%= pkg.name %>',
            underscore: 'lib/underscore/underscore'
          },
          shim: {
            'underscore': { exports: '_' }
          }
        }        
      }
    },
    qunit: {
      src: ['test/index.html']
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: 'dist/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    update_submodules: {}
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-docco');
  grunt.loadNpmTasks('grunt-update-submodules');
  
  grunt.registerTask('init', ['update_submodules']);
  grunt.registerTask('lint', ['jshint']);
  grunt.registerTask('test', ['update_submodules', 'jshint', 'qunit']);
  grunt.registerTask('build', ['update_submodules', 'jshint', 'requirejs', 'concat', 'uglify']);
  grunt.registerTask('doc', ['jshint', 'docco']);
  grunt.registerTask('default', ['update_submodules', 'jshint', 'qunit', 'requirejs', 'concat', 'uglify', 'docco']);
};