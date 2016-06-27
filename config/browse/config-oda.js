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
                            "filter_sector_oda": ['parentsector_code', 'year', 'oda'],
                            "filter_total_oda": ['year']
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
                                    "values": []
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
                                        "keys": ["1=1"],
                                        "values": ["(sector_oda_value/total_oda_value)*100"]
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
                        id: 'top-recipients', // TOP RECIPIENTS
                        type: 'chart',
                        config: {
                            type: "column",
                            x: ["recipientname"], //x axis
                            series: ["flowcategory_name"], // series
                            y: ["value"],//Y dimension
                            aggregationFn: {"value": "sum"},
                            useDimensionLabelsIfExist: false,// || default raw else fenixtool

                            // filterFor: ['parentsector_code', 'purposecode', 'year-from', 'year-to'],
                            config: {
                                colors: ['#5DA58D'],
                                xAxis: {
                                    labels: {
                                        "style": {
                                            width: '100px',
                                            //whiteSpace: 'nowrap'
                                        },
                                        //  step: 1
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
                        // filter: { //FX-filter format
                        //   parentsector_code: ["600"],
                        //   year: [{value: "2000", parent: 'from'}, {value: "2014", parent:  'to'}]
                        // },
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
                                }
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
                                    "value": "Top Recipients"
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
                        id: 'top-channels', // TOP CHANNELS OF DELIVERY
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
                            // filterFor: ['parentsector_code', 'purposecode', 'year-from', 'year-to'],
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