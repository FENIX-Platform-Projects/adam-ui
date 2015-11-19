/*global define*/
define(function () {

        'use strict';

    //var CODELIST_PREFIX = 'http://fenixservices.fao.org/d3s/msd/resources/data/uid/'
    var CODELIST_PREFIX = 'http://fenix.fao.org/d3s/msd/resources/'

        return {

            //Chaplin JS configuration
            CHAPLINJS_CONTROLLER_SUFFIX: '-controller',
            CHAPLINJS_PROJECT_ROOT: '/fenix/',
            CHAPLINJS_PUSH_STATE: false,
            CHAPLINJS_SCROLL_TO: false,
            CHAPLINJS_APPLICATION_TITLE: "FENIX Web App",

            //WDS configuration
            DB_NAME: 'db_name',
            WDS_URL: 'http://hqlprfenixapp2.hq.un.fao.org:10100/wds-5.2.1/rest/crud',
            WDS_OUTPUT_TYPE: 'object',
            WDS_OLAP_OUTPUT_TYPE : 'array',

            //Top Menu configuration
            TOP_MENU_CONFIG: 'config/submodules/fx-menu/top_menu.json',
            //TOP_MENU_TEMPLATE: 'fx-menu/templates/side.html',
            TOP_MENU_TEMPLATE: 'fx-menu/templates/blank-fluid.html',
            TOP_MENU_SHOW_BREADCRUMB : true,
            //TOP_MENU_SHOW_BREADCRUMB : false,
            TOP_MENU_SHOW_BREADCRUMB_HOME : true,
            TOP_MENU_SHOW_FOOTER: false,
            TOP_MENU_AUTH_MODE_HIDDEN_ITEMS: ['login'],
            TOP_MENU_PUBLIC_MODE_HIDDEN_ITEMS :['datamgmt', 'logout'],
            //TOP_MENU_PUBLIC_MODE_HIDDEN_ITEMS :['protected', 'logout'],


            SECURITY_NOT_AUTHORIZED_REDIRECTION_LINK : "login",

           // COUNTRIES_CODE_LIST : CODELIST_PREFIX + "UNECA_ISO3",
            COUNTRIES_CODE_LIST : CODELIST_PREFIX + "/crs_donors/2015",
            CODELIST_URL : CODELIST_PREFIX,
            MD_EXPORT_URL : 'http://fenixapps2.fao.org/fenixExport',
            DATA_ENVIROMENT_URL : 'http://fenixservices.fao.org',

            SOCIAL_LINK_FACEBOOK : "https://facebook.com",
            SOCIAL_LINK_TWITTER : "https://twitter.com",
            SOCIAL_LINK_YOUTUBE : "https://youtube.com",

            DOWNLOAD_FILE_SYSTEM_ROOT : 'http://fenixrepo.fao.org/cdn/data/adam/download/',

            SERVER : "http://www.fao.org/fenixrepo/external/lprapp16/"
		//SERVER : "http://fenixrepo.fao.org/external/lprapp16/"
            //SERVER : "http://fenix.fao.org/"
            //SERVER : "http://lprapp16.fao.org/"

        };
    });
