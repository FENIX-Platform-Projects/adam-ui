/*global define*/

define(function () {

    'use strict';

    return {

        "FAOSTAT_QC": {

            filter: [
                {
                    "type": "static",
                    "containerType": "baseContainer",
                    "title": "Year",
                    "components": [
                        {
                            "type": "time",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
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
                    "type": "codelist-codes",
                    "containerType": "baseContainer",
                    "title": "Item",
                    "defaultCodes": ["1717"],
                    "components": [
                        {
                            "type": "codelist-codes",
                            "uid": "FAOSTAT_Items",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            // name is the ID output in tehe filter getValues()
                            "name": "item",
                            "config": {
                                "defaultsource": [ ],
                                filter :  {
                                    "uid": "FLUDE_FAOSTAT_ITEM",
                                    "version": null,
                                    "codes" : ["QC"]
                                }
                            }
                        }
                    ]
                },
                {
                    "type": "codelist-codes",
                    "containerType": "baseContainer",
                    "title": "Elements",
                    "defaultCodes": ["5312"],
                    "components": [
                        {
                            "type": "codelist-codes",
                            "uid": "FAOSTAT_Elements",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            // name is the ID output in the filter getValues()
                            "name": "element",
                            "config": {
                                "defaultsource": [ ],
                                filter :  {
                                    "uid": "FAOSTAT_Elements",
                                    "version": null,
                                    "codes" : ["QC"]
                                }
                            }
                        }
                    ]
                },
                {
                    "type": "codelist",
                    "containerType": "baseContainer",
                    "title": "Country",
                    "defaultCodes": ["33"],
                    "components": [
                        {
                            "type": "codelist",
                            "uid": "FAOSTAT_Countries",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            // name is the ID output in the filter getValues()
                            "name": "country",
                            "config": {
                                "defaultsource": [ ]
                            }
                        }
                    ]
                }
            ],

            dashboard: {
                //data cube's uid
                uid: "FAOSTAT_QC",

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
                        id: 'faostat-QC-1',
                        type: 'map',
                        class: "fx-map-chart",
                        //needed if layout = injected
                        container: "#faostat-QC-1",
                        config: {
                            container: "#faostat-QC-1",
                            leaflet: {
                                zoomControl: false,
                                attributionControl: true,
                                scrollWheelZoom: false,
                                minZoom: 2
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['year', 'element', 'item'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 2013,
                                                    "to": 2013
                                                }
                                            ]
                                        },
                                        "element": {
                                            "codes": [
                                                {
                                                    "uid": "FAOSTAT_Elements",
                                                    "codes": [
                                                        "5312"
                                                    ]
                                                }
                                            ]
                                        },
                                        "item": {
                                            "codes": [
                                                {
                                                    "uid": "FAOSTAT_Items",
                                                    "codes": [
                                                        "1717"
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
                        id: 'faostat-QC-2',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#faostat-QC-2",
                        config: {
                            container: "#faostat-QC-2",
                            adapter: {
                                type: "timeserie",
                                xDimensions: 'time',
                                yDimensions: 'element',
                                valueDimensions: 'value',
                                seriesDimensions: ["element"]
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    subtitle: {
                                        text: 'FAOSTAT Data',
                                        x: -20
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['country', 'item', 'element'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {

                                        "country": {
                                            "codes": [
                                                {
                                                    "uid": "FAOSTAT_Countries",
                                                    "codes": [
                                                        "33"
                                                    ]
                                                }
                                            ]
                                        },
                                        "element": {
                                            "codes": [
                                                {
                                                    "uid": "FAOSTAT_Elements",
                                                    "codes": [
                                                        "5312"
                                                    ]
                                                }
                                            ]
                                        },
                                        "item": {
                                            "codes": [
                                                {
                                                    "uid": "FAOSTAT_Items",
                                                    "codes": [
                                                        "1717"
                                                    ]
                                                }
                                            ]

                                        }
                                }
                                }
                            }


                        ]
                    }




                ]

            }

        },

        "FAOSTAT_QA": {

            filter: [
                {
                    "type": "static",
                    "containerType": "baseContainer",
                    "title": "Year",
                    "components": [
                        {
                            "type": "time",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
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
                    "type": "codelist-codes",
                    "containerType": "baseContainer",
                    "title": "Item",
                    "defaultCodes": ["866"],
                    "components": [
                        {
                            "type": "codelist-codes",
                            "uid": "FAOSTAT_Items",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            // name is the ID output in the filter getValues()
                            "name": "item",
                            "config": {
                                "defaultsource": [ ],
                                filter :  {
                                    "uid": "FLUDE_FAOSTAT_ITEM",
                                    "version": null,
                                    "codes" : ["QA"]
                                }
                            }
                        }
                    ]
                },
                {
                    "type": "codelist-codes",
                    "containerType": "baseContainer",
                    "title": "Elements",
                    "defaultCodes": ["5111"],
                    "components": [
                        {
                            "type": "codelist-codes",
                            "uid": "FAOSTAT_Elements",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            // name is the ID output in the filter getValues()
                            "name": "element",
                            "config": {
                                "defaultsource": [ ],
                                filter :  {
                                    "uid": "FAOSTAT_Elements",
                                    "version": null,
                                    "codes" : ["QA"]
                                }
                            }
                        }
                    ]
                },
                {
                    "type": "codelist",
                    "containerType": "baseContainer",
                    "title": "Country",
                    "defaultCodes": ["33"],
                    "components": [
                        {
                            "type": "codelist",
                            "uid": "FAOSTAT_Countries",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            // name is the ID output in the filter getValues()
                            "name": "country",
                            "config": {
                                "defaultsource": [ ]
                            }
                        }
                    ]
                }
            ],

            dashboard: {
                //data cube's uid
                uid: "FAOSTAT_QA",

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
                        id: 'faostat-QA-1',
                        type: 'map',
                        class: "fx-map-chart",
                        //needed if layout = injected
                        container: "#faostat-QA-1",
                        config: {
                            container: "#faostat-QA-1",
                            leaflet: {
                                zoomControl: false,
                                attributionControl: true,
                                scrollWheelZoom: false,
                                minZoom: 2
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['year', 'element', 'item'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 2013,
                                                    "to": 2013
                                                }
                                            ]
                                        },
                                        "element": {
                                            "codes": [
                                                {
                                                    "uid": "FAOSTAT_Elements",
                                                    "codes": [
                                                        "5111"
                                                    ]
                                                }
                                            ]
                                        },
                                        "item": {
                                            "codes": [
                                                {
                                                    "uid": "FAOSTAT_Items",
                                                    "codes": [
                                                        "866"
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
                        id: 'faostat-QA-2',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#faostat-QA-2",
                        config: {
                            container: "#faostat-QA-2",
                            adapter: {
                                type: "timeserie",
                                xDimensions: 'time',
                                yDimensions: 'element',
                                valueDimensions: 'value',
                                seriesDimensions: ["element"]
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    subtitle: {
                                        text: 'FAOSTAT Data',
                                        x: -20
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['country', 'item', 'element'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {

                                        "country": {
                                            "codes": [
                                                {
                                                    "uid": "FAOSTAT_Countries",
                                                    "codes": [
                                                        "33"
                                                    ]
                                                }
                                            ]
                                        },
                                        "element": {
                                            "codes": [
                                                {
                                                    "uid": "FAOSTAT_Elements",
                                                    "codes": [
                                                        "5111"
                                                    ]
                                                }
                                            ]
                                        },
                                        "item": {
                                            "codes": [
                                                {
                                                    "uid": "FAOSTAT_Items",
                                                    "codes": [
                                                        "866"
                                                    ]
                                                }
                                            ]

                                        }
                                    }
                                }
                            }


                        ]
                    }




                ]

            }

        },

        "FAOSTAT_QL": {

            filter: [
                {
                    "type": "static",
                    "containerType": "baseContainer",
                    "title": "Year",
                    "components": [
                        {
                            "type": "time",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
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
                    "type": "codelist-codes",
                    "containerType": "baseContainer",
                    "title": "Item",
                    "defaultCodes": ["867"],
                    "components": [
                        {
                            "type": "codelist-codes",
                            "uid": "FAOSTAT_Items",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            // name is the ID output in the filter getValues()
                            "name": "item",
                            "config": {
                                "defaultsource": [ ],
                                filter :  {
                                    "uid": "FLUDE_FAOSTAT_ITEM",
                                    "version": null,
                                    "codes" : ["QL"]
                                }
                            }
                        }
                    ]
                },
                {
                    "type": "codelist-codes",
                    "containerType": "baseContainer",
                    "title": "Elements",
                    "defaultCodes": ["5420"],
                    "components": [
                        {
                            "type": "codelist-codes",
                            "uid": "FAOSTAT_Elements",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            // name is the ID output in the filter getValues()
                            "name": "element",
                            "config": {
                                "defaultsource": [ ],
                                filter :  {
                                    "uid": "FAOSTAT_Elements",
                                    "version": null,
                                    "codes" : ["QL"]
                                }
                            }
                        }
                    ]
                },
                {
                    "type": "codelist",
                    "containerType": "baseContainer",
                    "title": "Country",
                    "defaultCodes": ["33"],
                    "components": [
                        {
                            "type": "codelist",
                            "uid": "FAOSTAT_Countries",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            // name is the ID output in the filter getValues()
                            "name": "country",
                            "config": {
                                "defaultsource": [ ]
                            }
                        }
                    ]
                }
            ],

            dashboard: {
                //data cube's uid
                uid: "FAOSTAT_QL",

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
                        id: 'faostat-QL-1',
                        type: 'map',
                        class: "fx-map-chart",
                        //needed if layout = injected
                        container: "#faostat-QL-1",
                        config: {
                            container: "#faostat-QL-1",
                            leaflet: {
                                zoomControl: false,
                                attributionControl: true,
                                scrollWheelZoom: false,
                                minZoom: 2
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['year', 'element', 'item'],
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
                                        "element": {
                                            "codes": [
                                                {
                                                    "uid": "FAOSTAT_Elements",
                                                    "codes": [
                                                        "5420"
                                                    ]
                                                }
                                            ]
                                        },
                                        "item": {
                                            "codes": [
                                                {
                                                    "uid": "FAOSTAT_Items",
                                                    "codes": [
                                                        "867"
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
                        id: 'faostat-QL-2',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#faostat-QL-2",
                        config: {
                            container: "#faostat-QL-2",
                            adapter: {
                                type: "timeserie",
                                xDimensions: 'time',
                                yDimensions: 'element',
                                valueDimensions: 'value',
                                seriesDimensions: ["element"]
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    subtitle: {
                                        text: 'FAOSTAT Data',
                                        x: -20
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['country', 'item', 'element'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {

                                        "country": {
                                            "codes": [
                                                {
                                                    "uid": "FAOSTAT_Countries",
                                                    "codes": [
                                                        "33"
                                                    ]
                                                }
                                            ]
                                        },
                                        "element": {
                                            "codes": [
                                                {
                                                    "uid": "FAOSTAT_Elements",
                                                    "codes": [
                                                        "5420"
                                                    ]
                                                }
                                            ]
                                        },
                                        "item": {
                                            "codes": [
                                                {
                                                    "uid": "FAOSTAT_Items",
                                                    "codes": [
                                                        "867"
                                                    ]
                                                }
                                            ]

                                        }
                                    }
                                }
                            }


                        ]
                    }




                ]

            }

        },

        "FAOSTAT_OA": {

            filter: [
                {
                    "type": "static",
                    "containerType": "baseContainer",
                    "title": "Year",
                    "components": [
                        {
                            "type": "time",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
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
                    "type": "codelist-codes",
                    "containerType": "baseContainer",
                    "title": "Item",
                    "defaultCodes": ["3010"],
                    "components": [
                        {
                            "type": "codelist-codes",
                            "uid": "FAOSTAT_Items",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            // name is the ID output in the filter getValues()
                            "name": "item",
                            "config": {
                                "defaultsource": [ ],
                                filter :  {
                                    "uid": "FLUDE_FAOSTAT_ITEM",
                                    "version": null,
                                    "codes" : ["OA"]
                                }
                            }
                        }
                    ]
                },
                {
                    "type": "codelist-codes",
                    "containerType": "baseContainer",
                    "title": "Elements",
                    "defaultCodes": ["511"],
                    "components": [
                        {
                            "type": "codelist-codes",
                            "uid": "FAOSTAT_Elements",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            // name is the ID output in the filter getValues()
                            "name": "element",
                            "config": {
                                "defaultsource": [ ],
                                filter :  {
                                    "uid": "FAOSTAT_Elements",
                                    "version": null,
                                    "codes" : ["OA"]
                                }
                            }
                        }
                    ]
                },
                {
                    "type": "codelist",
                    "containerType": "baseContainer",
                    "title": "Country",
                    "defaultCodes": ["33"],
                    "components": [
                        {
                            "type": "codelist",
                            "uid": "FAOSTAT_Countries",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            // name is the ID output in the filter getValues()
                            "name": "country",
                            "config": {
                                "defaultsource": [ ]
                            }
                        }
                    ]
                }
            ],

            dashboard: {
                //data cube's uid
                uid: "FAOSTAT_OA",

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
                        id: 'faostat-OA-1',
                        type: 'map',
                        class: "fx-map-chart",
                        //needed if layout = injected
                        container: "#faostat-OA-1",
                        config: {
                            container: "#faostat-OA-1",
                            leaflet: {
                                zoomControl: false,
                                attributionControl: true,
                                scrollWheelZoom: false,
                                minZoom: 2
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['year', 'element', 'item'],
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
                                        "element": {
                                            "codes": [
                                                {
                                                    "uid": "FAOSTAT_Elements",
                                                    "codes": [
                                                        "511"
                                                    ]
                                                }
                                            ]
                                        },
                                        "item": {
                                            "codes": [
                                                {
                                                    "uid": "FAOSTAT_Items",
                                                    "codes": [
                                                        "3010"
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
                        id: 'faostat-OA-2',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#faostat-OA-2",
                        config: {
                            container: "#faostat-OA-2",
                            adapter: {
                                type: "timeserie",
                                xDimensions: 'time',
                                yDimensions: 'element',
                                valueDimensions: 'value',
                                seriesDimensions: ["element"]
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                subtitle: {
                                    text: 'FAOSTAT Data',
                                    x: -20
                                }
                            }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['country', 'item', 'element'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {

                                        "country": {
                                            "codes": [
                                                {
                                                    "uid": "FAOSTAT_Countries",
                                                    "codes": [
                                                        "33"
                                                    ]
                                                }
                                            ]
                                        },
                                        "element": {
                                            "codes": [
                                                {
                                                    "uid": "FAOSTAT_Elements",
                                                    "codes": [
                                                        "511"
                                                    ]
                                                }
                                            ]
                                        },
                                        "item": {
                                            "codes": [
                                                {
                                                    "uid": "FAOSTAT_Items",
                                                    "codes": [
                                                        "3010"
                                                    ]
                                                }
                                            ]

                                        }
                                    }
                                }
                            }


                        ]
                    }




                ]

            }

        },

        "FAOSTAT_FO": {

            filter: [
                {
                    "type": "static",
                    "containerType": "baseContainer",
                    "title": "Year",
                    "components": [
                        {
                            "type": "time",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
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
                    "type": "codelist-codes",
                    "containerType": "baseContainer",
                    "title": "Item",
                    "defaultCodes": ["1865"],
                    "components": [
                        {
                            "type": "codelist-codes",
                            "uid": "FAOSTAT_Items",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            // name is the ID output in the filter getValues()
                            "name": "item",
                            "config": {
                                "defaultsource": [ ],
                                filter :  {
                                    "uid": "FLUDE_FAOSTAT_ITEM",
                                    "version": null,
                                    "codes" : ["FO"]
                                }
                            }
                        }
                    ]
                },
                {
                    "type": "codelist-codes",
                    "containerType": "baseContainer",
                    "title": "Elements",
                    "defaultCodes": ["5916"],
                    "components": [
                        {
                            "type": "codelist-codes",
                            "uid": "FAOSTAT_Elements",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            // name is the ID output in the filter getValues()
                            "name": "element",
                            "config": {
                                "defaultsource": [ ],
                                filter :  {
                                    "uid": "FAOSTAT_Elements",
                                    "version": null,
                                    "codes" : ["FO"]
                                }
                            }
                        }
                    ]
                },
                {
                    "type": "codelist",
                    "containerType": "baseContainer",
                    "title": "Country",
                    "defaultCodes": ["33"],
                    "components": [
                        {
                            "type": "codelist",
                            "uid": "FAOSTAT_Countries",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            // name is the ID output in the filter getValues()
                            "name": "country",
                            "config": {
                                "defaultsource": [ ]
                            }
                        }
                    ]
                }
            ],

            dashboard: {
                //data cube's uid
                uid: "FAOSTAT_FO",

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
                        id: 'faostat-FO-1',
                        type: 'map',
                        class: "fx-map-chart",
                        //needed if layout = injected
                        container: "#faostat-FO-1",
                        config: {
                            container: "#faostat-FO-1",
                            leaflet: {
                                zoomControl: false,
                                attributionControl: true,
                                scrollWheelZoom: false,
                                minZoom: 2
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['year', 'element', 'item'],
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
                                        "element": {
                                            "codes": [
                                                {
                                                    "uid": "FAOSTAT_Elements",
                                                    "codes": [
                                                        "5916"
                                                    ]
                                                }
                                            ]
                                        },
                                        "item": {
                                            "codes": [
                                                {
                                                    "uid": "FAOSTAT_Items",
                                                    "codes": [
                                                        "1865"
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
                        id: 'faostat-FO-2',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#faostat-FO-2",
                        config: {
                            container: "#faostat-FO-2",
                            adapter: {
                                type: "timeserie",
                                xDimensions: 'time',
                                yDimensions: 'element',
                                valueDimensions: 'value',
                                seriesDimensions: ["element"]
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    subtitle: {
                                        text: 'FAOSTAT Data',
                                        x: -20
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['country', 'item', 'element'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {

                                        "country": {
                                            "codes": [
                                                {
                                                    "uid": "FAOSTAT_Countries",
                                                    "codes": [
                                                        "33"
                                                    ]
                                                }
                                            ]
                                        },
                                        "element": {
                                            "codes": [
                                                {
                                                    "uid": "FAOSTAT_Elements",
                                                    "codes": [
                                                        "5916"
                                                    ]
                                                }
                                            ]
                                        },
                                        "item": {
                                            "codes": [
                                                {
                                                    "uid": "FAOSTAT_Items",
                                                    "codes": [
                                                        "1865"
                                                    ]
                                                }
                                            ]

                                        }
                                    }
                                }
                            }


                        ]
                    }




                ]

            }

        },

        "FAOSTAT_GT": {

            filter: [
                {
                    "type": "static",
                    "containerType": "baseContainer",
                    "title": "Year",
                    "components": [
                        {
                            "type": "time",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
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
                    "type": "codelist-codes",
                    "containerType": "baseContainer",
                    "title": "Item",
                    "defaultCodes": ["5058"],
                    "components": [
                        {
                            "type": "codelist-codes",
                            "uid": "FAOSTAT_Items",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            // name is the ID output in the filter getValues()
                            "name": "item",
                            "config": {
                                "defaultsource": [ ],
                                filter :  {
                                    "uid": "FLUDE_FAOSTAT_ITEM",
                                    "version": null,
                                    "codes" : ["GT"]
                                }
                            }
                        }
                    ]
                },
                {
                    "type": "codelist-codes",
                    "containerType": "baseContainer",
                    "title": "Elements",
                    "defaultCodes": ["7231"],
                    "components": [
                        {
                            "type": "codelist-codes",
                            "uid": "FAOSTAT_Elements",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            // name is the ID output in the filter getValues()
                            "name": "element",
                            "config": {
                                "defaultsource": [ ],
                                filter :  {
                                    "uid": "FAOSTAT_Elements",
                                    "version": null,
                                    "codes" : ["GT"]
                                }
                            }
                        }
                    ]
                },
                {
                    "type": "codelist",
                    "containerType": "baseContainer",
                    "title": "Country",
                    "defaultCodes": ["33"],
                    "components": [
                        {
                            "type": "codelist",
                            "uid": "FAOSTAT_Countries",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            // name is the ID output in the filter getValues()
                            "name": "country",
                            "config": {
                                "defaultsource": [ ]
                            }
                        }
                    ]
                }
            ],

            dashboard: {
                //data cube's uid
                uid: "FAOSTAT_GT",

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
                        id: 'faostat-FO-1',
                        type: 'map',
                        class: "fx-map-chart",
                        //needed if layout = injected
                        container: "#faostat-GT-1",
                        config: {
                            container: "#faostat-GT-1",
                            leaflet: {
                                zoomControl: false,
                                attributionControl: true,
                                scrollWheelZoom: false,
                                minZoom: 2
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['year', 'element', 'item'],
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
                                        "element": {
                                            "codes": [
                                                {
                                                    "uid": "FAOSTAT_Elements",
                                                    "codes": [
                                                        "7231"
                                                    ]
                                                }
                                            ]
                                        },
                                        "item": {
                                            "codes": [
                                                {
                                                    "uid": "FAOSTAT_Items",
                                                    "codes": [
                                                        "5058"
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
                        id: 'faostat-GT-2',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#faostat-GT-2",
                        config: {
                            container: "#faostat-GT-2",
                            adapter: {
                                type: "timeserie",
                                xDimensions: 'time',
                                yDimensions: 'element',
                                valueDimensions: 'value',
                                seriesDimensions: ["element"]
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    subtitle: {
                                        text: 'FAOSTAT Data',
                                        x: -20
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['country', 'item', 'element'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {

                                        "country": {
                                            "codes": [
                                                {
                                                    "uid": "FAOSTAT_Countries",
                                                    "codes": [
                                                        "33"
                                                    ]
                                                }
                                            ]
                                        },
                                        "element": {
                                            "codes": [
                                                {
                                                    "uid": "FAOSTAT_Elements",
                                                    "codes": [
                                                        "7231"
                                                    ]
                                                }
                                            ]
                                        },
                                        "item": {
                                            "codes": [
                                                {
                                                    "uid": "FAOSTAT_Items",
                                                    "codes": [
                                                        "5058"
                                                    ]
                                                }
                                            ]

                                        }
                                    }
                                }
                            }


                        ]
                    }




                ]

            }

        },


        "FAOSTAT_GL": {

            filter: [
                {
                    "type": "static",
                    "containerType": "baseContainer",
                    "title": "Year",
                    "components": [
                        {
                            "type": "time",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
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
                    "type": "codelist-codes",
                    "containerType": "baseContainer",
                    "title": "Item",
                    "defaultCodes": ["5069"],
                    "components": [
                        {
                            "type": "codelist-codes",
                            "uid": "FAOSTAT_Items",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            // name is the ID output in the filter getValues()
                            "name": "item",
                            "config": {
                                "defaultsource": [ ],
                                filter :  {
                                    "uid": "FLUDE_FAOSTAT_ITEM",
                                    "version": null,
                                    "codes" : ["GL"]
                                }
                            }
                        }
                    ]
                },
                {
                    "type": "codelist-codes",
                    "containerType": "baseContainer",
                    "title": "Elements",
                    "defaultCodes": ["7244"],
                    "components": [
                        {
                            "type": "codelist-codes",
                            "uid": "FAOSTAT_Elements",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            // name is the ID output in the filter getValues()
                            "name": "element",
                            "config": {
                                "defaultsource": [ ],
                                filter :  {
                                    "uid": "FAOSTAT_Elements",
                                    "version": null,
                                    "codes" : ["GL"]
                                }
                            }
                        }
                    ]
                },
                {
                    "type": "codelist",
                    "containerType": "baseContainer",
                    "title": "Country",
                    "defaultCodes": ["33"],
                    "components": [
                        {
                            "type": "codelist",
                            "uid": "FAOSTAT_Countries",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            // name is the ID output in the filter getValues()
                            "name": "country",
                            "config": {
                                "defaultsource": [ ]
                            }
                        }
                    ]
                }
            ],

            dashboard: {
                //data cube's uid
                uid: "FAOSTAT_GL",

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
                        id: 'faostat-GL-1',
                        type: 'map',
                        class: "fx-map-chart",
                        //needed if layout = injected
                        container: "#faostat-GL-1",
                        config: {
                            container: "#faostat-GL-1",
                            leaflet: {
                                zoomControl: false,
                                attributionControl: true,
                                scrollWheelZoom: false,
                                minZoom: 2
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['year', 'element', 'item'],
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
                                        "element": {
                                            "codes": [
                                                {
                                                    "uid": "FAOSTAT_Elements",
                                                    "codes": [
                                                        "7244"
                                                    ]
                                                }
                                            ]
                                        },
                                        "item": {
                                            "codes": [
                                                {
                                                    "uid": "FAOSTAT_Items",
                                                    "codes": [
                                                        "5069"
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
                        id: 'faostat-GL-2',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#faostat-GL-2",
                        config: {
                            container: "#faostat-GL-2",
                            adapter: {
                                type: "timeserie",
                                xDimensions: 'time',
                                yDimensions: 'element',
                                valueDimensions: 'value',
                                seriesDimensions: ["element"]
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    subtitle: {
                                        text: 'FAOSTAT Data',
                                        x: -20
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['country', 'item', 'element'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {

                                        "country": {
                                            "codes": [
                                                {
                                                    "uid": "FAOSTAT_Countries",
                                                    "codes": [
                                                        "33"
                                                    ]
                                                }
                                            ]
                                        },
                                        "element": {
                                            "codes": [
                                                {
                                                    "uid": "FAOSTAT_Elements",
                                                    "codes": [
                                                        "7244"
                                                    ]
                                                }
                                            ]
                                        },
                                        "item": {
                                            "codes": [
                                                {
                                                    "uid": "FAOSTAT_Items",
                                                    "codes": [
                                                        "5069"
                                                    ]
                                                }
                                            ]

                                        }
                                    }
                                }
                            }


                        ]
                    }




                ]

            }

        },




        "FAOSTAT_RL": {

            filter: [
                {
                    "type": "static",
                    "containerType": "baseContainer",
                    "title": "Year",
                    "components": [
                        {
                            "type": "time",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "name": "year",
                            config: {
                                "defaultsource": [
                                    {"value": "2012", "label": "2012", "selected": true},
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
                    "type": "codelist-codes",
                    "containerType": "baseContainer",
                    "title": "Item",
                    "defaultCodes": ["6610"],
                    "components": [
                        {
                            "type": "codelist-codes",
                            "uid": "FAOSTAT_Items",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            // name is the ID output in tehe filter getValues()
                            "name": "item",
                            "config": {
                                "defaultsource": [ ],
                                filter :  {
                                    "uid": "FLUDE_FAOSTAT_ITEM",
                                    "version": null,
                                    "codes" : ["RL"]
                                }
                            }
                        }
                    ]
                },
                {
                    "type": "codelist-codes",
                    "containerType": "baseContainer",
                    "title": "Elements",
                    "defaultCodes": ["5110"],
                    "components": [
                        {
                            "type": "codelist-codes",
                            "uid": "FAOSTAT_Elements",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            // name is the ID output in the filter getValues()
                            "name": "element",
                            "config": {
                                "defaultsource": [ ],
                                filter :  {
                                    "uid": "FAOSTAT_Elements",
                                    "version": null,
                                    "codes" : ["RL"]
                                }
                            }
                        }
                    ]
                },
                {
                    "type": "codelist",
                    "containerType": "baseContainer",
                    "title": "Country",
                    "defaultCodes": ["33"],
                    "components": [
                        {
                            "type": "codelist",
                            "uid": "FAOSTAT_Countries",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            // name is the ID output in the filter getValues()
                            "name": "country",
                            "config": {
                                "defaultsource": [ ]
                            }
                        }
                    ]
                }
            ],

            dashboard: {
                //data cube's uid
                uid: "FAOSTAT_RL",

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
                        id: 'faostat-RL-1',
                        type: 'map',
                        class: "fx-map-chart",
                        //needed if layout = injected
                        container: "#faostat-RL-1",
                        config: {
                            container: "#faostat-RL-1",
                            leaflet: {
                                zoomControl: false,
                                attributionControl: true,
                                scrollWheelZoom: false,
                                minZoom: 2
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['year', 'element', 'item'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 2012,
                                                    "to": 2012
                                                }
                                            ]
                                        },
                                        "element": {
                                            "codes": [
                                                {
                                                    "uid": "FAOSTAT_Elements",
                                                    "codes": [
                                                        "5110"
                                                    ]
                                                }
                                            ]
                                        },
                                        "item": {
                                            "codes": [
                                                {
                                                    "uid": "FAOSTAT_Items",
                                                    "codes": [
                                                        "6610"
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
                        id: 'faostat-RL-2',
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#faostat-RL-2",
                        config: {
                            container: "#faostat-RL-2",
                            adapter: {
                                type: "timeserie",
                                xDimensions: 'time',
                                yDimensions: 'element',
                                valueDimensions: 'value',
                                seriesDimensions: ["element"]
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    subtitle: {
                                        text: 'FAOSTAT Data',
                                        x: -20
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['country', 'item', 'element'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {

                                        "country": {
                                            "codes": [
                                                {
                                                    "uid": "FAOSTAT_Countries",
                                                    "codes": [
                                                        "33"
                                                    ]
                                                }
                                            ]
                                        },
                                        "element": {
                                            "codes": [
                                                {
                                                    "uid": "FAOSTAT_Elements",
                                                    "codes": [
                                                        "5110"
                                                    ]
                                                }
                                            ]
                                        },
                                        "item": {
                                            "codes": [
                                                {
                                                    "uid": "FAOSTAT_Items",
                                                    "codes": [
                                                        "6610"
                                                    ]
                                                }
                                            ]

                                        }
                                    }
                                }
                            }


                        ]
                    }




                ]

            }

        }



    }
});
