/*global define*/

define(function () {

    'use strict';

    return {
        id: 'OTHER_SECTORS',
        filter: {
            recipientcode: {
                selector: {
                    id: "dropdown",
                    default: ["625"],
                    config: { //Selectize configuration
                        maxItems: 1
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
            parentsector_code: {
                selector: {
                    id: "dropdown",
                    emptyOption : {
                        enabled: true,
                        text: "All",
                        value: "all"
                    },
                    config: { //Selectize configuration
                        maxItems: 1
                        // placeholder: "All",
                        // plugins: ['remove_button'],
                        // mode: 'multi'
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
                    emptyOption : {
                        enabled: true,
                        text: "All",
                        value: "all"
                    },
                    config: { //Selectize configuration
                        maxItems: 1
                        // placeholder: "All",
                        // plugins: ['remove_button'],
                        // mode: 'multi'
                    }
                },
                className: "col-sm-4",
                cl: {
                   // codes: ["60010", "60020", "60030", "60040", "60061", "60062", "60063"],
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
                    "parentsector_code": {id: "parent", event: "select"} //obj or array of obj
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
                            }
                        }
                    },

                    filterFor: {
                        "filter_total_ODA": ['recipientcode', 'year', 'oda']
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
                                    "recipientcode": {
                                        "codes": [
                                            {
                                                "uid": "crs_recipients",
                                                "version": "2016",
                                                "codes": [
                                                    "625"
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
                            "rid":{"uid":"filter_total_ODA"}
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
                                "value": "ODA"
                            }
                        }
                    ]
                },
                {
                    id: "tot-oda-sector", //ref [data-item=':id']
                    type: "chart", //chart || map || olap,
                    config: {
                        type: "line",
                        x: ["year"], //x axis
                        series: ["indicator"], // series
                        y: ["value"],//Y dimension
                        aggregationFn: {"value": "sum"},
                        useDimensionLabelsIfExist: false,// || default raw else fenixtool

                        config: {
                            chart: {
                                events: {
                                    load: function(event) {
                                        var _that = this;
                                        var hasSubSector = false;

                                        var isVisible = $.each(_that.series, function (i, serie) {
                                            if(serie.name == '% Sector/Total'){
                                                serie.update({
                                                    yAxis: 'subsector-axis',
                                                    dashStyle: 'shortdot',
                                                    marker: {
                                                        radius: 3
                                                    }
                                                });

                                                return true;
                                            }
                                        });

                                        if(!isVisible){
                                            this.options.yAxis[1].title.text = '';
                                            this.yAxis[1].visible = false;
                                            this.yAxis[1].isDirty = true;
                                            this.redraw();
                                        } else {
                                            this.options.yAxis[1].title.text= '%';
                                            this.yAxis[1].visible = true;
                                            this.yAxis[1].isDirty = true;
                                            this.redraw();
                                        }

                                    }
                                }
                            },
                            xAxis: {
                                type: 'datetime'
                            },
                            yAxis: [{ //Primary Axis in default template
                            }, { // Secondary Axis
                                id: 'subsector-axis',
                                gridLineWidth: 0,
                                title: {
                                    text: '%'
                                },
                                opposite: true
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
                        "filter_total_country_ODA": ['recipientcode', 'year', 'oda'],
                        "filter_total_sector_country_oda": ['recipientcode', 'parentsector_code', 'year', 'oda']
                    },

                    postProcess: [
                        {
                            "name": "union",
                            "sid": [
                                {
                                    "uid": "total_country_oda" // RESULT OF PART 1: TOTAL ODA FOR THE COUNTRY
                                },
                                {
                                    "uid": "total_sector_country_oda" // RESULT OF PART 2: TOTAL ODA FOR SECTOR IN COUNTRY
                                },
                                {
                                    "uid":"percentage_ODA" // RESULT OF PART 3: PERCENTAGE CALCULATION (TOTAL ODA FOR SECTOR IN COUNTRY / TOTAL ODA FOR COUNTRY  x 100)
                                }

                            ],
                            "parameters": {
                            },
                            "rid":{"uid":"union_process"}

                        },  // PART 4: UNION is the FINAL PART IN THE PROCESS
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
                                    "recipientcode": {
                                        "codes": [
                                            {
                                                "uid": "crs_recipients",
                                                "version": "2016",
                                                "codes": [
                                                    "625"
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
                            "rid":{"uid":"filter_total_country_ODA"}
                        }, // PART 1: TOTAL ODA FOR THE COUNTRY: (1i) Filter
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
                            },
                            "rid":{"uid":"total_ODA"}

                        }, // (1ii): TOTAL ODA FOR THE COUNTRY: Group by
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
                                "value": "Total ODA in the Country" // PART 1 FINAL INDICATOR NAME
                            },
                            "rid": {
                                "uid": "total_country_oda"
                            }
                        }, // (1iii): TOTAL ODA FOR THE COUNTRY: Add Column
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
                                    "parentsector_code": {
                                        "codes": [
                                            {
                                                "uid": "crs_dac",
                                                "version": "2016",
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
                                                "version": "2016",
                                                "codes": [
                                                    "625"
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
                            "rid":{"uid":"filter_total_sector_country_oda"}

                        }, // PART 2: TOTAL ODA for SECTOR in COUNTRY: (2i) Filter
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

                        }, // (2ii): TOTAL ODA for SECTOR in COUNTRY: Group by
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
                                "value": "ODA in the Sector for the Country" // PART 2 FINAL INDICATOR NAME
                            },
                            "rid":{"uid":"total_sector_country_oda"}
                        }, // (2iii): TOTAL ODA for SECTOR in COUNTRY: Add Column
                        {
                            "name": "join",
                            "sid": [
                                {
                                    "uid": "total_country_oda"
                                },
                                {
                                    "uid": "total_sector_country_oda"
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
                            "rid":{"uid":"join_process"}
                        }, // PART 3 PERCENTAGE CALCULATION: (3i) Join
                        {
                            "name": "addcolumn",
                            "sid":[{"uid":"join_process"}],
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
                                    "keys":  ["1 = 1"],
                                    "values":[" ( total_sector_country_oda_value / total_country_oda_value )*100"]

                                }
                            },
                            "rid": {
                                "uid": "percentage_Value"
                            }
                        }, // (3ii) PERCENTAGE CALCULATION: Add Column
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
                        }, // (3iii) PERCENTAGE CALCULATION: filter (filter out what is not needed)
                        {
                            "name": "addcolumn",
                            "parameters": {
                                "column": {
                                    "id": "unitcode",
                                    "title": {
                                        "EN": "Measurement Unit"
                                    },
                                    "domain": {
                                        "codes": [{
                                            "idCodeList": "crs_units",
                                            "version": "2016",
                                            "level": 1
                                        }]
                                    },
                                    "dataType": "code",
                                    "subject": "um"
                                },
                                "value": "% SECTOR/TOTAL"
                            }
                        }, // (3iv) PERCENTAGE CALCULATION: Add Column (Measurement Unit Code)
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
                                "value": "% Sector/Total" // PART 3 FINAL INDICATOR NAME
                            },
                            "rid": {
                                "uid": "percentage_ODA"
                            }
                        } // (3vi) PERCENTAGE CALCULATION: Add Column
                    ]
                },
                 {
                    id: "tot-oda-subsector", //ref [data-item=':id']
                    type: "chart", //chart || map || olap,
                    config: {
                        type: "line",
                        x: ["year"], //x axis
                        series: ["indicator"], // series
                        y: ["value"],//Y dimension
                        aggregationFn: {"value": "sum"},
                        useDimensionLabelsIfExist: false,// || default raw else fenixtool

                        config: {
                            chart: {
                                events: {
                                    load: function(event) {
                                        var _that = this;
                                        var hasSubSector = false;

                                        var isVisible = $.each(_that.series, function (i, serie) {
                                            if(serie.name == '% Sub Sector/Sector'){
                                                serie.update({
                                                    yAxis: 'subsector-axis',
                                                    dashStyle: 'shortdot',
                                                    marker: {
                                                        radius: 3
                                                    }
                                                });

                                                return true;
                                            }
                                        });

                                        if(!isVisible){
                                            this.options.yAxis[1].title.text = '';
                                            this.yAxis[1].visible = false;
                                            this.yAxis[1].isDirty = true;
                                            this.redraw();
                                        } else {
                                            this.options.yAxis[1].title.text= '%';
                                            this.yAxis[1].visible = true;
                                            this.yAxis[1].isDirty = true;
                                            this.redraw();
                                        }

                                    }
                                }
                            },
                            xAxis: {
                                type: 'datetime'
                            },
                            yAxis: [{ //Primary Axis in default template
                            }, { // Secondary Axis
                                id: 'subsector-axis',
                                gridLineWidth: 0,
                                title: {
                                    text: '%'
                                },
                                opposite: true
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

                    //filterFor: ['un_region_code', 'parentsector_code', 'purposecode', 'year', 'oda'],

                    filterFor: {
                        "filter_total_country_sector_oda": ['recipientcode', 'parentsector_code', 'year', 'oda'],
                        "filter_total_country_subsector_oda": ['recipientcode', 'parentsector_code', 'purposecode', 'year', 'oda'],
                    },
                    postProcess:[
                        {
                            "name": "union",
                            "sid": [
                                {
                                    "uid": "total_country_sector_oda" // RESULT OF PART 1: TOTAL ODA FOR SECTOR IN COUNTRY
                                },
                                {
                                    "uid": "total_country_subsector_oda" // RESULT OF PART 2: TOTAL ODA FOR SUB SECTOR IN COUNTRY
                                },
                                {
                                    "uid":"percentage_ODA" // RESULT OF PART 3: PERCENTAGE CALCULATION (TOTAL ODA FOR SECTOR IN COUNTRY / TOTAL ODA FOR COUNTRY  x 100)
                                }

                            ],
                            "parameters": {
                            },
                            "rid":{"uid":"union_process"}

                        },  // PART 4: UNION is the FINAL PART IN THE PROCESS
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
                                    "recipientcode": {
                                        "codes": [
                                            {
                                                "uid": "crs_recipients",
                                                "version": "2016",
                                                "codes": [
                                                    "625"
                                                ]
                                            }
                                        ]
                                    },
                                    "parentsector_code": {
                                        "codes": [
                                            {
                                                "uid": "crs_dac",
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
                            "rid":
                            {"uid":"filter_total_country_sector_oda"}
                        }, // PART 1: TOTAL ODA FOR THE SECTOR IN COUNTRY: (1i) Filter
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
                        }, // (1ii): TOTAL ODA FOR THE SECTOR IN COUNTRY: Group by
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
                                "value": "ODA in the Sector for the Country" // PART 1 FINAL INDICATOR NAME
                            },
                            "rid": {
                                "uid": "total_country_sector_oda"
                            }
                        }, // (1iii): TOTAL ODA FOR THE SECTOR IN COUNTRY: Add Column
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
                                    "parentsector_code": {
                                        "codes": [
                                            {
                                                "uid": "crs_dac",
                                                "version": "2016",
                                                "codes": [
                                                    "600"
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
                                                    "60020"
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
                                                    "625"
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
                            "rid":{"uid":"filter_total_country_subsector_oda"}

                        }, // PART 2: TOTAL ODA for SUBSECTOR in COUNTRY: (2i) Filter
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

                        }, // (2ii): TOTAL ODA for SUBSECTOR in COUNTRY: Group by
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
                                "value": "ODA in the Sub Sector for the Country" // PART 2 FINAL INDICATOR NAME
                            },
                            "rid":{"uid":"total_country_subsector_oda"}
                        }, // (2iii): TOTAL ODA for SUB SECTOR in COUNTRY: Add Column
                        {
                            "name": "join",
                            "sid": [
                                {
                                    "uid": "total_country_sector_oda"
                                },
                                {
                                    "uid": "total_country_subsector_oda"
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
                            "rid":{"uid":"join_process"}
                        }, // PART 3 PERCENTAGE CALCULATION: (3i) Join
                        {
                            "name": "addcolumn",
                            "sid":[{"uid":"join_process"}],
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
                                    "keys":  ["1 = 1"],
                                    "values":[" ( total_country_subsector_oda_value / total_country_sector_oda_value )*100"]

                                }
                            },
                            "rid": {
                                "uid": "percentage_Value"
                            }
                        }, // (3ii) PERCENTAGE CALCULATION: Add Column
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
                        }, // (3iii) PERCENTAGE CALCULATION: filter (filter out what is not needed)
                        {
                            "name": "addcolumn",
                            "parameters": {
                                "column": {
                                    "id": "unitcode",
                                    "title": {
                                        "EN": "Measurement Unit"
                                    },
                                    "domain": {
                                        "codes": [{
                                            "idCodeList": "crs_units",
                                            "version": "2016",
                                            "level": 1
                                        }]
                                    },
                                    "dataType": "code",
                                    "subject": "um"
                                },
                                "value": "percentage"
                            }
                        }, // (3iv) PERCENTAGE CALCULATION: Add Column (Measurement Unit Code)
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
                                "value": "% Sub Sector/Sector" // PART 3 FINAL INDICATOR NAME
                            },
                            "rid": {
                                "uid": "percentage_ODA"
                            }
                        } // (3vi) PERCENTAGE CALCULATION: Add Column
                    ]
                },
                 {
                    id: 'top-partners', // TOP DONORS
                    type: 'chart',
                    config: {
                        type: "column",
                        x: ["donorcode_EN"], //x axis
                        series: ["flowcategory_code_EN"], // series
                        y: ["value"],//Y dimension
                        aggregationFn: {"value": "sum"},
                        useDimensionLabelsIfExist: false,// || default raw else fenixtool
                        config: {
                            colors: ['#008080'],
                            legend: {
                                title: {
                                    text: null
                                }
                            },
                            plotOptions: {
                                column: {
                                    events: {
                                        legendItemClick: function () {
                                            return false;
                                        }
                                    }
                                },
                                allowPointSelect: false
                            }
                        }

                    },

                     filterFor: {
                         "filter_donor": ['recipientcode', 'parentsector_code', 'year', 'oda']
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
                                 "rows": {
                                     "recipientcode": {
                                         "codes": [
                                             {
                                                 "uid": "crs_recipients",
                                                 "version": "2016",
                                                 "codes": [
                                                     "625"
                                                 ]
                                             }
                                         ]
                                     },
                                     "year": {
                                         "time": [
                                             {
                                                 "from": "2000",
                                                 "to": "2014"
                                             }
                                         ]
                                     },
                                     "oda":{
                                         "enumeration":[
                                             "usd_commitment"
                                         ]
                                     }
                                 }
                             },
                             "rid":{"uid":"filter_donor"}
                         },
                         {
                             "name": "group",
                             "parameters": {
                                 "by": [
                                     "donorcode"
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
                                     },
                                     {
                                         "columns": [
                                             "flowcategory_code"
                                         ],
                                         "rule": "first"
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
                                 "perPage": 10,
                                 "page": 1
                             }
                         }

                     ]


                   /* postProcess: [
                        {
                            "name": "group",
                            "parameters": {
                                "by": [
                                    "donorname"
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
                                        "columns": ["flowcategory_name"],
                                        "rule": "first"
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
                        }]*/
                },
                {
                    id: 'top-partners-others', // TOP DONORS Vs OTHER DONORS
                    type: 'chart',
                    config: {
                        type: "pieold",
                        x: ["indicator"], //x axis and series
                        series: ["unitname"], // series
                        y: ["value"],//Y dimension
                        aggregationFn: {"value": "sum"},
                        useDimensionLabelsIfExist: false,// || default raw else fenixtool

                        config: {
                            colors: ['#008080'],
                            legend: {
                                title: {
                                    text: null
                                }
                            },
                            plotOptions: {
                                pie: {
                                    showInLegend: true
                                },
                                series: {
                                    point: {
                                        events: {
                                            legendItemClick: function () {
                                                return false; // <== returning false will cancel the default action
                                            }
                                        }
                                    }
                                }
                            },
                            chart: {
                                events: {
                                    load: function (event) {
                                        if (this.options.chart.forExport) {
                                            Highcharts.each(this.series, function (series) {
                                                series.update({
                                                    dataLabels: {
                                                        enabled: false
                                                    }
                                                }, false);
                                            });
                                            this.redraw();
                                        }
                                    }
                                }

                            },
                            tooltip: {
                                style: {width: '200px', whiteSpace: 'normal'},
                                formatter: function () {
                                    var val = this.y;
                                    if (val.toFixed(0) < 1) {
                                        val = (val * 1000).toFixed(2) + ' K'
                                    } else {
                                        val = val.toFixed(2) + ' USD Mil'
                                    }

                                    return '<b>' + this.percentage.toFixed(2) + '% (' + val + ')</b>';
                                }
                            },
                            exporting: {
                                buttons: {
                                    toggleDataLabelsButton: {
                                        enabled: false
                                    }
                                },
                                chartOptions: {
                                    legend: {
                                        title: '',
                                        enabled: true,
                                        align: 'center',
                                        layout: 'vertical',
                                        useHTML: true,
                                        labelFormatter: function () {
                                            var val = this.y;
                                            if (val.toFixed(0) < 1) {
                                                val = (val * 1000).toFixed(2) + ' K'
                                            } else {
                                                val = val.toFixed(2) + ' USD Mil'
                                            }

                                            return '<div style="width:200px"><span style="float:left;  font-size:9px">' + this.name.trim() + ': ' + this.percentage.toFixed(2) + '% (' + val + ')</span></div>';
                                        }
                                    }
                                }
                            }
                        }
                    },
                    filterFor: {
                        "filter_top_10_donors_sum": ['parentsector_code', 'recipientcode', 'year', 'oda'],
                        "filter_top_all_donors_sum": ['parentsector_code', 'recipientcode', 'year', 'oda']
                    },

                    postProcess: [
                        {
                            "name": "union",
                            "sid": [
                                {
                                    "uid": "top_10_donors_sum"
                                },
                                {
                                    "uid": "others"
                                }
                            ],
                            "parameters": {},
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
                                    "donorcode",
                                    "value",
                                    "unitcode"
                                ],
                                "rows": {
                                    "oda": {
                                        "enumeration": [
                                            "usd_commitment"
                                        ]
                                    },
                                    "recipientcode": {
                                        "codes": [
                                            {
                                                "uid": "crs_recipients",
                                                "version": "2016",
                                                "codes": [
                                                    "625"
                                                ]
                                            }
                                        ]
                                    },
                                    "parentsector_code": {
                                        "codes": [
                                            {
                                                "uid": "crs_dac",
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
                            "rid": {
                                "uid": "filter_top_10_donors_sum"
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
                            "name": "order",
                            "parameters": {
                                "value": "DESC"
                            },
                            "rid":{"uid":"filtered_dataset"}
                        },
                        {
                            "name": "page",
                            "parameters": {
                                "perPage": 10,
                                "page": 1
                            }
                        },
                        {
                            "name": "group",
                            "parameters": {
                                "by": [
                                    "unitcode"
                                ],
                                "aggregations": [
                                    {
                                        "columns": [
                                            "value"
                                        ],
                                        "rule": "SUM"
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
                                "value": "Top Resource Partners"
                            },
                            "rid": {
                                "uid": "top_10_donors_sum"
                            }
                        },
                        {
                            "name": "group",
                            "sid":[{"uid":"filtered_dataset"}],
                            "parameters": {
                                "by": [
                                    "unitcode"
                                ],
                                "aggregations": [
                                    {
                                        "columns": [
                                            "value"
                                        ],
                                        "rule": "SUM"
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
                                "value": "sum of all donors"
                            },
                            "rid": {
                                "uid": "top_all_donors_sum"
                            }
                        },
                        {
                            "name": "join",
                            "sid": [
                                {
                                    "uid": "top_all_donors_sum"
                                },
                                {
                                    "uid": "top_10_donors_sum"
                                }
                            ],
                            "parameters": {
                                "joins": [
                                    [
                                        {
                                            "type": "id",
                                            "value": "unitcode"
                                        }
                                    ],
                                    [
                                        {
                                            "type": "id",
                                            "value": "unitcode"
                                        }
                                    ]
                                ],
                                "values": []
                            },
                            "rid": {
                                "uid": "join_process_total_donors"
                            }
                        },
                        {
                            "name": "addcolumn",
                            "sid": [
                                {
                                    "uid": "join_process_total_donors"
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
                                    "keys": [
                                        "1 = 1"
                                    ],
                                    "values": [
                                        "top_all_donors_sum_value - top_10_donors_sum_value"
                                    ]
                                }
                            }
                        },
                        {
                            "name": "filter",
                            "parameters": {
                                "columns": [
                                    "value",
                                    "unitcode"
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
                                "value": "Other Resource Partners"
                            },
                            "rid": {
                                "uid": "others"
                            }
                        }
                    ]
                },
                {
                    id: 'top-channel-categories', // TOP CHANNEL OF DELIVERY CATEGORIES
                    type: 'chart',
                    config: {
                        type: "column",
                        x: ["channelsubcategory_name"], //x axis
                        series: ["flowcategory_name"], // series
                        y: ["value"],//Y dimension
                        aggregationFn: {"value": "sum"},
                        useDimensionLabelsIfExist: false,// || default raw else fenixtool

                        config: {
                            colors: ['#56adc3'],
                            legend: {
                                title: {
                                    text: null
                                }
                            },
                            plotOptions: {
                                column: {
                                    events: {
                                        legendItemClick: function () {
                                            return false;
                                        }
                                    }
                                },
                                allowPointSelect: false
                            }
                        }

                    },
                    filter: { //FX-filter format
                        parentsector_code: ["600"],
                        recipientcode: ["625"],
                        year: [{value: "2000", parent: 'from'}, {value: "2014", parent:  'to'}]
                    },
                    postProcess: [
                        {
                            "name": "group",
                            "parameters": {
                                "by": [
                                    "channelsubcategory_code", "channelsubcategory_name"
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
                                        "columns": ["flowcategory_name"],
                                        "rule": "first"
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
                        }]
                },
                {
                    id: 'top-sectors', // TOP SECTORS
                    type: 'chart',
                    config: {
                        type: "column",
                        x: ["parentsector_code_EN"], //x axis
                        series: ["flowcategory_code_EN"], // series
                        y: ["value"],//Y dimension
                        aggregationFn: {"value": "sum"},
                        useDimensionLabelsIfExist: false,// || default raw else fenixtool
                        config: {
                            colors: ['#008080'],
                            legend: {
                                title: {
                                    text: null
                                }
                            },
                            plotOptions: {
                                column: {
                                    events: {
                                        legendItemClick: function () {
                                            return false;
                                        }
                                    }
                                },
                                allowPointSelect: false
                            }
                        }

                    },


                    filterFor: {
                        "filter_sectors": ['recipientcode', 'year', 'oda']
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
                                "rows": {
                                    "recipientcode": {
                                        "codes": [
                                            {
                                                "uid": "crs_recipients",
                                                "version": "2016",
                                                "codes": [
                                                    "625"
                                                ]
                                            }
                                        ]
                                    },
                                    "year": {
                                        "time": [
                                            {
                                                "from": "2000",
                                                "to": "2014"
                                            }
                                        ]
                                    },
                                    "oda":{
                                        "enumeration":[
                                            "usd_commitment"
                                        ]
                                    }
                                }
                            },
                            "rid":{"uid":"filter_sectors"}
                        },
                        {
                            "name": "group",
                            "parameters": {
                                "by": [
                                    "parentsector_code"
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
                                    },
                                    {
                                        "columns": [
                                            "flowcategory_code"
                                        ],
                                        "rule": "first"
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
                                "perPage": 10,
                                "page": 1
                            }
                        }

                    ]
                },
                {
                    id: 'top-sectors-others', // TOP SECTORS Vs OTHER SECTORS
                    type: 'chart',
                    config: {
                        type: "pieold",
                        x: ["indicator"], //x axis and series
                        series: ["unitname"], // series
                        y: ["value"],//Y dimension
                        aggregationFn: {"value": "sum"},
                        useDimensionLabelsIfExist: false,// || default raw else fenixtool

                        config: {
                            colors: ['#008080'],
                            legend: {
                                title: {
                                    text: null
                                }
                            },
                            plotOptions: {
                                pie: {
                                    showInLegend: true
                                },
                                series: {
                                    point: {
                                        events: {
                                            legendItemClick: function () {
                                                return false; // <== returning false will cancel the default action
                                            }
                                        }
                                    }
                                }
                            },
                            chart: {
                                events: {
                                    load: function (event) {
                                        if (this.options.chart.forExport) {
                                            Highcharts.each(this.series, function (series) {
                                                series.update({
                                                    dataLabels: {
                                                        enabled: false
                                                    }
                                                }, false);
                                            });
                                            this.redraw();
                                        }
                                    }
                                }

                            },
                            tooltip: {
                                style: {width: '200px', whiteSpace: 'normal'},
                                formatter: function () {
                                    var val = this.y;
                                    if (val.toFixed(0) < 1) {
                                        val = (val * 1000).toFixed(2) + ' K'
                                    } else {
                                        val = val.toFixed(2) + ' USD Mil'
                                    }

                                    return '<b>' + this.percentage.toFixed(2) + '% (' + val + ')</b>';
                                }
                            },
                            exporting: {
                                buttons: {
                                    toggleDataLabelsButton: {
                                        enabled: false
                                    }
                                },
                                chartOptions: {
                                    legend: {
                                        title: '',
                                        enabled: true,
                                        align: 'center',
                                        layout: 'vertical',
                                        useHTML: true,
                                        labelFormatter: function () {
                                            var val = this.y;
                                            if (val.toFixed(0) < 1) {
                                                val = (val * 1000).toFixed(2) + ' K'
                                            } else {
                                                val = val.toFixed(2) + ' USD Mil'
                                            }

                                            return '<div style="width:200px"><span style="float:left;  font-size:9px">' + this.name.trim() + ': ' + this.percentage.toFixed(2) + '% (' + val + ')</span></div>';
                                        }
                                    }
                                }
                            }
                        }
                    },
                    filterFor: {
                        "filter_top_10_sectors_sum": ['recipientcode', 'year', 'oda'],
                        "filter_top_all_sectors_sum": ['recipientcode', 'year', 'oda']
                    },

                    postProcess: [
                        {
                            "name": "union",
                            "sid": [
                                {
                                    "uid": "top_10_sectors_sum"
                                },
                                {
                                    "uid": "others"
                                }
                            ],
                            "parameters": {},
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
                                    "parentsector_code",
                                    "value",
                                    "unitcode"
                                ],
                                "rows": {
                                    "oda": {
                                        "enumeration": [
                                            "usd_commitment"
                                        ]
                                    },
                                    "recipientcode": {
                                        "codes": [
                                            {
                                                "uid": "crs_recipients",
                                                "version": "2016",
                                                "codes": [
                                                    "625"
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
                                "uid": "filter_top_10_sectors_sum"
                            }
                        },
                        {
                            "name": "group",
                            "parameters": {
                                "by": [
                                    "parentsector_code"
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
                            "name": "order",
                            "parameters": {
                                "value": "DESC"
                            },
                            "rid":{"uid":"filtered_dataset"}
                        },
                        {
                            "name": "page",
                            "parameters": {
                                "perPage": 10,
                                "page": 1
                            }
                        },
                        {
                            "name": "group",
                            "parameters": {
                                "by": [
                                    "unitcode"
                                ],
                                "aggregations": [
                                    {
                                        "columns": [
                                            "value"
                                        ],
                                        "rule": "SUM"
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
                                "value": "Top Sectors"
                            },
                            "rid": {
                                "uid": "top_10_sectors_sum"
                            }
                        },
                        {
                            "name": "group",
                            "sid":[{"uid":"filtered_dataset"}],
                            "parameters": {
                                "by": [
                                    "unitcode"
                                ],
                                "aggregations": [
                                    {
                                        "columns": [
                                            "value"
                                        ],
                                        "rule": "SUM"
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
                                "value": "sum of all sectors"
                            },
                            "rid": {
                                "uid": "top_all_sectors_sum"
                            }
                        },
                        {
                            "name": "join",
                            "sid": [
                                {
                                    "uid": "top_all_sectors_sum"
                                },
                                {
                                    "uid": "top_10_sectors_sum"
                                }
                            ],
                            "parameters": {
                                "joins": [
                                    [
                                        {
                                            "type": "id",
                                            "value": "unitcode"
                                        }
                                    ],
                                    [
                                        {
                                            "type": "id",
                                            "value": "unitcode"
                                        }
                                    ]
                                ],
                                "values": []
                            },
                            "rid": {
                                "uid": "join_process_total_sectors"
                            }
                        },
                        {
                            "name": "addcolumn",
                            "sid": [
                                {
                                    "uid": "join_process_total_sectors"
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
                                    "keys": [
                                        "1 = 1"
                                    ],
                                    "values": [
                                        "top_all_sectors_sum_value - top_10_sectors_sum_value"
                                    ]
                                }
                            }
                        },
                        {
                            "name": "filter",
                            "parameters": {
                                "columns": [
                                    "value",
                                    "unitcode"
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
                                "value": "Other Sectors"
                            },
                            "rid": {
                                "uid": "others"
                            }
                        }
                    ]
                },
                {
                    id: 'top-subsectors', // TOP SUB SECTORS
                    type: 'chart',
                    config: {
                        type: "pieold",
                        x: ["purposecode_EN"], //x axis and series
                        series: ["flowcategory_code_EN"], // series
                        y: ["value"],//Y dimension
                        aggregationFn: {"value": "sum"},
                        useDimensionLabelsIfExist: false,// || default raw else fenixtool
                        config: {
                            chart: {
                                events: {
                                    load: function (event) {
                                        if (this.options.chart.forExport) {
                                            Highcharts.each(this.series, function (series) {
                                                series.update({
                                                    dataLabels: {
                                                        enabled: false
                                                    }
                                                }, false);
                                            });
                                            this.redraw();
                                        }
                                    }
                                }

                            },
                            tooltip: {
                                style: {width: '200px', whiteSpace: 'normal'},
                                formatter: function () {
                                    var val = this.y;
                                    if (val.toFixed(0) < 1) {
                                        val = (val * 1000).toFixed(2) + ' K'
                                    } else {
                                        val = val.toFixed(2) + ' USD Mil'
                                    }

                                    return '<b>' + this.percentage.toFixed(2) + '% (' + val + ')</b>';
                                }
                            },
                            exporting: {
                                buttons: {
                                    toggleDataLabelsButton: {
                                        enabled: false
                                    }
                                },
                                chartOptions: {
                                    legend: {
                                        title: '',
                                        enabled: true,
                                        align: 'center',
                                        layout: 'vertical',
                                        useHTML: true,
                                        labelFormatter: function () {
                                            var val = this.y;
                                            if (val.toFixed(0) < 1) {
                                                val = (val * 1000).toFixed(2) + ' K'
                                            } else {
                                                val = val.toFixed(2) + ' USD Mil'
                                            }

                                            return '<div style="width:200px"><span style="float:left;  font-size:9px">' + this.name.trim() + ': ' + this.percentage.toFixed(2) + '% (' + val + ')</span></div>';
                                        }
                                    }
                                }
                            }
                        }

                    },

                    filterFor: {
                        "filter_sectors": ['recipientcode', 'parentsector_code', 'year', 'oda']
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
                                "rows": {
                                    "recipientcode": {
                                        "codes": [
                                            {
                                                "uid": "crs_recipients",
                                                "version": "2016",
                                                "codes": [
                                                    "625"
                                                ]
                                            }
                                        ]
                                    },
                                    "year": {
                                        "time": [
                                            {
                                                "from": "2000",
                                                "to": "2014"
                                            }
                                        ]
                                    },
                                    "oda":{
                                        "enumeration":[
                                            "usd_commitment"
                                        ]
                                    }
                                }
                            },
                            "rid":{"uid":"filter_sectors"}
                        },
                        {
                            "name": "group",
                            "parameters": {
                                "by": [
                                    "purposecode"
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
                                    },
                                    {
                                        "columns": [
                                            "flowcategory_code"
                                        ],
                                        "rule": "first"
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
                                "perPage": 10,
                                "page": 1
                            }
                        }

                    ]
                },
                {
                    id: 'regional-map',
                    type: 'map',
                    config: {
                        geoSubject: 'gaul0',
                        colorRamp: 'GnBu',  //Blues, Greens,
                        //colorRamp values: http://fenixrepo.fao.org/cdn/fenix/fenix-ui-map-datasets/colorramp.png

                        legendtitle: 'ODA',

                        fenix_ui_map: {

                            plugins: {
                                fullscreen: false,
                                disclaimerfao: false
                            },
                            guiController: {
                                overlay: false,
                                baselayer: false,
                                wmsLoader: false
                            },

                            baselayers: {
                                "cartodb": {
                                    title_en: "Baselayer",
                                    url: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
                                    subdomains: 'abcd',
                                    maxZoom: 19
                                }
                            },
                            labels: true,
                            boundaries: true,

                            zoomToCountry: [1],

                            //highlight service NOT WORK FOR NOW
                            //highlightCountry : [1], // GAUL Afghanistan
                        }
                    },


                    filterFor: ['un_region_code', 'parentsector_code', 'purposecode', 'year', 'oda'],

                    filter: { //FX-filter format
                        un_region_code: ["034"], // Region = 'Southern Asia'
                        year: [{value: 2000, parent: 'from'}, {value: 2014, parent:  'to'}]
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
        }
    });