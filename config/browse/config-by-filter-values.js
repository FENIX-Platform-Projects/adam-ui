/*global define*/

define(function () {

    'use strict';

    return {
        "sector": {
            parentsector_code: [
                {
                    value: "",
                    config: { path: "config-all-sector"},
                    display: { hide: ['tot-oda-sector', 'top-partners-others', 'top-recipients-others'], show: ['tot-oda', 'top-sectors']}
                },
                {value: "9999", config: {path: "config-fao-sector"}}
            ]
        }
    }
});