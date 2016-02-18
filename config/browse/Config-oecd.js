/*global define*/

define(function () {

    'use strict';

    return {

        SECONDARY_MENU: {
            url: 'config/browse/secondary_menu.json'
        },

        "sector": {

            filter: [
                {
                    "type": "codelist-hierarchy",
                    "containerType": "baseContainer",
                    "title": "Sector",
                    "module_class": "fx-filter-grid-module",
                    "class": "col-md-3 col-lg-2",
                    "components": [
                        {
                            "uid": "crs_dac",
                            "version": "2016",
                            "type": "codelist-hierarchy",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},
                            "name": "parentsector_code",
                            config: {
                                "defaultsource": [
                                    //{"value": null, "label": "All", "selected": true},
                                ],
                                "defaultcodes": ['600'],
                                "onlyValueText": true,
                                "enableMultiselection": false,
                                "filter": {
                                    "uid": "crs_dac",
                                    "version": "2016",
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
                    "module_class": "fx-filter-grid-module",
                    "class": "col-md-3 col-lg-2",
                    "components": [
                        {
                            "uid": "crs_dac",
                            "version": "2016",
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
                                    "version": "2016",
                                    "level" : 3,
                                    "levels":3
                                }
                            },
                            creator: {
                                    allowClear: true,
                                    placeholder: "All"
                            }
                        }
                    ]
                },
                {
                    "type": "static",
                    "containerType": "baseContainer",
                    "module_class": "fx-filter-grid-module",
                    "class": "col-md-3 col-lg-2",
                    "components": [
                        {
                            "type": "range",
                            "name": "year",
                            "componentType": "timeRangeLists-FENIX",
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
                                        {"value": "2013", "label": "2013", "selected": false},
                                        {"value": "2014", "label": "2014", "selected": false}
                                    ]
                                },
                                "to" : {
                                    "title":  {"EN": "To"},
                                    "defaultsource": [
                                        {"value": "2014", "label": "2014", "selected": true},
                                        {"value": "2013", "label": "2013", "selected": false},
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
                    "title": "Channel Parent Category",
                    "module_class": "fx-filter-grid-module",
                    "class": "col-md-3 col-lg-2",
                    "components": [
                        {
                            "uid": "crs_channels",
                            "version": "2016",
                            "type": "codelist-hierarchy",
                            "name": "channelsubcategory_code",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},

                            config: {
                                "defaultsource": [],
                                "onlyValueText": true,
                                "filter": {
                                    "uid": "crs_channels",
                                    "version": "2016",
                                    "level" : 2,
                                    "levels":3
                                }
                            },
                            creator: {
                                allowClear: true,
                                placeholder: "All"
                            }
                        }
                    ]
                },
                {
                    "type": "codelist-hierarchy",
                    "containerType": "baseContainer",
                    "title": "Channel of Delivery",
                    "module_class": "fx-filter-grid-module",
                    "class": "col-md-3 col-lg-2",
                    "components": [
                        {
                            "uid": "crs_channels",
                            "version": "2016",
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
                                    "version": "2016",
                                    "level" : 3,
                                    "levels":3
                                }
                            },
                            creator: {
                                allowClear: true,
                                placeholder: "All"
                            }
                        }
                    ]
                },
                {
                    "type": "codelist",
                    "containerType": "baseContainer",
                    "title": "ODA",
                    "icon" : {
                        "class" : "fa fa-info-circle",
                        "tooltip" : "Official Development Assistance - Grants, Grant-Like, Loans and Equity Investment"
                    },
                    "module_class": "fx-filter-grid-module",
                    "class": "col-md-3 col-lg-2",
                    "components": [
                        {
                            "uid": "crs_flow_amounts",
                            "version": "2016",
                            "type": "codelist",
                            "name": "uid",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},
                            config: {
                                "defaultsource": [],
                                "defaultcodes": ['adam_usd_commitment'],
                                "onlyValueText": true,
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
                                seriesDimensions: ['parentsector_code']
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "line"
                                    },
                                   /** subtitle: {
                                        text: '<b>Click and drag on chart to zoom</b>'
                                    },
                                    credits: {
                                        enabled: true,
                                        text: 'Source: OECD',
                                        href: ''
                                    },
                                    lang: {
                                        doptions: "Chart Download options"
                                    },**/
                                    exporting:{
                                       /** buttons: {
                                            contextButton: {
                                                _titleKey:"doptions",
                                                text: 'Download'
                                            }
                                            //contextButton: {symbol: 'url(http://www.emanuelchurch.com/images/download_icon_small.png)'}
                                        },**/
                                        chartOptions:{
                                          /**  subtitle: {
                                                text: ''
                                            },**/
                                            legend:{
                                                enabled:true//,
                                             /**   title: {
                                                    text: ''
                                                }**/
                                            }
                                        }
                                    },
                                    legend: {
                                        align: 'center',
                                        verticalAlign: 'bottom',
                                        layout: 'horizontal',
                                        x:0,
                                        y:0
                                    },
                                   /** legend: {
                                        title: {
                                            text: 'Click to hide/show'
                                        }
                                    },**/
                                    xAxis : {
                                        type: 'datetime'
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
                        allowedFilter: ['parentsector_code', 'purposecode', 'year', 'channelsubcategory_code', 'channelcode'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
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
                                                    "to": 2013
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "pggroup",
                                "parameters": {
                                    "by": [
                                        "parentsector_code", "year"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "SUM"
                                        },
                                        {
                                            "columns": ["unitcode"],
                                            "rule": "pgfirst"
                                        },
                                        {
                                            "columns": ["unitname"],
                                            "rule": "pgfirst"
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
                        id: 'item-2', // TOP DONORS
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
                                seriesDimensions: ['unitname'],
                                sort: false
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                 /**   subtitle: {
                                        text: '<b>Click and drag on chart to zoom</b>'
                                    },
                                    credits: {
                                        enabled: true,
                                        position: {
                                            align: 'left',
                                            x: 10
                                        },
                                        text: 'Source: OECD',
                                        href: ''
                                    },
                                    lang: {
                                        doptions: "Chart Download options"
                                    },**/
                                    exporting:{
                                       /** buttons: {
                                            contextButton: {
                                                _titleKey:"doptions",
                                                text: 'Download'
                                            }
                                            //contextButton: {symbol: 'url(http://www.emanuelchurch.com/images/download_icon_small.png)'}
                                        },**/
                                        chartOptions:{
                                           /** subtitle: {
                                                text: ''
                                            },**/
                                            legend:{
                                                enabled:false//,
                                              /**  title: {
                                                    text: ''
                                                }**/
                                            }
                                        }
                                    },
                                    legend: {
                                        enabled: false//,
                                       /** title: {
                                            text: 'Click to hide/show'
                                        }**/
                                    },
                                    plotOptions: {
                                      column: {
                                          colorByPoint: true
                                      }
                                    },
                                   // plotOptions : {
                                       // series : {
                                           // showCheckbox: true,
                                           // events: {
                                                //checkboxClick: function (event) {
                                                   // if (event.checked) {
                                                      //  this.show();
                                                   // } else {
                                                    //    this.hide();
                                                   // }
                                               // }
                                            //}
                                       // }
                                   // },
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
                        allowedFilter: ['parentsector_code', 'purposecode', 'year', 'channelsubcategory_code', 'channelcode'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
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
                                                    "to": 2013
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "pggroup",
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
                                            "rule": "pgfirst"
                                        },
                                        {
                                            "columns": ["unitname"],
                                            "rule": "pgfirst"
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
                        id: 'item-3', // TOP Channels
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-3",
                        config: {
                            container: "#item-3",
                            adapter: {
                                type: "standard",
                                xDimensions: 'channelsubcategory_code',
                                yDimensions: 'unitname',
                                valueDimensions: 'value',
                                seriesDimensions: ['unitcode'],
                                sort: false
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                   /** subtitle: {
                                        text: '<b>Click and drag on chart to zoom</b>'
                                    },
                                    credits: {
                                        enabled: true,
                                        text: 'Source: OECD',
                                        href: ''
                                    },
                                    lang: {
                                        doptions: "Chart Download options"
                                    },**/
                                    exporting:{
                                      /**  buttons: {
                                            contextButton: {
                                                _titleKey:"doptions",
                                                text: 'Download'
                                            }
                                            //contextButton: {symbol: 'url(http://www.emanuelchurch.com/images/download_icon_small.png)'}
                                        },**/
                                        chartOptions:{
                                          /**  subtitle: {
                                                text: ''
                                            },**/
                                            legend:{
                                                enabled:false//,
                                              /**  title: {
                                                    text: ''
                                                }**/
                                            }
                                        }
                                    },
                                    legend: {
                                        enabled: false,
                                       /** title: {
                                            text: 'Click to hide/show'
                                        },**/
                                        itemStyle: {
                                            width: 250
                                        }
                                    },
                                    plotOptions: {
                                        column: {
                                            colorByPoint: true
                                        }
                                    },
                                    tooltip: {
                                        useHTML:true,
                                        formatter: function(){
                                            return '<div style="width: 200px; white-space:normal"><b>' +this.x + ': ' + '</b><br/>' +
                                                Highcharts.numberFormat(this.y, 2, '.', ',') + ' USD Mil' + '</div>';
                                        }
                                    }

                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['parentsector_code', 'purposecode', 'year'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
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
                                "name": "pggroup",
                                "parameters": {
                                    "by": [
                                        "channelsubcategory_code"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "SUM"
                                        },
                                        {
                                            "columns": ["unitcode"],
                                            "rule": "pgfirst"
                                        },
                                        {
                                            "columns": ["unitname"],
                                            "rule": "pgfirst"
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
                        id: 'item-4',  // Top sub-sectors pie
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
                                        text: '<b>Hover for values</b>'
                                    },
                                   /** subtitle: {
                                        text: '<b>Hover over each slice of the chart to view values </b>'
                                    },
                                    credits: {
                                        enabled: true,
                                        text: 'Source: OECD',
                                        href: ''
                                    },
                                    lang: {
                                        doptions: "Chart Download options"
                                    },**/
                                    exporting:{
                                      /**  buttons: {
                                            contextButton: {
                                                _titleKey:"doptions",
                                                text: 'Download'
                                            }
                                            //contextButton: {symbol: 'url(http://www.emanuelchurch.com/images/download_icon_small.png)'}
                                        },**/
                                        chartOptions:{
                                          /**  subtitle: {
                                                text: ''
                                            },**/
                                            legend:{
                                                enabled: false//,
                                              /**  title: {
                                                    text: ''
                                                }**/
                                            },
                                            series: {
                                                dataLabels: {
                                                    style: {
                                                        width: '200px'
                                                    },
                                                    enabled: false
                                                }
                                            }
                                        }
                                    },
                                    legend: {
                                       /** title: {
                                            text: 'Click to hide/show'
                                        },**/
                                        itemStyle: {
                                            width: 250
                                        }
                                    },
                                    tooltip: {
                                        style: {width: '200px', whiteSpace: 'normal'},
                                        pointFormat: '<b>{point.percentage:.2f}% ({point.y:.2f} USD Mil)</b>'
                                    },
                                    // legend: {
                                    //    labelFormatter: function(){return this.name.slice(0, 25)+ '...'}
                                    // },
                                    plotOptions: {
                                        pie: {
                                            allowPointSelect: true,
                                            cursor: 'pointer',
                                            dataLabels: {
                                                style: {
                                                    width: '200px'
                                                },
                                                formatter: function(){
                                                    return '<div>' + this.point.name + ' '+
                                                        Math.round(this.point.percentage) //Highcharts.numberFormat(this.point.percentage, 2)
                                                        +'% </div>';
                                                },
                                                enabled: false
                                            },
                                            showInLegend: true
                                        }
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['parentsector_code', 'year', 'channelsubcategory_code', 'channelcode'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
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
                                                    "to": 2013
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "pggroup",
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
                                            "rule": "pgfirst"
                                        },
                                        {
                                            "columns": ["unitname"],
                                            "rule": "pgfirst"
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
                        id: 'item-5', // Regional Distribution
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        container: "#item-5",
                        config: {
                            container: "#item-5",
                            adapter: {
                                type: "standard",
                                xDimensions: 'parentsector_code',
                                yDimensions: 'unitname',
                                valueDimensions: 'value',
                                seriesDimensions: ['un_continent_code'],
                                sort: false
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "bar"
                                    },
                                    plotOptions: {
                                        series: {
                                            stacking: 'percent',
                                            dataLabels: {
                                                enabled: true,
                                                color: 'white',
                                                formatter: function(){   // display label in stack if value > 0%
                                                    var percent =  Math.round(this.point.percentage);
                                                    if(percent > 0)
                                                        return Math.round(this.point.percentage) + '%';
                                                }
                                            }
                                        }
                                    },
                                   /** subtitle: {
                                        text: '<b>Click and drag on chart to zoom</b>'
                                    },
                                    credits: {
                                        enabled: true,
                                        text: 'Source: OECD',
                                        href: ''
                                    },
                                    lang: {
                                        doptions: "Chart Download options"
                                    },**/
                                    exporting:{
                                        //sourceWidth: 1000,
                                       /** buttons: {
                                            contextButton: {
                                                _titleKey:"doptions",
                                                text: 'Download'
                                            }
                                            //contextButton: {symbol: 'url(http://www.emanuelchurch.com/images/download_icon_small.png)'}
                                        },**/
                                        chartOptions:{
                                           /** subtitle: {
                                                text: ''
                                            },**/
                                            legend:{
                                                enabled:true//,
                                              /**  title: {
                                                    text: ''
                                                }**/
                                            }
                                        }
                                    },
                                    legend: {
                                        reversed: true//,
                                       /** title: {
                                           text: 'Click to hide/show'
                                        }**/
                                    },
                                    yAxis: {
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
                                        formatter: function(){
                                            return '<b>' +this.series.name + ':' + '</b><br/>'  +' <b>'+   Highcharts.numberFormat(this.point.percentage, 4) + '% </b>'+
                                                  ' ('+ Highcharts.numberFormat(this.y, 2, '.', ',') + ' USD Mil)'
                                        }
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['parentsector_code', 'purposecode', 'year', 'channelsubcategory_code', 'channelcode'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
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
                                                    "to": 2013
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "pggroup",
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
                                            "rule": "pgfirst"
                                        },
                                        {
                                            "columns": ["unitname"],
                                            "rule": "pgfirst"
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
                        id: 'item-6',
                        type: 'map',
                        class: "fx-map-chart",
                        //needed if layout = injected
                        container: "#item-6",
                        config: {
                            container: "#item-6",
                            leaflet: {
                                zoomControl: false,
                                attributionControl: true,
                                scrollWheelZoom: false,
                                minZoom: 2
                            },
                           join: {
                               style: {
                                   colorramp: "PuBuGn"
                                }
                            },
                            layer: {
                                layertitle: "Commitment Current Prices"
                           }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['parentsector_code', 'purposecode', 'year', 'channelsubcategory_code', 'channelcode'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
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
                                                    "to": 2013
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "name": "pggroup",
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
                                            "rule": "pgfirst"
                                        },
                                        {
                                            "columns": ["unitname"],
                                            "rule": "pgfirst"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "select",
                                "parameters": {
                                    "query": "WHERE gaul0<>? AND  gaul0<>?",
                                    "queryParameters": [{"value": "NA"}, {"value": "147295+147296"}]
                                }
                            }
                        ]
                    }
      /**            {
                        id: 'item-7',
                        type: 'map',
                        class: "fx-map-chart",
                        //needed if layout = injected
                        container: "#item-7",
                        config: {
                            container: "#item-7",
                            valueSubject: "incomegroupcode",
                            leaflet: {
                                zoomControl: false,
                                attributionControl: true,
                                scrollWheelZoom: false,
                                minZoom: 2
                            },
                            join: {
                                style: {
                                    colorramp: "Reds",
                                    ranges: [10016, 10018, 10019],
                                   // openlegend: false,
                                    //valueSubject: "incomegroupcode"
                                    //colors: ['#fff', black', 'red', 'blue']
                                }
                            },
                            layer: {
                                layertitle: "Commitment Current Prices TEST",
                                popupBuilder: function(label,column) {
                                    return "<div class='fm-popup'>{{"+ label +"}}"+
                                        "<div class='fm-popup-join-content'>{{{"+ column + "}}} "+
                                        "</div></div>"
                                }
                            }

                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['parentsector_code', 'purposecode', 'year', 'channelcode'],
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
                                        }
                                    }
                                }
                            },
                            {
                                "name": "pggroup",
                                "parameters": {
                                    "by": [
                                       "gaul0", "incomegroupcode"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "SUM"
                                        },
                                        {
                                            "columns": ["unitcode"],
                                            "rule": "pgfirst"
                                        },
                                        {
                                            "columns": ["unitname"],
                                            "rule": "pgfirst"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "select",
                                "parameters": {
                                    "query": "WHERE gaul0<>? AND gaul0<>?",
                                    "queryParameters": [{"value": "NA"}, {"value": "147295+147296"}]
                                }
                            }
                        ]
                    }**/

                ]
            }
        },

        "country_sector": {

            filter: [
                {
                    "type": "codelist",
                    "containerType": "baseContainer",
                    "title": "Country",
                    "module_class": "fx-filter-grid-module",
                    "class": "col-md-3 col-lg-2",
                    "components": [
                        {
                            "uid": "crs_recipients",
                            "version": "2016",
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
                    "module_class": "fx-filter-grid-module",
                    "class": "col-md-3 col-lg-2",
                    "components": [
                        {
                            "uid": "crs_dac",
                            "version": "2016",
                            "type": "codelist-hierarchy",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},
                            "name": "parentsector_code",
                            config: {
                                "defaultsource": [
                                    //{"value": null, "label": "All", "selected": true},
                                ],
                                "defaultcodes": ['600'],
                                "onlyValueText": true,
                                "enableMultiselection": false,
                                "filter": {
                                    "uid": "crs_dac",
                                    "version": "2016",
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
                    "module_class": "fx-filter-grid-module",
                    "class": "col-md-3 col-lg-2",
                    "components": [
                        {
                            "uid": "crs_dac",
                            "version": "2016",
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
                                    "version": "2016",
                                    "level" : 3,
                                    "levels":3
                                }
                            },
                            creator: {
                                allowClear: true,
                                placeholder: "All"
                            }
                        }
                    ]
                },
                {
                    "type": "static",
                    "containerType": "baseContainer",
                    "module_class": "fx-filter-grid-module",
                    "class": "col-md-3 col-lg-2",
                    "components": [
                        {
                            "type": "range",
                            "name": "year",
                            "componentType": "timeRangeLists-FENIX",
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
                                        {"value": "2013", "label": "2013", "selected": false},
                                        {"value": "2014", "label": "2014", "selected": false}
                                    ]
                                },
                                "to" : {
                                    "title":  {"EN": "To"},
                                    "defaultsource": [
                                        {"value": "2014", "label": "2014", "selected": true},
                                        {"value": "2013", "label": "2013", "selected": false},
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
                    "title": "Channel Parent Category",
                    "module_class": "fx-filter-grid-module",
                    "class": "col-md-3 col-lg-2",
                    "components": [
                        {
                            "uid": "crs_channels",
                            "version": "2016",
                            "type": "codelist-hierarchy",
                            "name": "channelsubcategory_code",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},

                            config: {
                                "defaultsource": [],
                                "onlyValueText": true,
                                "filter": {
                                    "uid": "crs_channels",
                                    "version": "2016",
                                    "level" : 2,
                                    "levels":3
                                }
                            },
                            creator: {
                                allowClear: true,
                                placeholder: "All"
                            }
                        }
                    ]
                },
                {
                    "type": "codelist-hierarchy",
                    "containerType": "baseContainer",
                    "title": "Channel of Delivery",
                    "module_class": "fx-filter-grid-module",
                    "class": "col-md-3 col-lg-2",
                    "components": [
                        {
                            "uid": "crs_channels",
                            "version": "2016",
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
                                    "version": "2016",
                                    "level" : 3,
                                    "levels":3
                                }
                            },
                            creator: {
                                allowClear: true,
                                placeholder: "All"
                            }
                        }
                    ]
                },
                {
                    "type": "codelist",
                    "containerType": "baseContainer",
                    "title": "ODA",
                    "icon" : {
                        "class" : "fa fa-info-circle",
                        "tooltip" : "Official Development Assistance - Grants, Grant-Like, Loans and Equity Investment"
                    },
                    "module_class": "fx-filter-grid-module",
                    "class": "col-md-3 col-lg-2",
                    "components": [
                        {
                            "uid": "crs_flow_amounts",
                            "version": "2016",
                            "type": "codelist",
                            "name": "uid",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},
                            config: {
                                "defaultsource": [],
                                "defaultcodes": ['adam_usd_commitment'],
                                "onlyValueText": true,
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
                                seriesDimensions: ['parentsector_code']
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "line"
                                    },
                                   /** subtitle: {
                                        text: '<b>Hover for values and click and drag to zoom</b>'
                                    },**/
                                   /** credits: {
                                        enabled: true,
                                        text: 'Source: OECD',
                                        href: ''
                                    },
                                    lang: {
                                        doptions: "Chart Download options"
                                    },**/
                                    exporting:{
                                      /**  buttons: {
                                            contextButton: {
                                                _titleKey:"doptions",
                                                text: 'Download'
                                            }
                                            //contextButton: {symbol: 'url(http://www.emanuelchurch.com/images/download_icon_small.png)'}
                                        },**/
                                        chartOptions:{
                                          /**  subtitle: {
                                                text: ''
                                            },**/
                                            legend:{
                                                enabled:true//,
                                              /**  title: {
                                                    text: ''
                                                }**/
                                            }
                                        }
                                    },
                                    legend: {
                                        align: 'center',
                                        verticalAlign: 'bottom',
                                        layout: 'horizontal',
                                        x:0,
                                        y:0
                                    },
                                   /** legend: {
                                       title: {
                                            text: 'Click to hide/show'
                                        },
                                        itemStyle: {
                                            fontSize: '11px'
                                        }

                                    },**/
                                    xAxis : {
                                        type: 'datetime'
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
                        allowedFilter: ['recipientcode', 'parentsector_code', 'purposecode', 'year', 'channelsubcategory_code', 'channelcode'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
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
                                "name": "pggroup",
                                "parameters": {
                                    "by": [
                                        "parentsector_code", "year"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "SUM"
                                        },
                                        {
                                            "columns": ["unitcode"],
                                            "rule": "pgfirst"
                                        },
                                        {
                                            "columns": ["unitname"],
                                            "rule": "pgfirst"
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
                                xDimensions: 'parentsector_code',
                                yDimensions: 'unitname',
                                valueDimensions: 'value',
                                seriesDimensions: ['unitname'],
                                sort: false
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                    /**subtitle: {
                                        text: '<b>Click and drag on chart to zoom</b>'
                                    },**/
                                   /** credits: {
                                        enabled: true,
                                        text: 'Source: OECD',
                                        href: ''
                                    },
                                    lang: {
                                        doptions: "Chart Download options"
                                    },**/
                                    exporting:{
                                       /** buttons: {
                                            contextButton: {
                                                _titleKey:"doptions",
                                                text: 'Download'
                                            }
                                            //contextButton: {symbol: 'url(http://www.emanuelchurch.com/images/download_icon_small.png)'}
                                        },**/
                                        chartOptions:{
                                         /**   subtitle: {
                                                text: ''
                                            },**/
                                            legend:{
                                                enabled:false,
                                                title: {
                                                    text: ''
                                                }
                                            }
                                        }
                                    },
                                    legend: {
                                        enabled: false
                                      /** title: {
                                            text: 'Click to hide/show'
                                        }**/
                                    },
                                    plotOptions: {
                                        column: {
                                            colorByPoint: true
                                        }
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
                        allowedFilter: ['recipientcode', 'year', 'channelsubcategory_code', 'channelcode'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "recipientcode": {
                                            "codes": [
                                                {
                                                    "uid": "crs_recipients",
                                                    "version": "2016",
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
                                "name": "pggroup",
                                "parameters": {
                                    "by": [
                                        "parentsector_code"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "SUM"
                                        },
                                        {
                                            "columns": ["unitcode"],
                                            "rule": "pgfirst"
                                        },
                                        {
                                            "columns": ["unitname"],
                                            "rule": "pgfirst"
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
                                seriesDimensions: ['unitname'],
                                sort: false
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                   /** subtitle: {
                                        text: '<b>Click and drag on chart to zoom</b>'
                                    },**/
                                   /** credits: {
                                        enabled: true,
                                        text: 'Source: OECD',
                                        href: ''
                                    },
                                    lang: {
                                        doptions: "Chart Download options"
                                    },**/
                                    exporting:{
                                      /**  buttons: {
                                            contextButton: {
                                                _titleKey:"doptions",
                                                text: 'Download'
                                            }
                                            //contextButton: {symbol: 'url(http://www.emanuelchurch.com/images/download_icon_small.png)'}
                                        },**/
                                        chartOptions:{
                                          /**  subtitle: {
                                                text: ''
                                            },**/
                                            legend:{
                                                enabled:false//,
                                               /** title: {
                                                    text: ''
                                                }**/
                                            }
                                        }
                                    },
                                   legend: {
                                       enabled: false
                                      /**  title: {
                                            text: 'Click to hide/show'
                                        }**/
                                    },
                                   plotOptions: {
                                       column: {
                                           colorByPoint: true
                                       }
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
                        allowedFilter: ['recipientcode', 'parentsector_code', 'purposecode', 'year', 'channelsubcategory_code', 'channelcode'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
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
                                "name": "pggroup",
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
                                            "rule": "pgfirst"
                                        },
                                        {
                                            "columns": ["unitname"],
                                            "rule": "pgfirst"
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
                        id: 'item-4',    // Top sub-sectors pie
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
                                        text: '<b>Hover for values</b>'
                                    },
                                   /** credits: {
                                        enabled: true,
                                        text: 'Source: OECD',
                                        href: ''
                                    },
                                    lang: {
                                        doptions: "Chart Download options"
                                    },**/
                                    exporting:{
                                      /**  buttons: {
                                            contextButton: {
                                                _titleKey:"doptions",
                                                text: 'Download'
                                            }
                                            //contextButton: {symbol: 'url(http://www.emanuelchurch.com/images/download_icon_small.png)'}
                                        },**/
                                        chartOptions:{
                                          /**  subtitle: {
                                                text: ''
                                            },**/
                                            legend: {
                                                enabled: false
                                            },
                                            series: {
                                                dataLabels: {
                                                    style: {
                                                        width: '100px'
                                                    },
                                                    enabled: true
                                                }
                                            }
                                        }
                                    },
                                    legend: {
                                      /**  title: {
                                            text: 'Click to hide/show'
                                        },**/
                                        itemStyle: {
                                            width: 250
                                        }
                                    },
                                    tooltip: {
                                        style: {width: '200px', whiteSpace: 'normal'},
                                        pointFormat: '<b>{point.percentage:.2f}% ({point.y:.2f} USD Mil)</b>'
                                    },

                                   // legend: {
                                   //    labelFormatter: function(){return this.name.slice(0, 25)+ '...'}
                                   // },
                                    plotOptions: {
                                        pie: {
                                            allowPointSelect: true,
                                            cursor: 'pointer',
                                             dataLabels: {
                                                style: {
                                                   width: '100px'
                                                 },
                                                formatter: function(){
                                                   return '<div>' + this.point.name + ' '+
                                                       Math.round(this.point.percentage) //Highcharts.numberFormat(this.point.percentage, 2)
                                                      +'% </div>';
                                                },
                                                enabled: false
                                            },
                                            showInLegend: true
                                        }
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['recipientcode', 'parentsector_code', 'year', 'channelsubcategory_code', 'channelcode'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
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
                                "name": "pggroup",
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
                                            "rule": "pgfirst"
                                        },
                                        {
                                            "columns": ["unitname"],
                                            "rule": "pgfirst"
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
                                xDimensions: 'channelsubcategory_code',
                                yDimensions: 'unitname',
                                valueDimensions: 'value',
                                seriesDimensions: ['unitname'],
                                sort: false
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                   /** subtitle: {
                                        text: '<b>Click and drag on chart to zoom</b>'
                                    },**/
                                  /**  credits: {
                                        enabled: true,
                                        text: 'Source: OECD',
                                        href: ''
                                    },
                                    lang: {
                                        doptions: "Chart Download options"
                                    },**/
                                    exporting:{
                                      /**  buttons: {
                                            contextButton: {
                                                _titleKey:"doptions",
                                                text: 'Download'
                                            }
                                         },**/
                                        chartOptions:{
                                          /**  subtitle: {
                                                text: ''
                                            },**/
                                            legend:{
                                                enabled:false//,
                                               /** title: {
                                                    text: ''
                                                }**/
                                            }
                                        }
                                    },
                                    legend: {
                                        enabled: false,
                                       /** title: {
                                            text: 'Click to hide/show'
                                        },**/
                                        itemStyle: {
                                            width: 250
                                        }
                                    },
                                    plotOptions: {
                                        column: {
                                            colorByPoint: true
                                        },
                                        series: {
                                            dataLabels: {
                                                enabled: true
                                            }
                                        }
                                    },
                                    tooltip: {
                                        useHTML:true,
                                        formatter: function(){
                                            return '<div style="width: 200px; white-space:normal"><b>' +this.x + ': ' + '</b><br/>' +
                                                Highcharts.numberFormat(this.y, 2, '.', ',') + ' USD Mil' + '</div>';
                                        }
                                    }

                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['recipientcode', 'parentsector_code', 'purposecode', 'year'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
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
                                "name": "pggroup",
                                "parameters": {
                                    "by": [
                                        "channelsubcategory_code"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "SUM"
                                        },
                                        {
                                            "columns": ["unitcode"],
                                            "rule": "pgfirst"
                                        },
                                        {
                                            "columns": ["unitname"],
                                            "rule": "pgfirst"
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
                        id: 'item-6',
                        type: 'map',
                        class: "fx-map-chart",
                        name: 'region-map',
                        //needed if layout = injected
                        container: "#item-6",
                        config: {
                            container: "#item-6",
                            leaflet: {
                                zoomControl: false,
                                attributionControl: true,
                                scrollWheelZoom: false,
                                minZoom: 2
                            },
                            join: {
                                style: {
                                    colorramp: "YlOrBr"
                                }
                            },
                            layer: {
                                layertitle: "Commitment Current Prices"
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['regioncode', 'parentsector_code', 'purposecode', 'channelsubcategory_code', 'channelcode', 'year'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                          "regioncode": {
                                            "codes": [
                                                {
                                                    "uid": "crs_regions_countries",
                                                    "level": "1",
                                                    "version": "2016",
                                                    "codes": [
                                                        "10009"
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
                                                    "to": 2013
                                                }
                                            ]
                                        }
                                    }

                                }
                            },
                            {
                                "name": "pggroup",
                                "parameters": {
                                    "by": [
                                        "gaul0", "regioncode"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "SUM"
                                        },
                                        {
                                            "columns": ["unitcode"],
                                            "rule": "pgfirst"
                                        },
                                        {
                                            "columns": ["unitname"],
                                            "rule": "pgfirst"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "select",
                                "parameters": {
                                    "query": "WHERE gaul0<>? AND  gaul0<>?",
                                    "queryParameters": [{"value": "NA"}, {"value": "147295+147296"}]
                                    /**"query": "WHERE gaul0<>? AND regioncode=?",
                                    "queryParameters": [{"value": "NA"}, {"value": "10009"}]**/
                                }
                            }
                        ]
                    }

                ]
            }
        },

        "donor_sector": {


            filter: [
                {
                    "type": "codelist",
                    "containerType": "baseContainer",
                    "title": "Donor",
                    "module_class": "fx-filter-grid-module",
                    "class": "col-md-3 col-lg-2",
                    "components": [
                        {
                            "uid": "crs_donors",
                            "version": "2016",
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
                    "module_class": "fx-filter-grid-module",
                    "class": "col-md-3 col-lg-2",
                    "components": [
                        {
                            "uid": "crs_dac",
                            "version": "2016",
                            "type": "codelist-hierarchy",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},
                            "name": "parentsector_code",
                            config: {
                                "defaultsource": [
                                    //{"value": null, "label": "All", "selected": true},
                                ],
                                "defaultcodes": ['600'],
                                "onlyValueText": true,
                                "enableMultiselection": false,
                                "filter": {
                                    "uid": "crs_dac",
                                    "version": "2016",
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
                    "module_class": "fx-filter-grid-module",
                    "class": "col-md-3 col-lg-2",
                    "components": [
                        {
                            "uid": "crs_dac",
                            "version": "2016",
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
                                    "version": "2016",
                                    "level" : 3,
                                    "levels":3
                                }
                            },
                            creator: {
                                allowClear: true,
                                placeholder: "All"
                            }

                        }
                    ]
                },
                {
                    "type": "static",
                    "containerType": "baseContainer",
                    "module_class": "fx-filter-grid-module",
                    "class": "col-md-3 col-lg-2",
                    "components": [
                        {
                            "type": "range",
                            "name": "year",
                            "componentType": "timeRangeLists-FENIX",
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
                                        {"value": "2013", "label": "2013", "selected": false},
                                        {"value": "2014", "label": "2014", "selected": false}
                                    ]
                                },
                                "to" : {
                                    "title":  {"EN": "To"},
                                    "defaultsource": [
                                        {"value": "2014", "label": "2014", "selected": true},
                                        {"value": "2013", "label": "2013", "selected": false},
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
                    "title": "Channel Parent Category",
                    "module_class": "fx-filter-grid-module",
                    "class": "col-md-3 col-lg-2",
                    "components": [
                        {
                            "uid": "crs_channels",
                            "version": "2016",
                            "type": "codelist-hierarchy",
                            "name": "channelsubcategory_code",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},

                            config: {
                                "defaultsource": [],
                                "onlyValueText": true,
                                "filter": {
                                    "uid": "crs_channels",
                                    "version": "2016",
                                    "level" : 2,
                                    "levels":3
                                }
                            },
                            creator: {
                                allowClear: true,
                                placeholder: "All"
                            }
                        }
                    ]
                },
                {
                    "type": "codelist-hierarchy",
                    "containerType": "baseContainer",
                    "title": "Channel of Delivery",
                    "module_class": "fx-filter-grid-module",
                    "class": "col-md-3 col-lg-2",
                    "components": [
                        {
                            "uid": "crs_channels",
                            "version": "2016",
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
                                    "version": "2016",
                                    "level" : 3,
                                    "levels":3
                                }
                            },
                            creator: {
                                allowClear: true,
                                placeholder: "All"
                            }
                        }
                    ]
                },
                {
                    "type": "codelist",
                    "containerType": "baseContainer",
                    "title": "ODA",
                    "icon" : {
                        "class" : "fa fa-info-circle",
                        "tooltip" : "Official Development Assistance - Grants, Grant-Like, Loans and Equity Investment"
                    },
                    "module_class": "fx-filter-grid-module",
                    "class": "col-md-3 col-lg-2",
                    "components": [
                        {
                            "uid": "crs_flow_amounts",
                            "version": "2016",
                            "type": "codelist",
                            "name": "uid",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},
                            config: {
                                "defaultsource": [],
                                "defaultcodes": ['adam_usd_commitment'],
                                "onlyValueText": true,
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
                                seriesDimensions: ['parentsector_code']
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "line"
                                    },
                                  /**  subtitle: {
                                        text: '<b>Click and drag on chart to zoom</b>'
                                    },
                                    credits: {
                                        enabled: true,
                                        text: 'Source: OECD',
                                        href: ''
                                    },
                                    lang: {
                                        doptions: "Chart Download options"
                                    },**/
                                    exporting:{
                                       /** buttons: {
                                            contextButton: {
                                                _titleKey:"doptions",
                                                text: 'Download'
                                            }
                                            //contextButton: {symbol: 'url(http://www.emanuelchurch.com/images/download_icon_small.png)'}
                                        },**/
                                        chartOptions:{
                                          /**  subtitle: {
                                                text: ''
                                            },**/
                                            legend:{
                                                enabled:true//,
                                               /** title: {
                                                    text: ''
                                                } **/
                                            }
                                        }
                                    },
                                    legend: {
                                        align: 'center',
                                        verticalAlign: 'bottom',
                                        layout: 'horizontal',
                                        x:0,
                                        y:0
                                    },
                                    xAxis : {
                                        type: 'datetime'
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
                        allowedFilter: [ 'donorcode', 'parentsector_code', 'purposecode', 'year', 'channelsubcategory_code', 'channelcode'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
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
                                "name": "pggroup",
                                "parameters": {
                                    "by": [
                                        "parentsector_code", "year"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "SUM"
                                        },
                                        {
                                            "columns": ["unitcode"],
                                            "rule": "pgfirst"
                                        },
                                        {
                                            "columns": ["unitname"],
                                            "rule": "pgfirst"
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
                                xDimensions: 'parentsector_code',
                                yDimensions: 'unitname',
                                valueDimensions: 'value',
                                seriesDimensions: ['unitname'],
                                sort: false
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                    /**subtitle: {
                                        text: '<b>Click and drag on chart to zoom</b>'
                                    },
                                    credits: {
                                        enabled: true,
                                        text: 'Source: OECD',
                                        href: ''
                                    },
                                    lang: {
                                        doptions: "Chart Download options"
                                    },**/
                                    exporting:{
                                       /** buttons: {
                                            contextButton: {
                                                _titleKey:"doptions",
                                                text: 'Download'
                                            }
                                            //contextButton: {symbol: 'url(http://www.emanuelchurch.com/images/download_icon_small.png)'}
                                        },**/
                                        chartOptions:{
                                           /** subtitle: {
                                                text: ''
                                            },**/
                                            legend:{
                                                enabled:false//,
                                               /** title: {
                                                    text: ''
                                                }**/
                                            }
                                        }
                                    },
                                   legend: {
                                       enabled: false
                                       /** title: {
                                            text: 'Click to hide/show'
                                        }**/
                                    },
                                    plotOptions: {
                                       column: {
                                           colorByPoint: true
                                       }
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
                        allowedFilter: ['donorcode', 'year', 'channelsubcategory_code', 'channelcode'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "donorcode": {
                                            "codes": [
                                                {
                                                    "uid": "crs_donors",
                                                    "version": "2016",
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
                                "name": "pggroup",
                                "parameters": {
                                    "by": [
                                        "parentsector_code"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "SUM"
                                        },
                                        {
                                            "columns": ["unitcode"],
                                            "rule": "pgfirst"
                                        },
                                        {
                                            "columns": ["unitname"],
                                            "rule": "pgfirst"
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
                        id: 'item-3', // TOP Channels
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-3",
                        config: {
                            container: "#item-3",
                            adapter: {
                                type: "standard",
                                xDimensions: 'channelsubcategory_code',
                                yDimensions: 'unitname',
                                valueDimensions: 'value',
                                seriesDimensions: ['unitname'],
                                sort: false
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                   /** subtitle: {
                                        text: '<b>Click and drag on chart to zoom</b>'
                                    },
                                    credits: {
                                        enabled: true,
                                        text: 'Source: OECD',
                                        href: ''
                                    },
                                    lang: {
                                        doptions: "Chart Download options"
                                    },**/
                                    exporting:{
                                      /**  buttons: {
                                            contextButton: {
                                                _titleKey:"doptions",
                                                text: 'Download'
                                            }
                                            //contextButton: {symbol: 'url(http://www.emanuelchurch.com/images/download_icon_small.png)'}
                                        },**/
                                        chartOptions:{
                                           /** subtitle: {
                                                text: ''
                                            },**/
                                            legend:{
                                                enabled:false//,
                                               /** title: {
                                                    text: ''
                                                }**/
                                            }
                                        }
                                    },
                                    legend: {
                                        enabled: false,
                                       /** title: {
                                            text: 'Click to hide/show'
                                        },**/
                                        itemStyle: {
                                            width: 250
                                        }
                                    },

                                    plotOptions: {
                                        column: {
                                           colorByPoint: true
                                        },
                                        series: {
                                            dataLabels: {
                                                enabled: true
                                            }
                                        }
                                    },
                                    tooltip: {
                                        useHTML:true,
                                        formatter: function(){
                                            return '<div style="width: 200px; white-space:normal"><b>' +this.x + ': ' + '</b><br/>' +
                                                Highcharts.numberFormat(this.y, 2, '.', ',') + ' USD Mil' + '</div>';
                                        }
                                    }

                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['donorcode', 'parentsector_code', 'purposecode', 'year'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
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
                                "name": "pggroup",
                                "parameters": {
                                    "by": [
                                        "channelsubcategory_code"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "SUM"
                                        },
                                        {
                                            "columns": ["unitcode"],
                                            "rule": "pgfirst"
                                        },
                                        {
                                            "columns": ["unitname"],
                                            "rule": "pgfirst"
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
                        id: 'item-4',    // Top sub-sectors pie
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
                                        text: '<b>Hover for values</b>'
                                    },
                                   /** credits: {
                                        enabled: true,
                                        text: 'Source: OECD',
                                        href: ''
                                    },
                                    lang: {
                                        doptions: "Chart Download options"
                                    },**/
                                    exporting:{
                                       /** buttons: {
                                            contextButton: {
                                                _titleKey:"doptions",
                                                text: 'Download'
                                            }
                                            //contextButton: {symbol: 'url(http://www.emanuelchurch.com/images/download_icon_small.png)'}
                                        },**/
                                        chartOptions:{
                                          /**  subtitle: {
                                                text: ''
                                            },**/
                                            legend: {
                                                enabled: false
                                            },
                                            series: {
                                                dataLabels: {
                                                    style: {
                                                        width: '100px'
                                                    },
                                                    enabled: true
                                                }
                                            }
                                        }
                                    },
                                    legend: {
                                       /** title: {
                                            text: 'Click to hide/show'
                                        },**/
                                        itemStyle: {
                                            width: 250
                                        }
                                    },
                                    tooltip: {
                                        style: {width: '200px', whiteSpace: 'normal'},
                                        pointFormat: '<b>{point.percentage:.2f}% ({point.y:.2f} USD Mil)</b>'
                                    },
                                    // legend: {
                                    //    labelFormatter: function(){return this.name.slice(0, 25)+ '...'}
                                    // },
                                    plotOptions: {
                                        pie: {
                                            allowPointSelect: true,
                                            cursor: 'pointer',
                                            dataLabels: {
                                                style: {
                                                    width: '100px'
                                                },
                                                formatter: function(){
                                                    return '<div>' + this.point.name + ' '+
                                                        Math.round(this.point.percentage) //Highcharts.numberFormat(this.point.percentage, 2)
                                                        +'% </div>';
                                                },
                                                enabled: false
                                            },
                                            showInLegend: true
                                        }
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['donorcode', 'parentsector_code', 'year', 'channelsubcategory_code', 'channelcode'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
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
                                "name": "pggroup",
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
                                            "rule": "pgfirst"
                                        },
                                        {
                                            "columns": ["unitname"],
                                            "rule": "pgfirst"
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
                        id: 'item-5', // Regional Distribution
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        container: "#item-5",
                        config: {
                            container: "#item-5",
                            adapter: {
                                type: "standard",
                                xDimensions: 'parentsector_code',
                                yDimensions: 'unitname',
                                valueDimensions: 'value',
                                seriesDimensions: ['un_continent_code'],
                                sort: false
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "bar"
                                    },
                                    plotOptions: {
                                        series: {
                                            stacking: 'percent',
                                            dataLabels: {
                                                enabled: true,
                                                color: 'white',
                                                formatter: function(){   // display label in stack if value > 0%
                                                    var percent =  Math.round(this.point.percentage);
                                                    if(percent > 0)
                                                        return Math.round(this.point.percentage) + '%';
                                                }
                                            }
                                        }
                                    },
                                   /** subtitle: {
                                        text: '<b>Click and drag on chart to zoom</b>'
                                    },
                                    credits: {
                                        enabled: true,
                                        text: 'Source: OECD',
                                        href: ''
                                    },
                                    lang: {
                                        doptions: "Chart Download options"
                                    },**/
                                    exporting:{
                                        //sourceWidth: 1000,
                                      /**  buttons: {
                                            contextButton: {
                                                _titleKey:"doptions",
                                                text: 'Download'
                                            }
                                            //contextButton: {symbol: 'url(http://www.emanuelchurch.com/images/download_icon_small.png)'}
                                        },**/
                                        chartOptions:{
                                           /** subtitle: {
                                                text: ''
                                            },**/
                                            legend:{
                                                enabled:true//,
                                               /** title: {
                                                    text: ''
                                                }**/
                                            }
                                        }
                                    },
                                    legend: {
                                        reversed: true,
                                       /** title: {
                                            text: 'Click to hide/show'
                                        }**/
                                    },
                                    yAxis: {
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
                                        formatter: function(){
                                            return '<b>' +this.series.name + ':' + '</b><br/>'  +' <b>'+   Highcharts.numberFormat(this.point.percentage, 4) + '% </b>'+
                                                ' ('+ Highcharts.numberFormat(this.y, 2, '.', ',') + ' USD Mil)'
                                        }
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['donorcode', 'parentsector_code', 'purposecode', 'year', 'channelsubcategory_code', 'channelcode'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
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
                                "name": "pggroup",
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
                                            "rule": "pgfirst"
                                        },
                                        {
                                            "columns": ["unitname"],
                                            "rule": "pgfirst"
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
                        id: 'item-6',
                        type: 'map',
                        class: "fx-map-chart",
                        //needed if layout = injected
                        container: "#item-6",
                        config: {
                            container: "#item-6",
                            leaflet: {
                                zoomControl: false,
                                attributionControl: true,
                                scrollWheelZoom: false,
                                minZoom: 2
                            },
                            join: {
                                style: {
                                    colorramp: "PuBuGn"
                                }
                            },
                            layer: {
                                layertitle: "Commitment Current Prices"
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['parentsector_code', 'donorcode', 'purposecode', 'year', 'channelsubcategory_code', 'channelcode'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
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
                                "name": "pggroup",
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
                                            "rule": "pgfirst"
                                        },
                                        {
                                            "columns": ["unitname"],
                                            "rule": "pgfirst"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "select",
                                "parameters": {
                                    "query": "WHERE gaul0<>? AND  gaul0<>?",
                                    "queryParameters": [{"value": "NA"}, {"value": "147295+147296"}]
                                }
                            }
                        ]
                    }

                ]
            }
        },

        "country_donor_sector": {

            filter: [
                {
                    "type": "codelist",
                    "containerType": "baseContainer",
                    "title": "Country",
                    "module_class": "fx-filter-grid-module",
                    "class": "col-md-3 col-lg-2",
                    "components": [
                        {
                            "uid": "crs_recipients",
                            "version": "2016",
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
                    "module_class": "fx-filter-grid-module",
                    "class": "col-md-3 col-lg-2",
                    "components": [
                        {
                            "uid": "crs_donors",
                            "version": "2016",
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
                    "module_class": "fx-filter-grid-module",
                    "class": "col-md-3 col-lg-2",
                    "components": [
                        {
                            "uid": "crs_dac",
                            "version": "2016",
                            "type": "codelist-hierarchy",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},
                            "name": "parentsector_code",
                            config: {
                                "defaultsource": [
                                    //{"value": null, "label": "All", "selected": true},
                                ],
                                "defaultcodes": ['600'],
                                "onlyValueText": true,
                                "enableMultiselection": false,
                                "filter": {
                                    "uid": "crs_dac",
                                    "version": "2016",
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
                    "module_class": "fx-filter-grid-module",
                    "class": "col-md-3 col-lg-2",
                    "components": [
                        {
                            "uid": "crs_dac",
                            "version": "2016",
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
                                    "version": "2016",
                                    "level" : 3,
                                    "levels":3
                                }
                            },
                            creator: {
                                allowClear: true,
                                placeholder: "All"
                            }
                        }
                    ]
                },
                {
                    "type": "static",
                    "containerType": "baseContainer",
                    "module_class": "fx-filter-grid-module",
                    "class": "col-md-3 col-lg-2",
                    "components": [
                        {
                            "type": "range",
                            "name": "year",
                            "componentType": "timeRangeLists-FENIX",
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
                                        {"value": "2013", "label": "2013", "selected": false},
                                        {"value": "2014", "label": "2014", "selected": false}
                                    ]
                                },
                                "to" : {
                                    "title":  {"EN": "To"},
                                    "defaultsource": [
                                        {"value": "2014", "label": "2014", "selected": true},
                                        {"value": "2013", "label": "2013", "selected": false},
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
                    "title": "Channel Parent Category",
                    "module_class": "fx-filter-grid-module",
                    "class": "col-md-3 col-lg-2",
                    "components": [
                        {
                            "uid": "crs_channels",
                            "version": "2016",
                            "type": "codelist-hierarchy",
                            "name": "channelsubcategory_code",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},

                            config: {
                                "defaultsource": [],
                                "onlyValueText": true,
                                "filter": {
                                    "uid": "crs_channels",
                                    "version": "2016",
                                    "level" : 2,
                                    "levels":3
                                }
                            },
                            creator: {
                                allowClear: true,
                                placeholder: "All"
                            }
                        }
                    ]
                },
                {
                    "type": "codelist-hierarchy",
                    "containerType": "baseContainer",
                    "title": "Channel of Delivery",
                    "module_class": "fx-filter-grid-module",
                    "class": "col-md-3 col-lg-2",
                    "components": [
                        {
                            "uid": "crs_channels",
                            "version": "2016",
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
                                    "version": "2016",
                                    "level" : 3,
                                    "levels":3
                                }
                            },
                            creator: {
                                allowClear: true,
                                placeholder: "All"
                            }
                        }
                    ]
                },
                {
                    "type": "codelist",
                    "containerType": "baseContainer",
                    "title": "ODA",
                    "icon" : {
                        "class" : "fa fa-info-circle",
                        "tooltip" : "Official Development Assistance - Grants, Grant-Like, Loans and Equity Investment"
                    },
                    "module_class": "fx-filter-grid-module",
                    "class": "col-md-3 col-lg-2",
                    "components": [
                        {
                            "uid": "crs_flow_amounts",
                            "version": "2016",
                            "type": "codelist",
                            "name": "uid",
                            "componentType": "dropDownList-FENIX",
                            "lang": "EN",
                            "title": {"EN": "Codelist"},
                            config: {
                                "defaultsource": [],
                                "defaultcodes": ['adam_usd_commitment'],
                                "onlyValueText": true,
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
                                seriesDimensions: ['parentsector_code']
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "line"
                                    },
                                   /** subtitle: {
                                        text: '<b>Click and drag on chart to zoom</b>'
                                    },
                                    credits: {
                                        enabled: true,
                                        text: 'Source: OECD',
                                        href: ''
                                    },
                                    lang: {
                                        doptions: "Chart Download options"
                                    },**/
                                    exporting:{
                                       /** buttons: {
                                            contextButton: {
                                                _titleKey:"doptions",
                                                text: 'Download'
                                            }
                                            //contextButton: {symbol: 'url(http://www.emanuelchurch.com/images/download_icon_small.png)'}
                                        },**/
                                        chartOptions:{
                                           /** subtitle: {
                                                text: ''
                                            },**/
                                            legend:{
                                                enabled:true//,
                                               /** title: {
                                                    text: ''
                                                }**/
                                            }
                                        }
                                    },
                                    legend: {
                                        align: 'center',
                                        verticalAlign: 'bottom',
                                        layout: 'horizontal',
                                        x:0,
                                        y:0
                                    },
                                    xAxis : {
                                        type: 'datetime'
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
                        allowedFilter: ['recipientcode', 'donorcode', 'parentsector_code', 'purposecode', 'year', 'channelsubcategory_code', 'channelcode'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
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
                                                        "238"  //Ethiopia
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
                                "name": "pggroup",
                                "parameters": {
                                    "by": [
                                        "parentsector_code", "year"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "SUM"
                                        },
                                        {
                                            "columns": ["unitcode"],
                                            "rule": "pgfirst"
                                        },
                                        {
                                            "columns": ["unitname"],
                                            "rule": "pgfirst"
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
                                xDimensions: 'parentsector_code',
                                yDimensions: 'unitname',
                                valueDimensions: 'value',
                                seriesDimensions: ['unitname'],
                                sort: false
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                  /**  subtitle: {
                                        text: '<b>Click and drag on chart to zoom</b>'
                                    },
                                    credits: {
                                        enabled: true,
                                        text: 'Source: OECD',
                                        href: ''
                                    },
                                    lang: {
                                        doptions: "Chart Download options"
                                    },**/
                                    exporting:{
                                       /** buttons: {
                                            contextButton: {
                                                _titleKey:"doptions",
                                                text: 'Download'
                                            }
                                            //contextButton: {symbol: 'url(http://www.emanuelchurch.com/images/download_icon_small.png)'}
                                        },**/
                                        chartOptions:{
                                           /** subtitle: {
                                                text: ''
                                            },**/
                                            legend:{
                                                enabled:false,
                                                title: {
                                                    text: ''
                                                }
                                            }
                                        }
                                    },
                                    legend: {
                                        enabled: false
                                       /** title: {
                                            text: 'Click to hide/show'
                                        }**/
                                    },
                                    plotOptions: {
                                        column: {
                                            colorByPoint: true
                                        }
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
                        allowedFilter: ['recipientcode', 'donorcode', 'year', 'channelsubcategory_code', 'channelcode'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
                                        "recipientcode": {
                                            "codes": [
                                                {
                                                    "uid": "crs_recipients",
                                                    "version": "2016",
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
                                                    "version": "2016",
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
                                "name": "pggroup",
                                "parameters": {
                                    "by": [
                                        "parentsector_code"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "SUM"
                                        },
                                        {
                                            "columns": ["unitcode"],
                                            "rule": "pgfirst"
                                        },
                                        {
                                            "columns": ["unitname"],
                                            "rule": "pgfirst"
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
                        id: 'item-3', // TOP Channels
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#item-3",
                        config: {
                            container: "#item-3",
                            adapter: {
                                type: "standard",
                                xDimensions: 'channelsubcategory_code',
                                yDimensions: 'unitname',
                                valueDimensions: 'value',
                                seriesDimensions: ['unitname'],
                                sort:false
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    },
                                   /** subtitle: {
                                        text: '<b>Click and drag on chart to zoom</b>'
                                    },
                                    credits: {
                                        enabled: true,
                                        text: 'Source: OECD',
                                        href: ''
                                    },
                                    lang: {
                                        doptions: "Chart Download options"
                                    },**/
                                    exporting:{
                                       /** buttons: {
                                            contextButton: {
                                                _titleKey:"doptions",
                                                text: 'Download'
                                            }
                                            //contextButton: {symbol: 'url(http://www.emanuelchurch.com/images/download_icon_small.png)'}
                                        },**/
                                        chartOptions:{
                                          /**  subtitle: {
                                                text: ''
                                            },**/
                                            legend:{
                                                enabled:false,
                                                title: {
                                                    text: ''
                                                }
                                            }
                                        }
                                    },
                                    legend: {
                                        enabled: false
                                       /** title: {
                                            text: 'Click to hide/show'
                                        }**/
                                    },
                                    plotOptions: {
                                        column: {
                                            colorByPoint: true
                                        }
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
                        allowedFilter: ['recipientcode', 'donorcode', 'parentsector_code', 'purposecode', 'year'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
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
                                                        "238"  //Ethiopia
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
                                "name": "pggroup",
                                "parameters": {
                                    "by": [
                                        "channelsubcategory_code"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "SUM"
                                        },
                                        {
                                            "columns": ["unitcode"],
                                            "rule": "pgfirst"
                                        },
                                        {
                                            "columns": ["unitname"],
                                            "rule": "pgfirst"
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
                        id: 'item-4',    // Top sub-sectors pie
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
                                        text: '<b>Hover for values</b>'
                                    },
                                  /**  credits: {
                                        enabled: true,
                                        text: 'Source: OECD',
                                        href: ''
                                    },
                                    lang: {
                                        doptions: "Chart Download options"
                                    },**/
                                    exporting:{
                                      /**  buttons: {
                                            contextButton: {
                                                _titleKey:"doptions",
                                                text: 'Download'
                                            }
                                            //contextButton: {symbol: 'url(http://www.emanuelchurch.com/images/download_icon_small.png)'}
                                        },**/
                                        chartOptions:{
                                           /** subtitle: {
                                                text: ''
                                            },**/
                                            legend: {
                                                enabled: false
                                            },
                                            series: {
                                                dataLabels: {
                                                    style: {
                                                        width: '100px'
                                                    },
                                                    enabled: true
                                                }
                                            }
                                        }
                                    },
                                    legend: {
                                       /** title: {
                                            text: 'Click to hide/show'
                                        },**/
                                        itemStyle: {
                                            width: 250
                                        }
                                    },
                                    tooltip: {
                                        style: {width: '200px', whiteSpace: 'normal'},
                                        pointFormat: '<b>{point.percentage:.2f}% ({point.y:.2f} USD Mil)</b>'
                                    },
                                    // legend: {
                                    //    labelFormatter: function(){return this.name.slice(0, 25)+ '...'}
                                    // },
                                    plotOptions: {
                                        pie: {
                                            allowPointSelect: true,
                                            cursor: 'pointer',
                                            dataLabels: {
                                                style: {
                                                    width: '100px'
                                                },
                                                formatter: function(){
                                                    return '<div>' + this.point.name + ' '+
                                                        Math.round(this.point.percentage) //Highcharts.numberFormat(this.point.percentage, 2)
                                                        +'% </div>';
                                                },
                                                enabled: false
                                            },
                                            showInLegend: true
                                        }
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['recipientcode', 'donorcode', 'parentsector_code', 'year', 'channelsubcategory_code', 'channelcode'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
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
                                                        "238"  //Ethiopia
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
                                "name": "pggroup",
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
                                            "rule": "pgfirst"
                                        },
                                        {
                                            "columns": ["unitname"],
                                            "rule": "pgfirst"
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