/*global define*/
define([
    'config/Config'
], function (C) {
    'use strict';

    var SERVER = C.SERVER;
    //var SERVER = "http://fenix.fao.org";

    return window.FMCONFIG = {

 		BASEURL_LANG: 'http://fenixrepo.fao.org/cdn/js/fenix-ui-map/0.1.4/i18n/',


        MAP_SERVICE_SHADED: SERVER + 'test/geo/fenix/mapclassify/join/',
        DEFAULT_WMS_SERVER: SERVER + 'geoserver',
        MAP_SERVICE_GFI_JOIN: SERVER + 'test/geo/fenix/mapclassify/request/',
        MAP_SERVICE_GFI_STANDARD: SERVER + 'test/geo/fenix/mapclassify/request/',

        // ZOOM TO BBOX
        ZOOM_TO_BBOX: SERVER +'/geo/fenix/spatialquery/db/spatial/bbox/layer/',

        CSS_TO_SLD: 'http://fenixapps2.fao.org/geoservices/CSS2SLD',

        BASEURL_MAPS: 'http://fenixapps2.fao.org/maps-demo',
        MAP_SERVICE_ZOOM_TO_BOUNDARY: '/rest/service/bbox',
        MAP_SERVICE_WMS_GET_CAPABILITIES: '/rest/service/request',
        MAP_SERVICE_PROXY: '/rest/service/request'
    };
});

