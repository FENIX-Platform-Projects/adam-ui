/*global require*/

//develop
var pathProjectRoot = ".";
var projectRoot = "../..";
//var projectRoot = "http://localhost:8080";

//distribution
//var projectRoot = "http://www.fao.org/fenixrepo/cdn/projects/flude/1.0.0",
//var projectRoot = "//fenixrepo.fao.org/cdn/projects/flude/1.0.0",
//pathProjectRoot = projectRoot;

require.config({
    config: {
        text: {
            useXhr: function (url, protocol, hostname, port) {
                return true;
            }
        }
    },
    paths: {
        compilerPaths: pathProjectRoot + '/submodules/fenix-ui-common/js/Compiler',
        //compilerPaths : './submodules/fenix-ui-common/js/Compiler',
        commonPaths: pathProjectRoot + '/submodules/fenix-ui-common/js/paths',
        menuPaths: pathProjectRoot + '/submodules/fenix-ui-menu/js/paths',
        dashboardPaths: pathProjectRoot + '/submodules/fenix-ui-dashboard/src/js/paths',
        chartPaths: pathProjectRoot + '/submodules/fenix-ui-chart-creator/src/js/paths',
        mapPaths: pathProjectRoot + '/submodules/fenix-ui-map-creator/src/js/paths',
        tablePaths: pathProjectRoot + '/submodules/fenix-ui-table-creator/src/js/paths',
        filterPaths: pathProjectRoot + '/submodules/fenix-ui-filter/src/js/paths',
        olapPaths: pathProjectRoot + '/submodules/fenix-ui-olap/js/paths',
        reportPaths: pathProjectRoot + '/submodules/fenix-ui-reports/src/js/paths'
    }
});

require([
    "compilerPaths",
    "commonPaths",
    "menuPaths",
    "dashboardPaths",
    "chartPaths",
    "mapPaths",
    "tablePaths",
    "filterPaths",
    'olapPaths',
    "reportPaths"
], function (Compiler, Common, Menu, Dashboard, Chart, Map, Table, Filter, Olap, Reports) {

    'use strict';
    var submodules_path = projectRoot + '/submodules';

    var commonConfig = Common;
    commonConfig.baseUrl = submodules_path + '/fenix-ui-common/js';

    var menuConfig = Menu;
    menuConfig.baseUrl = submodules_path + '/fenix-ui-menu/js';

    var dashboardConfig = Dashboard;
    dashboardConfig.baseUrl = submodules_path + '/fenix-ui-dashboard/src/js';

    var chartConfig = Chart;
    chartConfig.baseUrl = submodules_path + '/fenix-ui-chart-creator/src/js';

    var mapConfig = Map;
    mapConfig.baseUrl = submodules_path + '/fenix-ui-map-creator/src/js';

    var tableConfig = Table;
    tableConfig.baseUrl = submodules_path + '/fenix-ui-table-creator/src/js';

    var filterConfig = Filter;
    filterConfig.baseUrl = submodules_path + '/fenix-ui-filter/';

    var olapConfig = Olap;
    olapConfig.baseUrl = submodules_path + '/fenix-ui-olap/js';

    var reoprtsConfig = Reports;
    reoprtsConfig.baseUrl = submodules_path + '/fenix-ui-reports/src/js';

    Compiler.resolve([commonConfig, menuConfig, dashboardConfig, chartConfig, tableConfig, mapConfig, filterConfig, olapConfig, reoprtsConfig],
        {
            placeholders: {
                "FENIX_CDN": "http://www.fao.org/fenixrepo/cdn"
                //"FENIX_CDN": "//fenixrepo.fao.org/cdn"
                //"FENIX_CDN": "http://lprapp16.fao.org/external/fenixrepo/cdn"
            },

            config: {

                //Set the config for the i18n
                i18n: {
                    locale: 'en'
                },

                // The path where your JavaScripts are located
                baseUrl: pathProjectRoot + '/src/js',

                // Specify the paths of vendor libraries
                paths: {

                    loglevel: '{FENIX_CDN}/js/loglevel/1.4.0/loglevel',
                    /* 'jquery-private': "{FENIX_CDN}/js/jquery/2.1.1/jquery.min",*/
                    bootstrap: "{FENIX_CDN}/js/bootstrap/3.3.4/js/bootstrap.min",
                    underscore: "{FENIX_CDN}/js/underscore/1.7.0/underscore.min",
                    backbone: "{FENIX_CDN}/js/backbone/1.1.2/backbone.min",
                    handlebars: "{FENIX_CDN}/js/handlebars/2.0.0/handlebars",
                    chaplin: "{FENIX_CDN}/js/chaplin/1.0.1/chaplin",
                    domReady: "{FENIX_CDN}/js/requirejs/plugins/domready/2.0.1/domReady",
                    i18n: "{FENIX_CDN}/js/requirejs/plugins/i18n/2.0.4/i18n",
                    text: '{FENIX_CDN}/js/requirejs/plugins/text/2.0.12/text',
                    rsvp: '{FENIX_CDN}/js/rsvp/3.0.17/rsvp',
                    select2: '{FENIX_CDN}/js/select2/3.5.4/select2.min',
                    "bootstrap-list-filter": '{FENIX_CDN}/js/bootstrap-list-filter/0.2.1/bootstrap-list-filter.min',

                    amplify: '{FENIX_CDN}/js/amplify/1.1.2/amplify.min',

                    'fx-c-c/config/creators/highcharts_template': projectRoot + '/config/submodules/fx-chart/highcharts_template',

                    'fx-ds/config/config': projectRoot + "/config/submodules/fx-dashboard/Config",

                    'fenix-ui-map': projectRoot + '/submodules/fenix-ui-map/dist/fenix-ui-map.src',
                    'fenix-ui-map-config': projectRoot + '/config/submodules/fx-map/Config',

                    'fx-m-c/config/config': projectRoot + '/config/submodules/fx-chart-creator/Config',

                    'fx-filter/config/config': projectRoot + '/config/submodules/fx-filter/Config',

                    nls: projectRoot + "/i18n",
                    config: projectRoot + "/config",
                    json: projectRoot + "/json",

                    'fx-common/config/auth_users': projectRoot + '/config/auth_users.json',


                    //OLAP DEPS
                    pivot: "../../submodules/fenix-ui-olap/js/pivot",
                    gt_msg: "../../submodules/fenix-ui-olap/lib/grid/gt_msg_en",
                    jqueryui: "../../submodules/fenix-ui-olap/lib/jquery-ui-1.9.2.custom.min",
                    gt_msg_grid: "../../submodules/fenix-ui-olap/lib/grid/gt_grid_all",
                    HPivot: "//fenixapps.fao.org/repository/js/jbpivot/0.1.0-olap/jbpivot.min",
                    highcharts: "//fenixapps.fao.org/repository/js/highcharts/4.0.4/js/highcharts",

                    "nls/pivot": "../../i18n/pivot",

                    pivotRenderersFuncs: "../../submodules/fenix-ui-olap/js/rend/function_rendererers",
                    pivotRenderers: "../../submodules/fenix-ui-olap/js/rend/rendererers",
                    pivotAggregatorsFuncs: "../../submodules/fenix-ui-olap/js/rend/function_aggregators",
                    pivotAggregators: "../../submodules/fenix-ui-olap/js/rend/aggregators",
                    pivotDataConfig: '../../config/submodules/fx-olap/dataConfig',
                    pivotDataTest: '../../submodules/fenix-ui-olap/tests/data/test.json',
                    'fx-olap/config/gridoption': '../../config/submodules/fx-olap/gridoption',

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

                ,
                //OLAP DEP
                jqueryui: ['jquery'],
                highcharts: ['jquery'],
                gt_msg: ['jquery'],
                gt_msg_grid: ['jquery', 'gt_msg'],
                pivotRenderers: ['pivotRenderersFuncs'],
                pivotAggregators: ['pivotAggregatorsFuncs', 'jquery'],
                pivot: {
                    deps: [
                        'jquery',
                        'jqueryui',
                        'gt_msg', 'gt_msg_grid',
                        'HPivot',
                        'pivotRenderers',
                        'nls/pivot'
                    ]
                },
                HPivot: ['jquery', 'jqueryui']

                /*,
                 map: {
                 // '*' means all modules will get 'jquery-private'
                 // for their 'jquery' dependency.
                 '*': { 'jquery': 'jquery-private' },

                 // 'jquery-private' wants the real jQuery module
                 // though. If this line was not here, there would
                 // be an unresolvable cyclic dependency.
                 'jquery-private': { 'jquery': 'jquery' }
                 }*/
                // For easier development, disable browser caching
                // Of course, this should be removed in a production environment
                //, urlArgs: 'bust=' +  (new Date()).getTime()
            }
        });

    // Bootstrap the application
    require([
        'application',
        'routes',
        'config/Config',
        'domReady!'
    ], function (Application, routes, C) {

        var app = new Application({
            routes: routes,
            controllerSuffix: C.CHAPLINJS_CONTROLLER_SUFFIX,
            root: C.CHAPLINJS_PROJECT_ROOT,
            pushState: C.CHAPLINJS_PUSH_STATE,
            scrollTo: C.CHAPLINJS_SCROLL_TO
        });
    });
});
