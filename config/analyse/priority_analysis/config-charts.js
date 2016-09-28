/*global define*/

define(function () {

    'use strict';

    return {

        dashboard: {
            //default dataset id
            uid: "adam_priority_analysis",

            context: "BY_PARTNER",

            items: [
                {
                    id: "top-partners", // TOP 10 RECIPIENTS
                    type: 'chart',
                    config: {
                        type: "column",
                        x: ["donorcode_EN"], //x axis
                        series: ["indicator"], // series
                        y: ["value"],//Y dimension
                        aggregationFn: {"value": "sum"},
                        useDimensionLabelsIfExist: false,// || default raw else fenixtool

                        config: {
                            chart: {
                                marginTop: 50
                            },
                            subtitle: {
                                text: ''
                            }
                        }

                    },

                    filterFor: {
                        //  "filter_top_10": ['year', 'purposecode', 'recipientcode']
                        "filter_top_10": ['year', 'purposecode']
                    },

                    postProcess: [
                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_priority_analysis"
                                }
                            ],
                            "parameters": {
                                "columns": [
                                    "donorcode",
                                    "value",
                                    "unitcode"
                                ],
                                "rows": {
                                    /* "recipientcode": {
                                     "codes": [
                                     {
                                     "uid": "crs_recipients",
                                     "version": "2016",
                                     "codes": [
                                     "625"
                                     ]
                                     }
                                     ]
                                     },*/
                                    "purposecode": {
                                        "codes": [
                                            {
                                                "uid": "crs_purposes",
                                                "version": "2016",
                                                "codes": [
                                                    "99820"
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
                            "rid": {"uid": "filter_top_10"}
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
                            }
                        },
                        {
                            "name": "page",
                            "parameters": {
                                "perPage": 10,
                                "page": 1
                            },
                            "rid": {"uid": "top_10"}
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
                                "value": "ODA" // PART 1 FINAL INDICATOR NAME
                            },
                            "rid": {
                                "uid": "oda"
                            }
                        }

                    ]
                }, // TOP 10 PARTNERS
                {
                    id: "top-recipients", // TOP 10 RECIPIENTS
                    type: 'chart',
                    config: {
                        type: "column",
                        x: ["donorcode_EN"], //x axis
                        series: ["indicator"], // series
                        y: ["value"],//Y dimension
                        aggregationFn: {"value": "sum"},
                        useDimensionLabelsIfExist: false,// || default raw else fenixtool

                        config: {
                            chart: {
                                marginTop: 50
                            },
                            subtitle: {
                                text: ''
                            }
                        }

                    },

                    filterFor: {
                        //  "filter_top_10": ['year', 'purposecode', 'recipientcode']
                        "filter_top_10": ['year', 'purposecode']
                    },

                    postProcess: [
                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_priority_analysis"
                                }
                            ],
                            "parameters": {
                                "columns": [
                                    "donorcode",
                                    "value",
                                    "unitcode"
                                ],
                                "rows": {
                                    /* "recipientcode": {
                                     "codes": [
                                     {
                                     "uid": "crs_recipients",
                                     "version": "2016",
                                     "codes": [
                                     "625"
                                     ]
                                     }
                                     ]
                                     },*/
                                    "purposecode": {
                                        "codes": [
                                            {
                                                "uid": "crs_purposes",
                                                "version": "2016",
                                                "codes": [
                                                    "99820"
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
                            "rid": {"uid": "filter_top_10"}
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
                            }
                        },
                        {
                            "name": "page",
                            "parameters": {
                                "perPage": 10,
                                "page": 1
                            },
                            "rid": {"uid": "top_10"}
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
                                "value": "ODA" // PART 1 FINAL INDICATOR NAME
                            },
                            "rid": {
                                "uid": "oda"
                            }
                        }

                    ]
                }, // TOP 10 RECIPIENTS
                {
                    id: "financing-priorities-partners",
                    type: 'chart',
                    config: {
                        type: "column",
                        x: ["purposecode_EN"], //x axis
                        series: ["donorcode_EN"], // series
                        y: ["value"],//Y dimension
                        aggregationFn: {"value": "sum"},
                        useDimensionLabelsIfExist: false,// || default raw else fenixtool

                        config: {
                            chart: {
                                marginTop: 50
                            },
                            subtitle: {
                                text: ''
                            },
                            plotOptions: {
                                column: {
                                    stacking: 'normal'
                                }
                            },
                            tooltip: {
                                formatter: function () {
                                    var unit = 'USD Mil';

                                    return '<b>' +
                                        this.series.name + '</b><br/>' +
                                        Highcharts.numberFormat(this.y, 2, '.', ',') + ' ' + unit;
                                }
                            },
                            exporting: {
                                buttons: {
                                    toggleDataLabelsButton: {
                                        enabled: false
                                    }
                                }
                            }
                        }
                    },

                    filterFor: {
                        //"filter_top_10": ['year', 'purposecode', 'recipientcode']
                        "filter_top_10": ['year', 'purposecode']
                    },

                    postProcess: [
                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_priority_analysis"
                                }
                            ],
                            "parameters": {
                                "columns": [
                                    "donorcode",
                                    "purposecode",
                                    "value",
                                    "unitcode"
                                ],
                                "rows": {
                                    "year": {
                                        "time": [
                                            {
                                                "from": 2000,
                                                "to": 2014
                                            }
                                        ]
                                    },
                                    /*"recipientcode": {
                                     "codes": [
                                     {
                                     "uid": "crs_recipients",
                                     "version": "2016",
                                     "codes": [
                                     "625"
                                     ]
                                     }
                                     ]
                                     },*/
                                    "purposecode": {
                                        "codes": [
                                            {
                                                "uid": "crs_purposes",
                                                "version": "2016",
                                                "codes": [
                                                    "99820"
                                                ]
                                            }
                                        ]
                                    }
                                }
                            },
                            "rid": {"uid": "filter_top_10"}
                        },
                        {
                            "name": "group",
                            "parameters": {
                                "by": [
                                    "donorcode",
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
                                    }
                                ]
                            }
                        },
                        {
                            "name": "order",
                            "parameters": {
                                "value": "DESC"
                            }
                        }//,
                        // {
                        //   "name": "page",
                        //  "parameters": {
                        //    "perPage": 10,
                        //    "page": 1
                        // }
                        // },
                    ]
                }, // BY TOP 10 RESOURCE PARTNERS
                {
                    id: "financing-priorities-recipients",
                    type: 'chart',
                    config: {
                        type: "column",
                        x: ["purposecode_EN"], //x axis
                        series: ["donorcode_EN"], // series
                        y: ["value"],//Y dimension
                        aggregationFn: {"value": "sum"},
                        useDimensionLabelsIfExist: false,// || default raw else fenixtool

                        config: {
                            chart: {
                                marginTop: 50
                            },
                            subtitle: {
                                text: ''
                            },
                            plotOptions: {
                                column: {
                                    stacking: 'normal'
                                }
                            },
                            tooltip: {
                                formatter: function () {
                                    var unit = 'USD Mil';

                                    return '<b>' +
                                        this.series.name + '</b><br/>' +
                                        Highcharts.numberFormat(this.y, 2, '.', ',') + ' ' + unit;
                                }
                            },
                            exporting: {
                                buttons: {
                                    toggleDataLabelsButton: {
                                        enabled: false
                                    }
                                }
                            }
                        }
                    },

                    filterFor: {
                        //"filter_top_10": ['year', 'purposecode', 'recipientcode']
                        "filter_top_10": ['year', 'purposecode']
                    },

                    postProcess: [
                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_priority_analysis"
                                }
                            ],
                            "parameters": {
                                "columns": [
                                    "donorcode",
                                    "purposecode",
                                    "value",
                                    "unitcode"
                                ],
                                "rows": {
                                    "year": {
                                        "time": [
                                            {
                                                "from": 2000,
                                                "to": 2014
                                            }
                                        ]
                                    },
                                    /*"recipientcode": {
                                     "codes": [
                                     {
                                     "uid": "crs_recipients",
                                     "version": "2016",
                                     "codes": [
                                     "625"
                                     ]
                                     }
                                     ]
                                     },*/
                                    "purposecode": {
                                        "codes": [
                                            {
                                                "uid": "crs_purposes",
                                                "version": "2016",
                                                "codes": [
                                                    "99820"
                                                ]
                                            }
                                        ]
                                    }
                                }
                            },
                            "rid": {"uid": "filter_top_10"}
                        },
                        {
                            "name": "group",
                            "parameters": {
                                "by": [
                                    "donorcode",
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
                                    }
                                ]
                            }
                        },
                        {
                            "name": "order",
                            "parameters": {
                                "value": "DESC"
                            }
                        }//,
                        // {
                        //   "name": "page",
                        //  "parameters": {
                        //    "perPage": 10,
                        //    "page": 1
                        // }
                        // },
                    ]
                } // BY TOP 10 RECIPIENTS

            ]
        }
    }


});