/*global define*/

define(function () {

    'use strict';

    return {
        "recipient": {
            config: { path: "config-recipient"},
            display: {
                hide: ['tot-oda-top-recipients', 'tot-oda-fao-top-recipients'],
                show: ['tot-oda', 'top-channels', 'tot-oda-top-partners', 'tot-oda-fao-top-partners']}
        },
        "donor": {
            config: { path: "config-donor"},
            display: {
                hide: ['tot-oda-top-partners', 'tot-oda-fao-top-partners'],
                show: ['tot-oda', 'top-channels', 'tot-oda-top-recipients', 'tot-oda-fao-top-recipients']}
        },
        "recipient_donor": {
            config: { path: "config-recipient-donor"},
            display: {
                hide: ['tot-oda-top-recipients', 'tot-oda-fao-top-recipients', 'tot-oda-top-recipients', 'tot-oda-fao-top-recipients'],
                show: ['tot-oda', 'top-channels']}
        }
    }
});