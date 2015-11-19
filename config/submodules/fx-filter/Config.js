/*global define*/
define([
    'config/Config'
], function (C) {
    'use strict';

    'use strict';

    var SERVER = C.SERVER;

    return {

        SERVER :SERVER,
        SERVICE_BASE_ADDRESS: SERVER + "d3s_dev/msd"

    };
});
