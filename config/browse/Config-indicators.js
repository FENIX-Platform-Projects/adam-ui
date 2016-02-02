/*global define*/

define(function () {

    'use strict';

    return {

        "country": {

            dashboard: {
                //data cube's uid
                uid: "adam_usd_commitment",

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
                            options: {
                                "columns_order": ["projecttitle", "year", "value"]
                            }

                            //  options: {
                            //  hidden_columns: ["GenderCode",
                            //      "AgeRangeCode"
                            //  ]
                            // }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: [],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "flowcode": {
                                            "codes": [
                                                {
                                                    "uid": "crs_flow_types",
                                                    "version": "2015",
                                                    "codes": [ "10_12", "10_11", "10_13", "10_19"]
                                                }
                                            ]
                                        },
                                        "sectorcode": {
                                            "codes": [
                                                {
                                                    "uid": "crs_sectors",
                                                    "version": "2015",
                                                    "codes": [
                                                        "600"
                                                    ]
                                                }
                                            ]
                                        },
                                        "recipientcode": {
                                            "codes": [
                                                {
                                                    "uid": "crs_recipients",
                                                    "version": "2015",
                                                    "codes": [
                                                        "625"  //Afghanistan
                                                    ]
                                                }
                                            ]
                                        },
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 2000,
                                                    "to": 2013
                                                }
                                            ]
                                        }
                                    },
                                    "columns": ["year", "value", "projecttitle"] // DSD Order
                                }
                            }
                        ]
                    }

                ]
            }
        }
    }



});