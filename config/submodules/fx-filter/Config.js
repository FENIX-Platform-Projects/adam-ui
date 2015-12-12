/*global define*/
define([
    'config/Config'
], function (C) {
    'use strict';

    'use strict';

    var SERVER = C.SERVER;
    var SERVER_POSTFIX = C.CODELIST_POSTFIX;
    var SERVICE = C.CODELIST_SERVICE;

    return {

        SERVER :SERVER,
        //SERVICE_BASE_ADDRESS: SERVER + "d3s_dev/msd",
        SERVICE_POSTFIX: SERVER_POSTFIX,
        SERVICE_BASE_ADDRESS: SERVER + SERVICE,
        D3S_METADATA_URL: SERVER + SERVICE + "/resources/",
        D3S_CODELIST_URL: SERVER + SERVICE+SERVER_POSTFIX,
        D3S_FILTER_CODES : SERVER + SERVICE + "/codes/filter",
        OVERWRITE_DEFAULT_CONFIG : true ,
        lang: "EN"
    };
});
