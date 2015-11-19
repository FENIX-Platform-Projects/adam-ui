/*global define*/

define(function () {

    'use strict';

    return {

        "FLUDE_TOPIC_1": {

            download: {
                "target": "1.FOREST AREA AND CHARACTERISTICS.zip"
            },

            filter: [
                {
                    "type": "distinct",
                    "uid": "FLUDE_TOPIC_1",
                    "column": "indicator",
                    "containerType": "baseContainer",
                    "title": "Indicator",
                    "defaultCodes": ["Forest"],
                    "components": [
                        {
                            "type": "codelist",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "uid" : "FLUDE_INDICATORS",
                            "title": {"EN": "Distinct"},
                            // name is the ID output in tehe filter getValues()
                            "name": "indicator",
                            "config": {
                                "defaultsource": []
                            }

                        }
                    ]
                },
                {
                    "type": "static",
                    "containerType": "baseContainer",
                    "title": "Year",
                    "components": [
                        {
                            "type": "time",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Year"},
                            "name": "year",
                            config: {
                                "defaultsource": [
                                    {"value": "2015", "label": "2015", "selected": true},
                                    {"value": "2010", "label": "2010", "selected": false},
                                    {"value": "2005", "label": "2005", "selected": false},
                                    {"value": "2000", "label": "2000", "selected": false},
                                    {"value": "1990", "label": "1990", "selected": false}
                                ]
                            }
                        }
                    ]
                },
                {
                    "type": "codelist",
                    "containerType": "baseContainer",
                    "title": "Domains",
                    "components": [
                        {
                            "uid": "FLUDE_DOMAINS",
                            "type": "codelist",
                            "name": "domain",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},

                            config: {
                                "defaultsource": [
                                    //{"value": null, "label": "All", "selected": true},
                                    //{"value": null, "label": "All", "selected": true, "removeFilter": true},
                                ],
                                "enableMultiselection": true
                            }
                        }
                    ]
                },
                {
                    "type": "codelist",
                    "containerType": "baseContainer",
                    "title": "Incomes",
                    "components": [
                        {
                            "uid": "FLUDE_INCOMES",
                            "type": "codelist",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},
                            "name": "incomes",
                            config: {
                                "defaultsource": [
                                    //{"value": null, "label": "All", "selected": true},
                                ],
                                "enableMultiselection": true
                            }
                        }
                    ]
                },
                {
                    "type": "codelist",
                    "containerType": "baseContainer",
                    "title": "Subregions",
                    "components": [
                        {
                            "uid": "FLUDE_SUBREGIONS",
                            "type": "codelist",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},
                            "name": "subregion",
                            config: {
                                "defaultsource": [
                                    //{"value": null, "label": "All", "selected": true},
                                ],
                                "enableMultiselection": true
                            }
                        }
                    ]
                }
            ],

            dashboard: {
                //data cube's uid
                uid: "FLUDE_TOPIC_1",

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
                        id: 'item-1',
                        type: 'map',
                        class: "fx-map-chart",
                        //needed if layout = injected
                        container: "#item-1",
                        config: {
                            container: "#item-1",
                            leaflet: {
                                    zoomControl: false,
                                    attributionControl: true,
                                    scrollWheelZoom: false,
                                    minZoom: 2
                                }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator', 'year', 'domain', 'incomes', 'subregion'],
                        forbiddenValues: {
                            year: {time: [{from: 2015, to: 2015}]},
                            domain: {removeFilter: true}
                        },
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 2015,
                                                    "to": 2015
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "Forest"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-2',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-2",
                        config: {
                            container: "#item-2",
                            adapter: {
                                type: "standard",
                                xDimensions: 'time',
                                yDimensions: 'element',
                                valueDimensions: 'value',
                                seriesDimensions: ['country']
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                    tooltip: {
                                        valueSuffix: ' 1000 HA'
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator', 'year', 'domain', 'incomes', 'subregion'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 2015,
                                                    "to": 2015
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "Forest"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "value": "DESC"
                                }
                            },
                            {
                                "name": "page",
                                "parameters": {
                                    "perPage": 25,
                                    "page": 1
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-3',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-3",
                        config: {
                            container: "#item-3",
                            adapter: {
                                type: "standard",
                                xDimensions: 'year',
                                yDimensions: 'indicator',
                                valueDimensions: 'value',
                                seriesDimensions: ['region']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                    tooltip: {
                                        valueSuffix: ' 1000 HA'
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 1990,
                                                    "to": 2015
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "Forest"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "region", "year", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }

                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "region": "ASC",
                                    "year": "ASC"
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-4',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-4",
                        config: {
                            container: "#item-4",
                            adapter: {
                                type: "pie",
                                valueDimensions: 'value',
                                seriesDimensions: ['region']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        plotBackgroundColor: null,
                                        plotBorderWidth: null,
                                        plotShadow: false,
                                        type: 'pie'
                                    },
                                    title: {
                                        //enable : false
                                        text: ''
                                    },
                                    tooltip: {
                                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                                    },
                                    plotOptions: {
                                        pie: {
                                            allowPointSelect: true,
                                            cursor: 'pointer',
                                            dataLabels: {
                                                enabled: true
                                            },
                                            showInLegend: true
                                        }
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator', 'year'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 2015,
                                                    "to": 2015
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "Forest"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "region", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "region": "ASC"
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-5',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-5",
                        config: {
                            container: "#item-5",
                            adapter: {
                                type: "standard",
                                xDimensions: 'year',
                                yDimensions: 'indicator',
                                valueDimensions: 'value',
                                seriesDimensions: ['subregion']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                    tooltip: {
                                        crosshairs: "mixed",
                                        shared: true
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 1990,
                                                    "to": 2015
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "Forest"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "subregion", "year", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "subregion": "ASC",
                                    "year": "ASC"
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-6',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-5",
                        config: {
                            container: "#item-6",
                            adapter: {
                                type: "standard",
                                xDimensions: 'year',
                                yDimensions: 'indicator',
                                valueDimensions: 'value',
                                seriesDimensions: ['domain']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                    tooltip: {
                                        valueSuffix: ' 1000 HA'
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 1990,
                                                    "to": 2015
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "Forest"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "domain", "year", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "domain": "ASC",
                                    "year": "ASC"
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-7',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-7",
                        config: {
                            container: "#item-7",
                            adapter: {
                                type: "standard",
                                xDimensions: 'year',
                                yDimensions: 'indicator',
                                valueDimensions: 'value',
                                seriesDimensions: ['incomes']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                    tooltip: {
                                        valueSuffix: ' 1000 HA'
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 1990,
                                                    "to": 2015
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "Forest"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "incomes", "year", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "incomes": "ASC",
                                    "year": "ASC"
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-8',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-8",
                        config: {
                            container: "#item-8",
                            adapter: {
                                type: "pie",
                                valueDimensions: 'value',
                                seriesDimensions: ['subregion']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        plotBackgroundColor: null,
                                        plotBorderWidth: null,
                                        plotShadow: false,
                                        type: 'pie'
                                    },
                                    title: {
                                        //text: 'Browser market shares January, 2015 to May, 2015'
                                    },
                                    tooltip: {
                                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                                    },
                                    plotOptions: {
                                        pie: {
                                            allowPointSelect: true,
                                            cursor: 'pointer',
                                            dataLabels: {
                                                enabled: true
                                            },
                                            showInLegend: true
                                        }
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator', 'year'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 2015,
                                                    "to": 2015
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "Forest"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "subregion", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "subregion": "ASC"
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-9',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-9",
                        config: {
                            container: "#item-9",
                            adapter: {
                                type: "pie",
                                valueDimensions: 'value',
                                seriesDimensions: ['domain']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        plotBackgroundColor: null,
                                        plotBorderWidth: null,
                                        plotShadow: false,
                                        type: 'pie'
                                    },
                                    title: {
                                        //text: 'Browser market shares January, 2015 to May, 2015'
                                    },
                                    tooltip: {
                                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                                    },
                                    plotOptions: {
                                        pie: {
                                            allowPointSelect: true,
                                            cursor: 'pointer',
                                            dataLabels: {
                                                enabled: true
                                            },
                                            showInLegend: true
                                        }
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator', 'year'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 2015,
                                                    "to": 2015
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "Forest"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "domain", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "domain": "ASC"
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-10',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-10",
                        config: {
                            container: "#item-10",
                            adapter: {
                                type: "pie",
                                valueDimensions: 'value',
                                seriesDimensions: ['incomes']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        plotBackgroundColor: null,
                                        plotBorderWidth: null,
                                        plotShadow: false,
                                        type: 'pie'
                                    },
                                    title: {
                                        //text: 'Browser market shares January, 2015 to May, 2015'
                                    },
                                    tooltip: {
                                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                                    },
                                    plotOptions: {
                                        pie: {
                                            allowPointSelect: true,
                                            cursor: 'pointer',
                                            dataLabels: {
                                                enabled: true
                                            },
                                            showInLegend: true
                                        }
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator', 'year'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 2015,
                                                    "to": 2015
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "Forest"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "incomes", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "incomes": "ASC"
                                }
                            }
                        ]
                    }
                ]
            }
        },

        "FLUDE_TOPIC_2": {

            download: {
                "target": "2.PRODUCTION.zip"
            },

            filter: [
                {
                    "type": "distinct",
                    "uid": "FLUDE_TOPIC_2",
                    "column": "indicator",
                    "containerType": "baseContainer",
                    "title": "Indicator",
                    "defaultCodes": ["ProdFor"],
                    "components": [
                        {
                            "type": "codelist",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "uid" : "FLUDE_INDICATORS",
                            "title": {"EN": "Distinct"},
                            // name is the ID output in tehe filter getValues()
                            "name": "indicator",
                            "config": {
                                "defaultsource": []
                            }
                        }
                    ]
                },
                {
                    "type": "static",
                    "containerType": "baseContainer",
                    "title": "Year",
                    "components": [
                        {
                            "type": "time",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Year"},
                            "name": "year",
                            config: {
                                "defaultsource": [
                                    {"value": "2015", "label": "2015", "selected": true},
                                    {"value": "2010", "label": "2010", "selected": false},
                                    {"value": "2005", "label": "2005", "selected": false},
                                    {"value": "2000", "label": "2000", "selected": false},
                                    {"value": "1990", "label": "1990", "selected": false}
                                ]
                            }
                        }
                    ]
                },
                {
                    "type": "codelist",
                    "containerType": "baseContainer",
                    "title": "Domains",
                    "components": [
                        {
                            "uid": "FLUDE_DOMAINS",
                            "type": "codelist",
                            "name": "domain",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},

                            config: {
                                "defaultsource": [
                                    //{"value": null, "label": "All", "selected": true},
                                    //{"value": null, "label": "All", "selected": true, "removeFilter": true},
                                ],
                                "enableMultiselection": true
                            }
                        }
                    ]
                },
                {
                    "type": "codelist",
                    "containerType": "baseContainer",
                    "title": "Incomes",
                    "components": [
                        {
                            "uid": "FLUDE_INCOMES",
                            "type": "codelist",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},
                            "name": "incomes",
                            config: {
                                "defaultsource": [
                                    //{"value": null, "label": "All", "selected": true},
                                ],
                                "enableMultiselection": true
                            }
                        }
                    ]
                },
                {
                    "type": "codelist",
                    "containerType": "baseContainer",
                    "title": "Subregions",
                    "components": [
                        {
                            "uid": "FLUDE_SUBREGIONS",
                            "type": "codelist",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},
                            "name": "subregion",
                            config: {
                                "defaultsource": [
                                    //{"value": null, "label": "All", "selected": true},
                                ],
                                "enableMultiselection": true
                            }
                        }
                    ]
                }
            ],

            dashboard: {
                //data cube's uid
                uid: "FLUDE_TOPIC_2",

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
                        id: 'item-1',
                        type: 'map',
                        class: "fx-map-chart",
                        //needed if layout = injected
                        container: "#item-1",
                        config: {
                            container: "#item-1",
                            leaflet: {
                                zoomControl: false,
                                attributionControl: true,
                                scrollWheelZoom: false,
                                minZoom: 2
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator', 'year', 'domain', 'incomes', 'subregion'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 2015,
                                                    "to": 2015
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "ProdFor"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-2',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-2",
                        config: {
                            container: "#item-2",
                            adapter: {
                                type: "standard",
                                xDimensions: 'time',
                                yDimensions: 'element',
                                valueDimensions: 'value',
                                seriesDimensions: ['country']
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                    tooltip: {
                                        valueSuffix: ' 1000 HA'
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator', 'year', 'domain', 'incomes', 'subregion'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 2015,
                                                    "to": 2015
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "ProdFor"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "value": "DESC"
                                }
                            },
                            {
                                "name": "page",
                                "parameters": {
                                    "perPage": 25,
                                    "page": 1
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-3',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-3",
                        config: {
                            container: "#item-3",
                            adapter: {
                                type: "standard",
                                xDimensions: 'year',
                                yDimensions: 'indicator',
                                valueDimensions: 'value',
                                seriesDimensions: ['region']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                    tooltip: {
                                        valueSuffix: ' 1000 HA'
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 1990,
                                                    "to": 2015
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "ProdFor"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "region", "year", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "region": "ASC",
                                    "year": "ASC"
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-7',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-7",
                        config: {
                            container: "#item-7",
                            adapter: {
                                type: "pie",
                                valueDimensions: 'value',
                                seriesDimensions: ['region']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        plotBackgroundColor: null,
                                        plotBorderWidth: null,
                                        plotShadow: false,
                                        type: 'pie'
                                    },
                                    title: {
                                        //text: 'Browser market shares January, 2015 to May, 2015'
                                    },
                                    tooltip: {
                                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                                    },
                                    plotOptions: {
                                        pie: {
                                            allowPointSelect: true,
                                            cursor: 'pointer',
                                            dataLabels: {
                                                enabled: true
                                            },
                                            showInLegend: true
                                        }
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator', 'year'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 2015,
                                                    "to": 2015
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "ProdFor"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "region", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "region": "ASC"
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-4',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-4",
                        config: {
                            container: "#item-4",
                            adapter: {
                                type: "standard",
                                xDimensions: 'year',
                                yDimensions: 'indicator',
                                valueDimensions: 'value',
                                seriesDimensions: ['subregion']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                    tooltip: {
                                        valueSuffix: ' 1000 HA'
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 1990,
                                                    "to": 2015
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "ProdFor"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "subregion", "year", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "subregion": "ASC",
                                    "year": "ASC"
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-5',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-5",
                        config: {
                            container: "#item-5",
                            adapter: {
                                type: "standard",
                                xDimensions: 'year',
                                yDimensions: 'indicator',
                                valueDimensions: 'value',
                                seriesDimensions: ['domain']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                    tooltip: {
                                        valueSuffix: ' 1000 HA'
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 1990,
                                                    "to": 2015
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "ProdFor"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "domain", "year", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "domain": "ASC",
                                    "year": "ASC"
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-6',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-6",
                        config: {
                            container: "#item-6",
                            adapter: {
                                type: "standard",
                                xDimensions: 'year',
                                yDimensions: 'indicator',
                                valueDimensions: 'value',
                                seriesDimensions: ['incomes']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                    tooltip: {
                                        valueSuffix: ' 1000 HA'
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 1990,
                                                    "to": 2015
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "ProdFor"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "incomes", "year", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "incomes": "ASC",
                                    "year": "ASC"
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-8',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-8",
                        config: {
                            container: "#item-8",
                            adapter: {
                                type: "pie",
                                valueDimensions: 'value',
                                seriesDimensions: ['subregion']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        plotBackgroundColor: null,
                                        plotBorderWidth: null,
                                        plotShadow: false,
                                        type: 'pie'
                                    },
                                    title: {
                                        //text: 'Browser market shares January, 2015 to May, 2015'
                                    },
                                    tooltip: {
                                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                                    },
                                    plotOptions: {
                                        pie: {
                                            allowPointSelect: true,
                                            cursor: 'pointer',
                                            dataLabels: {
                                                enabled: true
                                            },
                                            showInLegend: true
                                        }
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator', 'year'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 2015,
                                                    "to": 2015
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "ProdFor"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "subregion", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "subregion": "ASC"
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-9',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-9",
                        config: {
                            container: "#item-9",
                            adapter: {
                                type: "pie",
                                valueDimensions: 'value',
                                seriesDimensions: ['domain']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        plotBackgroundColor: null,
                                        plotBorderWidth: null,
                                        plotShadow: false,
                                        type: 'pie'
                                    },
                                    title: {
                                        //text: 'Browser market shares January, 2015 to May, 2015'
                                    },
                                    tooltip: {
                                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                                    },
                                    plotOptions: {
                                        pie: {
                                            allowPointSelect: true,
                                            cursor: 'pointer',
                                            dataLabels: {
                                                enabled: true
                                            },
                                            showInLegend: true
                                        }
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator', 'year'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 2015,
                                                    "to": 2015
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "ProdFor"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "domain", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": [
                                                "um"
                                            ],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "domain": "ASC"
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-10',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-10",
                        config: {
                            container: "#item-10",
                            adapter: {
                                type: "pie",
                                valueDimensions: 'value',
                                seriesDimensions: ['incomes']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        plotBackgroundColor: null,
                                        plotBorderWidth: null,
                                        plotShadow: false,
                                        type: 'pie'
                                    },
                                    title: {
                                        //text: 'Browser market shares January, 2015 to May, 2015'
                                    },
                                    tooltip: {
                                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                                    },
                                    plotOptions: {
                                        pie: {
                                            allowPointSelect: true,
                                            cursor: 'pointer',
                                            dataLabels: {
                                                enabled: true
                                            },
                                            showInLegend: true
                                        }
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator', 'year'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 2015,
                                                    "to": 2015
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "ProdFor"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "incomes", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "incomes": "ASC"
                                }
                            }
                        ]
                    }
                ]
            }
        },

        "FLUDE_TOPIC_3": {

            download: {
                "target": "3.DISTURBANCE AND FOREST DEGRADATION.zip"
            },

            filter: [
                {
                    "type": "distinct",
                    "uid": "FLUDE_TOPIC_3",
                    "column": "indicator",
                    "containerType": "baseContainer",
                    "title": "Indicator",
                    "defaultCodes": ["InvSppAreaToT"],
                    "components": [
                        {
                            "type": "codelist",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "uid" : "FLUDE_INDICATORS",
                            "title": {"EN": "Distinct"},
                            // name is the ID output in tehe filter getValues()
                            "name": "indicator",
                            "config": {
                                "defaultsource": []
                            }
                        }
                    ]
                },
                {
                    "type": "static",
                    "containerType": "baseContainer",
                    "title": "Year",
                    "components": [
                        {
                            "type": "time",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Year"},
                            "name": "year",
                            config: {
                                "defaultsource": [
                                    {"value": "2010", "label": "2010", "selected": true},
                                    {"value": "2005", "label": "2005", "selected": false},
                                    {"value": "2000", "label": "2000", "selected": false},
                                    {"value": "1990", "label": "1990", "selected": false}
                                ]
                            }
                        }
                    ]
                },
                {
                    "type": "codelist",
                    "containerType": "baseContainer",
                    "title": "Domains",
                    "components": [
                        {
                            "uid": "FLUDE_DOMAINS",
                            "type": "codelist",
                            "name": "domain",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},

                            config: {
                                "defaultsource": [
                                    //{"value": null, "label": "All", "selected": true},
                                    //{"value": null, "label": "All", "selected": true, "removeFilter": true},
                                ],
                                "enableMultiselection": true
                            }
                        }
                    ]
                },
                {
                    "type": "codelist",
                    "containerType": "baseContainer",
                    "title": "Incomes",
                    "components": [
                        {
                            "uid": "FLUDE_INCOMES",
                            "type": "codelist",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},
                            "name": "incomes",
                            config: {
                                "defaultsource": [
                                    //{"value": null, "label": "All", "selected": true},
                                ],
                                "enableMultiselection": true
                            }
                        }
                    ]
                },
                {
                    "type": "codelist",
                    "containerType": "baseContainer",
                    "title": "Subregions",
                    "components": [
                        {
                            "uid": "FLUDE_SUBREGIONS",
                            "type": "codelist",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},
                            "name": "subregion",
                            config: {
                                "defaultsource": [
                                    //{"value": null, "label": "All", "selected": true}
                                ],
                                "enableMultiselection": true
                            }
                        }
                    ]
                }
            ],

            dashboard: {
                //data cube's uid
                uid: "FLUDE_TOPIC_3",

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
                        id: 'item-1',
                        type: 'map',
                        class: "fx-map-chart",
                        //needed if layout = injected
                        container: "#item-1",
                        config: {
                            container: "#item-1",
                            leaflet: {
                                zoomControl: false,
                                attributionControl: true,
                                scrollWheelZoom: false ,
                                minZoom: 2
                            }

                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator', 'year', 'domain', 'incomes', 'subregion'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 2010,
                                                    "to": 2010
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "InvSppAreaToT"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            }
                        ]
                    },


                    {
                        id: 'item-2',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-2",
                        config: {
                            container: "#item-2",
                            adapter: {
                                type: "standard",
                                xDimensions: 'time',
                                yDimensions: 'element',
                                valueDimensions: 'value',
                                seriesDimensions: ['country']
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                    tooltip: {
                                        valueSuffix: ' 1000 HA'
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator', 'year', 'domain', 'incomes', 'subregion'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 1990,
                                                    "to": 2010
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "InvSppAreaToT"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "value": "DESC"
                                }
                            },
                            {
                                "name": "page",
                                "parameters": {
                                    "perPage": 25,
                                    "page": 1
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-3',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-3",
                        config: {
                            container: "#item-3",
                            adapter: {
                                type: "standard",
                                xDimensions: 'year',
                                yDimensions: 'indicator',
                                valueDimensions: 'value',
                                seriesDimensions: ['region']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                    tooltip: {
                                        valueSuffix: ' 1000 HA'
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 1990,
                                                    "to": 2010
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "InvSppAreaToT"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "region", "year", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "region": "ASC",
                                    "year": "ASC"
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-7',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-7",
                        config: {
                            container: "#item-7",
                            adapter: {
                                type: "pie",
                                valueDimensions: 'value',
                                seriesDimensions: ['region']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        plotBackgroundColor: null,
                                        plotBorderWidth: null,
                                        plotShadow: false,
                                        type: 'pie'
                                    },
                                    title: {
                                        //text: 'Browser market shares January, 2015 to May, 2015'
                                    },
                                    tooltip: {
                                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                                    },
                                    plotOptions: {
                                        pie: {
                                            allowPointSelect: true,
                                            cursor: 'pointer',
                                            dataLabels: {
                                                enabled: true
                                            },
                                            showInLegend: true
                                        }
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator', 'year'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 2010,
                                                    "to": 2010
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "InvSppAreaToT"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "region", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "region": "ASC"
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-4',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-4",
                        config: {
                            container: "#item-4",
                            adapter: {
                                type: "standard",
                                xDimensions: 'year',
                                yDimensions: 'indicator',
                                valueDimensions: 'value',
                                seriesDimensions: ['subregion']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                    tooltip: {
                                        valueSuffix: ' 1000 HA'
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 1990,
                                                    "to": 2010
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "InvSppAreaToT"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "subregion", "year", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "subregion": "ASC",
                                    "year": "ASC"
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-5',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-5",
                        config: {
                            container: "#item-5",
                            adapter: {
                                type: "standard",
                                xDimensions: 'year',
                                yDimensions: 'indicator',
                                valueDimensions: 'value',
                                seriesDimensions: ['domain']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                    tooltip: {
                                        valueSuffix: ' 1000 HA'
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 1990,
                                                    "to": 2010
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "InvSppAreaToT"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "domain", "year", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "domain": "ASC",
                                    "year": "ASC"
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-6',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-6",
                        config: {
                            container: "#item-6",
                            adapter: {
                                type: "standard",
                                xDimensions: 'year',
                                yDimensions: 'indicator',
                                valueDimensions: 'value',
                                seriesDimensions: ['incomes']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                    tooltip: {
                                        valueSuffix: ' 1000 HA'
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 1990,
                                                    "to": 2010
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "InvSppAreaToT"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "incomes", "year", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "incomes": "ASC",
                                    "year": "ASC"
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-8',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-8",
                        config: {
                            container: "#item-8",
                            adapter: {
                                type: "pie",
                                valueDimensions: 'value',
                                seriesDimensions: ['subregion']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        plotBackgroundColor: null,
                                        plotBorderWidth: null,
                                        plotShadow: false,
                                        type: 'pie'
                                    },
                                    title: {
                                        //text: 'Browser market shares January, 2015 to May, 2015'
                                    },
                                    tooltip: {
                                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                                    },
                                    plotOptions: {
                                        pie: {
                                            allowPointSelect: true,
                                            cursor: 'pointer',
                                            dataLabels: {
                                                enabled: true
                                            },
                                            showInLegend: true
                                        }
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator', 'year'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 2010,
                                                    "to": 2010
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "InvSppAreaToT"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "subregion", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "subregion": "ASC"
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-9',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-9",
                        config: {
                            container: "#item-9",
                            adapter: {
                                type: "pie",
                                valueDimensions: 'value',
                                seriesDimensions: ['domain']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                    tooltip: {
                                        valueSuffix: ' 1000 HA'
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator', 'year'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 2010,
                                                    "to": 2010
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "InvSppAreaToT"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "domain", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "domain": "ASC"
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-10',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-10",
                        config: {
                            container: "#item-10",
                            adapter: {
                                type: "pie",
                                valueDimensions: 'value',
                                seriesDimensions: ['incomes']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        plotBackgroundColor: null,
                                        plotBorderWidth: null,
                                        plotShadow: false,
                                        type: 'pie'
                                    },
                                    title: {
                                        //text: 'Browser market shares January, 2015 to May, 2015'
                                    },
                                    tooltip: {
                                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                                    },
                                    plotOptions: {
                                        pie: {
                                            allowPointSelect: true,
                                            cursor: 'pointer',
                                            dataLabels: {
                                                enabled: true
                                            },
                                            showInLegend: true
                                        }
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator', 'year'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 2010,
                                                    "to": 2010
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "InvSppAreaToT"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "incomes", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "incomes": "ASC"
                                }
                            }
                        ]
                    }


                ]
            }
        },

        "FLUDE_TOPIC_4": {

            download: {
                "target": "4.MEASURING PROGRESS TOWARDS SFM.zip"
            },

            filter: [
                {
                    "type": "distinct",
                    "uid": "FLUDE_TOPIC_4",
                    "column": "indicator",
                    "containerType": "baseContainer",
                    "title": "Indicator",
                    "defaultCodes": ["SFMpolicN"],
                    "components": [
                        {
                            "type": "codelist",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "uid" : "FLUDE_INDICATORS",
                            "title": {"EN": "Distinct"},
                            // name is the ID output in tehe filter getValues()
                            "name": "indicator",
                            "config": {
                                "defaultsource": []
                            }
                        }
                    ]
                },

                {
                    "type": "codelist",
                    "containerType": "baseContainer",
                    "title": "Domains",
                    "components": [
                        {
                            "uid": "FLUDE_DOMAINS",
                            "type": "codelist",
                            "name": "domain",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},

                            config: {
                                "defaultsource": [
                                    {"value": null, "label": "All", "selected": true}
                                ]
                            }
                        }
                    ]
                },
                {
                    "type": "codelist",
                    "containerType": "baseContainer",
                    "title": "Incomes",
                    "components": [
                        {
                            "uid": "FLUDE_INCOMES",
                            "type": "codelist",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},
                            "name": "incomes",
                            config: {
                                "defaultsource": [
                                    //{"value": null, "label": "All", "selected": true},
                                ],
                                "enableMultiselection": true
                            }
                        }
                    ]
                },
                {
                    "type": "codelist",
                    "containerType": "baseContainer",
                    "title": "Subregions",
                    "components": [
                        {
                            "uid": "FLUDE_SUBREGIONS",
                            "type": "codelist",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},
                            "name": "subregion",
                            config: {
                                "defaultsource": [
                                    //{"value": null, "label": "All", "selected": true},
                                ],
                                "enableMultiselection": true
                            }
                        }
                    ]
                }
            ],

            dashboard: {
                //data cube's uid
                uid: "FLUDE_TOPIC_4",

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
                        id: 'item-1',
                        type: 'table',
                        class: "fx-map-chart",
                        //needed if layout = injected
                        container: "#item-1",
                        config: {
                            container: "#item-1",
                            leaflet: {
                                zoomControl: false,
                                attributionControl: true,
                                scrollWheelZoom: false,
                                minZoom: 2
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator', 'year', 'domain', 'incomes', 'subregion'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "SFMpolicN"
                                                    ]
                                                }
                                            ]
                                        }
                                    },
                                    "columns": ["country",  "indicator", "domain", "value"]
                                }
                            }
                        ]
                    }

                ]
            }

        },

        "FLUDE_TOPIC_5": {

            download: {
                "target": "5.BIODIVERSITY AND CONSERVATION.zip"
            },

            filter: [
                {
                    "type": "distinct",
                    "uid": "FLUDE_TOPIC_5",
                    "column": "indicator",
                    "containerType": "baseContainer",
                    "title": "Indicator",
                    "defaultCodes": ["BioCons"],
                    "components": [
                        {
                            "type": "codelist",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "uid" : "FLUDE_INDICATORS",
                            "title": {"EN": "Distinct"},
                            // name is the ID output in tehe filter getValues()
                            "name": "indicator",
                            "config": {
                                "defaultsource": []
                            }
                        }
                    ]
                },
                {
                    "type": "static",
                    "containerType": "baseContainer",
                    "title": "Year",
                    "components": [
                        {
                            "type": "time",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Year"},
                            "name": "year",
                            config: {
                                "defaultsource": [
                                    {"value": "2015", "label": "2015", "selected": true},
                                    {"value": "2010", "label": "2010", "selected": false},
                                    {"value": "2005", "label": "2005", "selected": false},
                                    {"value": "2000", "label": "2000", "selected": false},
                                    {"value": "1990", "label": "1990", "selected": false}
                                ]
                            }
                        }
                    ]
                },
                {
                    "type": "codelist",
                    "containerType": "baseContainer",
                    "title": "Domains",
                    "components": [
                        {
                            "uid": "FLUDE_DOMAINS",
                            "type": "codelist",
                            "name": "domain",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},

                            config: {
                                "defaultsource": [
                                    //{"value": null, "label": "All", "selected": true}
                                    //{"value": null, "label": "All", "selected": true, "removeFilter": true},
                                ],
                                "enableMultiselection": true
                            }
                        }
                    ]
                },
                {
                    "type": "codelist",
                    "containerType": "baseContainer",
                    "title": "Incomes",
                    "components": [
                        {
                            "uid": "FLUDE_INCOMES",
                            "type": "codelist",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},
                            "name": "incomes",
                            config: {
                                "defaultsource": [
                                    //{"value": null, "label": "All", "selected": true},
                                ],
                                "enableMultiselection": true
                            }
                        }
                    ]
                },
                {
                    "type": "codelist",
                    "containerType": "baseContainer",
                    "title": "Subregions",
                    "components": [
                        {
                            "uid": "FLUDE_SUBREGIONS",
                            "type": "codelist",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},
                            "name": "subregion",
                            config: {
                                "defaultsource": [
                                    //{"value": null, "label": "All", "selected": true},
                                ],
                                "enableMultiselection": true
                            }
                        }
                    ]
                }
            ],

            dashboard: {
                //data cube's uid
                uid: "FLUDE_TOPIC_5",

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
                        id: 'item-1',
                        type: 'map',
                        class: "fx-map-chart",
                        //needed if layout = injected
                        container: "#item-1",
                        config: {
                            container: "#item-1",
                            leaflet: {
                                zoomControl: false,
                                attributionControl: true,
                                scrollWheelZoom: false ,
                                minZoom: 2
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator', 'year', 'domain', 'incomes', 'subregion'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 2010,
                                                    "to": 2010
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "BioCons"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            }
                        ]
                    },


                    {
                        id: 'item-2',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-2",
                        config: {
                            container: "#item-2",
                            adapter: {
                                type: "standard",
                                xDimensions: 'time',
                                yDimensions: 'element',
                                valueDimensions: 'value',
                                seriesDimensions: ['country']
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                    tooltip: {
                                        valueSuffix: ' 1000 HA'
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator', 'year', 'domain', 'incomes', 'subregion'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 1990,
                                                    "to": 2010
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "BioCons"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "value": "DESC"
                                }
                            },
                            {
                                "name": "page",
                                "parameters": {
                                    "perPage": 25,
                                    "page": 1
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-3',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-3",
                        config: {
                            container: "#item-3",
                            adapter: {
                                type: "standard",
                                xDimensions: 'time',
                                yDimensions: 'element',
                                valueDimensions: 'value',
                                seriesDimensions: ['country']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                    tooltip: {
                                        valueSuffix: ' 1000 HA'
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 1990,
                                                    "to": 2010
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "BioCons"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "region", "year", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "region": "ASC",
                                    "year": "ASC"
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-4',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-4",
                        config: {
                            container: "#item-4",
                            adapter: {
                                type: "pie",
                                valueDimensions: 'value',
                                seriesDimensions: ['region']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        plotBackgroundColor: null,
                                        plotBorderWidth: null,
                                        plotShadow: false,
                                        type: 'pie'
                                    },
                                    title: {
                                        //text: 'Browser market shares January, 2015 to May, 2015'
                                    },
                                    tooltip: {
                                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                                    },
                                    plotOptions: {
                                        pie: {
                                            allowPointSelect: true,
                                            cursor: 'pointer',
                                            dataLabels: {
                                                enabled: true
                                            },
                                            showInLegend: true
                                        }
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator', 'year'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 2010,
                                                    "to": 2010
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "BioCons"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "region", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "region": "ASC"
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-5',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-5",
                        config: {
                            container: "#item-5",
                            adapter: {
                                type: "standard",
                                xDimensions: 'year',
                                yDimensions: 'indicator',
                                valueDimensions: 'value',
                                seriesDimensions: ['subregion']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                    tooltip: {
                                        valueSuffix: ' 1000 HA'
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 1990,
                                                    "to": 2010
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "BioCons"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "subregion", "year", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "subregion": "ASC",
                                    "year": "ASC"
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-6',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-6",
                        config: {
                            container: "#item-6",
                            adapter: {
                                type: "standard",
                                xDimensions: 'year',
                                yDimensions: 'indicator',
                                valueDimensions: 'value',
                                seriesDimensions: ['domain']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                    tooltip: {
                                        valueSuffix: ' 1000 HA'
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 1990,
                                                    "to": 2010
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "BioCons"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "domain", "year", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "domain": "ASC",
                                    "year": "ASC"
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-7',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-7",
                        config: {
                            container: "#item-7",
                            adapter: {
                                type: "standard",
                                xDimensions: 'year',
                                yDimensions: 'indicator',
                                valueDimensions: 'value',
                                seriesDimensions: ['incomes']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                    tooltip: {
                                        valueSuffix: ' 1000 HA'
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 1990,
                                                    "to": 2010
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "BioCons"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "incomes", "year", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "incomes": "ASC",
                                    "year": "ASC"
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-8',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-8",
                        config: {
                            container: "#item-8",
                            adapter: {
                                type: "pie",
                                valueDimensions: 'value',
                                seriesDimensions: ['subregion']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        plotBackgroundColor: null,
                                        plotBorderWidth: null,
                                        plotShadow: false,
                                        type: 'pie'
                                    },
                                    title: {
                                        //text: 'Browser market shares January, 2015 to May, 2015'
                                    },
                                    tooltip: {
                                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                                    },
                                    plotOptions: {
                                        pie: {
                                            allowPointSelect: true,
                                            cursor: 'pointer',
                                            dataLabels: {
                                                enabled: true
                                            },
                                            showInLegend: true
                                        }
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator', 'year'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 2010,
                                                    "to": 2010
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "BioCons"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "subregion", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "subregion": "ASC"
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-9',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-9",
                        config: {
                            container: "#item-9",
                            adapter: {
                                type: "pie",
                                valueDimensions: 'value',
                                seriesDimensions: ['domain']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        plotBackgroundColor: null,
                                        plotBorderWidth: null,
                                        plotShadow: false,
                                        type: 'pie'
                                    },
                                    title: {
                                        //text: 'Browser market shares January, 2015 to May, 2015'
                                    },
                                    tooltip: {
                                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                                    },
                                    plotOptions: {
                                        pie: {
                                            allowPointSelect: true,
                                            cursor: 'pointer',
                                            dataLabels: {
                                                enabled: true
                                            },
                                            showInLegend: true
                                        }
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator', 'year'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 2010,
                                                    "to": 2010
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "BioCons"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "domain", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "domain": "ASC"
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-10',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-10",
                        config: {
                            container: "#item-10",
                            adapter: {
                                type: "pie",
                                valueDimensions: 'value',
                                seriesDimensions: ['incomes']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        plotBackgroundColor: null,
                                        plotBorderWidth: null,
                                        plotShadow: false,
                                        type: 'pie'
                                    },
                                    title: {
                                        //text: 'Browser market shares January, 2015 to May, 2015'
                                    },
                                    tooltip: {
                                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                                    },
                                    plotOptions: {
                                        pie: {
                                            allowPointSelect: true,
                                            cursor: 'pointer',
                                            dataLabels: {
                                                enabled: true
                                            },
                                            showInLegend: true
                                        }
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator', 'year'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 2010,
                                                    "to": 2010
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "BioCons"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "incomes", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "incomes": "ASC"
                                }
                            }
                        ]
                    }
                ]
            }
        },

        "FLUDE_TOPIC_6": {

            download: {
                "target": "6.PROTECTIVE FUNCTIONS AND SELECTIVE ECOSYSTEM SERVICES.zip"
            },

            filter: [
                {
                    "type": "distinct",
                    "uid": "FLUDE_TOPIC_6",
                    "column": "indicator",
                    "containerType": "baseContainer",
                    "title": "Indicator",
                    "defaultCodes": ["SoilWatProt"],
                    "components": [
                        {
                            "type": "codelist",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "uid" : "FLUDE_INDICATORS",
                            "title": {"EN": "Distinct"},
                            // name is the ID output in tehe filter getValues()
                            "name": "indicator",
                            "config": {
                                "defaultsource": []
                            }
                        }
                    ]
                },
                {
                    "type": "static",
                    "containerType": "baseContainer",
                    "title": "Year",
                    "components": [
                        {
                            "type": "time",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Year"},
                            "name": "year",
                            config: {
                                "defaultsource": [
                                    {"value": "2015", "label": "2015", "selected": true},
                                    {"value": "2010", "label": "2010", "selected": false},
                                    {"value": "2005", "label": "2005", "selected": false},
                                    {"value": "2000", "label": "2000", "selected": false},
                                    {"value": "1990", "label": "1990", "selected": false}
                                ]
                            }
                        }
                    ]
                },
                {
                    "type": "codelist",
                    "containerType": "baseContainer",
                    "title": "Domains",
                    "components": [
                        {
                            "uid": "FLUDE_DOMAINS",
                            "type": "codelist",
                            "name": "domain",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},

                            config: {
                                "defaultsource": [
                                    //{"value": null, "label": "All", "selected": true},
                                    //{"value": null, "label": "All", "selected": true, "removeFilter": true},
                                ],
                                "enableMultiselection": true
                            }
                        }
                    ]
                },
                {
                    "type": "codelist",
                    "containerType": "baseContainer",
                    "title": "Incomes",
                    "components": [
                        {
                            "uid": "FLUDE_INCOMES",
                            "type": "codelist",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},
                            "name": "incomes",
                            config: {
                                "defaultsource": [
                                    //{"value": null, "label": "All", "selected": true},
                                ],
                                "enableMultiselection": true
                            }
                        }
                    ]
                },
                {
                    "type": "codelist",
                    "containerType": "baseContainer",
                    "title": "Subregions",
                    "components": [
                        {
                            "uid": "FLUDE_SUBREGIONS",
                            "type": "codelist",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},
                            "name": "subregion",
                            config: {
                                "defaultsource": [
                                    //{"value": null, "label": "All", "selected": true},
                                ],
                                "enableMultiselection": true
                            }
                        }
                    ]
                }
            ],

            dashboard: {
                //data cube's uid
                uid: "FLUDE_TOPIC_6",

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
                        id: 'item-1',
                        type: 'map',
                        class: "fx-map-chart",
                        //needed if layout = injected
                        container: "#item-1",
                        config: {
                            container: "#item-1" ,
                            leaflet: {
                                zoomControl: false,
                                attributionControl: true,
                                scrollWheelZoom: false,
                                minZoom: 2
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator', 'year', 'domain', 'incomes', 'subregion'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 2010,
                                                    "to": 2010
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "SoilWatProt"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-2',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-2",
                        config: {
                            container: "#item-2",
                            adapter: {
                                type: "standard",
                                xDimensions: 'time',
                                yDimensions: 'element',
                                valueDimensions: 'value',
                                seriesDimensions: ['country']
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                    tooltip: {
                                        valueSuffix: ' 1000 HA'
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator', 'year', 'domain', 'incomes', 'subregion'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 1990,
                                                    "to": 2010
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "SoilWatProt"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "value": "DESC"
                                }
                            },
                            {
                                "name": "page",
                                "parameters": {
                                    "perPage": 25,
                                    "page": 1
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-3',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-3",
                        config: {
                            container: "#item-3",
                            adapter: {
                                type: "standard",
                                xDimensions: 'year',
                                yDimensions: 'indicator',
                                valueDimensions: 'value',
                                seriesDimensions: ['region']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                    tooltip: {
                                        valueSuffix: ' 1000 HA'
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 1990,
                                                    "to": 2010
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "SoilWatProt"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "region", "year", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "region": "ASC",
                                    "year": "ASC"
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-4',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-4",
                        config: {
                            container: "#item-4",
                            adapter: {
                                type: "pie",
                                valueDimensions: 'value',
                                seriesDimensions: ['region']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        plotBackgroundColor: null,
                                        plotBorderWidth: null,
                                        plotShadow: false,
                                        type: 'pie'
                                    },
                                    title: {
                                        //text: 'Browser market shares January, 2015 to May, 2015'
                                    },
                                    tooltip: {
                                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                                    },
                                    plotOptions: {
                                        pie: {
                                            allowPointSelect: true,
                                            cursor: 'pointer',
                                            dataLabels: {
                                                enabled: true
                                            },
                                            showInLegend: true
                                        }
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator', 'year'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 2010,
                                                    "to": 2010
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "SoilWatProt"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "region", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "region": "ASC"
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-5',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-5",
                        config: {
                            container: "#item-5",
                            adapter: {
                                type: "standard",
                                xDimensions: 'year',
                                yDimensions: 'indicator',
                                valueDimensions: 'value',
                                seriesDimensions: ['subregion']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                    tooltip: {
                                        valueSuffix: ' 1000 HA'
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 1990,
                                                    "to": 2010
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "SoilWatProt"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "subregion", "year", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "subregion": "ASC",
                                    "year": "ASC"
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-6',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-6",
                        config: {
                            container: "#item-6",
                            adapter: {
                                type: "pie",
                                valueDimensions: 'value',
                                seriesDimensions: ['subregion']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        plotBackgroundColor: null,
                                        plotBorderWidth: null,
                                        plotShadow: false,
                                        type: 'pie'
                                    },
                                    title: {
                                        //text: 'Browser market shares January, 2015 to May, 2015'
                                    },
                                    tooltip: {
                                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                                    },
                                    plotOptions: {
                                        pie: {
                                            allowPointSelect: true,
                                            cursor: 'pointer',
                                            dataLabels: {
                                                enabled: true
                                            },
                                            showInLegend: true
                                        }
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator', 'year'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 2010,
                                                    "to": 2010
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "SoilWatProt"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "subregion", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "subregion": "ASC"
                                }
                            }
                        ]
                    },

                    {
                        id: 'item-7',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-7",
                        config: {
                            container: "#item-7",
                            adapter: {
                                type: "standard",
                                xDimensions: 'year',
                                yDimensions: 'indicator',
                                valueDimensions: 'value',
                                seriesDimensions: ['domain']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                    tooltip: {
                                        valueSuffix: ' 1000 HA'
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 1990,
                                                    "to": 2010
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "SoilWatProt"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "domain", "year", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "domain": "ASC",
                                    "year": "ASC"
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-8',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-8",
                        config: {
                            container: "#item-8",
                            adapter: {
                                type: "pie",
                                valueDimensions: 'value',
                                seriesDimensions: ['domain']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        plotBackgroundColor: null,
                                        plotBorderWidth: null,
                                        plotShadow: false,
                                        type: 'pie'
                                    },
                                    title: {
                                        //text: 'Browser market shares January, 2015 to May, 2015'
                                    },
                                    tooltip: {
                                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                                    },
                                    plotOptions: {
                                        pie: {
                                            allowPointSelect: true,
                                            cursor: 'pointer',
                                            dataLabels: {
                                                enabled: true
                                            },
                                            showInLegend: true
                                        }
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator', 'year'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 2010,
                                                    "to": 2010
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "SoilWatProt"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "domain", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "domain": "ASC"
                                }
                            }
                        ]
                    },

                    {
                        id: 'item-9',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-9",
                        config: {
                            container: "#item-9",
                            adapter: {
                                type: "standard",
                                xDimensions: 'year',
                                yDimensions: 'indicator',
                                valueDimensions: 'value',
                                seriesDimensions: ['incomes']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                    tooltip: {
                                        valueSuffix: ' 1000 HA'
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 1990,
                                                    "to": 2010
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "SoilWatProt"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "incomes", "year", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "incomes": "ASC",
                                    "year": "ASC"
                                }
                            }
                        ]
                    },

                    {
                        id: 'item-10',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-10",
                        config: {
                            container: "#item-10",
                            adapter: {
                                type: "pie",
                                valueDimensions: 'value',
                                seriesDimensions: ['incomes']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        plotBackgroundColor: null,
                                        plotBorderWidth: null,
                                        plotShadow: false,
                                        type: 'pie'
                                    },
                                    title: {
                                        //text: 'Browser market shares January, 2015 to May, 2015'
                                    },
                                    tooltip: {
                                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                                    },
                                    plotOptions: {
                                        pie: {
                                            allowPointSelect: true,
                                            cursor: 'pointer',
                                            dataLabels: {
                                                enabled: true
                                            },
                                            showInLegend: true
                                        }
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator', 'year'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 2010,
                                                    "to": 2010
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "SoilWatProt"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "incomes", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "incomes": "ASC"
                                }
                            }
                        ]
                    }


                ]
            }
        },

        "FLUDE_TOPIC_7": {

            download: {
                "target": "7.ECONOMICS LIVELIHOOD.zip"
            },

            filter: [
                {
                    "type": "distinct",
                    "uid": "FLUDE_TOPIC_7",
                    "column": "indicator",
                    "containerType": "baseContainer",
                    "title": "Indicator",
                    "defaultCodes": ["ForEmpl"],
                    "components": [
                        {
                            "type": "codelist",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "uid" : "FLUDE_INDICATORS",
                            "title": {"EN": "Distinct"},
                            // name is the ID output in tehe filter getValues()
                            "name": "indicator",
                            "config": {
                                "defaultsource": []
                            }
                        }
                    ]
                },
                {
                    "type": "static",
                    "containerType": "baseContainer",
                    "title": "Year",
                    "components": [
                        {
                            "type": "time",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Year"},
                            "name": "year",
                            config: {
                                "defaultsource": [

                                    {"value": "2010", "label": "2010", "selected": true},
                                    {"value": "2005", "label": "2005", "selected": false},
                                    {"value": "2000", "label": "2000", "selected": false},
                                    {"value": "1990", "label": "1990", "selected": false}
                                ]
                            }
                        }
                    ]
                },
                {
                    "type": "codelist",
                    "containerType": "baseContainer",
                    "title": "Domains",
                    "components": [
                        {
                            "uid": "FLUDE_DOMAINS",
                            "type": "codelist",
                            "name": "domain",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},

                            config: {
                                "defaultsource": [
                                    //{"value": null, "label": "All", "selected": true},
                                    //{"value": null, "label": "All", "selected": true, "removeFilter": true},
                                ],
                                "enableMultiselection": true
                            }
                        }
                    ]
                },
                {
                    "type": "codelist",
                    "containerType": "baseContainer",
                    "title": "Incomes",
                    "components": [
                        {
                            "uid": "FLUDE_INCOMES",
                            "type": "codelist",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},
                            "name": "incomes",
                            config: {
                                "defaultsource": [
                                    //{"value": null, "label": "All", "selected": true},
                                ],
                                "enableMultiselection": true
                            }
                        }
                    ]
                },
                {
                    "type": "codelist",
                    "containerType": "baseContainer",
                    "title": "Subregions",
                    "components": [
                        {
                            "uid": "FLUDE_SUBREGIONS",
                            "type": "codelist",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},
                            "name": "subregion",
                            config: {
                                "defaultsource": [
                                    //{"value": null, "label": "All", "selected": true},
                                ],
                                "enableMultiselection": true
                            }
                        }
                    ]
                }
            ],

            dashboard: {
                //data cube's uid
                uid: "FLUDE_TOPIC_7",

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
                        id: 'item-1',
                        type: 'map',
                        class: "fx-map-chart",
                        //needed if layout = injected
                        container: "#item-1",
                        config: {
                            container: "#item-1",
                            leaflet: {
                                zoomControl: false,
                                attributionControl: true,
                                scrollWheelZoom: false,
                                minZoom: 2
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator', 'year', 'domain', 'incomes', 'subregion'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 2010,
                                                    "to": 2010
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "ForEmpl"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-2',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-2",
                        config: {
                            container: "#item-2",
                            adapter: {
                                type: "standard",
                                xDimensions: 'time',
                                yDimensions: 'element',
                                valueDimensions: 'value',
                                seriesDimensions: ['country']
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                    tooltip: {
                                        valueSuffix: ' 1000 HA'
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator', 'year', 'domain', 'incomes', 'subregion'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 1990,
                                                    "to": 2010
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "ForEmpl"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "value": "DESC"
                                }
                            },
                            {
                                "name": "page",
                                "parameters": {
                                    "perPage": 25,
                                    "page": 1
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-3',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-3",
                        config: {
                            container: "#item-3",
                            adapter: {
                                type: "standard",
                                xDimensions: 'year',
                                yDimensions: 'indicator',
                                valueDimensions: 'value',
                                seriesDimensions: ['region']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                    tooltip: {
                                        valueSuffix: ' 1000 HA'
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 1990,
                                                    "to": 2010
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "ForEmpl"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "region", "year", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "region": "ASC",
                                    "year": "ASC"
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-4',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-4",
                        config: {
                            container: "#item-4",
                            adapter: {
                                type: "pie",
                                valueDimensions: 'value',
                                seriesDimensions: ['region']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        plotBackgroundColor: null,
                                        plotBorderWidth: null,
                                        plotShadow: false,
                                        type: 'pie'
                                    },
                                    title: {
                                        //text: 'Browser market shares January, 2015 to May, 2015'
                                    },
                                    tooltip: {
                                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                                    },
                                    plotOptions: {
                                        pie: {
                                            allowPointSelect: true,
                                            cursor: 'pointer',
                                            dataLabels: {
                                                enabled: true
                                            },
                                            showInLegend: true
                                        }
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator', 'year'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 2010,
                                                    "to": 2010
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "ForEmpl"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "region", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "region": "ASC"
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-5',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-5",
                        config: {
                            container: "#item-5",
                            adapter: {
                                type: "standard",
                                xDimensions: 'year',
                                yDimensions: 'indicator',
                                valueDimensions: 'value',
                                seriesDimensions: ['subregion']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                    tooltip: {
                                        valueSuffix: ' 1000 HA'
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 1990,
                                                    "to": 2010
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "ForEmpl"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "subregion", "year", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "subregion": "ASC",
                                    "year": "ASC"
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-6',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-6",
                        config: {
                            container: "#item-6",
                            adapter: {
                                type: "standard",
                                xDimensions: 'year',
                                yDimensions: 'indicator',
                                valueDimensions: 'value',
                                seriesDimensions: ['domain']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                    tooltip: {
                                        valueSuffix: ' 1000 HA'
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 1990,
                                                    "to": 2010
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "ForEmpl"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "domain", "year", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "domain": "ASC",
                                    "year": "ASC"
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-7',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-7",
                        config: {
                            container: "#item-7",
                            adapter: {
                                type: "standard",
                                xDimensions: 'year',
                                yDimensions: 'indicator',
                                valueDimensions: 'value',
                                seriesDimensions: ['incomes']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                    tooltip: {
                                        valueSuffix: ' 1000 HA'
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 1990,
                                                    "to": 2010
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "ForEmpl"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "incomes", "year", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "incomes": "ASC",
                                    "year": "ASC"
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-8',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-8",
                        config: {
                            container: "#item-8",
                            adapter: {
                                type: "pie",
                                valueDimensions: 'value',
                                seriesDimensions: ['subregion']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        plotBackgroundColor: null,
                                        plotBorderWidth: null,
                                        plotShadow: false,
                                        type: 'pie'
                                    },
                                    title: {
                                        //text: 'Browser market shares January, 2015 to May, 2015'
                                    },
                                    tooltip: {
                                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                                    },
                                    plotOptions: {
                                        pie: {
                                            allowPointSelect: true,
                                            cursor: 'pointer',
                                            dataLabels: {
                                                enabled: true
                                            },
                                            showInLegend: true
                                        }
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator', 'year'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 2010,
                                                    "to": 2010
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "ForEmpl"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "subregion", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "subregion": "ASC"
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-9',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-9",
                        config: {
                            container: "#item-9",
                            adapter: {
                                type: "pie",
                                valueDimensions: 'value',
                                seriesDimensions: ['domain']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        plotBackgroundColor: null,
                                        plotBorderWidth: null,
                                        plotShadow: false,
                                        type: 'pie'
                                    },
                                    title: {
                                        //text: 'Browser market shares January, 2015 to May, 2015'
                                    },
                                    tooltip: {
                                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                                    },
                                    plotOptions: {
                                        pie: {
                                            allowPointSelect: true,
                                            cursor: 'pointer',
                                            dataLabels: {
                                                enabled: true
                                            },
                                            showInLegend: true
                                        }
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator', 'year'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 2010,
                                                    "to": 2010
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "ForEmpl"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "domain", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "domain": "ASC"
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-10',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-10",
                        config: {
                            container: "#item-10",
                            adapter: {
                                type: "pie",
                                valueDimensions: 'value',
                                seriesDimensions: ['incomes']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        plotBackgroundColor: null,
                                        plotBorderWidth: null,
                                        plotShadow: false,
                                        type: 'pie'
                                    },
                                    title: {
                                        //text: 'Browser market shares January, 2015 to May, 2015'
                                    },
                                    tooltip: {
                                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                                    },
                                    plotOptions: {
                                        pie: {
                                            allowPointSelect: true,
                                            cursor: 'pointer',
                                            dataLabels: {
                                                enabled: true
                                            },
                                            showInLegend: true
                                        }
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator', 'year'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 2010,
                                                    "to": 2010
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "ForEmpl"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "incomes", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "incomes": "ASC"
                                }
                            }
                        ]
                    }

                ]


            }
        },

        "FLUDE_TOPIC_8": {

            download: {
                "target": "8.OWNERSHIP.zip"
            },

            filter: [
                {
                    "type": "distinct",
                    "uid": "FLUDE_TOPIC_8",
                    "column": "indicator",
                    "containerType": "baseContainer",
                    "title": "Indicator",
                    "defaultCodes": ["PubOwn"],
                    "components": [
                        {
                            "type": "codelist",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "uid" : "FLUDE_INDICATORS",
                            "title": {"EN": "Distinct"},
                            // name is the ID output in tehe filter getValues()
                            "name": "indicator",
                            "config": {
                                "defaultsource": []
                            }
                        }
                    ]
                },
                {
                    "type": "static",
                    "containerType": "baseContainer",
                    "title": "Year",
                    "components": [
                        {
                            "type": "time",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Year"},
                            "name": "year",
                            config: {
                                "defaultsource": [
                                    {"value": "2010", "label": "2010", "selected": true},
                                    {"value": "2005", "label": "2005", "selected": false},
                                    {"value": "2000", "label": "2000", "selected": false},
                                    {"value": "1990", "label": "1990", "selected": false}
                                ]
                            }
                        }
                    ]
                },
                {
                    "type": "codelist",
                    "containerType": "baseContainer",
                    "title": "Domains",
                    "components": [
                        {
                            "uid": "FLUDE_DOMAINS",
                            "type": "codelist",
                            "name": "domain",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},

                            config: {
                                "defaultsource": [
                                    //{"value": null, "label": "All", "selected": true},
                                    //{"value": null, "label": "All", "selected": true, "removeFilter": true},
                                ],
                                "enableMultiselection": true
                            }
                        }
                    ]
                },
                {
                    "type": "codelist",
                    "containerType": "baseContainer",
                    "title": "Incomes",
                    "components": [
                        {
                            "uid": "FLUDE_INCOMES",
                            "type": "codelist",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},
                            "name": "incomes",
                            config: {
                                "defaultsource": [
                                    //{"value": null, "label": "All", "selected": true},
                                ],
                                "enableMultiselection": true
                            }
                        }
                    ]
                },
                {
                    "type": "codelist",
                    "containerType": "baseContainer",
                    "title": "Subregions",
                    "components": [
                        {
                            "uid": "FLUDE_SUBREGIONS",
                            "type": "codelist",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},
                            "name": "subregion",
                            config: {
                                "defaultsource": [
                                    //{"value": null, "label": "All", "selected": true},
                                ],
                                "enableMultiselection": true
                            }
                        }
                    ]
                }
            ],

            dashboard: {
                //data cube's uid
                uid: "FLUDE_TOPIC_8",

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
                        id: 'item-1',
                        type: 'map',
                        class: "fx-map-chart",
                        //needed if layout = injected
                        container: "#topic-8-1",
                        config: {
                            container: "#topic-8-1",
                            leaflet: {
                                zoomControl: false,
                                attributionControl: true,
                                scrollWheelZoom: false ,
                                minZoom: 2
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator', 'year', 'domain', 'incomes', 'subregion'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 2010,
                                                    "to": 2010
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "PubOwn"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            }
                        ]
                    },

                    {
                        id: 'item-2',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#topic-8-2",
                        config: {
                            container: "#topic-8-2",
                            adapter: {
                                type: "standard",
                                xDimensions: 'time',
                                yDimensions: 'element',
                                valueDimensions: 'value',
                                seriesDimensions: ['country']
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    }, tooltip: {
                                        valueSuffix: ' 1000 HA'
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator', 'year', 'domain', 'incomes', 'subregion'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 1990,
                                                    "to": 2010
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "PubOwn"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "value": "DESC"
                                }
                            },
                            {
                                "name": "page",
                                "parameters": {
                                    "perPage": 25,
                                    "page": 1
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-3',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#topic-8-3",
                        config: {
                            container: "#topic-8-3",
                            adapter: {
                                type: "standard",
                                xDimensions: 'year',
                                yDimensions: 'indicator',
                                valueDimensions: 'value',
                                seriesDimensions: ['region']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                    tooltip: {
                                        valueSuffix: ' 1000 HA'
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 1990,
                                                    "to": 2010
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "PubOwn"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "region", "year", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "region": "ASC",
                                    "year": "ASC"
                                }
                            }
                        ]
                    },
                    {
                        id: 'topic-8-4',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#topic-8-4",
                        config: {
                            container: "#topic-8-4",
                            adapter: {
                                type: "pie",
                                valueDimensions: 'value',
                                seriesDimensions: ['region']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        plotBackgroundColor: null,
                                        plotBorderWidth: null,
                                        plotShadow: false,
                                        type: 'pie'
                                    },
                                    title: {
                                        //text: 'Browser market shares January, 2015 to May, 2015'
                                    },
                                    tooltip: {
                                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                                    },
                                    plotOptions: {
                                        pie: {
                                            allowPointSelect: true,
                                            cursor: 'pointer',
                                            dataLabels: {
                                                enabled: true
                                            },
                                            showInLegend: true
                                        }
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator', 'year'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 2010,
                                                    "to": 2010
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "PubOwn"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "region", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "region": "ASC"
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-5',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#topic-8-5",
                        config: {
                            container: "#topic-8-5",
                            adapter: {
                                type: "standard",
                                xDimensions: 'year',
                                yDimensions: 'indicator',
                                valueDimensions: 'value',
                                seriesDimensions: ['subregion']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                    tooltip: {
                                        valueSuffix: ' 1000 HA'
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 1990,
                                                    "to": 2010
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "PubOwn"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "subregion", "year", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "subregion": "ASC",
                                    "year": "ASC"
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-6',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#topic-8-6",
                        config: {
                            container: "#topic-8-6",
                            adapter: {
                                type: "standard",
                                xDimensions: 'year',
                                yDimensions: 'indicator',
                                valueDimensions: 'value',
                                seriesDimensions: ['domain']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                    tooltip: {
                                        valueSuffix: ' 1000 HA'
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 1990,
                                                    "to": 2010
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "PubOwn"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "domain", "year", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "domain": "ASC",
                                    "year": "ASC"
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-7',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#topic-8-7",
                        config: {
                            container: "#topic-8-7",
                            adapter: {
                                type: "standard",
                                xDimensions: 'year',
                                yDimensions: 'indicator',
                                valueDimensions: 'value',
                                seriesDimensions: ['incomes']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                    tooltip: {
                                        valueSuffix: ' 1000 HA'
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 1990,
                                                    "to": 2010
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "PubOwn"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "incomes", "year", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "incomes": "ASC",
                                    "year": "ASC"
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-8',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#topic-8-8",
                        config: {
                            container: "#topic-8-8",
                            adapter: {
                                type: "pie",
                                valueDimensions: 'value',
                                seriesDimensions: ['subregion']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        plotBackgroundColor: null,
                                        plotBorderWidth: null,
                                        plotShadow: false,
                                        type: 'pie'
                                    },
                                    title: {
                                        //text: 'Browser market shares January, 2015 to May, 2015'
                                    },
                                    tooltip: {
                                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                                    },
                                    plotOptions: {
                                        pie: {
                                            allowPointSelect: true,
                                            cursor: 'pointer',
                                            dataLabels: {
                                                enabled: true
                                            },
                                            showInLegend: true
                                        }
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator', 'year'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 2010,
                                                    "to": 2010
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "PubOwn"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "subregion", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "subregion": "ASC"
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-9',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#topic-8-9",
                        config: {
                            container: "#topic-8-9",
                            adapter: {
                                type: "pie",
                                valueDimensions: 'value',
                                seriesDimensions: ['domain']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        plotBackgroundColor: null,
                                        plotBorderWidth: null,
                                        plotShadow: false,
                                        type: 'pie'
                                    },
                                    title: {
                                        //text: 'Browser market shares January, 2015 to May, 2015'
                                    },
                                    tooltip: {
                                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                                    },
                                    plotOptions: {
                                        pie: {
                                            allowPointSelect: true,
                                            cursor: 'pointer',
                                            dataLabels: {
                                                enabled: true
                                            },
                                            showInLegend: true
                                        }
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator', 'year'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 2010,
                                                    "to": 2010
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "PubOwn"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "domain", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "domain": "ASC"
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-10',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#topic-8-10",
                        config: {
                            container: "#topic-8-10",
                            adapter: {
                                type: "pie",
                                valueDimensions: 'value',
                                seriesDimensions: ['incomes']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        plotBackgroundColor: null,
                                        plotBorderWidth: null,
                                        plotShadow: false,
                                        type: 'pie'
                                    },
                                    title: {
                                        //text: 'Browser market shares January, 2015 to May, 2015'
                                    },
                                    tooltip: {
                                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                                    },
                                    plotOptions: {
                                        pie: {
                                            allowPointSelect: true,
                                            cursor: 'pointer',
                                            dataLabels: {
                                                enabled: true
                                            },
                                            showInLegend: true
                                        }
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator', 'year'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 2010,
                                                    "to": 2010
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "PubOwn"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "incomes", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "incomes": "ASC"
                                }
                            }
                        ]
                    }


                ]

            }
        },

        "ANNUAL_DATA": {

            download: {
                "target": "9. ANNUAL DATA.zip"
            },

            filter: [
                {
                    "type": "distinct",
                    "uid": "FLUDE_TOPIC_9",
                    "column": "indicator",
                    "containerType": "baseContainer",
                    "title": "Indicator",
                    "defaultCodes": ["BurnLan"],
                    "components": [
                        {
                            "type": "codelist",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "uid" : "FLUDE_INDICATORS",
                            "title": {"EN": "Distinct"},
                            // name is the ID output in tehe filter getValues()
                            "name": "indicator",
                            "config": {
                                "defaultsource": []
                            }
                        }
                    ]
                },
                {
                    "type": "static",
                    "containerType": "baseContainer",
                    "title": "Year",
                    "components": [
                        {
                            "type": "time",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Year"},
                            "name": "year",
                            config: {
                                "defaultsource": [

                                    {"value": "2011", "label": "2011", "selected": true},
                                    {"value": "2010", "label": "2010", "selected": false},
                                    {"value": "2009", "label": "2009", "selected": false},
                                    {"value": "2008", "label": "2008", "selected": false},
                                    {"value": "2007", "label": "2007", "selected": false},
                                    {"value": "2006", "label": "2006", "selected": false},
                                    {"value": "2005", "label": "2005", "selected": false},
                                    {"value": "2004", "label": "2004", "selected": false},
                                    {"value": "2003", "label": "2003", "selected": false},
                                    {"value": "2002", "label": "2002", "selected": false},
                                    {"value": "2001", "label": "2001", "selected": false},
                                    {"value": "2000", "label": "2000", "selected": false},
                                    {"value": "1999", "label": "1999", "selected": false},
                                    {"value": "1998", "label": "1998", "selected": false},
                                    {"value": "1997", "label": "1997", "selected": false},
                                    {"value": "1996", "label": "1996", "selected": false},
                                    {"value": "1995", "label": "1995", "selected": false},
                                    {"value": "1994", "label": "1994", "selected": false},
                                    {"value": "1993", "label": "1993", "selected": false},
                                    {"value": "1992", "label": "1992", "selected": false},
                                    {"value": "1991", "label": "1991", "selected": false},
                                    {"value": "1990", "label": "1990", "selected": false}
                                ]
                            }
                        }
                    ]
                },
                {
                    "type": "codelist",
                    "containerType": "baseContainer",
                    "title": "Domains",
                    "components": [
                        {
                            "uid": "FLUDE_DOMAINS",
                            "type": "codelist",
                            "name": "domain",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},

                            config: {
                                "defaultsource": [
                                    //{"value": null, "label": "All", "selected": true},
                                    //{"value": null, "label": "All", "selected": true, "removeFilter": true},
                                ],
                                "enableMultiselection": true
                            }
                        }
                    ]
                },
                {
                    "type": "codelist",
                    "containerType": "baseContainer",
                    "title": "Incomes",
                    "components": [
                        {
                            "uid": "FLUDE_INCOMES",
                            "type": "codelist",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},
                            "name": "incomes",
                            config: {
                                "defaultsource": [
                                    //{"value": null, "label": "All", "selected": true},
                                ],
                                "enableMultiselection": true
                            }
                        }
                    ]
                },
                {
                    "type": "codelist",
                    "containerType": "baseContainer",
                    "title": "Subregions",
                    "components": [
                        {
                            "uid": "FLUDE_SUBREGIONS",
                            "type": "codelist",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},
                            "name": "subregion",
                            config: {
                                "defaultsource": [
                                    //{"value": null, "label": "All", "selected": true},
                                ],
                                "enableMultiselection": true
                            }
                        }
                    ]
                }
            ],

            dashboard: {
                //data cube's uid
                uid: "FLUDE_TOPIC_9",

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

                items:  [
                    {
                        id: 'item-1',
                        type: 'map',
                        class: "fx-map-chart",
                        //needed if layout = injected
                        container: "#topic-9-1",
                        config: {
                            container: "#topic-9-1",
                            leaflet: {
                                zoomControl: false,
                                attributionControl: true,
                                scrollWheelZoom: false ,
                                minZoom: 2
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator', 'year', 'domain', 'incomes', 'subregion'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 2011,
                                                    "to": 2011
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "WooRemov"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            }
                        ]
                    },

                    {
                        id: 'item-2',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#topic-9-2",
                        config: {
                            container: "#topic-9-2",
                            adapter: {
                                type: "standard",
                                xDimensions: 'time',
                                yDimensions: 'element',
                                valueDimensions: 'value',
                                seriesDimensions: ['country']
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                    tooltip: {
                                        valueSuffix: ' 1000 HA'
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator', 'year', 'domain', 'incomes', 'subregion'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 2011,
                                                    "to": 2011
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "WooRemov"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "value": "DESC"
                                }
                            },
                            {
                                "name": "page",
                                "parameters": {
                                    "perPage": 25,
                                    "page": 1
                                }
                            }
                        ]
                    },

                    {
                        id: 'item-5',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#topic-9-5",
                        config: {
                            container: "#topic-9-5",
                            adapter: {
                                type: "standard",
                                xDimensions: 'year',
                                yDimensions: 'indicator',
                                valueDimensions: 'value',
                                seriesDimensions: ['subregion']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                    tooltip: {
                                        valueSuffix: ' 1000 HA'
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 2000,
                                                    "to": 2011
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "WooRemov"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "subregion", "year", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "subregion": "ASC",
                                    "year": "ASC"
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-6',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#topic-9-6",
                        config: {
                            container: "#topic-9-6",
                            adapter: {
                                type: "standard",
                                xDimensions: 'year',
                                yDimensions: 'indicator',
                                valueDimensions: 'value',
                                seriesDimensions: ['domain']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                    tooltip: {
                                        valueSuffix: ' 1000 HA'
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 2000,
                                                    "to": 2011
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "WooRemov"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "domain", "year", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "domain": "ASC",
                                    "year": "ASC"
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-7',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#topic-9-7",
                        config: {
                            container: "#topic-9-7",
                            adapter: {
                                type: "standard",
                                xDimensions: 'year',
                                yDimensions: 'indicator',
                                valueDimensions: 'value',
                                seriesDimensions: ['incomes']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                    tooltip: {
                                        valueSuffix: ' 1000 HA'
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 2000,
                                                    "to": 2011
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "WooRemov"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "incomes", "year", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "incomes": "ASC",
                                    "year": "ASC"
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-8',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#topic-9-8",
                        config: {
                            container: "#topic-9-8",
                            adapter: {
                                type: "pie",
                                valueDimensions: 'value',
                                seriesDimensions: ['subregion']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        plotBackgroundColor: null,
                                        plotBorderWidth: null,
                                        plotShadow: false,
                                        type: 'pie'
                                    },
                                    title: {
                                        //text: 'Browser market shares January, 2015 to May, 2015'
                                    },
                                    tooltip: {
                                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                                    },
                                    plotOptions: {
                                        pie: {
                                            allowPointSelect: true,
                                            cursor: 'pointer',
                                            dataLabels: {
                                                enabled: true
                                            },
                                            showInLegend: true
                                        }
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator', 'year'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 2011,
                                                    "to": 2011
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "WooRemov"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "subregion", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "subregion": "ASC"
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-9',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#topic-9-9",
                        config: {
                            container: "#topic-9-9",
                            adapter: {
                                type: "pie",
                                valueDimensions: 'value',
                                seriesDimensions: ['domain']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        plotBackgroundColor: null,
                                        plotBorderWidth: null,
                                        plotShadow: false,
                                        type: 'pie'
                                    },
                                    title: {
                                        //text: 'Browser market shares January, 2015 to May, 2015'
                                    },
                                    tooltip: {
                                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                                    },
                                    plotOptions: {
                                        pie: {
                                            allowPointSelect: true,
                                            cursor: 'pointer',
                                            dataLabels: {
                                                enabled: true
                                            },
                                            showInLegend: true
                                        }
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator', 'year'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 2011,
                                                    "to": 2011
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "WooRemov"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "domain", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "domain": "ASC"
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-10',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#topic-9-10",
                        config: {
                            container: "#topic-9-10",
                            adapter: {
                                type: "pie",
                                valueDimensions: 'value',
                                seriesDimensions: ['incomes']
                            },
                            template: {},
                            creator: {
                                chartObj: {
                                    chart: {
                                        plotBackgroundColor: null,
                                        plotBorderWidth: null,
                                        plotShadow: false,
                                        type: 'pie'
                                    },
                                    title: {
                                        //text: 'Browser market shares January, 2015 to May, 2015'
                                    },
                                    tooltip: {
                                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                                    },
                                    plotOptions: {
                                        pie: {
                                            allowPointSelect: true,
                                            cursor: 'pointer',
                                            dataLabels: {
                                                enabled: true
                                            },
                                            showInLegend: true
                                        }
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['indicator', 'year'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 2011,
                                                    "to": 2011
                                                }
                                            ]
                                        },
                                        "indicator": {
                                            "codes": [
                                                {
                                                    "uid": "FLUDE_INDICATORS",
                                                    "codes": [
                                                        "WooRemov"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "incomes", "indicator"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "AVG"
                                        },
                                        {
                                            "columns": ["um"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "incomes": "ASC"
                                }
                            }
                        ]
                    }


                ]
            }
        }

    }
});