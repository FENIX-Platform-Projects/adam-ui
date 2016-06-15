/*global define*/

define(function () {

    'use strict';

    return {

        SECONDARY_MENU: {
            url: 'config/browse/secondary_menu.json'
        },

        "sector": {
            filter: {
                parentsector_code: {
                    selector: {
                        id: "dropdown",
                        default: ["600"],
                        config: { //Selectize configuration
                            maxItems: 1,
                            placeholder: "Please select",
                            plugins: ['remove_button'],
                            mode: 'multi'
                        }
                    },
                    className: "col-sm-3",
                    cl: {
                        uid: "crs_dac",
                        version: "2016",
                        level: 1,
                        levels: 1
                    },
                    template: {
                        hideSwitch: true,
                        hideRemoveButton: true
                    }
                },
                purposecode: {
                    selector: {
                        id: "dropdown",
                        config: {
                            maxItems: 1,
                            placeholder: "All",
                            plugins: ['remove_button'],
                            mode: 'multi'
                        }
                    },
                    className: "col-sm-3",
                    cl: {
                        codes: ["60010", "60020", "60030", "60040", "60061", "60062", "60063"],
                        "uid": "crs_dac",
                        "version": "2016",
                        "level": 2,
                        "levels": 2
                    },
                    template: {
                        hideSwitch: true,
                        hideRemoveButton: true
                    },
                    dependencies: {
                        "parentsector_code": {id: "parent", event: "select"}, //obj or array of obj
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
                uid: {
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
                        headerIconClassName: 'glyphicon glyphicon-asterisk',
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
                        id: "tot-oda", //ref [data-item=':id']
                        type: "chart", //chart || map || olap,
                        config: {
                            type: "line",
                            x: ["year"], //x axis
                            series: ["flowcategory"], // series
                            y: ["value"],//Y dimension
                            aggregationFn: {"value": "sum"},
                            useDimensionLabelsIfExist: true,// || default raw else fenixtool

                            // filterFor: ['parentsector_code', 'purposecode', 'year-from', 'year-to'],
                            config: {
                                xAxis: {
                                    type: 'datetime'
                                }
                            }
                        },

                        filter: { //FX-filter format
                            parentsector_code: ["600"],
                            year: [{value: "2000", parent: "from"}, {value: "2014", parent:  "to"}]
                        },

                        postProcess: [
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "year"
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
                                "name": "order",
                                "parameters": {
                                    "year": "ASC"
                                }
                            }]
                    },
                    {
                        id: 'test-venn', // VENN TEST
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
                    },
                    {
                        id: 'country-map',
                        type: 'map',
                        config: {
                            geoSubject: 'gaul0',
                            fenix_ui_map: {

                                guiController: {
                                    overlay: false,
                                    baselayer: false,
                                    wmsLoader: false
                                },
                                baselayers: {
                                    "cartodb": {

                                        title_en: "CartoDB light",
                                        url: 'http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png',
                                        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
                                        subdomains: 'abcd',
                                        maxZoom: 19
                                        // title_en: "Baselayer",
                                        // url: 'http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png',
                                        // subdomains: 'abcd',
                                        // maxZoom: 19
                                    }
                                }
                            }
                        },

                        filter: { //FX-filter format
                            parentsector_code: ["600"],
                           // year: [{value: 2000, parent: 'from'}, {value: 2014, parent:  'to'}]

                        },
                        postProcess: [
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "gaul0"
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
                                            "columns": ["unitname"],
                                            "rule": "first"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "select",
                                "parameters": {
                                    "query": "WHERE gaul0<>?",
                                    "queryParameters": [{"value": "NA"}]
                                }
                            }
                        ]
                    }

                ]
            }
        }
    }


});