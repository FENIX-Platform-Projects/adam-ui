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
                            placeholder: "All",
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
                        "parentsector_code": {id: "parent", event: "select"}
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

                            config: { // Highcharts configuration
                                xAxis: {
                                    type: 'datetime'
                                },
                                yAxis: [{ //Primary Axis in default template
                                }, { // Secondary Axis
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
                                    marker: {
                                        radius: 3
                                    }
                                }, {
                                    name: 'ODA SECTOR'
                                    //, type: 'column'
                                }, {
                                    name: 'TOTAL ODA'
                                    //, type: 'column'
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
                            "filter_total_sector_oda": ['parentsector_code', 'year', 'oda'],
                            "filter_total_oda": ['year', 'oda']
                        },

                        postProcess: [
                            {
                                "name": "union",
                                "sid": [
                                    {
                                        "uid": "total_sector_oda" // RESULT OF PART 1: TOTAL ODA for the selected Sector
                                    },
                                    {
                                        "uid": "total_oda" // RESULT OF PART 2: TOTAL ODA for ALL Sectors
                                    },
                                    {
                                        "uid": "percentage_ODA" // RESULT OF PART 3: PERCENTAGE CALCULATION (TOTAL ODA SECTOR / TOTAL ODA for ALL Sectors x 100)
                                    }
                                ],
                                "parameters": {},
                                "rid": {
                                    "uid": "union_process"
                                }
                            }, // PART 4: UNION is the FINAL PART IN THE PROCESS
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
                                rid: {uid: "filter_total_sector_oda"}
                            }, // PART 1: TOTAL ODA FOR SECTOR: (1i) Filter
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
                            }, // (1ii): TOTAL ODA FOR SECTOR: Group by
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
                                    "value": "ODA SECTOR" // PART 1 FINAL INDICATOR NAME
                                },
                                "rid": {
                                    "uid": "total_sector_oda"
                                }
                            }, // (1iii): TOTAL ODA FOR SECTOR: Add Column
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

                            }, //PART 2:  TOTAL ODA for ALL Sectors: (2i) Filter
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
                            }, //(2ii):  TOTAL ODA for ALL Sectors: Group by
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
                                    "value": "TOTAL ODA" // PART 2 FINAL INDICATOR NAME
                                },
                                "rid": {
                                    "uid": "total_oda"
                                }
                            }, //(2iii):  TOTAL ODA for ALL Sectors: Add Column
                            {
                                "name": "join",
                                "sid": [
                                    {
                                        "uid": "total_sector_oda"
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
                                    "values": []
                                },
                                "rid": {
                                    "uid": "join_process"
                                }
                            }, // PART 3 PERCENTAGE CALCULATION: (3i) Join
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
                                        "keys": ["1=1"],
                                        "values": ["(total_sector_oda_value/total_oda_value)*100"]
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
                            }, // (3iv) PERCENTAGE CALCULATION: Add Column (Measurement Unit)
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
                            }, // (3v) PERCENTAGE CALCULATION: Add Column (Measurement Unit)
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
                                    "value": "% SECTOR/TOTAL ODA"  // PART 3 FINAL INDICATOR NAME
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
                            x: ["donorname"], //x axis
                            series: ["flowcategory_name"], // series
                            y: ["value"],//Y dimension
                            aggregationFn: {"value": "sum"},
                            useDimensionLabelsIfExist: false,// || default raw else fenixtool

                            config: {
                                colors: ['#008080']
                            }

                        },
                        filter: { //FX-filter format
                            parentsector_code: ["600"],
                            year: [{value: "2000", parent: 'from'}, {value: "2014", parent:  'to'}]
                        },
                        postProcess: [
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
                            }]
                    },
                    {
                        id: 'top-partners-others', // TOP RESOURCE PARTNERS Vs OTHER RESOURCE PARTNERS
                        type: 'chart',
                        config: {
                            type: "pie",
                            x: ["indicator"], //x axis and series
                            series: ["unitname"], // series
                            y: ["value"],//Y dimension
                            aggregationFn: {"value": "sum"},
                            useDimensionLabelsIfExist: false,// || default raw else fenixtool

                            config: {
                                colors: ['#008080'],
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
                            "filter_top_10_donors_sum": ['parentsector_code', 'year', 'oda'],
                            "filter_all_donors_sum": ['parentsector_code', 'year', 'oda']
                        },

                        postProcess: [
                            {
                                "name": "union",
                                "sid": [
                                    {
                                        "uid": "top_10_donors_sum" // RESULT OF PART 1: TOTAL ODA for TOP 10 PARTNERS
                                    },
                                    {
                                        "uid":"others" // RESULT OF PART 3: TOTAL ODA OTHERS CALCULATION (TOTAL ODA ALL PARTNERS (PART 2) - TOTAL ODA FOR TOP 10 Partners)
                                    }
                                ],
                                "parameters": {
                                },
                                "rid":{"uid":"union_process"}

                            }, // PART 4: UNION is the FINAL PART IN THE PROCESS

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
                                "rid":{"uid":"filter_top_10_donors_sum"}
                            }, // PART 1: TOTAL ODA for TOP 10 PARTNERS: (1i) Filter
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
                                    ]
                                }
                            }, // (1ii): TOTAL ODA for TOP 10 PARTNERS: Group by
                            {
                                "name": "order",
                                "parameters": {
                                    "value": "DESC"
                                }
                            }, // (1iii): TOTAL ODA for TOP 10 PARTNERS: Order by
                            {
                                "name": "page",
                                "parameters": {
                                    "perPage": 10,
                                    "page": 1
                                }
                            }, // (1iv): TOTAL ODA for TOP 10 PARTNERS: Limit
                            {
                                "name": "filter",
                                "parameters": {
                                    "columns": [
                                        "unitcode",
                                        "value"

                                    ],
                                    "rows": {
                                    }
                                }
                            }, // (1v): TOTAL ODA for TOP 10 PARTNERS: Filter (filter out what is not needed)
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
                            }, // (1vi): TOTAL ODA for TOP 10 PARTNERS: Group by
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
                                    "value": "Top Resource Partners" // PART 1 FINAL INDICATOR NAME
                                },
                                "rid": {
                                    "uid": "top_10_donors_sum"
                                }
                            }, // (1vii): TOTAL ODA for TOP 10 PARTNERS: Add Column
                            {
                                "name": "filter",
                                "sid": [
                                    {
                                        "uid": "adam_usd_aggregation_table"
                                    }
                                ],
                                "parameters": {
                                    "columns": [
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
                                    "uid": "filter_all_donors_sum"
                                }
                            }, // PART 2: TOTAL ODA for ALL PARTNERS : (2i) Filter
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
                            }, // (2ii): TOTAL ODA for ALL PARTNERS: Group by
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
                                    "value": "sum of all donors" // PART 2 FINAL INDICATOR NAME
                                },
                                "rid": {
                                    "uid": "top_all_donors_sum"
                                }
                            }, // (2iii): TOTAL ODA for ALL PARTNERS : Add Column
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
                                    "values": [
                                    ]
                                },
                                "rid":{"uid":"join_process_total_donors"}
                            }, // PART 3: TOTAL ODA OTHERS CALCULATION: (3i) Join
                            {
                                "name": "addcolumn",
                                "sid":[{"uid":"join_process_total_donors"}],
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
                                        "values":["top_all_donors_sum_value - top_10_donors_sum_value"]
                                    }
                                }
                            }, // (3ii): TOTAL ODA OTHERS CALCULATION: Add Column
                            {
                                "name": "filter",
                                "parameters": {
                                    "columns": [
                                        "value",
                                        "unitcode"
                                    ]
                                }
                            }, // (3iii): TOTAL ODA OTHERS CALCULATION: Filter (filter out what is not needed)
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
                                    "value": "Other Resource Partners" // PART 3 FINAL INDICATOR NAME
                                },
                                "rid": {
                                    "uid": "others"
                                }
                            } // (3iv): TOTAL ODA OTHERS CALCULATION: Add Column
                        ]
                    },
                    {
                        id: 'top-recipients', // TOP RECIPIENTS
                        type: 'chart',
                        config: {
                            type: "column",
                            x: ["recipientname"], //x axis
                            series: ["flowcategory_name"], // series
                            y: ["value"],//Y dimension
                            aggregationFn: {"value": "sum"},
                            useDimensionLabelsIfExist: false,// || default raw else fenixtool
                            config: {
                                colors: ['#5DA58D']
                            }

                        },
                        filter: { //FX-filter format
                            parentsector_code: ["600"],
                            year: [{value: "2000", parent: 'from'}, {value: "2014", parent:  'to'}]
                        },
                        postProcess: [
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "recipientname", "recipientcode"
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
                                "name": "select",
                                "parameters": {
                                    "query": "WHERE recipientcode NOT IN (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", // skipping regional recipient countries (e.g. "Africa, regional"; "North of Sahara, regional")
                                    "queryParameters": [
                                        {"value": '298'}, {"value": '498'}, {"value": '798'}, {"value": '89'},
                                        {"value": '589'}, {"value": '889'}, {"value": '189'}, {"value": '289'},
                                        {"value": '389'}, {"value": '380'}, {"value": '489'}, {"value": '789'},
                                        {"value": '689'}, {"value": '619'}, {"value": '679'}
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
                        id: 'top-recipients-others', // TOP RECIPIENTS Vs OTHER RECIPIENTS
                        type: 'chart',
                        config: {
                            type: "pie",
                            x: ["indicator"], //x axis and series
                            series: ["unitname"], // series
                            y: ["value"],//Y dimension
                            aggregationFn: {"value": "sum"},
                            useDimensionLabelsIfExist: false,// || default raw else fenixtool

                            config: {
                                colors: ['#5DA58D'],
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
                            "filter_top_10_recipients_sum": ['parentsector_code', 'year', 'oda'],
                            "filter_all_recipients_sum": ['parentsector_code', 'year', 'oda']
                        },

                        postProcess: [
                            {
                                "name": "union",
                                "sid": [
                                    {
                                        "uid": "top_10_recipients_sum"
                                    },
                                    {
                                        "uid":"others"
                                    }
                                ],
                                "parameters": {
                                },
                                "rid":{"uid":"union_process"}
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
                                "rid":{"uid":"filter_top_10_recipients_sum"}
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "recipientcode"
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
                                "name": "select",
                                "parameters": {
                                    "query": "WHERE recipientcode NOT IN (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", // skipping regional recipient countries (e.g. "Africa, regional"; "North of Sahara, regional")
                                    "queryParameters": [
                                        {"value": '298'}, {"value": '498'}, {"value": '798'}, {"value": '89'},
                                        {"value": '589'}, {"value": '889'}, {"value": '189'}, {"value": '289'},
                                        {"value": '389'}, {"value": '380'}, {"value": '489'}, {"value": '789'},
                                        {"value": '689'}, {"value": '619'}, {"value": '679'}
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
                            },
                            {
                                "name": "filter",
                                "parameters": {
                                    "columns": [
                                        "unitcode",
                                        "value"

                                    ],
                                    "rows": {
                                    }
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
                                    "value": "Top Recipient Countries"
                                },
                                "rid": {
                                    "uid": "top_10_recipients_sum"
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
                                "rid":{"uid":"filter_all_recipients_sum"}
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
                            // NEED TO VERIFY HOW TO DO THIS
                           // {
                            //    "name": "select",
                            //    "parameters": {
                             //       "query": "WHERE recipientcode NOT IN (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", // skipping regional recipient countries (e.g. "Africa, regional"; "North of Sahara, regional")
                             //       "queryParameters": [
                             //           {"value": '298'}, {"value": '498'}, {"value": '798'}, {"value": '89'},
                             //           {"value": '589'}, {"value": '889'}, {"value": '189'}, {"value": '289'},
                             //           {"value": '389'}, {"value": '380'}, {"value": '489'}, {"value": '789'},
                             //           {"value": '689'}, {"value": '619'}, {"value": '679'}
                              //      ]
                              //  }
                           // },
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
                                    "value": "sum of all recipients"
                                },
                                "rid": {
                                    "uid": "top_all_recipients_sum"
                                }
                            },
                            {
                                "name": "join",
                                "sid": [
                                    {
                                        "uid": "top_all_recipients_sum"
                                    },
                                    {
                                        "uid": "top_10_recipients_sum"
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
                                    "values": [
                                    ]
                                },
                                "rid":{"uid":"join_process_total_recipients"}
                            },
                            {
                                "name": "addcolumn",
                                "sid":[{"uid":"join_process_total_recipients"}],
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
                                        "values":["top_all_recipients_sum_value - top_10_recipients_sum_value"]
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
                                    "value": "Other Recipient Countries"
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
                                colors: ['#56adc3']
                            }

                        },
                        filter: { //FX-filter format
                            parentsector_code: ["600"],
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
                        id: 'top-channels', // TOP CHANNELS OF DELIVERY
                        type: 'chart',
                        config: {
                            type: "pie",
                            x: ["channelname"], //x axis and series
                            series: ["flowcategory_name"], // series
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
                        filter: { //FX-filter format
                            parentsector_code: ["600"],
                            year: [{value: "2000", parent: 'from'}, {value: "2014", parent:  'to'}]
                        },
                        postProcess: [
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "channelcode", "channelname"
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
                        id: 'top-subsectors', // TOP SUB SECTORS
                        type: 'chart',
                        config: {
                            type: "pie",
                            x: ["purposename"], //x axis and series
                            series: ["flowcategory_name"], // series
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
                        filter: { //FX-filter format
                            parentsector_code: ["600"],
                            year: [{value: "2000", parent: 'from'}, {value: "2014", parent: 'to'}]
                        },
                        postProcess: [
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "purposename"
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
                        id: 'oda-regional', // REGIONAL DISTRIBUTION
                        type: 'chart',
                        config: {
                            type: "column",
                            x: ["parentsector_code"], //x axis
                            series: ["un_continent_code"], // series
                            y: ["value"],//Y dimension
                            aggregationFn: {"value": "sum"},
                            useDimensionLabelsIfExist: true,// || default raw else fenixtool

                            config: {
                                chart: {
                                    inverted: true
                                },
                                plotOptions: {
                                    series: {
                                        stacking: 'percent',
                                        dataLabels: {
                                            enabled: true,
                                            color: 'white',
                                            style: {
                                                fontWeight: 'normal',
                                                textShadow: '0'
                                            },
                                            formatter: function () {
                                                var percent = Math.round(this.point.percentage);
                                                if (percent > 0)
                                                    return Math.round(this.point.percentage) + '%';
                                                else
                                                    return this.point.percentage.toFixed(2) + '%';
                                            }
                                        }
                                    },
                                    column: {
                                        minPointLength: 5
                                    }
                                },
                                exporting: {
                                    chartOptions: {
                                        legend: {
                                            title: '',
                                            enabled: true,
                                            useHTML: true,
                                            labelFormatter: function () {
                                                return '<div><span>' + this.name + ' (' + this.yData + ' USD Mil)</span></div>';
                                            }
                                        }
                                    }
                                },
                                yAxis: {
                                    min: 0,
                                    title: {
                                        text: '%',
                                        align: 'high'
                                    }
                                },
                                xAxis: {
                                    labels: {
                                        enabled: false
                                    }
                                },
                                tooltip: {
                                    formatter: function () {
                                        var percent = Math.round(this.point.percentage);

                                        if (percent < 1)
                                            percent = this.point.percentage.toFixed(2);

                                        return '<b>' + this.series.name + ':' + '</b><br/>' + ' <b>' + percent + '% </b>' +
                                            ' (' + Highcharts.numberFormat(this.y, 2, '.', ',') + ' USD Mil)'
                                    }
                                }
                            }
                        },
                        filter: { //FX-filter format
                            parentsector_code: ["600"],
                            year: [{value: 2000, parent: 'from'}, {value: 2014, parent:  'to'}]
                        },

                        postProcess: [
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "parentsector_code", "un_continent_code"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "SUM"
                                        },
                                        {
                                            "columns": ["unitcode"],
                                            "rule": "first"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "select",
                                "parameters": {
                                    "query": "WHERE un_continent_code<>?",
                                    "queryParameters": [{"value": ''}]
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
                        id: 'country-map',
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
                                boundaries: true
                            }
                        },

                        filter: { //FX-filter format
                            parentsector_code: ["600"],
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
                        ]
                    }
                ]
            }
        },
        "country": {
            filter: {
                recipientcode: {
                    selector: {
                        id: "dropdown",
                        default: ["625"],
                        config: { //Selectize configuration
                            maxItems: 1,
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
                                }, { // Secondary Axis
                                    gridLineWidth: 0,
                                    title: {
                                        text: '%'
                                    },
                                    opposite: true
                                }],
                                series: [{
                                    name: '% SECTOR/TOTAL',
                                    yAxis: 1,
                                    dashStyle: 'shortdot',
                                    marker: {
                                        radius: 3
                                    }
                                },
                                    {
                                        name: 'ODA IN THE SECTOR FOR THE COUNTRY'//,
                                        // type: 'column'
                                    },
                                    {
                                        name: 'TOTAL ODA IN THE COUNTRY'//,
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
                            "filter_total_ODA": ['recipientcode', 'year', 'oda'],
                            "filter_country_oda": ['recipientcode', 'parentsector_code', 'year']
                        },

                        postProcess: [

                            {
                                "name": "union",
                                "sid": [
                                    {
                                        "uid": "total_oda"
                                    },
                                    {
                                        "uid": "country_oda"
                                    },
                                    {
                                        "uid":"percentage_ODA"
                                    }

                                ],
                                "parameters": {
                                },
                                "rid":{"uid":"union_process"}

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
                                "rid":{"uid":"total_ODA"}

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
                                    "value": "TOTAL ODA IN THE COUNTRY"
                                },
                                "rid": {
                                    "uid": "total_oda"
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
                                "rid":{"uid":"filter_country_oda"}

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
                                    "value": "ODA IN THE SECTOR FOR THE COUNTRY"
                                },
                                "rid":{"uid":"country_oda"}
                            },
                            {
                                "name": "join",
                                "sid": [
                                    {
                                        "uid": "total_oda"
                                    },
                                    {
                                        "uid": "country_oda"
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
                            },
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
                                        "values":[" ( country_oda_value / total_oda_value )*100"]

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
                                    "value": "% SECTOR/TOTAL"
                                },
                                "rid": {
                                    "uid": "percentage_ODA"
                                }
                            }
                        ]
                    },
                    {
                        id: 'top-partners', // TOP DONORS
                        type: 'chart',
                        config: {
                            type: "column",
                            x: ["donorname"], //x axis
                            series: ["flowcategory_name"], // series
                            y: ["value"],//Y dimension
                            aggregationFn: {"value": "sum"},
                            useDimensionLabelsIfExist: false,// || default raw else fenixtool

                            // filterFor: ['parentsector_code', 'purposecode', 'year-from', 'year-to'],
                            config: {
                                colors: ['#008080']
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
                            }]
                    },
                    {
                        id: 'top-partners-others', // TOP DONORS Vs OTHER DONORS
                        type: 'chart',
                        config: {
                            type: "pie",
                            x: ["indicator"], //x axis and series
                            series: ["unitname"], // series
                            y: ["value"],//Y dimension
                            aggregationFn: {"value": "sum"},
                            useDimensionLabelsIfExist: false,// || default raw else fenixtool

                            // filterFor: ['parentsector_code', 'purposecode', 'year-from', 'year-to'],

                            config: {
                                colors: ['#008080'],
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
                        // filter: { //FX-filter format
                        //   parentsector_code: ["600"],
                        //   year: [{value: "2000", parent: 'from'}, {value: "2014", parent:  'to'}]
                        // },
                        postProcess: [
                            {
                                "name": "union",
                                "sid": [
                                    {
                                        "uid": "top_10_donors_sum"
                                    },
                                    {
                                        "uid":"others"
                                    }
                                ],
                                "parameters": {
                                },
                                "rid":{"uid":"union_process"}

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
                                        },
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
                            },
                            {
                                "name": "filter",
                                "parameters": {
                                    "columns": [
                                        "unitcode",
                                        "value"

                                    ],
                                    "rows": {
                                    }
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
                                "name": "filter",
                                "sid": [
                                    {
                                        "uid": "adam_usd_aggregation_table"
                                    }
                                ],
                                "parameters": {
                                    "columns": [
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
                                    "values": [
                                    ]
                                },
                                "rid":{"uid":"join_process_total_donors"}
                            },
                            {
                                "name": "addcolumn",
                                "sid":[{"uid":"join_process_total_donors"}],
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
                                        "values":["top_all_donors_sum_value - top_10_donors_sum_value"]
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

                            // filterFor: ['parentsector_code', 'purposecode', 'year-from', 'year-to'],
                            config: {
                                colors: ['#56adc3']
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
                        id: 'top-channels', // TOP CHANNELS OF DELIVERY
                        type: 'chart',
                        config: {
                            type: "pie",
                            x: ["channelname"], //x axis and series
                            series: ["flowcategory_name"], // series
                            y: ["value"],//Y dimension
                            aggregationFn: {"value": "sum"},
                            useDimensionLabelsIfExist: false,// || default raw else fenixtool

                            // filterFor: ['parentsector_code', 'purposecode', 'year-from', 'year-to'],
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
                                        "channelcode", "channelname"
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
                            x: ["parentsector_name"], //x axis
                            series: ["flowcategory_name"], // series
                            y: ["value"],//Y dimension
                            aggregationFn: {"value": "sum"},
                            useDimensionLabelsIfExist: false,// || default raw else fenixtool

                            // filterFor: ['parentsector_code', 'purposecode', 'year-from', 'year-to'],
                            config: {
                                colors: ['#008080']
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
                                        "parentsector_name"
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
                   /* {
                        id: 'top-sectors-others', // TOP SECTORS Vs OTHER SECTORS
                        type: 'chart',
                        config: {
                            type: "pie",
                            x: ["indicator"], //x axis and series
                            series: ["unitname"], // series
                            y: ["value"],//Y dimension
                            aggregationFn: {"value": "sum"},
                            useDimensionLabelsIfExist: false,// || default raw else fenixtool

                            // filterFor: ['parentsector_code', 'purposecode', 'year-from', 'year-to'],

                            config: {
                                colors: ['#008080'],
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
                        // filter: { //FX-filter format
                        //   parentsector_code: ["600"],
                        //   year: [{value: "2000", parent: 'from'}, {value: "2014", parent:  'to'}]
                        // },
                        postProcess: [
                            {
                                "name": "union",
                                "sid": [
                                    {
                                        "uid": "top_10_sectors_sum"
                                    },
                                    {
                                        "uid":"others"
                                    }
                                ],
                                "parameters": {
                                },
                                "rid":{"uid":"union_process"}

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
                                        },
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
                            },
                            {
                                "name": "filter",
                                "parameters": {
                                    "columns": [
                                        "unitcode",
                                        "value"

                                    ],
                                    "rows": {
                                    }
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
                                "name": "filter",
                                "sid": [
                                    {
                                        "uid": "adam_usd_aggregation_table"
                                    }
                                ],
                                "parameters": {
                                    "columns": [
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
                                    "values": [
                                    ]
                                },
                                "rid":{"uid":"join_process_total_sectors"}
                            },
                            {
                                "name": "addcolumn",
                                "sid":[{"uid":"join_process_total_sectors"}],
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
                                        "values":["top_all_sectors_sum_value - top_10_sectors_sum_value"]
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
                    },*/
                    {
                        id: 'top-subsectors', // TOP SUB SECTORS
                        type: 'chart',
                        config: {
                            type: "pie",
                            x: ["purposename"], //x axis and series
                            series: ["flowcategory_name"], // series
                            y: ["value"],//Y dimension
                            aggregationFn: {"value": "sum"},
                            useDimensionLabelsIfExist: false,// || default raw else fenixtool

                            // filterFor: ['parentsector_code', 'purposecode', 'year-from', 'year-to'],
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
                        filter: { //FX-filter format
                            parentsector_code: ["600"],
                            recipientcode: ["625"],
                            year: [{value: "2000", parent: 'from'}, {value: "2014", parent: 'to'}]
                        },
                        postProcess: [
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "purposename"
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

                                zoomToCountry: [1]
                                
                                //highlight service NOT WORK FOR NOW
                                //highlightCountry : [1], // GAUL Afghanistan
                            }
                        },

                        filter: { //FX-filter format
                            parentsector_code: ["600"],
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
        },
        "donor": {
            filter: {
                donorcode: {
                    selector: {
                        id: "dropdown",
                        default: ["1"], // Austria
                        config: { //Selectize configuration
                            maxItems: 1,
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
                                }, { // Secondary Axis
                                    gridLineWidth: 0,
                                    title: {
                                        text: '%'
                                    },
                                    opposite: true
                                }],
                                series: [{
                                    name: '% SECTOR/TOTAL',
                                    yAxis: 1,
                                    dashStyle: 'shortdot',
                                    marker: {
                                        radius: 3
                                    }
                                },

                                    {
                                        name: 'ODA FROM DONOR IN SECTOR'//,
                                        // type: 'column'
                                    },
                                    {
                                        name: 'TOTAL ODA FROM DONOR'//,
                                        // type: 'column'
                                    },
                                    {
                                        name: 'OECD AVERAGE OF ODA IN THAT SECTOR'//,
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
                            "filter_sector_oda": ['donorcode', 'parentsector_code', 'year', 'oda'],
                            "filter_total_donor_oda": ['donorcode', 'year', 'oda'],
                            "filter_aggregated_oecd": ['parentsector_code', 'year', 'oda'],
                            "filter_sd": ['parentsector_code', 'year', 'oda']
                        },

                        postProcess: [

                            {
                                "name": "union",
                                "sid": [
                                    {
                                        "uid": "sector_oda"
                                    },
                                    {
                                        "uid": "total_donor_oda"
                                    },
                                    {
                                        "uid":"percentage_ODA"
                                    },
                                    {"uid":"OECD_AVG"}
                                ],
                                "parameters": {
                                },
                                "rid":{"uid":"union_process"}

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
                                    "uid": "filter_sector_oda"
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
                                },
                                "rid": {
                                    "uid": "tt"
                                }
                            },
                            {
                                "name": "addcolumn",
                                "sid": [
                                    {
                                        "uid": "tt"
                                    }
                                ],
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
                                    "value": "ODA FROM DONOR IN SECTOR"
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
                                        "year": {
                                            "time": [
                                                {
                                                    "from": 2000,
                                                    "to": 2013
                                                }
                                            ]
                                        }
                                    }
                                },
                                "rid": {
                                    "uid": "filter_total_donor_oda"
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
                                },
                                "rid":{"uid":"total_ODA"}

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
                                    "value": "TOTAL ODA FROM DONOR"
                                },
                                "rid": {
                                    "uid": "total_donor_oda"
                                }
                            },

                            {
                                "name": "join",
                                "sid": [
                                    {
                                        "uid": "sector_oda"
                                    },
                                    {
                                        "uid": "total_donor_oda"
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
                            },
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
                                        "values":[" ( sector_oda_value / total_donor_oda_value )*100"]

                                    }
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
                                    "value": "% SECTOR/TOTAL"
                                },
                                "rid": {
                                    "uid": "percentage_ODA"
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
                                        "dac_member": {
                                            "enumeration": [
                                                "t"
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
                                    "uid": "filter_aggregated_oecd"
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
                                },
                                "rid":{"uid":"aggregated_oecd"}
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
                                        "donorcode"
                                    ],
                                    "rows": {
                                        "oda": {
                                            "enumeration": [
                                                "usd_commitment"
                                            ]
                                        },
                                        "dac_member": {
                                            "enumeration": [
                                                "t"
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
                                "rid":{"uid":"filter_sd"}

                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "donorcode",
                                        "year"


                                    ],
                                    "aggregations": [
                                    ]
                                },
                                "rid": {
                                    "uid": "sd"
                                }
                            },
                            {
                                "name": "addcolumn",
                                "parameters": {
                                    "column": {
                                        "dataType": "number",
                                        "id": "value_count",
                                        "title": {
                                            "EN": "Value"
                                        },
                                        "subject": null
                                    },
                                    "value": 1
                                },
                                "rid": {
                                    "uid": "percentage_Value"
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
                                                "value_count"
                                            ],
                                            "rule": "SUM"
                                        }
                                    ]
                                },
                                "rid": {
                                    "uid": "count_dac_members"
                                }
                            },

                            {
                                "name": "join",
                                "sid": [
                                    {
                                        "uid": "count_dac_members"
                                    },
                                    {
                                        "uid": "aggregated_oecd"
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
                                }
                            },
                            {
                                "name": "addcolumn",
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
                                        "values":[" ( aggregated_oecd_value / count_dac_members_value_count )"]
                                    }
                                },
                                "rid": {
                                    "uid": "avg_value"
                                }
                            },
                            {
                                "name": "filter",
                                "parameters": {
                                    "columns": [
                                        "year",
                                        "value",
                                        "aggregated_oecd_unitcode"
                                    ],
                                    "rows": {
                                    }
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
                                    "value": "OECD AVERAGE OF ODA IN THAT SECTOR"
                                },
                                "rid": {
                                    "uid": "OECD_AVG"
                                }
                            }
                        ]
                    },
                   /* {
                        id: 'top-partners', // TOP DONORS
                        type: 'chart',
                        config: {
                            type: "column",
                            x: ["donorname"], //x axis
                            series: ["flowcategory_name"], // series
                            y: ["value"],//Y dimension
                            aggregationFn: {"value": "sum"},
                            useDimensionLabelsIfExist: false,// || default raw else fenixtool

                            // filterFor: ['parentsector_code', 'purposecode', 'year-from', 'year-to'],
                            config: {
                                colors: ['#008080']
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
                            }]
                    },
                    {
                        id: 'top-partners-others', // TOP DONORS Vs OTHER DONORS
                        type: 'chart',
                        config: {
                            type: "pie",
                            x: ["indicator"], //x axis and series
                            series: ["unitname"], // series
                            y: ["value"],//Y dimension
                            aggregationFn: {"value": "sum"},
                            useDimensionLabelsIfExist: false,// || default raw else fenixtool

                            // filterFor: ['parentsector_code', 'purposecode', 'year-from', 'year-to'],

                            config: {
                                colors: ['#008080'],
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
                        // filter: { //FX-filter format
                        //   parentsector_code: ["600"],
                        //   year: [{value: "2000", parent: 'from'}, {value: "2014", parent:  'to'}]
                        // },
                        postProcess: [
                            {
                                "name": "union",
                                "sid": [
                                    {
                                        "uid": "top_10_donors_sum"
                                    },
                                    {
                                        "uid":"others"
                                    }
                                ],
                                "parameters": {
                                },
                                "rid":{"uid":"union_process"}

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
                                        },
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
                            },
                            {
                                "name": "filter",
                                "parameters": {
                                    "columns": [
                                        "unitcode",
                                        "value"

                                    ],
                                    "rows": {
                                    }
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
                                "name": "filter",
                                "sid": [
                                    {
                                        "uid": "adam_usd_aggregation_table"
                                    }
                                ],
                                "parameters": {
                                    "columns": [
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
                                    "values": [
                                    ]
                                },
                                "rid":{"uid":"join_process_total_donors"}
                            },
                            {
                                "name": "addcolumn",
                                "sid":[{"uid":"join_process_total_donors"}],
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
                                        "values":["top_all_donors_sum_value - top_10_donors_sum_value"]
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

                            // filterFor: ['parentsector_code', 'purposecode', 'year-from', 'year-to'],
                            config: {
                                colors: ['#56adc3']
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
                        id: 'top-channels', // TOP CHANNELS OF DELIVERY
                        type: 'chart',
                        config: {
                            type: "pie",
                            x: ["channelname"], //x axis and series
                            series: ["flowcategory_name"], // series
                            y: ["value"],//Y dimension
                            aggregationFn: {"value": "sum"},
                            useDimensionLabelsIfExist: false,// || default raw else fenixtool

                            // filterFor: ['parentsector_code', 'purposecode', 'year-from', 'year-to'],
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
                                        "channelcode", "channelname"
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
                            x: ["parentsector_name"], //x axis
                            series: ["flowcategory_name"], // series
                            y: ["value"],//Y dimension
                            aggregationFn: {"value": "sum"},
                            useDimensionLabelsIfExist: false,// || default raw else fenixtool

                            // filterFor: ['parentsector_code', 'purposecode', 'year-from', 'year-to'],
                            config: {
                                colors: ['#008080']
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
                                        "parentsector_name"
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
                        id: 'top-subsectors', // TOP SUB SECTORS
                        type: 'chart',
                        config: {
                            type: "pie",
                            x: ["purposename"], //x axis and series
                            series: ["flowcategory_name"], // series
                            y: ["value"],//Y dimension
                            aggregationFn: {"value": "sum"},
                            useDimensionLabelsIfExist: false,// || default raw else fenixtool

                            // filterFor: ['parentsector_code', 'purposecode', 'year-from', 'year-to'],
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
                        filter: { //FX-filter format
                            parentsector_code: ["600"],
                            recipientcode: ["625"],
                            year: [{value: "2000", parent: 'from'}, {value: "2014", parent: 'to'}]
                        },
                        postProcess: [
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "purposename"
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

                                zoomToCountry: [1]

                                //highlight service NOT WORK FOR NOW
                                //highlightCountry : [1], // GAUL Afghanistan
                            }
                        },

                        filter: { //FX-filter format
                            parentsector_code: ["600"],
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
                    }*/
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