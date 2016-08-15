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
                    className: "col-md-3",
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
                        frankie: true,
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
                                    name: '% Sector/Total ODA',
                                    yAxis: 1,
                                    dashStyle: 'shortdot',
                                    marker: {
                                        radius: 3
                                    }
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
                                    "value": "ODA Sector" // PART 1 FINAL INDICATOR NAME
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
                                    "value": "Total ODA" // PART 2 FINAL INDICATOR NAME
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
                                    "value": "% Sector/Total ODA"  // PART 3 FINAL INDICATOR NAME
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
                            "filter_top_10_donors_sum": ['parentsector_code', 'year', 'oda'],
                            "filter_all_donors_sum": ['parentsector_code', 'year', 'oda']
                        },

                        postProcess: [
                            {
                                "name": "union",
                                "sid": [
                                    {
                                        "uid": "top_10_donors_sum"
                                        // RESULT OF PART 1: TOTAL ODA for TOP 10 PARTNERS
                                    },
                                    {
                                        "uid": "others"
                                        // RESULT OF PART 3: TOTAL ODA OTHERS CALCULATION (TOTAL ODA ALL PARTNERS (PART 2) - TOTAL ODA FOR TOP 10 Partners)
                                    }
                                ],
                                "parameters": {},
                                "rid": {
                                    "uid": "union_process"
                                }
                            },
                            // PART 4: UNION is the FINAL PART IN THE PROCESS

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
                                "rid": {
                                    "uid": "filter_top_10_donors_sum"
                                }
                            },
                            // PART 1: TOTAL ODA for TOP 10 PARTNERS: (1i) Filter
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
                            // (1ii): TOTAL ODA for TOP 10 PARTNERS: Group by
                            {
                                "name": "order",
                                "parameters": {
                                    "value": "DESC"
                                },
                                "rid":{"uid":"filtered_dataset"}
                            },
                            // (1iii): TOTAL ODA for TOP 10 PARTNERS: Order by
                            {
                                "name": "page",
                                "parameters": {
                                    "perPage": 10,
                                    "page": 1
                                }
                            },
                            // (1iv): TOTAL ODA for TOP 10 PARTNERS: Limit
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
                            // (1vi): TOTAL ODA for TOP 10 PARTNERS: Group by
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
                                    // PART 1 FINAL INDICATOR NAME
                                },
                                "rid": {
                                    "uid": "top_10_donors_sum"
                                }
                            },
                            // (1vii): TOTAL ODA for TOP 10 PARTNERS: Add Column
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
                            // (2ii): TOTAL ODA for ALL PARTNERS: Group by
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
                                    // PART 2 FINAL INDICATOR NAME
                                },
                                "rid": {
                                    "uid": "top_all_donors_sum"
                                }
                            },
                            // (2iii): TOTAL ODA for ALL PARTNERS : Add Column
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
                            // PART 3: TOTAL ODA OTHERS CALCULATION: (3i) Join
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
                            // (3ii): TOTAL ODA OTHERS CALCULATION: Add Column
                            {
                                "name": "filter",
                                "parameters": {
                                    "columns": [
                                        "value",
                                        "unitcode"
                                    ]
                                }
                            },
                            // (3iii): TOTAL ODA OTHERS CALCULATION: Filter (filter out what is not needed)
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
                                    // PART 3 FINAL INDICATOR NAME
                                },
                                "rid": {
                                    "uid": "others"
                                }
                            }
                            // (3iv): TOTAL ODA OTHERS CALCULATION: Add Column
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
                                colors: ['#5DA58D'],
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
                                    "value": "Top Recipient Countries"
                                },
                                "rid": {
                                    "uid": "top_10_recipients_sum"
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
                                    "value": "Other Recipients"
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
                                    buttons: {
                                        toggleDataLabelsButton: {
                                            enabled: false
                                        }
                                    },
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
                                    name: '% Sector/Total',
                                    yAxis: 1,
                                    dashStyle: 'shortdot',
                                    marker: {
                                        radius: 3
                                    }
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
                    /*{
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
                                    name: '% Sector/Total',
                                    yAxis: 1,
                                    dashStyle: 'shortdot',
                                    marker: {
                                        radius: 3
                                    }
                                }//,

                                 //   {
                                   //     name: 'ODA from Resource Partner in Sector'//,
                                        // type: 'column'
                                   // },
                                   // {
                                       // name: 'Total ODA from Resource Partner'//,
                                     //   // type: 'column'
                                    //},
                                   // {
                                        //name: 'OECD Average of ODA in that Sector'//,
                                        // type: 'column'
                                    //}
                                    ],
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
                            "filter_donor_sector_oda": ['donorcode', 'parentsector_code', 'year', 'oda'],
                            "filter_total_donor_oda": ['donorcode', 'year', 'oda'],

                            "filter_total_oda_dac_members_by_year": ['parentsector_code', 'year', 'oda'],
                            "filter_dac_members_by_donor_year": ['parentsector_code', 'year', 'oda']
                        },

                        postProcess: [

                            {
                                "name": "union",
                                "sid": [
                                    {
                                        "uid": "donor_sector_oda" // RESULT OF PART 1: TOTAL ODA FROM DONOR IN SECTOR
                                    },
                                    {
                                        "uid": "total_donor_oda" // RESULT OF PART 2: TOTAL ODA FOR DONOR (ALL SECTORS)
                                    },
                                    {
                                        "uid":"percentage_ODA" // RESULT OF PART 3: PERCENTAGE CALCULATION (ODA FROM DONOR IN SECTOR / TOTAL ODA FROM DONOR x 100)
                                    },
                                    {
                                        "uid":"OECD_AVG" // RESULT OF PART 4: OECD DONORS (DAC MEMBERS) AVERAGE ODA IN SELECTED SECTOR
                                    }
                                ],
                                "parameters": {
                                },
                                "rid":{"uid":"union_process"}

                            }, // PART 5: UNION is the FINAL PART IN THE PROCESS
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
                                    "uid": "filter_donor_sector_oda"
                                }
                            }, // PART 1: TOTAL ODA FROM DONOR IN SECTOR: (1i) Filter
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
                            }, // (1ii): TOTAL ODA FROM DONOR IN SECTOR: Group by
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
                                    "value": "ODA from Resource Partner in Sector" // PART 1 FINAL INDICATOR NAME
                                },
                                "rid": {
                                    "uid": "donor_sector_oda"
                                }
                            }, // (1iii): TOTAL ODA FROM DONOR IN SECTOR: Add Column

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
                                                    "to": 2014
                                                }
                                            ]
                                        }
                                    }
                                },
                                "rid": {
                                    "uid": "filter_total_donor_oda"
                                }
                            },  // PART 2: TOTAL ODA FOR DONOR: (2i) Filter
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

                            }, // (2ii): TOTAL ODA FOR DONOR: Group by
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
                                    "value": "Total ODA from Resource Partner" // PART 2 FINAL INDICATOR NAME
                                },
                                "rid": {
                                    "uid": "total_donor_oda"
                                }
                            }, // (2iii): TOTAL ODA FOR DONOR: Add Column

                            {
                                "name": "join",
                                "sid": [
                                    {
                                        "uid": "donor_sector_oda"
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
                                        "values":[" ( donor_sector_oda_value / total_donor_oda_value )*100"]

                                    }
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
                                    "value": "% Sector/Total" // PART 3 FINAL INDICATOR NAME
                                },
                                "rid": {
                                    "uid": "percentage_ODA"
                                }
                            }, // (3vi) PERCENTAGE CALCULATION: Add Column

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
                                    "uid": "filter_total_oda_dac_members_by_year"
                                }
                            }, // PART 4 OECD DONORS (DAC MEMBERS) AVERAGE ODA: (4i) Filter
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
                            }, // (4ii): OECD DONORS (DAC MEMBERS) AVERAGE ODA: Group by

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
                                "rid":{"uid":"filter_dac_members_by_donor_year"}

                            }, // (4iii): OECD DONORS (DAC MEMBERS) AVERAGE ODA: Filter
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
                            }, // (4iv): OECD DONORS (DAC MEMBERS) AVERAGE ODA: Group by
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
                            }, // (4v): OECD DONORS (DAC MEMBERS) AVERAGE ODA: Add Column
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
                            }, // (4vi): OECD DONORS (DAC MEMBERS) AVERAGE ODA: Group by

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
                            }, // (4vii): OECD DONORS (DAC MEMBERS) AVERAGE ODA: Join
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
                            }, // (4viii): OECD DONORS (DAC MEMBERS) AVERAGE ODA: Add Column
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
                            }, // (4ix): OECD DONORS (DAC MEMBERS) AVERAGE ODA: Filter
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
                                    "value": "OECD Average of ODA in Sector" // PART 4 FINAL INDICATOR NAME
                                },
                                "rid": {
                                    "uid": "OECD_AVG"
                                }
                            } // (4x): OECD DONORS (DAC MEMBERS) AVERAGE ODA: Add Column
                        ]
                    },
                   {
                        id: "tot-oda-gni", //ref [data-item=':id']
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
                                    name: '% ODA/GNI',
                                    yAxis: 1,
                                    dashStyle: 'shortdot',
                                    marker: {
                                        radius: 3
                                    }
                                },
                                    {
                                        name: '% OECD Average of ODA/GNI',
                                        yAxis: 1,
                                        dashStyle: 'shortdot',
                                        marker: {
                                            radius: 3
                                        }
                                    }
                                ],
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
                            "filter_total_ODA": ['donorcode', 'year', 'oda'],
                            "filter_gni_donor_oda": ['donorcode', 'year'],

                            "filter_total_oda_dac_members_by_year": ['year', 'oda'],
                            "filter_dac_members_by_donor_year": ['year', 'oda']
                        },

                        postProcess: [

                            {
                                "name": "union",
                                "sid": [
                                    {
                                        "uid": "total_donor_oda" // RESULT OF PART 1: TOTAL ODA FOR DONOR (ALL SECTORS)
                                    },
                                    {
                                        "uid": "gni_donor_oda" // RESULT OF PART 2: GNI OF DONOR
                                    },
                                    {
                                        "uid":"percentage_ODA_GNI" // RESULT OF PART 3: PERCENTAGE CALCULATION (TOTAL ODA FOR DONOR / GNI FOR DONOR x 100)
                                    },
                                    {
                                        "uid":"percentage_OECD_AVG_GNI" // RESULT OF PART 5 (PART 4 used to calculated OECD_AVG): PERCENTAGE CALCULATION (OECD DONORS AVERAGE ODA / GNI FOR DONOR x 100)
                                    }
                                ],
                                "parameters": {
                                },
                                "rid":{"uid":"union_process"}

                            }, // PART 6: UNION is the FINAL PART IN THE PROCESS

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
                                                    "to": 2014
                                                }
                                            ]
                                        }
                                    }
                                },
                                "rid":{"uid":"filter_total_ODA"}
                            }, // PART 1: TOTAL ODA FOR DONOR (ALL SECTORS): (1i) Filter
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

                            }, // (1ii): TOTAL ODA FOR DONOR (ALL SECTORS): Group by
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
                                    "value": "Total ODA from Resource Partner"
                                },
                                "rid": {
                                    "uid": "total_donor_oda"
                                }
                            }, // (1iii): TOTAL ODA FOR DONOR (ALL SECTORS): Add Column

                            {
                                "name": "filter",
                                "sid": [
                                    {
                                        "uid": "adam_donors_gni"
                                    }
                                ],
                                "parameters": {
                                    "columns": [
                                        "year",
                                        "value",
                                        "unitcode"
                                    ],
                                    "rows": {
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
                                    "uid": "filter_gni_donor_oda"
                                }
                            }, // PART 2: GNI OF DONOR: (2i) Filter
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
                            }, // (2ii): GNI OF DONOR: Group by
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
                                    "value": "Resource Partner GNI"
                                },
                                "rid": {
                                    "uid": "gni_donor_oda"
                                }
                            }, // (2iii): GNI OF DONOR: Add Column

                            {
                                "name": "join",
                                "sid": [
                                    {
                                        "uid": "gni_donor_oda"
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
                                "rid":{"uid":"join_process_oda_gni"}
                            },  // PART 3 PERCENTAGE CALCULATION: (3i) Join
                            {
                                "name": "addcolumn",
                                "sid":[{"uid":"join_process_oda_gni"}],
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
                                        "values":[" ( total_donor_oda_value / gni_donor_oda_value)*100"]
                                    }
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
                                }
                            },  // (3iii) PERCENTAGE CALCULATION: filter (filter out what is not needed)
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
                                    "value": "% ODA/GNI"
                                },
                                "rid": {
                                    "uid": "percentage_ODA_GNI"
                                }
                            }, // (3vi) PERCENTAGE CALCULATION: Add Column

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
                                    "uid": "filter_total_oda_dac_members_by_year"
                                }
                            }, // PART 4 OECD DONORS (DAC MEMBERS) AVERAGE ODA: (4i) Filter
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
                            }, // (4ii): OECD DONORS (DAC MEMBERS) AVERAGE ODA: Group by
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
                                "rid":{"uid":"filter_dac_members_by_donor_year"}

                            }, // (4iii): OECD DONORS (DAC MEMBERS) AVERAGE ODA: Filter
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
                            }, // (4iv): OECD DONORS (DAC MEMBERS) AVERAGE ODA: Group by
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
                            }, // (4v): OECD DONORS (DAC MEMBERS) AVERAGE ODA: Add Column
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
                            }, // (4vi): OECD DONORS (DAC MEMBERS) AVERAGE ODA: Group by

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
                            }, // (4vii): OECD DONORS (DAC MEMBERS) AVERAGE ODA: Join
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
                            }, // (4viii): OECD DONORS (DAC MEMBERS) AVERAGE ODA: Add Column
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
                            }, // (4ix): OECD DONORS (DAC MEMBERS) AVERAGE ODA: Filter
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
                                    "value": "OECD Average of ODA" // PART 4 FINAL INDICATOR NAME
                                },
                                "rid": {
                                    "uid": "OECD_AVG"
                                }
                            }, // (4x): OECD DONORS (DAC MEMBERS) AVERAGE ODA: Add Column

                            {
                                "name": "join",
                                "sid": [
                                    {
                                        "uid": "OECD_AVG"
                                    },
                                    {
                                        "uid": "gni_donor_oda"
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
                                "rid":{"uid":"join_process_oecd_avg_gni"}
                            },  // PART 5 PERCENTAGE CALCULATION [OECD AVG/GNI]: (5i) Join
                            {
                                "name": "addcolumn",
                                "sid":[{"uid":"join_process_oecd_avg_gni"}],
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
                                        "values":[" ( OECD_AVG_value / gni_donor_oda_value)*100"]
                                    }
                                }
                            }, // (5ii) PERCENTAGE CALCULATION [OECD AVG/GNI]: Add Column
                            {
                                "name": "filter",
                                "parameters": {
                                    "columns": [
                                        "year",
                                        "value"
                                    ],
                                    "rows": {}
                                }
                            },  // (5iii) PERCENTAGE CALCULATION [OECD AVG/GNI]: filter (filter out what is not needed)
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
                            }, // (5iv) PERCENTAGE CALCULATION [OECD AVG/GNI]: Add Column (Measurement Unit Code)
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
                                    "value": "% OECD Average of ODA/GNI"
                                },
                                "rid": {
                                    "uid": "percentage_OECD_AVG_GNI"
                                }
                            } // (5vi) PERCENTAGE CALCULATION [OECD AVG/GNI]: Add Column
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
                                colors: ['#5DA58D'],
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
                            donorcode: ["1"],
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
                            "filter_top_10_recipients_sum": ['donorcode', 'parentsector_code', 'year', 'oda'],
                            "filter_all_recipients_sum": ['donorcode', 'parentsector_code', 'year', 'oda']
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
                                    "value": "Top Recipient Countries"
                                },
                                "rid": {
                                    "uid": "top_10_recipients_sum"
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
                                    "value": "Other Recipients"
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
                            donorcode: ["1"],
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
                        filter: { //FX-filter format
                            donorcode: ["1"],
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
                                    buttons: {
                                        toggleDataLabelsButton: {
                                            enabled: false
                                        }
                                    },
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
                            donorcode: ["1"],
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
                            donorcode: ["1"],
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
        "country_donor": {
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
                                    name: '% ODA to Recipient/Total Resource Partner ODA',
                                    yAxis: 1,
                                    dashStyle: 'shortdot',
                                    marker: {
                                        radius: 3
                                    }
                                }
                                ],
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
                            "filter_donor_recipient_oda": ['donorcode', 'recipientcode', 'year', 'oda'],
                            "filter_total_donor_oda": ['donorcode', 'year', 'oda'],

                            "filter_total_oda_dac_members_by_year": ['recipientcode', 'year', 'oda'],
                            "filter_dac_members_by_donor_year": ['recipientcode', 'year', 'oda']
                        },

                        postProcess: [

                            {
                                "name": "union",
                                "sid": [
                                    {
                                        "uid": "donor_recipient_oda" // RESULT OF PART 1: TOTAL ODA FROM DONOR TO RECIPIENT
                                    },
                                    {
                                        "uid": "total_donor_oda" // RESULT OF PART 2: TOTAL ODA FOR DONOR (ALL RECIPIENTS)
                                    },
                                    {
                                        "uid":"percentage_ODA" // RESULT OF PART 3: PERCENTAGE CALCULATION (ODA FROM DONOR TO RECIPIENT / TOTAL ODA FROM DONOR x 100)
                                    },
                                    {
                                        "uid":"OECD_AVG" // RESULT OF PART 4: OECD DONORS (DAC MEMBERS) AVERAGE ODA IN SELECTED SECTOR
                                    }
                                ],
                                "parameters": {
                                },
                                "rid":{"uid":"union_process"}

                            }, // PART 5: UNION is the FINAL PART IN THE PROCESS
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
                                    "uid": "filter_donor_recipient_oda"
                                }
                            }, // PART 1: TOTAL ODA FROM DONOR TO RECIPIENT: (1i) Filter
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
                            }, // (1ii): TOTAL ODA FROM DONOR TO RECIPIENT: Group by
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
                                    "value": "ODA from Resource Partner to Recipient" // PART 1 FINAL INDICATOR NAME
                                },
                                "rid": {
                                    "uid": "donor_recipient_oda"
                                }
                            }, // (1iii): TOTAL ODA FROM DONOR TO RECIPIENT: Add Column

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
                                                    "to": 2014
                                                }
                                            ]
                                        }
                                    }
                                },
                                "rid": {
                                    "uid": "filter_total_donor_oda"
                                }
                            },  // PART 2: TOTAL ODA FOR DONOR: (2i) Filter
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

                            }, // (2ii): TOTAL ODA FOR DONOR: Group by
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
                                    "value": "Total ODA from Resource Partner" // PART 2 FINAL INDICATOR NAME
                                },
                                "rid": {
                                    "uid": "total_donor_oda"
                                }
                            }, // (2iii): TOTAL ODA FOR DONOR: Add Column

                            {
                                "name": "join",
                                "sid": [
                                    {
                                        "uid": "donor_recipient_oda"
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
                                        "values":[" ( donor_recipient_oda_value / total_donor_oda_value )*100"]

                                    }
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
                                    "value": "% ODA to Recipient/Total Resource Partner ODA" // PART 3 FINAL INDICATOR NAME
                                },
                                "rid": {
                                    "uid": "percentage_ODA"
                                }
                            }, // (3vi) PERCENTAGE CALCULATION: Add Column

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
                                    "uid": "filter_total_oda_dac_members_by_year"
                                }
                            }, // PART 4 OECD DONORS (DAC MEMBERS) AVERAGE ODA: (4i) Filter
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
                            }, // (4ii): OECD DONORS (DAC MEMBERS) AVERAGE ODA: Group by

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
                                "rid":{"uid":"filter_dac_members_by_donor_year"}

                            }, // (4iii): OECD DONORS (DAC MEMBERS) AVERAGE ODA: Filter
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
                            }, // (4iv): OECD DONORS (DAC MEMBERS) AVERAGE ODA: Group by
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
                            }, // (4v): OECD DONORS (DAC MEMBERS) AVERAGE ODA: Add Column
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
                            }, // (4vi): OECD DONORS (DAC MEMBERS) AVERAGE ODA: Group by

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
                            }, // (4vii): OECD DONORS (DAC MEMBERS) AVERAGE ODA: Join
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
                            }, // (4viii): OECD DONORS (DAC MEMBERS) AVERAGE ODA: Add Column
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
                            }, // (4ix): OECD DONORS (DAC MEMBERS) AVERAGE ODA: Filter
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
                                    "value": "OECD Average of ODA in that Recipient Country" // PART 4 FINAL INDICATOR NAME
                                },
                                "rid": {
                                    "uid": "OECD_AVG"
                                }
                            } // (4x): OECD DONORS (DAC MEMBERS) AVERAGE ODA: Add Column
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
                            recipientcode: ["625"],
                            donorcode: ["1"],
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
                            x: ["parentsector_name"], //x axis
                            series: ["flowcategory_name"], // series
                            y: ["value"],//Y dimension
                            aggregationFn: {"value": "sum"},
                            useDimensionLabelsIfExist: false,// || default raw else fenixtool
                            config: {
                                colors: ['#5DA58D'],
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
                            recipientcode: ["625"],
                            donorcode: ["1"],
                            year: [{value: "2000", parent: 'from'}, {value: "2014", parent:  'to'}]
                        },
                        postProcess: [
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "parentsector_name", "parentsector_code"
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
                        id: 'top-sectors-others', // TOP SECTORS Vs OTHER SECTORS
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
                            "filter_top_10_sectors_sum": ['recipientcode', 'donorocode', 'year', 'oda'],
                            "filter_all_sectors_sum": ['recipientcode', 'donorocode', 'year', 'oda']
                        },

                        postProcess: [
                            {
                                "name": "union",
                                "sid": [
                                    {
                                        "uid": "top_10_sectors_sum"
                                        // RESULT OF PART 1: TOTAL ODA for TOP 10 SECTORS
                                    },
                                    {
                                        "uid": "others"
                                        // RESULT OF PART 3: TOTAL ODA OTHERS CALCULATION (TOTAL ODA ALL SECTORS (PART 2) - TOTAL ODA FOR TOP 10 Sectors)
                                    }
                                ],
                                "parameters": {},
                                "rid": {
                                    "uid": "union_process"
                                }
                            },
                            // PART 4: UNION is the FINAL PART IN THE PROCESS

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
                                    "uid": "filter_top_10_sectors_sum"
                                }
                            },
                            // PART 1: TOTAL ODA for TOP 10 SECTORS: (1i) Filter
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
                            // (1ii): TOTAL ODA for TOP 10 SECTORS: Group by
                            {
                                "name": "order",
                                "parameters": {
                                    "value": "DESC"
                                },
                                "rid":{"uid":"filtered_dataset"}
                            },
                            // (1iii): TOTAL ODA for TOP 10 SECTORS: Order by
                            {
                                "name": "page",
                                "parameters": {
                                    "perPage": 10,
                                    "page": 1
                                }
                            },
                            // (1iv): TOTAL ODA for TOP 10 SECTORS: Limit
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
                            // (1vi): TOTAL ODA for TOP 10 SECTORS: Group by
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
                                    // PART 1 FINAL INDICATOR NAME
                                },
                                "rid": {
                                    "uid": "top_10_sectors_sum"
                                }
                            },
                            // (1vii): TOTAL ODA for TOP 10 PARTNERS: Add Column
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
                            // PART 2i: TOTAL ODA for ALL SECTORS: Group by
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
                                    // PART 2 FINAL INDICATOR NAME
                                },
                                "rid": {
                                    "uid": "top_all_sectors_sum"
                                }
                            },
                            // (2ii): TOTAL ODA for ALL SECTORS : Add Column
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
                            // PART 3: TOTAL ODA OTHERS CALCULATION: (3i) Join
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
                            // (3ii): TOTAL ODA OTHERS CALCULATION: Add Column
                            {
                                "name": "filter",
                                "parameters": {
                                    "columns": [
                                        "value",
                                        "unitcode"
                                    ]
                                }
                            },
                            // (3iii): TOTAL ODA OTHERS CALCULATION: Filter (filter out what is not needed)
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
                                    // PART 3 FINAL INDICATOR NAME
                                },
                                "rid": {
                                    "uid": "others"
                                }
                            }
                            // (3iv): TOTAL ODA OTHERS CALCULATION: Add Column
                        ]
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
                        filter: { //FX-filter format
                            recipientcode: ["625"],
                            donorcode: ["1"],
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
                    }
                ]
            }
        }
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