/*global define*/

define(function () {

    'use strict';

    return {
            dashboard: {
                //default dataset id
                uid: "adam_usd_commitment",

                items: [
                    {
                        id: "partner-matrix-2",
                        type: 'custom',
                        config: {
                            "groupedRow":false,
                            "aggregationFn":{"value":"sum"},
                            "formatter":"localstring",
                            "decimals":2,
                            "showRowHeaders":true,
                            "columns":["indicator"],
                            "rows":["donorcode", "recipientcode"],
                            "aggregations":[],
                            "values":["value"],
                            inputFormat : "fenixtool"
                        },

                        filterFor: {
                            "filter_total_ODA": ['year', 'oda', 'donorcode']
                        },

                        postProcess: [
                            {
                                "name": "filter",
                                "sid": [
                                    {
                                        "uid": "adam_usd_aggregation_table"
                                    }
                                ],
                                "parameters": {
                                    "columns": [
                                        "donorcode",
                                        "recipientcode",
                                        "value",
                                        "unitcode"
                                    ],
                                    "rows": {
                                        "donorcode": {
                                            "codes": [
                                                {
                                                    "uid": "crs_donors",
                                                    "version": "2016",
                                                    "codes": [
                                                        "1"
                                                    ]
                                                }
                                            ]
                                        },
                                        "oda": {
                                            "enumeration": [
                                                "usd_commitment"
                                            ]
                                        },
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 2000,
                                                    "to": 2014
                                                }
                                            ]
                                        }
                                    }
                                },
                                "rid":{"uid":"filter_total_ODA"}
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "donorcode",  "recipientcode"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": [
                                                "value"
                                            ],
                                            "rule": "SUM"
                                        },
                                        {
                                            "columns": [
                                                "unitcode"
                                            ],
                                            "rule": "first"
                                        }
                                    ]
                                },
                                "rid": {
                                    "uid": "total_oda"
                                }
                            },
                            {
                                "name": "select",
                                "parameters": {
                                    "query": "WHERE recipientcode NOT IN (?) AND value > 0", // skipping regional recipient countries (e.g. "Africa, regional"; "North of Sahara, regional")
                                    "queryParameters": [
                                        {"value": 'NA'}
                                    ]
                                }
                            },
                            {
                                "name": "addcolumn",
                                "parameters": {
                                    "column": {
                                        "dataType": "text",
                                        "id": "indicator",
                                        key:true,
                                        "title": {
                                            "EN": "Indicator"
                                        },
                                        "domain": {
                                            "codes": [
                                                {
                                                    "extendedName": {
                                                        "EN": "Adam Processes"
                                                    },
                                                    "idCodeList": "adam_processes"
                                                }
                                            ]
                                        },
                                        "subject": null
                                    },
                                    "value": "Total ODA (mil $)"
                                }
                            }
                        ]
                    },
                ]
            }
       }


});