/*global define*/

define(function () {

    'use strict';

    return {

        SECONDARY_MENU: {
            url: 'config/browse/secondary_menu.json'
        },

            filter: {
                "recipientcode": {
                    default: ["600"],
                    "cl": {"uid": "crs_recipients", "version": "2016"},
                    "selector": {"id": "tree", "hideSummary": false},
                    "template": {"title": "", "hideSwitch": true},
                    "format": {"dimension": "recipientcode"},
                    className: "col-sm-4",
                    summaryRender : function (item) {
                        return "<u><mark> " + item.label + "</mark></u>"
                    }
                },
                "donorcode": {
                    default: ["600"],
                    "cl": {"uid": "crs_donors", "version": "2016"},
                    "selector": {"id": "tree", "hideSummary": false},
                    "template": {"title": "", "hideSwitch": true},
                    "format": {"dimension": "donorcode"},
                    className: "col-sm-6",
                    summaryRender : function (item) {
                        return "<u><mark> " + item.label + "</mark></u>"
                    }
                },
              /**  recipientcode2: {
                    selector: {
                        id: "dropdown",
                        default: ["600"],
                        config: { //Selectize configuration
                           // maxItems: 1,
                            placeholder: "Please select",
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
                        default: ["600"],
                        config: { //Selectize configuration
                           // maxItems: 1,
                            placeholder: "Please select",
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
                }**/
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
                           year : [2014]//,
                         //  recipientcode: ["600"],
                         //  donorcode: ["600"]
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