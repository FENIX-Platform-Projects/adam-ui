/*global define*/

define(function () {

    'use strict';

    return {

        "country": {

            uid: "adam_country_indicators",

            items: [
                    {
                        id: 'indicators-1',
                        type: 'custom',

                        filterFor: {
                            "filter_country": ['countrycode']
                        },
                        postProcess: [
                            {
                                "name": "filter",
                                "sid": [
                                    {
                                        "uid": "adam_country_indicators"
                                    }
                                ],
                                "parameters": {
                                   "columns": ["period", "value", "indicatorcode", "source", "note", "link", "itemcode", "unitcode"],
                                    "rows": {
                                        "countrycode": {
                                            "codes": [
                                                {
                                                    "uid": "crs_recipientdonors",
                                                    "version": "2016",
                                                    "codes": [
                                                        "625" // Afghanistan
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                },
                                "rid": {
                                    "uid": "filter_country"
                                }

                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "indicatorcode": "ASC"
                                }
                            }]
                    }
                ]
        },
        "donor": {

            uid: "adam_country_indicators",

            items: [
                {
                    id: 'indicators-1',
                    type: 'custom',

                    filterFor: {
                        "filter_donor": ['countrycode']
                    },
                    postProcess: [
                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_country_indicators"
                                }
                            ],
                            "parameters": {
                                "columns": ["period", "value", "indicatorcode", "source", "note", "link", "itemcode", "unitcode"],
                                "rows": {
                                    "countrycode": {
                                        "codes": [
                                            {
                                                "uid": "crs_recipientdonors",
                                                "version": "2016",
                                                "codes": [
                                                    "1" //Austria
                                                ]
                                            }
                                        ]
                                    }
                                }
                            },
                            "rid": {
                                "uid": "filter_donor"
                            }

                        },
                        {
                            "name": "order",
                            "parameters": {
                                "indicatorcode": "ASC"
                            }
                        }]
                }
            ]

        }
    }


});