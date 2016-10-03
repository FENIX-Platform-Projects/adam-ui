/*global define*/

define(function () {

    'use strict';

    return {
            id: 'OTHER_SECTORS',
            filter: {
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

                            config: {
                                xAxis: {
                                    type: 'datetime'
                                }
                            }
                        },

                        filterFor: {
                            "filter_total_ODA": ['year', 'oda']
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
                        id: "top-recipients-all-sectors", //ref [data-item=':id']
                        type: 'chart',
                        config: {
                            type: "column",
                            x: ["recipientcode"], //x axis
                            series: ["unitcode"], // series
                            y: ["value"],//Y dimension
                            aggregationFn: {"value": "sum"},
                            useDimensionLabelsIfExist: true,// || default raw else fenixtool

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
                            "filter_top_10_recipients_sum": ['year', 'oda']
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
                                        "recipientcode", "unitcode"
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
                                    "query": "WHERE recipientcode NOT IN (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", // skipping regional recipient countries (e.g. "Africa, regional"; "North of Sahara, regional")
                                    "queryParameters": [
                                        {"value": '298'}, {"value": '498'}, {"value": '798'}, {"value": '89'},
                                        {"value": '589'}, {"value": '889'}, {"value": '189'}, {"value": '289'},
                                        {"value": '389'}, {"value": '380'}, {"value": '489'}, {"value": '789'},
                                        {"value": '689'}, {"value": '619'}, {"value": '679'}, {"value": 'NA'}
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
                        id: "top-partners-all-sectors", //ref [data-item=':id']
                        type: 'chart',
                        config: {
                            type: "column",
                            x: ["donorcode"], //x axis
                            series: ["unitcode"], // series
                            y: ["value"],//Y dimension
                            aggregationFn: {"value": "sum"},
                            useDimensionLabelsIfExist: true,// || default raw else fenixtool

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
                            "filter_top_10_partners_sum": ['year', 'oda']
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
                                "rid":{"uid":"filter_top_10_partners_sum"}
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "donorcode", "unitcode"
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
                                    "query": "WHERE donorcode NOT IN (?)", // skipping regional recipient countries (e.g. "Africa, regional"; "North of Sahara, regional")
                                    "queryParameters": [
                                       {"value": 'NA'}
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
                        id: "top-sectors", //ref [data-item=':id']
                        type: 'chart',
                        config: {
                            type: "column",
                            x: ["parentsector_code"], //x axis
                            series: ["unitcode"], // series
                            y: ["value"],//Y dimension
                            aggregationFn: {"value": "sum"},
                            useDimensionLabelsIfExist: true,// || default raw else fenixtool

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
                            "filter_top_10_sectors_sum": ['year', 'oda']
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
                                "rid":{"uid":"filter_top_10_sectors_sum"}
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "parentsector_code", "unitcode"
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
                                    "query": "WHERE parentsector_code NOT IN (?)", // skipping regional recipient countries (e.g. "Africa, regional"; "North of Sahara, regional")
                                    "queryParameters": [
                                        {"value": 'NA'}
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
                        id: 'top-subsectors', // TOP SUB SECTORS
                        type: 'chart',
                        config: {
                            type: "pieold",
                            x: ["purposecode"], //x axis and series
                            series: ["unitcode"], // series
                            y: ["value"],//Y dimension
                            aggregationFn: {"value": "sum"},
                            useDimensionLabelsIfExist: true,// || default raw else fenixtool

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
                            "filter_top_10_subsectors_sum": ['year', 'oda']
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
                                        "purposecode",
                                        "value",
                                        "unitcode"
                                    ],
                                    "rows": {
                                        "oda": {
                                            "enumeration": [
                                                "usd_commitment"
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
                                "rid":{"uid":"filter_top_10_subsectors_sum"}
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "purposecode", "unitcode"
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
                                    "query": "WHERE purposecode NOT IN (?)", // skipping regional recipient countries (e.g. "Africa, regional"; "North of Sahara, regional")
                                    "queryParameters": [
                                       {"value": 'NA'}
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
                        id: 'oda-regional', // REGIONAL DISTRIBUTION
                        type: 'chart',
                        config: {
                            type: "column",
                            x: ["unitcode"], //x axis
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
                            year: [{value: 2000, parent: 'from'}, {value: 2014, parent:  'to'}]
                        },

                        postProcess: [
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "unitcode", "un_continent_code"
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
        }



});