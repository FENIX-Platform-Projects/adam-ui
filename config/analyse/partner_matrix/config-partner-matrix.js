/*global define*/
define(function ( ) {

    'use strict';

    return {
        dashboard: {
            DEFAULT_TOPIC : 'recipient' //recipient, donor or recipient_donor
        },
        filter: {
            RECIPIENT_COUNTRY: 'recipientcode',
            RESOURCE_PARTNER: 'donorcode',
            SECTOR: 'parentsector_code',
            SUB_SECTOR: 'purposecode',
            CHANNELS_SUBCATEGORY: 'channelsubcategory_code',
            CHANNEL: 'channelcode',
            ODA: 'oda',
            YEAR: 'year',
            YEAR_FROM: 'year-from',
            YEAR_TO: 'year-to',
            COUNTRY: 'countrycode'
        },
        topic: {
            SELECTED_TOPIC: 'selected_topic',
            COUNTRY_SELECTED: 'recipient',
            RESOURCE_PARTNER_SELECTED: 'donor',
            COUNTRY_AND_RESOURCE_PARTNER_SELECTED: 'recipient_donor'
        }
    };
});