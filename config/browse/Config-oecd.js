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
                            series: ["indicator"], // series
                            y: ["value"],//Y dimension
                            aggregationFn: {"value": "sum"},
                            useDimensionLabelsIfExist: false,// || default raw else fenixtool

                            config: {
                                xAxis: {
                                    type: 'datetime'
                                },
                                yAxis: [{ //Primary Axis in default template
                                },{ // Secondary Axis
                                    gridLineWidth: 0,
                                    title: {
                                        text: '%'
                                    },
                                    opposite: true
                                }],
                                series: [{
                                    name: '% SECTOR/TOTAL ODA',
                                    yAxis: 1,
                                    dashStyle: 'shortdot',
                                    marker : {
                                       radius: 3
                                    }
                                },
                                    {
                                        name: 'ODA SECTOR'//,
                                       // type: 'column'
                                    },
                                    {
                                        name: 'TOTAL ODA'//,
                                       // type: 'column'
                                    }],
                                exporting: {
                                    chartOptions: {
                                        legend: {
                                            enabled: true
                                        }

                                    }
                                }

                            }
                        },

                        filterFor: {
                            "filter_sector_oda": ['sectorcode', 'year-from', 'year-to', 'oda'],
                            "filter_total_oda": ['year-from', 'year-to']
                        },

                        postProcess: [
                            {
                                "name": "union",
                                "sid": [
                                    {
                                        "uid": "sector_oda"
                                    },
                                    {
                                        "uid": "total_oda"
                                    },
                                    {
                                        "uid": "percentage_ODA"
                                    }
                                ],
                                "parameters": {
                                },
                                "rid": {
                                    "uid": "union_process"
                                }
                            },
                            {
                                "name": "filter",
                                "sid": [
                                    {
                                        "uid": "adam_usd_aggregation_table"
                                    }
                                ],
                                "parameters": {
                                    "columns": [
                                        "year",
                                        "value",
                                        "unitcode"
                                    ],
                                    "rows": {
                                        "oda": {
                                            "enumeration": [
                                                "usd_commitment"
                                            ]
                                        },
                                        "sectorcode": {
                                            "codes": [
                                                {
                                                    "uid": "crs_sectors",
                                                    "version": "2016",
                                                    "codes": [
                                                        "600"
                                                    ]
                                                }
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
                                 rid: {uid: "filter_sector_oda"}
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "year"
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
                                    "value": "ODA SECTOR"
                                },
                                "rid": {
                                    "uid": "sector_oda"
                                }
                            },
                            {
                                "name": "filter",
                                "sid": [
                                    {
                                        "uid": "adam_usd_aggregation_table"
                                    }
                                ],
                                "parameters": {
                                    "columns": [
                                        "year",
                                        "value",
                                        "unitcode"
                                    ],
                                    "rows": {
                                        "oda": {
                                            "enumeration": [
                                                "usd_commitment"
                                            ]
                                        },
                                        "sectorcode": {
                                            "codes": [
                                                {
                                                    "uid": "crs_sectors",
                                                    "version": "2016",
                                                    "codes": [
                                                        "NA"
                                                    ]
                                                }
                                            ]
                                        },
                                        "purposecode": {
                                            "codes": [
                                                {
                                                    "uid": "crs_purposes",
                                                    "version": "2016",
                                                    "codes": [
                                                        "NA"
                                                    ]
                                                }
                                            ]
                                        },
                                        "donorcode": {
                                            "codes": [
                                                {
                                                    "uid": "crs_donors",
                                                    "version": "2016",
                                                    "codes": [
                                                        "NA"
                                                    ]
                                                }
                                            ]
                                        },
                                        "recipientcode": {
                                            "codes": [
                                                {
                                                    "uid": "crs_recipients",
                                                    "version": "2016",
                                                    "codes": [
                                                        "NA"
                                                    ]
                                                }
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
                                "rid": {
                                    "uid": "filter_total_oda"
                                }

                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "year"
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
                                    "value": "TOTAL ODA"
                                },
                                "rid": {
                                    "uid": "total_oda"
                                }
                            },
                            {
                                "name": "join",
                                "sid": [
                                    {
                                        "uid": "sector_oda"
                                    },
                                    {
                                        "uid": "total_oda"
                                    }
                                ],
                                "parameters": {
                                    "joins": [
                                        [
                                            {
                                                "type": "id",
                                                "value": "year"
                                            }
                                        ],
                                        [
                                            {
                                                "type": "id",
                                                "value": "year"
                                            }
                                        ]
                                    ],
                                    "values": [
                                    ]
                                },
                                "rid": {
                                    "uid": "join_process"
                                }
                            },
                            {
                                "name": "addcolumn",
                                "sid": [
                                    {
                                        "uid": "join_process"
                                    }
                                ],
                                "parameters": {
                                    "column": {
                                        "dataType": "number",
                                        "id": "value",
                                        "title": {
                                            "EN": "Value"
                                        },
                                        "subject": null
                                    },
                                    "value": {
                                        "keys":  ["1=1"],
                                        "values":["(sector_oda_value/total_oda_value)*100"]
                                    }
                                },
                                "rid": {
                                    "uid": "percentage_Value"
                                }
                            },
                            {
                                "name": "filter",
                                "parameters": {
                                    "columns": [
                                        "year",
                                        "value"
                                    ],
                                    "rows": {}
                                },
                                "rid": {
                                    "uid": "percentage_with_two_values"
                                }
                            },
                            {
                                "name": "addcolumn",
                                "parameters": {
                                    "column": {
                                        "id": "unitcode",
                                        "title": {
                                            "EN": "Measurement Unit"
                                        },
                                        "domain": {
                                            "codes": [
                                                {
                                                    "idCodeList": "crs_units",
                                                    "version": "2016",
                                                    "level": 1
                                                }
                                            ]
                                        },
                                        "dataType": "code",
                                        "subject": "um"
                                    },
                                    "value": "percentage"
                                }
                            },
                            {
                                "name": "addcolumn",
                                "parameters": {
                                    "column": {
                                        "dataType": "text",
                                        "id": "unitcode_EN",
                                        "title": {
                                            "EN": "Measurement Unit_TEST"
                                        },
                                        "subject": null
                                    },
                                    "value": "%"
                                },
                                "rid": {
                                    "uid": "percentage_withUM"
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
                                    "value": "% SECTOR/TOTAL ODA"
                                },
                                "rid": {
                                    "uid": "percentage_ODA"
                                }
                            }
                        ]
                    }
                   , {
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
                            colorRamp: 'GnBu',  //Blues, Greens,
                            //colorRamp values: http://fenixrepo.fao.org/cdn/fenix/fenix-ui-map-datasets/colorramp.png
                            
                            legendtitle: 'ODA',

                            fenix_ui_map: {

                                guiController: {
                                    overlay: false,
                                    baselayer: false,
                                    wmsLoader: false
                                },

                                baselayers: {
                                    "cartodb": {
                                        title_en: "CartoDB light",
                                        url: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
                                        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
                                        subdomains: 'abcd',
                                        maxZoom: 19
                                        // title_en: "Baselayer",
                                        // url: 'http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png',
                                        // subdomains: 'abcd',
                                        // maxZoom: 19
                                    }
                                },
                                labels: true,
                                boundaries: true
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
                        ]//
                    }

                ]
            }
        },
/*
        "recipient": {
            dashboard: {
                //default dataset id
                uid: "browse-country",

                items: [
                    {
                        id: 'country-map',
                        type: 'map',
                        config: {
                            geoSubject: 'gaul0',
                            colorRamp: 'Reds',  //Blues, Greens, 
                            //colorRamp values: http://fenixrepo.fao.org/cdn/fenix/fenix-ui-map-datasets/colorramp.png
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
                                },
                                labels: true,
                                boundaries: true
                                //highlightCountry: ['TCD','MLI','NER']
                            }
                        },

                        filter: { //FX-filter format
                            parentsector_code: ["600"],
                           // year: [{value: 2000, parent: 'from'}, {value: 2014, parent:  'to'}]
                        }
                    }
                ]
            }
        }
*/
    }


});