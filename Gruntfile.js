module.exports = function (grunt) {

    grunt.registerTask('createMain', 'build new main.js', function () {

        var requirejs = require('requirejs'),
            Handlebars = require('handlebars'),
            dependencies = [],
            baseUrls = [];

        var done = this.async();

        requirejs.config({
            //Use node's special variable __dirname to
            //get the directory containing this file.
            //Useful if building a library that will
            //be used in node but does not require the
            //use of node outside
            baseUrl: __dirname,

            //Pass the top-level main.js/index.js require
            //function to requirejs so that node modules
            //are loaded relative to the top-level JS file.
            nodeRequire: require
        });

        /* Iterate over modules directory. */
        grunt.file.recurse('./', function callback(abspath, rootdir, subdir, filename) {

            /* Read package.json excluding plugins. */
            if (filename === 'paths.js') {

                grunt.log.writeln('Adding: ' + rootdir + '/' + subdir);

                baseUrls.push(rootdir + '/' + subdir);
                dependencies.push(abspath);
            }

        });

        dependencies.push('submodules/fenix-ui-common/js/Compiler.js');

        grunt.log.writeln('Loading dependencies: start');
        grunt.log.writeln(JSON.stringify(dependencies));

        requirejs(dependencies, function () {

            grunt.log.writeln('Loading dependencies: DONE');

            var args = Array.prototype.slice.call(arguments);

            var Compiler = args[args.length - 1];

            //Remove last element from array
            args.pop();

            for (var i = 0; i < baseUrls.length; i++) {
                args[i].baseUrl = baseUrls[i];
            }


            //var projectRoot = "//fenixrepo.fao.org/cdn/test/flude";
            var projectRoot = "./";

            Compiler.resolve(args,  {
                placeholders: {
                    "FENIX_CDN": "//fenixrepo.fao.org/cdn"
                    //"FENIX_CDN": "http://lprapp16.fao.org/external/fenixrepo/cdn"
                },

                config: {

                    //Set the config for the i18n
                    i18n: {
                        locale: 'en'
                    },

                    // The path where your JavaScripts are located
                    baseUrl: projectRoot + 'src/js',

                    // Specify the paths of vendor libraries
                    paths: {
                        bootstrap: "{FENIX_CDN}/js/bootstrap/3.3.4/js/bootstrap.min",
                        underscore: "{FENIX_CDN}/js/underscore/1.7.0/underscore.min",
                        backbone: "{FENIX_CDN}/js/backbone/1.1.2/backbone.min",
                        handlebars: "{FENIX_CDN}/js/handlebars/2.0.0/handlebars",
                        chaplin: "{FENIX_CDN}/js/chaplin/1.0.1/chaplin.min",
                        domReady: "{FENIX_CDN}/js/requirejs/plugins/domready/2.0.1/domReady",
                        i18n: "{FENIX_CDN}/js/requirejs/plugins/i18n/2.0.4/i18n",
                        text: '{FENIX_CDN}/js/requirejs/plugins/text/2.0.12/text',
                        rsvp: '{FENIX_CDN}/js/rsvp/3.0.17/rsvp',
                        select2 : '{FENIX_CDN}/js/select2/3.5.4/select2.min',

                        amplify: '{FENIX_CDN}/js/amplify/1.1.2/amplify.min',

                        'fx-c-c/config/creators/highcharts_template' : projectRoot + '/config/submodules/fx-chart/highcharts_template',

                        'fx-ds/config/config' : projectRoot + "/config/submodules/fx-dashboard/Config",

                        'fenix-ui-map' : projectRoot + '/submodules/fenix-ui-map/dist/fenix-ui-map.src',
                        'fenix-ui-map-config' : projectRoot + '/config/submodules/fx-map/Config' ,

                        'fx-m-c/config/config' : projectRoot + '/config/submodules/fx-chart-creator/Config' ,

                        'fx-filter/config/config' : projectRoot + '/config/submodules/fx-filter/Config' ,

                        nls: projectRoot + "/i18n",
                        config: projectRoot + "/config",
                        json: projectRoot + "/json",

                        'fx-common/config/auth_users' :  projectRoot + '/config/auth_users.json'
                    },

                    // Underscore and Backbone are not AMD-capable per default,
                    // so we need to use the AMD wrapping of RequireJS
                    shim: {
                        bootstrap: {
                            deps: ["jquery"]
                        },
                        select2: {
                            deps: ["jquery"]
                        },
                        underscore: {
                            exports: '_'
                        },
                        backbone: {
                            deps: ['underscore', 'jquery'],
                            exports: 'Backbone'
                        },
                        handlebars: {
                            exports: 'Handlebars'
                        }
                    }
                    // For easier development, disable browser caching
                    // Of course, this should be removed in a production environment
                    //, urlArgs: 'bust=' +  (new Date()).getTime()
                }
            }, true);

            /* Load home page. */
            var source = grunt.file.read('src/js/templates/main.hbs', [, {encoding: 'utf8'}]);
            var template = Handlebars.compile(source);

            var dynamic_data = { config: JSON.stringify(Compiler.getConfig())};

            grunt.log.writeln("Compiled RequireJS configuration");
            grunt.log.writeln(JSON.stringify(dynamic_data));

            grunt.file.write('mainDynamicToOptimize.js', template(dynamic_data) , [, {encoding: 'utf8'}]);

            done();

        });

    });

    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        requirejs: {
            compile: {
                options: {
                    baseUrl: "./src/js",
                    paths: {
                        requireLib: "require"
                    },
                    //include: 'requireLib',
                    mainConfigFile: "./mainDynamicToOptimize.js",
                    name: "./../../mainDynamicToOptimize",
                    out: "./../dist/mainDynamic.js",
                    removeCombined: true,
                    findNestedDependencies: true,
                    preserveLicenseComments: false

                }
            }
        },

        //TODO
        watch: {
            scripts: {
                // ** + any folder
                files: ['**/*.js'],
                tasks: ['concat']
            }
        }
    });

    //Precompile Handlebars templates to JST file.
    grunt.loadNpmTasks('grunt-contrib-handlebars');

    // Writes static files using handlebars templates.
    grunt.loadNpmTasks('grunt-writefile');

    //RequireJS
    grunt.loadNpmTasks('grunt-contrib-requirejs');

    // Default task(s).
    grunt.registerTask('default', ['createMain', 'requirejs']);

};