/*global require*/

var pathProjectRoot = "./";
var projectRoot = "./";
var submoduleRoot = './submodules/';

require.config({
    config: {
        text: {
            useXhr: function (url, protocol, hostname, port) {
                return true;
            }
        }
    },
    paths: {
        compilerPaths: pathProjectRoot + 'submodules/fenix-ui-common/js/Compiler',
        commonPaths: pathProjectRoot + 'submodules/fenix-ui-common/js/paths',
        menuPaths: pathProjectRoot + 'submodules/fenix-ui-menu/src/js/paths',
        dashboardPaths: pathProjectRoot + 'submodules/fenix-ui-dashboard/src/js/paths',
        chartPaths: pathProjectRoot + 'submodules/fenix-ui-chart-creator/src/js/paths',
        mapPaths: pathProjectRoot + 'submodules/fenix-ui-map-creator/src/js/paths',
        tablePaths: pathProjectRoot + 'submodules/fenix-ui-table-creator/src/js/paths',
        filterPaths: pathProjectRoot + 'submodules/fenix-ui-filter/src/js/paths',
        analysisPaths: pathProjectRoot + 'submodules/fenix-ui-analysis/src/js/paths',
        reportPaths: pathProjectRoot + 'submodules/fenix-ui-reports/src/js/paths',
        visualizationPaths: pathProjectRoot + 'submodules/fenix-ui-visualization-box/src/js/paths',
        dataEditorPaths: pathProjectRoot + 'submodules/fenix-ui-DataEditor/js/paths',
        dsdEditorPaths: pathProjectRoot + 'submodules/fenix-ui-DSDEditor/js/paths',
        metadataEditorPaths: pathProjectRoot + 'submodules/fenix-ui-metadata-editor/js/paths',
        metadataViewerPaths: pathProjectRoot + 'submodules/fenix-ui-metadata-viewer/src/js/paths',
        catalogPaths: pathProjectRoot + 'submodules/fenix-ui-catalog/src/js/paths',
        dataManagementPaths: pathProjectRoot + 'submodules/fenix-ui-data-management/src/js/paths',
        fenixMap: pathProjectRoot + 'submodules/fenix-ui-map/src/paths'
    }
});

require([
    "compilerPaths",
    "commonPaths",
    "menuPaths",
    "filterPaths",
    "analysisPaths",
    "catalogPaths",
    "visualizationPaths",
    "metadataViewerPaths",
    "chartPaths",
    "mapPaths",
    "reportPaths",
    "fenixMap",
    "dashboardPaths",
    "tablePaths"
], function (Compiler, Common, Menu, Filter, Analysis, Catalog, Box, MetadataViewer, ChartCreator, MapCreator, Report, Map, Dashboard, Table) {

    'use strict';

    var submodules_path = projectRoot + '../../submodules/';

    var commonConfig = Common;
    commonConfig.baseUrl = submodules_path + 'fenix-ui-common/js';

    var catalogConfig = Catalog;
    catalogConfig.baseUrl = submodules_path + 'fenix-ui-catalog/src/js';

    var menuConfig = Menu;
    menuConfig.baseUrl = submodules_path + '/fenix-ui-menu/src/js';

    var analysisConfig = Analysis;
    analysisConfig.baseUrl = submodules_path + 'fenix-ui-analysis/src/js';

    var boxConfig = Box;
    boxConfig.baseUrl = submodules_path + 'fenix-ui-visualization-box/src/js';

    var filterConfig = Filter;
    filterConfig.baseUrl = submodules_path + 'fenix-ui-filter/src/js';

    var metadataViewerConfig = MetadataViewer;
    metadataViewerConfig.baseUrl = submodules_path + 'fenix-ui-metadata-viewer/src/js';

    var chartConfig = ChartCreator;
    chartConfig.baseUrl = submodules_path + 'fenix-ui-chart-creator/src/js';

    var mapCreatorConfig = MapCreator;
    mapCreatorConfig.baseUrl = submodules_path + 'fenix-ui-map-creator/src/js';

    var reportConfig = Report;
    reportConfig.baseUrl = submodules_path + 'fenix-ui-reports/src/js';

    var mapConfig = Map;
    mapConfig.baseUrl = submodules_path + 'fenix-ui-map/src/js';

    var dashboardConfig = Dashboard;
    dashboardConfig.baseUrl = submodules_path + 'fenix-ui-dashboard/src/js';

    var tableConfig = Table;
    tableConfig.baseUrl = submodules_path + 'fenix-ui-table-creator/src/js';

    Compiler.resolve([commonConfig, catalogConfig, menuConfig, filterConfig, analysisConfig, boxConfig, metadataViewerConfig, chartConfig, mapCreatorConfig, reportConfig, mapConfig, dashboardConfig, tableConfig],
        {
            placeholders: {"FENIX_CDN": "http://fenixrepo.fao.org/cdn"},

            config: {

                i18n: {
                    locale: 'en'
                },

                locale: 'en',

                // The path where your JavaScripts are located
                baseUrl: pathProjectRoot + '/src/js',

                // Specify the paths of vendor libraries
                // Specify the paths of vendor libraries
                paths: {
                    bootstrap: "{FENIX_CDN}/js/bootstrap/3.3.4/js/bootstrap.min",
                    underscore: "{FENIX_CDN}/js/underscore/1.7.0/underscore.min",
                    underscoreString: "{FENIX_CDN}/js/underscore.string/3.2.2/underscore.string.min",
                    backbone: "{FENIX_CDN}/js/backbone/1.1.2/backbone.min",
                    handlebars: "{FENIX_CDN}/js/handlebars/2.0.0/handlebars",
                    //chaplin: "{FENIX_CDN}/js/chaplin/1.1.1/chaplin.min",
                    chaplin: "../../chaplin",
                    domReady: "{FENIX_CDN}/js/requirejs/plugins/domready/2.0.1/domReady",
                    i18n: "{FENIX_CDN}/js/requirejs/plugins/i18n/2.0.4/i18n",
                    text: '{FENIX_CDN}/js/requirejs/plugins/text/2.0.12/text',
                    rsvp: '{FENIX_CDN}/js/rsvp/3.0.17/rsvp',
                    "bootstrap-list-filter": '{FENIX_CDN}/js/bootstrap-list-filter/0.2.1/bootstrap-list-filter.min',
                    select2: '{FENIX_CDN}/js/select2/3.5.4/select2.min',

                    //Threejs
                    copyShader: "{FENIX_CDN}/js/threejs/4.4/CopyShader",
                    effectComposer: "{FENIX_CDN}/js/threejs/4.4/EffectComposer",
                    maskPass: "{FENIX_CDN}/js/threejs/4.4/MaskPass",
                    orbitControls: "{FENIX_CDN}/js/threejs/4.4/OrbitControls",
                    projector: "{FENIX_CDN}/js/threejs/4.4/Projector",
                    renderPass: "{FENIX_CDN}/js/threejs/4.4/RenderPass",
                    shaderPass: "{FENIX_CDN}/js/threejs/4.4/ShaderPass",
                    canvasRender: "{FENIX_CDN}/js/threejs/4.4/CanvasRenderer", // TO BE REVIEWED
                    detector: "{FENIX_CDN}/js/threejs/4.4/Detector", // TO BE REVIEWED
                    tweenMax: "{FENIX_CDN}/js/tweenmax/1.18.0/tweenmax.min", // TO BE REVIEWED
                    threejs: "{FENIX_CDN}/js/threejs/4.4/three.min",
                    loglevel: "{FENIX_CDN}/js/loglevel/1.4.0/loglevel",

                 //   'highcharts': '{FENIX_CDN}/js/highcharts/4.1.6/js/highcharts',

                    amplify: '{FENIX_CDN}/js/amplify/1.1.2/amplify.min',

                    nls: "../../i18n",
                    config: "../../config",
                    json: "../../json",

                    'webix': 'http://fenixrepo.fao.org/cdn/js/webix/2.2.1/js/webix',

                    'fx-common/config/auth_users': '../../config/auth_users.json',


                },

                // Underscore and Backbone are not AMD-capable per default,
                // so we need to use the AMD wrapping of RequireJS
                shim: {
                    canvasRender: {
                        deps: ["threejs"]
                    },
                    detector: {
                        deps: ["threejs"]
                    },
                    projector: {
                        deps: ["threejs"]
                    },
                    copyShader: {
                        deps: ["threejs"]
                    },
                    effectComposer: {
                        deps: ["threejs"]
                    },
                    maskPass: {
                        deps: ["threejs"]
                    },
                    orbitControls: {
                        deps: ["threejs"]
                    },
                    renderPass: {
                        deps: ["threejs"]
                    },
                    shaderPass: {
                        deps: ["threejs"]
                    },
                    //highcharts: {
                     //   "exports": "Highcharts",
                      //  "deps": ["jquery"]
                   // },
                    bootstrap: {
                        deps: ["jquery"]
                    },
                    select2: {
                        deps: ["jquery"]
                    },
                    underscore: {
                        exports: '_'
                    },
                    underscoreString: ['underscore'],
                    backbone: {
                        deps: ['underscore', 'jquery'],
                        exports: 'Backbone'
                    },
                    handlebars: {
                        exports: 'Handlebars'
                    },
                    threejs: {
                        deps: ['underscore', 'jquery'],
                    }
                },
                waitSeconds: 15
                // For easier development, disable browser caching
                // Of course, this should be removed in a production environment
                //, urlArgs: 'bust=' +  (new Date()).getTime()
            }
        });

    // Bootstrap the application
    require([
        'loglevel',
        'application',
        'routes',
        'config/Config',
        'domReady!'
    ], function (log, Application, routes, C) {

        //trace, debug, info, warn, error, silent
        log.setLevel('silent');

        var app = new Application({
            routes: routes,
            controllerSuffix: C.CHAPLINJS_CONTROLLER_SUFFIX,
            root: C.CHAPLINJS_PROJECT_ROOT,
            pushState: C.CHAPLINJS_PUSH_STATE,
            scrollTo: C.CHAPLINJS_SCROLL_TO
        });

    });
});