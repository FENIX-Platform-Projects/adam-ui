/*global define*/

define(function () {

    'use strict';

    return {
        "sector": {
            purposecode: {hide: ['top-sectors', 'top-subsectors', 'tot-oda-sector', 'top-recipients-all-sectors', 'top-partners-all-sectors'], show: ['tot-oda-subsector']},
            parentsector_code: {hide: ['tot-oda', 'top-sectors', 'tot-oda-subsector', 'top-recipients-all-sectors', 'top-partners-all-sectors'], show: ['top-subsectors', 'tot-oda-sector', 'top-partners-others', 'top-recipients-others', 'top-recipients', 'top-partners']}
        },
        "country": {
            purposecode: {hide: ['top-sectors', 'top-sectors-others', 'top-subsectors', 'tot-oda-sector', 'tot-oda'], show: ['tot-oda-subsector']},
            parentsector_code: {hide: ['top-sectors', 'top-sectors-others', 'tot-oda-subsector', 'tot-oda'], show: ['top-subsectors', 'tot-oda-sector']}
        },
        "donor": {
            purposecode: {hide: ['top-sectors', 'top-sectors-others', 'top-subsectors', 'tot-oda-sector', 'tot-oda'], show: ['tot-oda-subsector']},
            parentsector_code: {hide: ['top-sectors', 'top-sectors-others', 'tot-oda-subsector', 'tot-oda'], show: ['top-subsectors', 'tot-oda-sector']}
        },
        "country_donor": {
            purposecode: {hide: ['top-sectors', 'top-sectors-others', 'top-subsectors', 'tot-oda-sector', 'tot-oda'], show: ['tot-oda-subsector']},
            parentsector_code: {hide: ['top-sectors', 'top-sectors-others', 'tot-oda-subsector', 'tot-oda'], show: ['top-subsectors', 'tot-oda-sector']}
        }
    }
});