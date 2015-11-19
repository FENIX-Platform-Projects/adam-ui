/*global define*/
define([
    'config/Config'
], function (C) {
    'use strict';

    return {

        SERVICE_BASE_ADDRESS : C.SERVER,
        D3P_PATHNAME : "d3s_dev/processes/",
        D3P_QUERY_PARAMS : '?language=EN'
    }
});