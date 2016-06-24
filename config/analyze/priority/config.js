/*global define*/

define(function () {

    'use strict';

    return {

        SECONDARY_MENU: {
            url: 'config/browse/secondary_menu.json'
        },

            filter: {
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
                }
            },


            dashboard: {
                //default dataset id
                uid: "adam_usd_commitment",

                items: [
                    {
                        id: 'venn',
                        type: 'chart',
                        config: {
                            type: "venn",
                            renderer: "jvenn",
                            x: ["donorname"], //x axis and series
                            series: ["recipientname"], // series
                            y: ["donorname"],//Y dimension
                            aggregationFn: {"value": "sum"},
                            useDimensionLabelsIfExist: false,// || default raw else fenixtool
                            // filterFor: ['parentsector_code', 'purposecode', 'year-from', 'year-to'],

                        },
                        filter: { //FX-filter format
                           recipientname: ['Afghanistan', 'Bangladesh', 'Belize'],
                           year : [2014]
                        },
                        postProcess: [
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "recipientname", "donorname"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "SUM"
                                        },
                                        {
                                            "columns": ["unitcode"],
                                            "rule": "first"
                                        },
                                        {
                                            "columns": ["flowcategory"],
                                            "rule": "first"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "select",
                                "parameters": {
                                    "query": "WHERE recipientname<>?",
                                    "queryParameters": [{"value": "NA"}]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "recipientname": "DESC"
                                }
                            }
                           ]
                    }
                ]
            }
    }


});