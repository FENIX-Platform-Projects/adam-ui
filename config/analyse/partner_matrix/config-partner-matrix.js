/*global define*/
define(function ( ) {

    'use strict';

    return {
        dashboard: {
            DEFAULT_TOPIC : 'country' //country, donor or country-donor
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
            RECIPIENT_COUNTRY_SELECTED: 'country',
            RESOURCE_PARTNER_SELECTED: 'donor',
            RECIPIENT_AND_PARTNER_SELECTED: 'country-donor'
        }
    };
});