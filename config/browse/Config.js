/*global define*/

define(function () {

    'use strict';

    return {

        SECONDARY_MENU: {
            url: 'config/browse/secondary_menu.json'
        },

        "sector": {

            download: {
                "target": "6.PROTECTIVE FUNCTIONS AND SELECTIVE ECOSYSTEM SERVICES.zip"
            },

            filter: [
                {
                    "type": "codelist-hierarchy",
                    "containerType": "baseContainer",
                    "title": "Sector",
                    "components": [
                        {
                            "uid": "crs_dac",
                            "version": "2015",
                            "type": "codelist-hierarchy",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},
                            "name": "sectorcode",
                            config: {
                                "defaultsource": [
                                    //{"value": null, "label": "All", "selected": true},
                                ],
                                "defaultcodes": ['600'],
                                "onlyValueText": true,
                                "enableMultiselection": false,
                                "filter": {
                                    "uid": "crs_dac",
                                    "version": "2015",
                                    "level" : 1,
                                    "levels":3
                                }
                            }

                        }
                    ]
                },
                {
                    "type": "codelist-hierarchy",
                    "containerType": "baseContainer",
                    "title": "Sub Sector",
                    "components": [
                        {
                            "uid": "crs_dac",
                            "version": "2015",
                            "type": "codelist-hierarchy",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},
                            "name": "purposecode",
                            config: {
                                "defaultsource": [
                                    //{"value": null, "label": "All", "selected": true},
                                ],
                                "onlyValueText": true,
                                "filter": {
                                    "uid": "crs_dac",
                                    "version": "2015",
                                    "level" : 3,
                                    "levels":3
                                }
                            }
                        }
                    ]
                },
                {
                    "type": "static",
                    "containerType": "baseContainer",
                    "components": [
                        {
                            "type": "range",
                            "name": "year",
                            "componentType": "timeRangeLists-FENIX",
                            "class" : "timeRangeList",
                            "lang": "EN",
                            "title": {"EN": "Year"},
                            "config": {
                                "from" : {
                                    "title":  {"EN": "From"},
                                    "defaultsource": [
                                        {"value": "2000", "label": "2000", "selected": true},
                                        {"value": "2001", "label": "2001", "selected": false},
                                        {"value": "2002", "label": "2002", "selected": false},
                                        {"value": "2003", "label": "2003", "selected": false},
                                        {"value": "2004", "label": "2004", "selected": false},
                                        {"value": "2005", "label": "2005", "selected": false},
                                        {"value": "2006", "label": "2006", "selected": false},
                                        {"value": "2007", "label": "2007", "selected": false},
                                        {"value": "2008", "label": "2008", "selected": false},
                                        {"value": "2009", "label": "2009", "selected": false},
                                        {"value": "2010", "label": "2010", "selected": false},
                                        {"value": "2011", "label": "2011", "selected": false},
                                        {"value": "2012", "label": "2012", "selected": false},
                                        {"value": "2013", "label": "2013", "selected": false}
                                    ]
                                },
                                "to" : {
                                    "title":  {"EN": "To"},
                                    "defaultsource": [
                                        {"value": "2013", "label": "2013", "selected": true},
                                        {"value": "2012", "label": "2012", "selected": false},
                                        {"value": "2011", "label": "2011", "selected": false},
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
                                        {"value": "2000", "label": "2000", "selected": false}
                                    ]
                                }
                            }
                        }
                    ]
                },
                {
                    "type": "codelist-hierarchy",
                    "containerType": "baseContainer",
                    "title": "Channel of Delivery",
                    "components": [
                        {
                            "uid": "crs_channels",
                            "version": "2015",
                            "type": "codelist-hierarchy",
                            "name": "channelcode",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},

                            config: {
                                "defaultsource": [],
                                "onlyValueText": true,
                                "filter": {
                                    "uid": "crs_channels",
                                    "version": "2015",
                                    "level" : 3,
                                    "levels":3
                                }
                            }
                        }
                    ]
                },
                {
                    "type": "codelist",
                    "containerType": "baseContainer",
                    "title": "Official Development Assistance (ODA)",
                    "components": [
                        {
                            "uid": "crs_flow_amounts",
                            "version": "2015",
                            "type": "codelist",
                            "name": "uid",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},
                            config: {
                                "defaultsource": [],
                                "defaultcodes": ['usd_commitment'],
                                "removeFilter": true
                            }
                        }
                    ]
                }
            ],

            dashboard: {
                //data cube's uid
                uid: "adam_usd_commitment",

                //data base filter
                filter: [  {
                    "name": "filter",
                    "parameters": {
                        "rows": {     // ROWS = WHERE
                            "flowcode": {
                                "codes": [
                                    {
                                        "uid": "crs_flow_types",
                                        "version": "2015",
                                        "codes": [ "10_12", "10_11", "10_13", "10_19"
                                        ]   //ODA
                                    }
                                ]
                            }

                        }
                        //, "columns" = SELECT COLUMNS
                    }
                }],

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
                        id: 'item-1',   // TOTAL ODA
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-1",
                        config: {
                            container: "#item-1",
                            adapter: {
                                type: "standard",
                                xDimensions: 'year',
                                yDimensions: 'unitname',
                                valueDimensions: 'value',
                                seriesDimensions: ['sectorcode']
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "line"
                                    },
                                    xAxis : {
                                     type: 'datetime'
                                    },
                                    subtitle: {
                                        text: ''
                                    },
                                    tooltip: {
                                        formatter: function(){
                                            return '<b>' +this.x + ': ' +
                                                this.series.name +  '</b><br/>' +
                                                Highcharts.numberFormat(this.y, 2, '.', ',') + ' USD Mil'
                                        }
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['sectorcode', 'purposecode', 'year', 'channelcode'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                     "rows": {
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
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 2000,
                                                    "to": 2013
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
                                        "sectorcode", "year"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "SUM"
                                        },
                                        {
                                            "columns": ["unitcode"],
                                            "rule": "FIRST"
                                        },
                                        {
                                            "columns": ["unitname"],
                                            "rule": "FIRST"
                                        }

                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "year": "ASC"
                                }
                            }

                        ]
                    },
                    {
                        id: 'item-2', // TOP 10 DONORS
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-2",
                        config: {
                            container: "#item-2",
                            adapter: {
                                type: "standard",
                                xDimensions: 'donorcode',
                                yDimensions: 'unitname',
                                valueDimensions: 'value',
                                seriesDimensions: ['donorcode']
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                    subtitle: {
                                        text: ''
                                    },
                                    tooltip: {
                                        formatter: function(){
                                            return '<b>' +this.x + ': ' + '</b><br/>' +
                                                Highcharts.numberFormat(this.y, 2, '.', ',') + ' USD Mil'
                                        }
                                    }

                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['sectorcode', 'purposecode', 'year', 'channelcode'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
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
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 2000,
                                                    "to": 2013
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
                                        "donorcode"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "SUM"
                                        },
                                        {
                                            "columns": ["unitcode"],
                                            "rule": "FIRST"
                                        },
                                        {
                                            "columns": ["unitname"],
                                            "rule": "FIRST"
                                        }

                                    ]
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
                                  "perPage": 10,  //top 10
                                   "page": 1
                               }
                            }
                        ]
                    },
                    {
                        id: 'item-3', // TOP 10 CHANNELS OF DELIVERY
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-3",
                        config: {
                            container: "#item-3",
                            adapter: {
                                type: "standard",
                                xDimensions: 'channelcode',
                                yDimensions: 'unitname',
                                valueDimensions: 'value',
                                seriesDimensions: ['channelcode']
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                    subtitle: {
                                        text: ''
                                    },
                                    tooltip: {
                                        formatter: function(){
                                            return '<b>' +this.x + ': ' + '</b><br/>' +
                                                Highcharts.numberFormat(this.y, 2, '.', ',') + ' USD Mil'
                                        }
                                    }

                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['sectorcode', 'purposecode', 'year', 'channelcode'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
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
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "channelcode"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "SUM"
                                        },
                                        {
                                            "columns": ["unitcode"],
                                            "rule": "FIRST"
                                        },
                                        {
                                            "columns": ["unitname"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "value": "DESC"
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-4',  // TOP 10 Subsectors
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-4",
                        config: {
                            container: "#item-4",
                            adapter: {
                                type: "pie",
                                valueDimensions: 'value',
                                seriesDimensions: ['purposecode']
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
                                    subtitle: {
                                        text: ''
                                    },
                                    title: {
                                        //text: 'Browser market shares January, 2015 to May, 2015'
                                    },
                                    tooltip: {
                                        style: {width: '200px', whiteSpace: 'normal'},
                                        pointFormat: '<b>{point.percentage:.2f}%</b>'
                                    },
                                    legend: {
                                       labelFormatter: function(){
                                        //  var words = this.name.split(/\s+/).slice(1,5);
                                          // for


                                           return this.name.slice(0, 25)+ '...'
                                       }
                                        //s.split(/\s+/).slice(1,3);
                                    },
                                    plotOptions: {
                                        pie: {
                                            allowPointSelect: true,
                                            cursor: 'pointer',
                                            dataLabels: {
                                               formatter: function(){
                                                var words = this.point.name.slice(0, 60)+ '...';

                                                return words;

                                               },
                                                enabled: true
                                            },
                                            showInLegend: true
                                        }
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['sectorcode', 'purposecode', 'year', 'channelcode'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "purposecode": {
                                            "codes": [
                                                {
                                                    "uid": "crs_purposes",
                                                    "version": "2015",
                                                    "codes": [
                                                        "60010", "60020", "60030",
                                                        "60040", "60061", "60062", "60063"
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
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "purposecode"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "SUM"
                                        },
                                        {
                                            "columns": ["unitcode"],
                                            "rule": "FIRST"
                                        },
                                        {
                                            "columns": ["unitname"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "value": "DESC"
                                }
                            }
                        ]
                    }

                ]
            }
        },

        "country_sector": {
            download: {
                "target": "6.PROTECTIVE FUNCTIONS AND SELECTIVE ECOSYSTEM SERVICES.zip"
            },

            filter: [
                {
                    "type": "codelist",
                    "containerType": "baseContainer",
                    "title": "Country",
                    "components": [
                        {
                            "uid": "crs_recipients",
                            "version": "2015",
                            "type": "codelist",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},
                            "name": "recipientcode",
                            config: {
                                "defaultsource": [
                                    //{"value": null, "label": "All", "selected": true},
                                ],
                                "defaultcodes": ['625'], //afghanistan
                                "onlyValueText": true,
                                "enableMultiselection": false
                            }

                        }
                    ]
                },
                {
                    "type": "codelist-hierarchy",
                    "containerType": "baseContainer",
                    "title": "Sector",
                    "components": [
                        {
                            "uid": "crs_dac",
                            "version": "2015",
                            "type": "codelist-hierarchy",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},
                            "name": "sectorcode",
                            config: {
                                "defaultsource": [
                                    //{"value": null, "label": "All", "selected": true},
                                ],
                                "defaultcodes": ['600'],
                                "onlyValueText": true,
                                "enableMultiselection": false,
                                "filter": {
                                    "uid": "crs_dac",
                                    "version": "2015",
                                    "level" : 1,
                                    "levels":3
                                }
                            }

                        }
                    ]
                },
                {
                    "type": "codelist-hierarchy",
                    "containerType": "baseContainer",
                    "title": "Sub Sector",
                    "components": [
                        {
                            "uid": "crs_dac",
                            "version": "2015",
                            "type": "codelist-hierarchy",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},
                            "name": "purposecode",
                            config: {
                                "defaultsource": [
                                    //{"value": null, "label": "All", "selected": true},
                                ],
                                "onlyValueText": true,
                                "filter": {
                                    "uid": "crs_dac",
                                    "version": "2015",
                                    "level" : 3,
                                    "levels":3
                                }
                            }
                        }
                    ]
                },
                {
                    "type": "static",
                    "containerType": "baseContainer",
                    "components": [
                        {
                            "type": "range",
                            "name": "year",
                            "componentType": "timeRangeLists-FENIX",
                            "class" : "timeRangeList",
                            "lang": "EN",
                            "title": {"EN": "Year"},
                            "config": {
                                "from" : {
                                    "title":  {"EN": "From"},
                                    "defaultsource": [
                                        {"value": "2000", "label": "2000", "selected": true},
                                        {"value": "2001", "label": "2001", "selected": false},
                                        {"value": "2002", "label": "2002", "selected": false},
                                        {"value": "2003", "label": "2003", "selected": false},
                                        {"value": "2004", "label": "2004", "selected": false},
                                        {"value": "2005", "label": "2005", "selected": false},
                                        {"value": "2006", "label": "2006", "selected": false},
                                        {"value": "2007", "label": "2007", "selected": false},
                                        {"value": "2008", "label": "2008", "selected": false},
                                        {"value": "2009", "label": "2009", "selected": false},
                                        {"value": "2010", "label": "2010", "selected": false},
                                        {"value": "2011", "label": "2011", "selected": false},
                                        {"value": "2012", "label": "2012", "selected": false},
                                        {"value": "2013", "label": "2013", "selected": false}
                                    ]
                                },
                                "to" : {
                                    "title":  {"EN": "To"},
                                    "defaultsource": [
                                        {"value": "2013", "label": "2013", "selected": true},
                                        {"value": "2012", "label": "2012", "selected": false},
                                        {"value": "2011", "label": "2011", "selected": false},
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
                                        {"value": "2000", "label": "2000", "selected": false}
                                    ]
                                }
                            }
                        }
                    ]
                },
                {
                    "type": "codelist-hierarchy",
                    "containerType": "baseContainer",
                    "title": "Channel of Delivery",
                    "components": [
                        {
                            "uid": "crs_channels",
                            "version": "2015",
                            "type": "codelist-hierarchy",
                            "name": "channelcode",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},

                            config: {
                                "defaultsource": [],
                                "onlyValueText": true,
                                "filter": {
                                    "uid": "crs_channels",
                                    "version": "2015",
                                    "level" : 3,
                                    "levels":3
                                }
                            }
                        }
                    ]
                },
                {
                    "type": "codelist",
                    "containerType": "baseContainer",
                    "title": "Official Development Assistance (ODA)",
                    "components": [
                        {
                            "uid": "crs_flow_amounts",
                            "version": "2015",
                            "type": "codelist",
                            "name": "uid",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},
                            config: {
                                "defaultsource": [],
                                "defaultcodes": ['usd_commitment'],
                                "removeFilter": true
                            }
                        }
                    ]
                }
            ],

            dashboard: {
                //data cube's uid
                uid: "adam_usd_commitment",

                //data base filter
                filter: [  {
                    "name": "filter",
                    "parameters": {
                        "rows": {     // ROWS = WHERE
                            "flowcode": {
                                "codes": [
                                    {
                                        "uid": "crs_flow_types",
                                        "version": "2015",
                                        "codes": [ "10_12", "10_11", "10_13", "10_19"
                                        ]   //ODA
                                    }
                                ]
                            }//,
                            /**"recipientcode": {
                                "codes": [
                                    {
                                        "uid": "crs_recipients",
                                        "version": "2015",
                                        "codes": [
                                            "130"  //Algeria
                                        ]
                                    }
                                ]
                            }  **/

                        }
                        //, "columns" = SELECT COLUMNS
                    }
                }],

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
                        id: 'item-1',  // TOTAL ODA
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-1",
                        config: {
                            container: "#item-1",
                            adapter: {
                                type: "standard",
                                xDimensions: 'year',
                                yDimensions: 'unitname',
                                valueDimensions: 'value',
                                seriesDimensions: ['sectorcode']
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "line"
                                    },
                                    xAxis : {
                                        type: 'datetime'
                                    },
                                    subtitle: {
                                        text: ''
                                    },
                                    tooltip: {
                                        formatter: function(){
                                            return '<b>' +this.x + ': ' +
                                                this.series.name +  '</b><br/>' +
                                                Highcharts.numberFormat(this.y, 2, '.', ',') + ' USD Mil'
                                        }
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['sectorcode', 'purposecode', 'year', 'channelcode'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
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
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "sectorcode", "year"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "SUM"
                                        },
                                        {
                                            "columns": ["unitcode"],
                                            "rule": "FIRST"
                                        },
                                        {
                                            "columns": ["unitname"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "year": "ASC"
                                }
                            }

                        ]
                    },
                    {
                        id: 'item-2', // Total ODA for most financed sectors
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-2",
                        config: {
                            container: "#item-2",
                            adapter: {
                                type: "standard",
                                xDimensions: 'sectorcode',
                                yDimensions: 'unitname',
                                valueDimensions: 'value',
                                seriesDimensions: ['sectorcode']
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                    subtitle: {
                                        text: ''
                                    },
                                    tooltip: {
                                        formatter: function(){
                                            return '<b>' +this.x + ': ' + '</b><br/>' +
                                                Highcharts.numberFormat(this.y, 2, '.', ',') + ' USD Mil'
                                        }
                                    }

                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['recipientcode', 'year', 'channelcode'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
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
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "sectorcode"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "SUM"
                                        },
                                        {
                                            "columns": ["unitcode"],
                                            "rule": "FIRST"
                                        },
                                        {
                                            "columns": ["unitname"],
                                            "rule": "FIRST"
                                        }
                                    ]
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
                                    "perPage": 10,  //top 20
                                    "page": 1
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-3', // TOP Donors
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-3",
                        config: {
                            container: "#item-3",
                            adapter: {
                                type: "standard",
                                xDimensions: 'donorcode',
                                yDimensions: 'unitname',
                                valueDimensions: 'value',
                                seriesDimensions: ['donorcode']
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                    subtitle: {
                                        text: ''
                                    },
                                    tooltip: {
                                        formatter: function(){
                                            return '<b>' +this.x + ': ' + '</b><br/>' +
                                                Highcharts.numberFormat(this.y, 2, '.', ',') + ' USD Mil'
                                        }
                                    }

                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['sectorcode', 'purposecode', 'year', 'channelcode'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
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
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "donorcode"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "SUM"
                                        },
                                        {
                                            "columns": ["unitcode"],
                                            "rule": "FIRST"
                                        },
                                        {
                                            "columns": ["unitname"],
                                            "rule": "FIRST"
                                        }
                                    ]
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
                                    "perPage": 10,  //top 10
                                    "page": 1
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-4',    // Top sub-sectors
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-4",
                        config: {
                            container: "#item-4",
                            adapter: {
                                type: "pie",
                                valueDimensions: 'value',
                                seriesDimensions: ['purposecode']
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
                                    subtitle: {
                                        text: ''
                                    },
                                    title: {
                                        //text: 'Browser market shares January, 2015 to May, 2015'
                                    },
                                    tooltip: {
                                        style: {width: '200px', whiteSpace: 'normal'},
                                        pointFormat: '<b>{point.percentage:.2f}%</b>'
                                    },
                                    legend: {
                                        labelFormatter: function(){return this.name.slice(0, 25)+ '...'}
                                    },
                                    plotOptions: {
                                        pie: {
                                            allowPointSelect: true,
                                            cursor: 'pointer',
                                            dataLabels: {
                                                formatter: function(){
                                                    var words = this.point.name.slice(0, 60)+ '...';

                                                    return words;

                                                },
                                                enabled: true
                                            },
                                            showInLegend: true
                                        }
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['sectorcode', 'purposecode', 'year', 'channelcode'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
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
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "purposecode"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "SUM"
                                        },
                                        {
                                            "columns": ["unitcode"],
                                            "rule": "FIRST"
                                        },
                                        {
                                            "columns": ["unitname"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "value": "DESC"
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-5', // TOP Channels
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-5",
                        config: {
                            container: "#item-5",
                            adapter: {
                                type: "standard",
                                xDimensions: 'channelcode',
                                yDimensions: 'unitname',
                                valueDimensions: 'value',
                                seriesDimensions: ['channelcode']
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                    subtitle: {
                                        text: ''
                                    },
                                    tooltip: {
                                        formatter: function(){
                                            return '<b>' +this.x + ': ' + '</b><br/>' +
                                                Highcharts.numberFormat(this.y, 2, '.', ',') + ' USD Mil'
                                        }
                                    }

                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['sectorcode', 'purposecode', 'year', 'channelcode'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
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
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "channelcode"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "SUM"
                                        },
                                        {
                                            "columns": ["unitcode"],
                                            "rule": "FIRST"
                                        },
                                        {
                                            "columns": ["unitname"],
                                            "rule": "FIRST"
                                        }
                                    ]
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
                                    "perPage": 10,  //top 10
                                    "page": 1
                                }
                            }
                        ]
                    }


                ]
            }
        },

        "donor_sector": {
            download: {
                "target": "6.PROTECTIVE FUNCTIONS AND SELECTIVE ECOSYSTEM SERVICES.zip"
            },

            filter: [
                {
                    "type": "codelist",
                    "containerType": "baseContainer",
                    "title": "Donor",
                    "components": [
                        {
                            "uid": "crs_donors",
                            "version": "2015",
                            "type": "codelist",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},
                            "name": "donorcode",
                            config: {
                                "defaultsource": [
                                    //{"value": null, "label": "All", "selected": true},
                                ],
                                "defaultcodes": ["1"],  //Austria
                                "onlyValueText": true,
                                "enableMultiselection": false
                            }

                        }
                    ]
                },
                {
                    "type": "codelist-hierarchy",
                    "containerType": "baseContainer",
                    "title": "Sector",
                    "components": [
                        {
                            "uid": "crs_dac",
                            "version": "2015",
                            "type": "codelist-hierarchy",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},
                            "name": "sectorcode",
                            config: {
                                "defaultsource": [
                                    //{"value": null, "label": "All", "selected": true},
                                ],
                                "defaultcodes": ['600'],
                                "onlyValueText": true,
                                "enableMultiselection": false,
                                "filter": {
                                    "uid": "crs_dac",
                                    "version": "2015",
                                    "level" : 1,
                                    "levels":3
                                }
                            }

                        }
                    ]
                },
                {
                    "type": "codelist-hierarchy",
                    "containerType": "baseContainer",
                    "title": "Sub Sector",
                    "components": [
                        {
                            "uid": "crs_dac",
                            "version": "2015",
                            "type": "codelist-hierarchy",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},
                            "name": "purposecode",
                            config: {
                                "defaultsource": [
                                    //{"value": null, "label": "All", "selected": true},
                                ],
                                "onlyValueText": true,
                                "filter": {
                                    "uid": "crs_dac",
                                    "version": "2015",
                                    "level" : 3,
                                    "levels":3
                                }
                            }
                        }
                    ]
                },
                {
                    "type": "static",
                    "containerType": "baseContainer",
                    "components": [
                        {
                            "type": "range",
                            "name": "year",
                            "componentType": "timeRangeLists-FENIX",
                            "class" : "timeRangeList",
                            "lang": "EN",
                            "title": {"EN": "Year"},
                            "config": {
                                "from" : {
                                    "title":  {"EN": "From"},
                                    "defaultsource": [
                                        {"value": "2000", "label": "2000", "selected": true},
                                        {"value": "2001", "label": "2001", "selected": false},
                                        {"value": "2002", "label": "2002", "selected": false},
                                        {"value": "2003", "label": "2003", "selected": false},
                                        {"value": "2004", "label": "2004", "selected": false},
                                        {"value": "2005", "label": "2005", "selected": false},
                                        {"value": "2006", "label": "2006", "selected": false},
                                        {"value": "2007", "label": "2007", "selected": false},
                                        {"value": "2008", "label": "2008", "selected": false},
                                        {"value": "2009", "label": "2009", "selected": false},
                                        {"value": "2010", "label": "2010", "selected": false},
                                        {"value": "2011", "label": "2011", "selected": false},
                                        {"value": "2012", "label": "2012", "selected": false},
                                        {"value": "2013", "label": "2013", "selected": false}
                                    ]
                                },
                                "to" : {
                                    "title":  {"EN": "To"},
                                    "defaultsource": [
                                        {"value": "2013", "label": "2013", "selected": true},
                                        {"value": "2012", "label": "2012", "selected": false},
                                        {"value": "2011", "label": "2011", "selected": false},
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
                                        {"value": "2000", "label": "2000", "selected": false}
                                    ]
                                }
                            }
                        }
                    ]
                },
                {
                    "type": "codelist-hierarchy",
                    "containerType": "baseContainer",
                    "title": "Channel of Delivery",
                    "components": [
                        {
                            "uid": "crs_channels",
                            "version": "2015",
                            "type": "codelist-hierarchy",
                            "name": "channelcode",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},

                            config: {
                                "defaultsource": [],
                                "onlyValueText": true,
                                "filter": {
                                    "uid": "crs_channels",
                                    "version": "2015",
                                    "level" : 3,
                                    "levels":3
                                }
                            }
                        }
                    ]
                },
                {
                    "type": "codelist",
                    "containerType": "baseContainer",
                    "title": "Official Development Assistance (ODA)",
                    "components": [
                        {
                            "uid": "crs_flow_amounts",
                            "version": "2015",
                            "type": "codelist",
                            "name": "uid",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},
                            config: {
                                "defaultsource": [],
                                "defaultcodes": ['usd_commitment'],
                                "removeFilter": true
                            }
                        }
                    ]
                }
            ],

            dashboard: {
                //data cube's uid
                uid: "adam_usd_commitment",

                //data base filter
                filter: [  {
                    "name": "filter",
                    "parameters": {
                        "rows": {     // ROWS = WHERE
                            "flowcode": {
                                "codes": [
                                    {
                                        "uid": "crs_flow_types",
                                        "version": "2015",
                                        "codes": [ "10_12", "10_11", "10_13", "10_19"
                                        ]   //ODA
                                    }
                                ]
                            }

                        }
                        //, "columns" = SELECT COLUMNS
                    }
                }],

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
                        id: 'item-1',  // TOTAL ODA
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-1",
                        config: {
                            container: "#item-1",
                            adapter: {
                                type: "standard",
                                xDimensions: 'year',
                                yDimensions: 'unitname',
                                valueDimensions: 'value',
                                seriesDimensions: ['sectorcode']
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "line"
                                    },
                                    xAxis : {
                                        type: 'datetime'
                                    },
                                    subtitle: {
                                        text: ''
                                    },
                                    tooltip: {
                                        formatter: function(){
                                            return '<b>' +this.x + ': ' +
                                                this.series.name +  '</b><br/>' +
                                                Highcharts.numberFormat(this.y, 2, '.', ',') + ' USD Mil'
                                        }
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: [ 'donorcode', 'sectorcode', 'purposecode', 'year', 'channelcode'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
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
                                        "donorcode": {
                                            "codes": [
                                                {
                                                    "uid": "crs_donors",
                                                    "version": "2015",
                                                    "codes": [
                                                        "1"  //Austria
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
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "sectorcode", "year"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "SUM"
                                        },
                                        {
                                            "columns": ["unitcode"],
                                            "rule": "FIRST"
                                        },
                                        {
                                            "columns": ["unitname"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "year": "ASC"
                                }
                            }

                        ]
                    },
                    {
                        id: 'item-2', // Total ODA for most financed sectors
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-2",
                        config: {
                            container: "#item-2",
                            adapter: {
                                type: "standard",
                                xDimensions: 'sectorcode',
                                yDimensions: 'unitname',
                                valueDimensions: 'value',
                                seriesDimensions: ['sectorcode']
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                    subtitle: {
                                        text: ''
                                    },
                                    tooltip: {
                                        formatter: function(){
                                            return '<b>' +this.x + ': ' + '</b><br/>' +
                                                Highcharts.numberFormat(this.y, 2, '.', ',') + ' USD Mil'
                                        }
                                    }

                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['donorcode', 'year', 'channelcode'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "donorcode": {
                                            "codes": [
                                                {
                                                    "uid": "crs_donors",
                                                    "version": "2015",
                                                    "codes": [
                                                        "1"  //Austria
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
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "sectorcode"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "SUM"
                                        },
                                        {
                                            "columns": ["unitcode"],
                                            "rule": "FIRST"
                                        },
                                        {
                                            "columns": ["unitname"],
                                            "rule": "FIRST"
                                        }
                                    ]
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
                                    "perPage": 10,  //top 20
                                    "page": 1
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-3', // TOP Channels
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-3",
                        config: {
                            container: "#item-3",
                            adapter: {
                                type: "standard",
                                xDimensions: 'channelcode',
                                yDimensions: 'unitname',
                                valueDimensions: 'value',
                                seriesDimensions: ['channelcode']
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                    subtitle: {
                                        text: ''
                                    },
                                    tooltip: {
                                        formatter: function(){
                                            return '<b>' +this.x + ': ' + '</b><br/>' +
                                                Highcharts.numberFormat(this.y, 2, '.', ',') + ' USD Mil'
                                        }
                                    }

                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['donorcode', 'sectorcode', 'purposecode', 'year', 'channelcode'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
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
                                        "donorcode": {
                                            "codes": [
                                                {
                                                    "uid": "crs_donors",
                                                    "version": "2015",
                                                    "codes": [
                                                        "1"  //Austria
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
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "channelcode"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "SUM"
                                        },
                                        {
                                            "columns": ["unitcode"],
                                            "rule": "FIRST"
                                        },
                                        {
                                            "columns": ["unitname"],
                                            "rule": "FIRST"
                                        }
                                    ]
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
                                    "perPage": 10,  //top 10
                                    "page": 1
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-4',    // Top sub-sectors
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-4",
                        config: {
                            container: "#item-4",
                            adapter: {
                                type: "pie",
                                valueDimensions: 'value',
                                seriesDimensions: ['purposecode']
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
                                    subtitle: {
                                        text: ''
                                    },
                                    title: {
                                        //text: 'Browser market shares January, 2015 to May, 2015'
                                    },
                                    tooltip: {
                                        style: {width: '200px', whiteSpace: 'normal'},
                                        pointFormat: '<b>{point.percentage:.2f}%</b>'
                                    },
                                    legend: {
                                        labelFormatter: function(){return this.name.slice(0, 25)+ '...'}
                                    },
                                    plotOptions: {
                                        pie: {
                                            allowPointSelect: true,
                                            cursor: 'pointer',
                                            dataLabels: {
                                                formatter: function(){
                                                    var words = this.point.name.slice(0, 60)+ '...';

                                                    return words;

                                                },
                                                enabled: true
                                            },
                                            showInLegend: true
                                        }
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['sectorcode', 'purposecode', 'year', 'channelcode'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
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
                                        "donorcode": {
                                            "codes": [
                                                {
                                                    "uid": "crs_donors",
                                                    "version": "2015",
                                                    "codes": [
                                                        "1"  //Austria
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
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "purposecode"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "SUM"
                                        },
                                        {
                                            "columns": ["unitcode"],
                                            "rule": "FIRST"
                                        },
                                        {
                                            "columns": ["unitname"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "value": "DESC"
                                }
                            }
                        ]
                    }

                ]
            }
        },

        "country_donor_sector": {
            download: {
                "target": "6.PROTECTIVE FUNCTIONS AND SELECTIVE ECOSYSTEM SERVICES.zip"
            },

            filter: [
                {
                    "type": "codelist",
                    "containerType": "baseContainer",
                    "title": "Country",
                    "components": [
                        {
                            "uid": "crs_recipients",
                            "version": "2015",
                            "type": "codelist",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},
                            "name": "recipientcode",
                            config: {
                                "defaultsource": [
                                    //{"value": null, "label": "All", "selected": true},
                                ],
                                "defaultcodes": ["238"],  //Ethiopia
                                "onlyValueText": true,
                                "enableMultiselection": false
                            }

                        }
                    ]
                },
                {
                    "type": "codelist",
                    "containerType": "baseContainer",
                    "title": "Donor",
                    "components": [
                        {
                            "uid": "crs_donors",
                            "version": "2015",
                            "type": "codelist",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},
                            "name": "donorcode",
                            config: {
                                "defaultsource": [
                                    //{"value": null, "label": "All", "selected": true},
                                ],
                                "defaultcodes": ["1"],  //Austria
                                "onlyValueText": true,
                                "enableMultiselection": false
                            }

                        }
                    ]
                },
                {
                    "type": "codelist-hierarchy",
                    "containerType": "baseContainer",
                    "title": "Sector",
                    "components": [
                        {
                            "uid": "crs_dac",
                            "version": "2015",
                            "type": "codelist-hierarchy",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},
                            "name": "sectorcode",
                            config: {
                                "defaultsource": [
                                    //{"value": null, "label": "All", "selected": true},
                                ],
                                "defaultcodes": ['600'],
                                "onlyValueText": true,
                                "enableMultiselection": false,
                                "filter": {
                                    "uid": "crs_dac",
                                    "version": "2015",
                                    "level" : 1,
                                    "levels":3
                                }
                            }

                        }
                    ]
                },
                {
                    "type": "codelist-hierarchy",
                    "containerType": "baseContainer",
                    "title": "Sub Sector",
                    "components": [
                        {
                            "uid": "crs_dac",
                            "version": "2015",
                            "type": "codelist-hierarchy",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},
                            "name": "purposecode",
                            config: {
                                "defaultsource": [
                                    //{"value": null, "label": "All", "selected": true},
                                ],
                                "onlyValueText": true,
                                "filter": {
                                    "uid": "crs_dac",
                                    "version": "2015",
                                    "level" : 3,
                                    "levels":3
                                }
                            }
                        }
                    ]
                },
                {
                    "type": "static",
                    "containerType": "baseContainer",
                    "components": [
                        {
                            "type": "range",
                            "name": "year",
                            "componentType": "timeRangeLists-FENIX",
                            "class" : "timeRangeList",
                            "lang": "EN",
                            "title": {"EN": "Year"},
                            "config": {
                                "from" : {
                                    "title":  {"EN": "From"},
                                    "defaultsource": [
                                        {"value": "2000", "label": "2000", "selected": true},
                                        {"value": "2001", "label": "2001", "selected": false},
                                        {"value": "2002", "label": "2002", "selected": false},
                                        {"value": "2003", "label": "2003", "selected": false},
                                        {"value": "2004", "label": "2004", "selected": false},
                                        {"value": "2005", "label": "2005", "selected": false},
                                        {"value": "2006", "label": "2006", "selected": false},
                                        {"value": "2007", "label": "2007", "selected": false},
                                        {"value": "2008", "label": "2008", "selected": false},
                                        {"value": "2009", "label": "2009", "selected": false},
                                        {"value": "2010", "label": "2010", "selected": false},
                                        {"value": "2011", "label": "2011", "selected": false},
                                        {"value": "2012", "label": "2012", "selected": false},
                                        {"value": "2013", "label": "2013", "selected": false}
                                    ]
                                },
                                "to" : {
                                    "title":  {"EN": "To"},
                                    "defaultsource": [
                                        {"value": "2013", "label": "2013", "selected": true},
                                        {"value": "2012", "label": "2012", "selected": false},
                                        {"value": "2011", "label": "2011", "selected": false},
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
                                        {"value": "2000", "label": "2000", "selected": false}
                                    ]
                                }
                            }
                        }
                    ]
                },
                {
                    "type": "codelist-hierarchy",
                    "containerType": "baseContainer",
                    "title": "Channel of Delivery",
                    "components": [
                        {
                            "uid": "crs_channels",
                            "version": "2015",
                            "type": "codelist-hierarchy",
                            "name": "channelcode",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},

                            config: {
                                "defaultsource": [],
                                "onlyValueText": true,
                                "filter": {
                                    "uid": "crs_channels",
                                    "version": "2015",
                                    "level" : 3,
                                    "levels":3
                                }
                            }
                        }
                    ]
                },
                {
                    "type": "codelist",
                    "containerType": "baseContainer",
                    "title": "Official Development Assistance (ODA)",
                    "components": [
                        {
                            "uid": "crs_flow_amounts",
                            "version": "2015",
                            "type": "codelist",
                            "name": "uid",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},
                            config: {
                                "defaultsource": [],
                                "defaultcodes": ['usd_commitment'],
                                "removeFilter": true
                            }
                        }
                    ]
                }
            ],

            dashboard: {
                //data cube's uid
                uid: "adam_usd_commitment",

                //data base filter
                filter: [  {
                    "name": "filter",
                    "parameters": {
                        "rows": {     // ROWS = WHERE
                            "flowcode": {
                                "codes": [
                                    {
                                        "uid": "crs_flow_types",
                                        "version": "2015",
                                        "codes": [ "10_12", "10_11", "10_13", "10_19"
                                        ]   //ODA
                                    }
                                ]
                            }

                        }
                        //, "columns" = SELECT COLUMNS
                    }
                }],

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
                        id: 'item-1',  // TOTAL ODA
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-1",
                        config: {
                            container: "#item-1",
                            adapter: {
                                type: "standard",
                                xDimensions: 'year',
                                yDimensions: 'unitname',
                                valueDimensions: 'value',
                                seriesDimensions: ['sectorcode']
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "line"
                                    },
                                    xAxis : {
                                        type: 'datetime'
                                    },
                                    subtitle: {
                                        text: ''
                                    },
                                    tooltip: {
                                        formatter: function(){
                                            return '<b>' +this.x + ': ' +
                                                this.series.name +  '</b><br/>' +
                                                Highcharts.numberFormat(this.y, 2, '.', ',') + ' USD Mil'
                                        }
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['recipientcode', 'donorcode', 'sectorcode', 'purposecode', 'year', 'channelcode'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
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
                                                        "238"  //Ethiopia
                                                    ]
                                                }
                                            ]
                                        },
                                        "donorcode": {
                                            "codes": [
                                                {
                                                    "uid": "crs_donors",
                                                    "version": "2015",
                                                    "codes": [
                                                        "1"  //Austria
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
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "sectorcode", "year"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "SUM"
                                        },
                                        {
                                            "columns": ["unitcode"],
                                            "rule": "FIRST"
                                        },
                                        {
                                            "columns": ["unitname"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "year": "ASC"
                                }
                            }

                        ]
                    },
                    {
                        id: 'item-2', // Total ODA for most financed sectors
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-2",
                        config: {
                            container: "#item-2",
                            adapter: {
                                type: "standard",
                                xDimensions: 'sectorcode',
                                yDimensions: 'unitname',
                                valueDimensions: 'value',
                                seriesDimensions: ['sectorcode']
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                    subtitle: {
                                        text: ''
                                    },
                                    tooltip: {
                                        formatter: function(){
                                            return '<b>' +this.x + ': ' + '</b><br/>' +
                                                Highcharts.numberFormat(this.y, 2, '.', ',') + ' USD Mil'
                                        }
                                    }

                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['recipientcode', 'donorcode', 'year', 'channelcode'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "recipientcode": {
                                            "codes": [
                                                {
                                                    "uid": "crs_recipients",
                                                    "version": "2015",
                                                    "codes": [
                                                        "238"  //Ethiopia
                                                    ]
                                                }
                                            ]
                                        },
                                        "donorcode": {
                                            "codes": [
                                                {
                                                    "uid": "crs_donors",
                                                    "version": "2015",
                                                    "codes": [
                                                        "1"  //Austria
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
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "sectorcode"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "SUM"
                                        },
                                        {
                                            "columns": ["unitcode"],
                                            "rule": "FIRST"
                                        },
                                        {
                                            "columns": ["unitname"],
                                            "rule": "FIRST"
                                        }
                                    ]
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
                                    "perPage": 10,  //top 20
                                    "page": 1
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-3', // TOP Channels
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-3",
                        config: {
                            container: "#item-3",
                            adapter: {
                                type: "standard",
                                xDimensions: 'channelcode',
                                yDimensions: 'unitname',
                                valueDimensions: 'value',
                                seriesDimensions: ['channelcode']
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                    subtitle: {
                                        text: ''
                                    },
                                    tooltip: {
                                        formatter: function(){
                                            return '<b>' +this.x + ': ' + '</b><br/>' +
                                                Highcharts.numberFormat(this.y, 2, '.', ',') + ' USD Mil'
                                        }
                                    }

                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['recipientcode', 'donorcode', 'sectorcode', 'purposecode', 'year', 'channelcode'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
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
                                                        "238"  //Ethiopia
                                                    ]
                                                }
                                            ]
                                        },
                                        "donorcode": {
                                            "codes": [
                                                {
                                                    "uid": "crs_donors",
                                                    "version": "2015",
                                                    "codes": [
                                                        "1"  //Austria
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
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "channelcode"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "SUM"
                                        },
                                        {
                                            "columns": ["unitcode"],
                                            "rule": "FIRST"
                                        },
                                        {
                                            "columns": ["unitname"],
                                            "rule": "FIRST"
                                        }
                                    ]
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
                                    "perPage": 10,  //top 10
                                    "page": 1
                                }
                            }
                        ]
                    },
                    {
                        id: 'item-4',    // Top sub-sectors
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-4",
                        config: {
                            container: "#item-4",
                            adapter: {
                                type: "pie",
                                valueDimensions: 'value',
                                seriesDimensions: ['purposecode']
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
                                    subtitle: {
                                        text: ''
                                    },
                                    title: {
                                        //text: 'Browser market shares January, 2015 to May, 2015'
                                    },
                                    tooltip: {
                                        style: {width: '200px', whiteSpace: 'normal'},
                                        pointFormat: '<b>{point.percentage:.2f}%</b>'
                                    },
                                    legend: {
                                        labelFormatter: function(){return this.name.slice(0, 25)+ '...'}
                                    },
                                    plotOptions: {
                                        pie: {
                                            allowPointSelect: true,
                                            cursor: 'pointer',
                                            dataLabels: {
                                                formatter: function(){
                                                    var words = this.point.name.slice(0, 60)+ '...';

                                                    return words;

                                                },
                                                enabled: true
                                            },
                                            showInLegend: true
                                        }
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['recipientcode', 'donorcode', 'sectorcode', 'purposecode', 'year', 'channelcode'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
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
                                                        "238"  //Ethiopia
                                                    ]
                                                }
                                            ]
                                        },
                                        "donorcode": {
                                            "codes": [
                                                {
                                                    "uid": "crs_donors",
                                                    "version": "2015",
                                                    "codes": [
                                                        "1"  //Austria
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
                                    }
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "purposecode"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "SUM"
                                        },
                                        {
                                            "columns": ["unitcode"],
                                            "rule": "FIRST"
                                        },
                                        {
                                            "columns": ["unitname"],
                                            "rule": "FIRST"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "value": "DESC"
                                }
                            }
                        ]
                    }

                ]
            }
        }

    }



});