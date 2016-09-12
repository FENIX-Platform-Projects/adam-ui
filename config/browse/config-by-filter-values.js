/*global define*/

define(function () {

    'use strict';

    return {
        "sector": {
            parentsector_code: [
                {
                    value: "",
                    config: { path: "config-all-sector"},
                    display: { hide: ['tot-oda-sector', 'top-partners-others', 'top-recipients-others', 'top-recipients', 'top-partners'], show: ['tot-oda', 'top-sectors', 'top-recipients-all-sectors', 'top-partners-all-sectors']}
                },
                {value: "9999", config: {path: "config-fao-sector"}}
            ]
        }
    }
});