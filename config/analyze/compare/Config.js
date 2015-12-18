/*global define*/

define(function () {

    'use strict';

    return {

        cd: {
            "country-country": {
                "uid": "crs_recipients",
                "version": "2015"
            },
            "country-region": {
                "uid": "crs_regions_countries",
                "version": "2015"
            },
            "regional-aggregation": {
                "uid": "crs_regional_projects",
                "version": "2015"
            },
            "donor": {
                "uid": "crs_donors",
                "version": "2015"
            },
            "delivery": {
                "uid": "crs_channels",
                "version": "2015"
            },
            "sector": {
                "uid": "crs_dac",
                "version": "2015"
            },
            "sub-sector": {
                "uid": "crs_dac",
                "version": "2015",
                level: 3,
                levels: 3
            },
            "oda": {
                "uid": "crs_flow_amounts",
                "version": "2015"
            }
        },
        selectors: {
            "country-country": {
                "uid": "crs_recipients",
                "version": "2015"
            },
            "country-region": {
                "uid": "crs_regions_countries",
                "version": "2015"
            },
            "regional-aggregation": {
                "uid": "crs_regional_projects",
                "version": "2015"
            },
            "donor": {
                "uid": "crs_donors",
                "version": "2015"
            },
            "delivery": {
                "uid": "crs_channels",
                "version": "2015"
            },
            "sector": {
                "uid": "crs_dac",
                "version": "2015"
            },
            "sub-sector": {
                "uid": "crs_dac",
                "version": "2015",
                level: 3,
                levels: 3
            },
            "oda": {
                "uid": "crs_flow_amounts",
                "version": "2015"
            },
            "year": {
                "from": 2000,
                "to": 2013
            }
        }
    }


});