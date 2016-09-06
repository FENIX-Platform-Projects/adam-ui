/*global define*/

define(function () {

    'use strict';

    return {

        filter: {
            recipientcode: {
                selector: {
                    id: "dropdown",
                    default: ["625"], // afghanistan
                    config: { //Selectize configuration
                        maxItems: 1,
                        placeholder: "All",
                        plugins: ['remove_button'],
                        mode: 'multi'
                    }
                },
                className: "col-sm-3",
                cl: {
                    uid: "crs_recipients",
                    version: "2016",
                    level: 1,
                    levels: 1
                },
                template: {
                    hideSwitch: true,
                    hideRemoveButton: true
                }
            },
            donorcode: {
                selector: {
                    id: "dropdown",
                    default: ["1"], // Austria
                    config: { //Selectize configuration
                        maxItems: 1,
                        placeholder: "All",
                        plugins: ['remove_button'],
                        mode: 'multi'
                    }
                },
                className: "col-sm-3",
                cl: {
                    uid: "crs_donors",
                    version: "2016",
                    level: 1,
                    levels: 1
                },
                template: {
                    hideSwitch: true,
                    hideRemoveButton: true
                }
            },
            "year-from": {
                selector: {
                    id: "dropdown",
                    from: 2000,
                    to: 2014,
                    default: [2000],
                    config: { //Selectize configuration
                        maxItems: 1
                    }
                },
                className: "col-sm-2",
                format: {
                    type: "static",
                    output: "time"
                },
                template: {
                    hideSwitch: true,
                    hideRemoveButton: true
                }
            },
            "year-to": {

                selector: {
                    id: "dropdown",
                    from: 2000,
                    to: 2014,
                    default: [2014],
                    config: {
                        maxItems: 1
                    }
                },
                className: "col-sm-2",
                format: {
                    type: "static",
                    output: "time"
                },

                dependencies: {
                    "year-from": {id: "min", event: "select"}
                },

                template: {
                    hideSwitch: true,
                    hideRemoveButton: true
                }
            },
            oda: {
                selector: {
                    id: "dropdown",
                    default: ['adam_usd_commitment'],
                    config: { //Selectize configuration
                        maxItems: 1
                    }
                },
                className: "col-sm-4",
                cl: {
                    uid: "crs_flow_amounts",
                    version: "2016"
                },
                template: {
                    hideHeaderIcon: false,
                    headerIconClassName: 'glyphicon glyphicon-info-sign',
                    hideSwitch: true,
                    hideRemoveButton: true
                }
            }
        },


            dashboard: {
                //default dataset id
                uid: "adam_usd_commitment",

                items: [
                    {
                        id: "partner-matrix",
                        type: 'table',
                        config: {
                            "groupedRow":true,
                            "aggregationFn":{"value":"sum"},
                            "decimals":2,
                            "showRowHeaders":true,
                            "rows":["donorcode", "recipientcode", "indicatorcode"],
                            "columns":["donorcode", "recipientcode", "indicatorcode"],
                            "aggregations":[],
                            "values":["value"],
                            useDimensionLabelsIfExist: true
                         },

                        filterFor: {
                            "filter_top_10_sectors_sum": ['year', 'oda']
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
                                        "oda": {
                                            "enumeration": [
                                                "usd_commitment"
                                            ]
                                        },
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 2000,
                                                    "to": 2001
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
                                        "donorcode", "recipientcode"
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
                                "name": "addcolumn",
                                "parameters": {
                                    "column": {
                                        "dataType": "text",
                                        "id": "indicator",
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
                                    "value": "Total ODA"
                                }
                            }
                        ]
                    }
                ]
            }
    }


});