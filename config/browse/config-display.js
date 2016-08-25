/*global define*/

define(function () {

    'use strict';

    return {
        "sector": {
            purposecode: {hide: ['top-subsectors', 'tot-oda-sector'], show: ['tot-oda-subsector']},
            parentsector_code: {hide: ['tot-oda-subsector'], show: ['top-subsectors', 'tot-oda-sector']}
        },
        "country": {
            purposecode: {hide: ['top-sectors', 'top-sectors-others', 'top-subsectors', 'tot-oda-sector', 'tot-oda'], show: ['tot-oda-subsector']},
            parentsector_code: {hide: ['top-sectors', 'top-sectors-others', 'tot-oda-subsector', 'tot-oda'], show: ['top-subsectors', 'tot-oda-sector']}
        },
        "donor": {
            purposecode: {hide: ['top-sectors', 'top-sectors-others', 'top-subsectors', 'tot-oda-sector', 'tot-oda'], show: ['tot-oda-subsector']},
            parentsector_code: {hide: ['top-sectors', 'top-sectors-others', 'tot-oda-subsector', 'tot-oda'], show: ['top-subsectors', 'tot-oda-sector']}
        }
    }
});