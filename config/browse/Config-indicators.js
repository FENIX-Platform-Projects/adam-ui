/*global define*/

define(function () {

    'use strict';

    return {

        "country_sector": {

            dashboard: {
                //data cube's uid
                uid: "adam_country_indicators",

                //data base filter
                filter: [],

                //bridge configuration
                bridge: {
                    type: "d3p"
                },

                /*
                 * in case bridge is WDS this is the cube metadata.
                 * if bridge is D3P this is ignored
                 * */
                metadata: {},

                items: [
                    {
                        id: 'indicator-1',
                        type: 'custom',
                        class: "fx-map-chart",
                        //needed if layout = injected
                        container: "#indicator-1",
                        config: {
                            container: "#indicator-1",
                            eventId: "country-indicator-1",
                            order: ["period", "value", "indicatorcode", "source", "note"]
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: [],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "countrycode": {
                                            "codes": [
                                                {
                                                    "uid": "crs_recipientdonors",
                                                    "version": "2015",
                                                    "codes": [
                                                        "625"  //Afghanistan
                                                    ]
                                                }
                                            ]
                                        }
                                    },
                                    "columns": ["period", "value", "indicatorcode", "source", "note"]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "indicatorcode": "ASC"
                                }
                            }
                        ]
                    }

                ]
            }
        },
        "donor_sector": {

            dashboard: {
                //data cube's uid
                uid: "adam_country_indicators",

                //data base filter
                filter: [],

                //bridge configuration
                bridge: {
                    type: "d3p"
                },

                /*
                 * in case bridge is WDS this is the cube metadata.
                 * if bridge is D3P this is ignored
                 * */
                metadata: {},

                items: [
                    {
                        id: 'indicator-1',
                        type: 'custom',
                        class: "fx-map-chart",
                        //needed if layout = injected
                        container: "#indicator-1",
                        config: {
                            container: "#indicator-1",
                            eventId: "country-indicator-1",
                            order: ["period", "value", "indicatorcode", "source", "note"]
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: [],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "countrycode": {
                                            "codes": [
                                                {
                                                    "uid": "crs_recipientdonors",
                                                    "version": "2015",
                                                    "codes": [
                                                        "1"  //Australia
                                                    ]
                                                }
                                            ]
                                        }
                                    },
                                    "columns": ["period", "value", "indicatorcode", "source", "note"]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "indicatorcode": "ASC"
                                }
                            }
                        ]
                    }

                ]
            }
        }
    }



});