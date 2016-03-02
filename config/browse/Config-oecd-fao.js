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
                    "remove": ['top-subsectors'],
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
                        id: 'tot-oda',   // TOTAL ODA
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#tot-oda",
                        config: {
                            container: "#tot-oda",
                            adapter: {
                                type: "standard",
                                xDimensions: 'year',
                                yDimensions: 'unitcode',
                                valueDimensions: 'value',
                                seriesDimensions: ['flowcategory']
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "line",
                                        events: {
                                            load: function(event) {
                                                amplify.publish('fx.browse.chart.faosector.loaded', this);
                                            }
                                        }
                                    },
                                    exporting:{
                                        chartOptions:{
                                            legend:{
                                                enabled:false//, only one series and all info in title and subtitle
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
                        allowedFilter: ['purposecode', 'year',  'channelsubcategory_code', 'channelcode'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
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
                                "name": "pggroup",
                                "parameters": {
                                    "by": [
                                        "year"
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
                                            "columns": ["flowcategory"],
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
                        id: 'top-partners', // TOP DONORS
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#top-partners",
                        config: {
                            container: "#top-partners",
                            adapter: {
                                type: "standard",
                                xDimensions: 'donorcode',
                                yDimensions: 'unitname',
                                valueDimensions: 'value',
                                seriesDimensions: ['flowcategory'],
                                sort: false
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column",
                                        events: {
                                            load: function(event) {
                                                if (this.options.chart.forExport) {
                                                    this.xAxis[0].update ({
                                                        categories: this.xAxis[0].categories,
                                                        labels: {
                                                            style: {
                                                                fontSize: '6px'
                                                            }
                                                        }
                                                    }, false);

                                                    Highcharts.each(this.series, function (series) {
                                                        series.update({
                                                            dataLabels: {
                                                                enabled: true,
                                                                style: {
                                                                    fontSize: '6px'
                                                                }
                                                            }
                                                        }, false);
                                                    });
                                                    this.redraw();
                                                }
                                            }
                                        }
                                    },
                                    xAxis: {
                                        labels: {
                                            //useHTML: true,
                                            events: {
                                                click: function () {
                                                   // console.log(this);
                                                    //var chart = $('#item-2').highcharts();
                                                   // console.log(chart);
                                                    //chart.series[0].data[0].graphic.hide();
                                                    //chart.series[0].data[0].dataLabel.hide();

                                                   // var third = series[0].data[2];
                                                    //third.graphic.hide();
                                                    //return this.value
                                                   // reloadFlash();
                                                   // $('#report').html('click on xAxis label');
                                                }
                                                                                          }
                                            //formatter: function() {
                                               //return '<a href="javascript:alert(\'hello\')">'+
                                                  //  this.value +'</a>';
                                           // }
                                        }
                                    },
                                    exporting:{
                                        chartOptions:{
                                            legend:{
                                                enabled:true
                                            },
                                            plotOptions: {
                                                series: {
                                                    dataLabels: {
                                                        enabled: false
                                                    }
                                                }
                                            }

                                          /**  xAxis: [{
                                                labels: {
                                                    useHTML: true,
                                                    style: {
                                                       fontSize: '6px'
                                                    }
                                                }
                                            }]**/
                                        }
                                    },
                                    plotOptions: {
                                        series: {
                                            dataLabels: {
                                                enabled: false
                                            }
                                        }
                                    },
                                    legend: {
                                        enabled: true
                                    },
                                   // plotOptions: {
                                       // column: {
                                         //   colorByPoint: true
                                        //}
                                   // },
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
                                    },
                                    colors: ['#56adc3']

                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['purposecode', 'year', 'channelsubcategory_code', 'channelcode'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
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
                                        },
                                        {
                                            "columns": ["flowcategory"],
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
                        id: 'top-recipients', // TOP RECIPIENTS
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        title: '',
                        //needed if layout = injected
                        container: "#top-recipients",
                        config: {
                            container: "#top-recipients",
                            adapter: {
                                type: "standard",
                                xDimensions: 'recipientcode',
                                yDimensions: 'unitname',
                                valueDimensions: 'value',
                                seriesDimensions: ['flowcategory'],
                                sort: false
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column",
                                        events: {
                                            load: function(event) {
                                                if (this.options.chart.forExport) {
                                                    this.xAxis[0].update ({
                                                        categories: this.xAxis[0].categories,
                                                        labels: {
                                                            style: {
                                                                fontSize: '6px'
                                                            }
                                                        }
                                                    }, false);

                                                    Highcharts.each(this.series, function (series) {
                                                        series.update({
                                                            dataLabels: {
                                                                enabled: true,
                                                                style: {
                                                                    fontSize: '6px'
                                                                }
                                                            }
                                                        }, false);
                                                    });
                                                    this.redraw();
                                                }
                                            }
                                        }
                                    },
                                    xAxis: {
                                        labels: {
                                            //useHTML: true,
                                            style: {
                                                fontSize:'11px'
                                            },
                                            events: {
                                                click: function () {
                                                    // console.log(this);
                                                    //var chart = $('#item-2').highcharts();
                                                    // console.log(chart);
                                                    //chart.series[0].data[0].graphic.hide();
                                                    //chart.series[0].data[0].dataLabel.hide();

                                                    // var third = series[0].data[2];
                                                    //third.graphic.hide();
                                                    //return this.value
                                                    // reloadFlash();
                                                    // $('#report').html('click on xAxis label');
                                                }
                                            }
                                            //formatter: function() {
                                            //return '<a href="javascript:alert(\'hello\')">'+
                                            //  this.value +'</a>';
                                            // }
                                        }
                                    },
                                    exporting:{
                                        chartOptions:{
                                            legend:{
                                                enabled:true
                                            },
                                            xAxis: {
                                                labels: {
                                                    style: {
                                                        //  fontSize: '6px'
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    legend: {
                                        enabled: true
                                    },
                                    // plotOptions: {
                                    // column: {
                                    //   colorByPoint: true
                                    //}
                                    // },
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
                                    },
                                    colors: ['#5691c3']

                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['purposecode', 'year', 'channelsubcategory_code', 'channelcode'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
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
                                "name": "pggroup",
                                "parameters": {
                                    "by": [
                                        "recipientcode"
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
                                        },
                                        {
                                            "columns": ["flowcategory"],
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
                        id: 'top-subsectors',  // Top sub-sectors pie
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#top-subsectors",
                        config: {
                            container: "#top-subsectors",
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
                                    exporting:{
                                        chartOptions:{
                                            title: {
                                                text: ''
                                            },
                                            legend: {
                                                align: 'center',
                                                layout: 'vertical',
                                                //symbolHeight:2,
                                                //symbolPadding: 0,
                                                //symbolWidth: 2,
                                                useHTML: true,
                                                labelFormatter: function() {
                                                        var val = this.y;
                                                        if (val.toFixed(0) < 1) {
                                                            val = (val * 1000).toFixed(2) + ' K'
                                                        } else {
                                                            val = val.toFixed(2) + ' USD Mil'
                                                        }

                                                        return '<div style="width:200px"><span style="float:left;  font-size:9px">' + this.name.trim() +': '+ this.percentage.toFixed(2) + '% ('+ val+ ')</span></div>';

                                                   // return '<div style="width:200px"><span style="float:left;  font-size:9px">' + this.name.trim() +': '+ Highcharts.numberFormat(this.percentage, 2) + '% (' + Highcharts.numberFormat(this.y, 2)+ ' USD Mil)</b></span></div>';
                                                }
                                            }
                                        }
                                    },
                                    legend: {
                                        align: 'center',
                                        verticalAlign: 'bottom',
                                        layout: 'horizontal',
                                        x:0,
                                        y:0//,
                                        /**itemStyle: {
                                            width: 250
                                        },**/
                                    },
                                    tooltip: {
                                        style: {width: '200px', whiteSpace: 'normal'},
                                       // pointFormat: '<b>{point.percentage:.2f}% ({point.y:.2f} USD Mil)</b>',
                                        formatter: function () {
                                            var val = this.y;
                                            if (val.toFixed(0) < 1) {
                                                val = (val * 1000).toFixed(2) + ' K'
                                            } else {
                                                val = val.toFixed(2) + ' USD Mil'
                                            }

                                            return '<b>'+this.percentage.toFixed(2) + '% ('+ val+ ')</b>';
                                        }
                                    },
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
                                                        Math.round(this.point.percentage)
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
                        //Need to pass in purposecode to get FAO sub sectors
                        allowedFilter: ['year', 'purposecode', 'channelsubcategory_code', 'channelcode'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
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
                        id: 'top-channels', // TOP Channels
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#top-channels",
                        config: {
                            container: "#top-channels",
                            adapter: {
                                type: "standard",
                                xDimensions: 'channelsubcategory_code',
                                yDimensions: 'unitname',
                                valueDimensions: 'value',
                                seriesDimensions: ['flowcategory'],
                                sort: false
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column",
                                        events: {
                                            load: function(event) {
                                                if (this.options.chart.forExport) {
                                                    this.xAxis[0].update ({
                                                        categories: this.xAxis[0].categories,
                                                        labels: {
                                                            style: {
                                                                fontSize: '6px'
                                                            }
                                                        }
                                                    }, false);

                                                    Highcharts.each(this.series, function (series) {
                                                        series.update({
                                                            dataLabels: {
                                                                enabled: true,
                                                                style: {
                                                                    fontSize: '6px'
                                                                }
                                                            }
                                                        }, false);
                                                    });
                                                    this.redraw();
                                                }
                                            }
                                        }
                                    },
                                    exporting:{
                                        chartOptions:{
                                            legend:{
                                                enabled:true
                                            }
                                        }
                                    },
                                   /** legend: {
                                        enabled: true,
                                        align: 'center',
                                        verticalAlign: 'bottom',
                                        layout: 'horizontal',
                                        x:0,
                                        y:0
                                    },**/

                                   // plotOptions: {
                                       // column: {
                                       //     colorByPoint: true
                                      // }
                                   // },
                                    tooltip: {
                                        useHTML:true,
                                        formatter: function(){
                                            return '<div style="width: 200px; white-space:normal"><b>' +this.x + ': ' + '</b><br/>' +
                                                Highcharts.numberFormat(this.y, 2, '.', ',') + ' USD Mil' + '</div>';
                                        }
                                    },
                                    colors: ['#5663c3']

                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['purposecode', 'year'],
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
                                                    "to": 2014
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
                                        },
                                        {
                                            "columns": ["flowcategory"],
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
                        id: 'oda-regional', // Regional Distribution
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        container: "#oda-regional",
                        config: {
                            container: "#oda-regional",
                            adapter: {
                                type: "standard",
                                xDimensions: 'unitcode',
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
                                    exporting:{
                                        chartOptions:{
                                            legend:{
                                                enabled:true
                                            }
                                        }
                                    },
                                    legend: {
                                        reversed: true
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
                        allowedFilter: ['purposecode', 'year', 'channelsubcategory_code', 'channelcode'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
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
                                "name": "pggroup",
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
                        id: 'country-map',
                        type: 'map',
                        class: "fx-map-chart",
                        //needed if layout = injected
                        title: '',
                        container: "#country-map",
                        config: {
                            container: "#country-map",
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
                        allowedFilter: ['purposecode', 'year', 'channelsubcategory_code', 'channelcode'],
                        filter: [
                            {
                                "name": "filter",
                                "parameters": {
                                    "rows": {
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
                    "remove": ['top-sectors'],
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
                                "defaultcodes": [],
                                "onlyValueText": true,
                                "enableMultiselection": false,
                                "filter": {
                                    "uid": "crs_dac",
                                    "version": "2016",
                                    "level" : 1,
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
                    "title": "Sub Sector",
                    "module_class": "fx-filter-grid-module",
                    "class": "col-md-3 col-lg-2",
                    "remove": ['top-subsectors'],
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
                        id: 'tot-oda',  // TOTAL ODA
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#tot-oda",
                        config: {
                            container: "#tot-oda",
                            adapter: {
                                type: "standard",
                                xDimensions: 'year',
                                yDimensions: 'unitcode',
                                valueDimensions: 'value',
                                seriesDimensions: ['flowcategory']
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "line",
                                        events: {
                                            load: function(event) {
                                                amplify.publish('fx.browse.chart.faosector.loaded', this);
                                            }
                                        }
                                    },
                                    exporting:{
                                        chartOptions:{
                                            legend:{
                                                enabled:true
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
                        allowedFilter: ['recipientcode', 'purposecode', 'year', 'channelsubcategory_code', 'channelcode'],
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
                                                    "to": 2014
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
                                        "year"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": ["value"],
                                            "rule": "SUM"
                                        },
                                        {
                                            "columns": ["unitcode"],
                                            "rule": "pgfirst"
                                        } ,
                                        {
                                            "columns": ["flowcategory"],
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
                        id: 'top-partners', // TOP Donors
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#top-partners",
                        config: {
                            container: "#top-partners",
                            adapter: {
                                type: "standard",
                                xDimensions: 'donorcode',
                                yDimensions: 'unitname',
                                valueDimensions: 'value',
                                seriesDimensions: ['flowcategory'],
                                sort: false
                            },
                            template: {
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column",
                                        events: {
                                            load: function(event) {
                                                if (this.options.chart.forExport) {
                                                    this.xAxis[0].update ({
                                                        categories: this.xAxis[0].categories,
                                                        labels: {
                                                            style: {
                                                                fontSize: '6px'
                                                            }
                                                        }
                                                    }, false);

                                                    Highcharts.each(this.series, function (series) {
                                                        series.update({
                                                            dataLabels: {
                                                                enabled: true,
                                                                style: {
                                                                    fontSize: '6px'
                                                                }
                                                            }
                                                        }, false);
                                                    });
                                                    this.redraw();
                                                }
                                            }
                                        }
                                    },
                                    exporting:{
                                        chartOptions:{
                                            legend:{
                                                enabled:true
                                            }
                                        }
                                    },
                                    legend: {
                                        enabled: true
                                    },
                                   // plotOptions: {
                                       // column: {
                                         //   colorByPoint: true
                                       // }
                                  //  },
                                    tooltip: {
                                        formatter: function(){
                                            return '<b>' +this.x + ': ' + '</b><br/>' +
                                                Highcharts.numberFormat(this.y, 2, '.', ',') + ' USD Mil'
                                        }
                                    },
                                    colors: ['#56adc3']

                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['recipientcode', 'purposecode', 'year', 'channelsubcategory_code', 'channelcode'],
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
                                                    "to": 2014
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
                                        },
                                        {
                                            "columns": ["flowcategory"],
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
                        id: 'top-sectors', // TOP SECTORS
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#top-sectors",
                        config: {
                            container: "#top-sectors",
                            adapter: {
                                type: "standard",
                                xDimensions: 'parentsector_code',
                                yDimensions: 'unitname',
                                valueDimensions: 'value',
                                seriesDimensions: ['flowcategory'],
                                sort: false
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column",
                                        events: {
                                            load: function(event) {
                                                if (this.options.chart.forExport) {
                                                    this.xAxis[0].update ({
                                                        categories: this.xAxis[0].categories,
                                                        labels: {
                                                            style:{
                                                                width:'80px',
                                                                fontSize: '6px'
                                                            }
                                                        }
                                                    }, false);

                                                    Highcharts.each(this.series, function (series) {
                                                        series.update({
                                                            dataLabels: {
                                                                enabled: true,
                                                                style: {
                                                                    fontSize: '6px'
                                                                }
                                                            }
                                                        }, false);
                                                    });
                                                    this.redraw();
                                                }
                                            }
                                        }
                                    },
                                    exporting:{
                                        chartOptions:{
                                            legend:{
                                                enabled:true
                                            }
                                        }
                                    },
                                    legend: {
                                        enabled: true
                                    },
                                    xAxis: {
                                        labels: {
                                            style:{
                                                width:'80px'
                                            },
                                            rotation: -45
                                        }
                                    },
                                   // plotOptions: {
                                     //   column: {
                                      //      colorByPoint: true
                                      //  }
                                   // },
                                    tooltip: {
                                        formatter: function(){
                                            return '<b>' +this.x + ': ' + '</b><br/>' +
                                                Highcharts.numberFormat(this.y, 2, '.', ',') + ' USD Mil'
                                        }
                                    },
                                    colors: ['#39B7CD']

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
                                                    "to": 2014
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
                                        },
                                        {
                                            "columns": ["flowcategory"],
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
                        id: 'top-subsectors',    // Top sub-sectors pie
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#top-subsectors",
                        config: {
                            container: "#top-subsectors",
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
                                    exporting:{
                                        chartOptions:{
                                            title: {
                                                text: ''
                                            },
                                            legend: {
                                                align: 'center',
                                                layout: 'vertical',
                                                //symbolHeight:2,
                                                //symbolPadding: 0,
                                                //symbolWidth: 2,
                                                useHTML: true,
                                                labelFormatter: function() {
                                                    var val = this.y;
                                                    if (val.toFixed(0) < 1) {
                                                        val = (val * 1000).toFixed(2) + ' K'
                                                    } else {
                                                        val = val.toFixed(2) + ' USD Mil'
                                                    }

                                                    return '<div style="width:200px"><span style="float:left;  font-size:9px">' + this.name.trim() +': '+ this.percentage.toFixed(2) + '% ('+ val+ ')</span></div>';

                                                    // return '<div style="width:200px"><span style="float:left;  font-size:9px">' + this.name.trim() +': '+ Highcharts.numberFormat(this.percentage, 2) + '% (' + Highcharts.numberFormat(this.y, 2)+ ' USD Mil)</b></span></div>';
                                                }
                                            }
                                            /** legend: {
                                                align: 'center',
                                                verticalAlign: 'bottom',
                                                layout: 'vertical',
                                                x:0,
                                                y:0,
                                                useHTML: true,
                                                labelFormatter: function() {
                                                    return '<div style="width:200px"><span style="float:left">' + this.name.trim() +': '+ Highcharts.numberFormat(this.percentage, 2) + '% (' + Highcharts.numberFormat(this.y, 2)+ ' USD Mil)</b></span></div>';
                                                }
                                            }**/
                                        }
                                    },
                                    legend: {
                                        align: 'center',
                                        verticalAlign: 'bottom',
                                        layout: 'horizontal',
                                        x:0,
                                        y:0//,
                                        /**itemStyle: {
                                            width: 250
                                        },**/
                                    },
                                    tooltip: {
                                        style: {width: '200px', whiteSpace: 'normal'},
                                        // pointFormat: '<b>{point.percentage:.2f}% ({point.y:.2f} USD Mil)</b>',
                                        formatter: function () {
                                            var val = this.y;
                                            if (val.toFixed(0) < 1) {
                                                val = (val * 1000).toFixed(2) + ' K'
                                            } else {
                                                val = val.toFixed(2) + ' USD Mil'
                                            }

                                            return '<b>'+this.percentage.toFixed(2) + '% ('+ val+ ')</b>';
                                        }
                                    },
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
                                                        Math.round(this.point.percentage)
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
                        // FAO sub Sectors needs purpose code
                        allowedFilter: ['recipientcode', 'purposecode', 'year', 'channelsubcategory_code', 'channelcode'],
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
                                                    "to": 2014
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
                        id: 'top-channels', // TOP Channels
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#top-channels",
                        config: {
                            container: "#top-channels",
                            adapter: {
                                type: "standard",
                                xDimensions: 'channelsubcategory_code',
                                yDimensions: 'unitname',
                                valueDimensions: 'value',
                                seriesDimensions: ['flowcategory'],
                                sort: false
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column",
                                        events: {
                                            load: function(event) {
                                                if (this.options.chart.forExport) {
                                                    this.xAxis[0].update ({
                                                        categories: this.xAxis[0].categories,
                                                        labels: {
                                                            style: {
                                                                fontSize: '6px'
                                                            }
                                                        }
                                                    }, false);

                                                    Highcharts.each(this.series, function (series) {
                                                        series.update({
                                                            dataLabels: {
                                                                enabled: true,
                                                                style: {
                                                                    fontSize: '6px'
                                                                }
                                                            }
                                                        }, false);
                                                    });
                                                    this.redraw();
                                                }
                                            }
                                        }
                                    },
                                    exporting:{
                                        chartOptions:{
                                            legend:{
                                                enabled:true
                                            }
                                        }
                                    },
                                   /** legend: {
                                        enabled: true,
                                        align: 'center',
                                        verticalAlign: 'bottom',
                                        layout: 'horizontal',
                                        x:0,
                                        y:0//,

                                    },**/

                                    // plotOptions: {
                                    // column: {
                                    //     colorByPoint: true
                                    // }
                                    // },
                                    tooltip: {
                                        useHTML:true,
                                        formatter: function(){
                                            return '<div style="width: 200px; white-space:normal"><b>' +this.x + ': ' + '</b><br/>' +
                                                Highcharts.numberFormat(this.y, 2, '.', ',') + ' USD Mil' + '</div>';
                                        }
                                    },
                                    colors: ['#5663c3']

                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['recipientcode', 'purposecode', 'year'],
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
                                                    "to": 2014
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
                                        },
                                        {
                                            "columns": ["flowcategory"],
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
                        id: 'country-map',
                        type: 'map',
                        class: "fx-map-chart",
                        name: 'region-map',
                        //needed if layout = injected
                        container: "#country-map",
                        config: {
                            container: "#country-map",
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
                        allowedFilter: ['regioncode', 'purposecode', 'channelsubcategory_code', 'channelcode', 'year'],
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
                                    "query": "WHERE gaul0<>?",
                                    "queryParameters": [{"value": "NA"}]
                                    /**"query": "WHERE gaul0<>? AND regioncode=?",
                                    "queryParameters": [{"value": "NA"}, {"value": "10009"}]**/
                                }
                            }
                        ]
                    }

                ]
            }
        },

        "donor": {


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
                    "remove": ['top-sectors'],
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
                                "defaultcodes": [],
                                "onlyValueText": true,
                                "enableMultiselection": false,
                                "filter": {
                                    "uid": "crs_dac",
                                    "version": "2016",
                                    "level" : 1,
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
                    "title": "Sub Sector",
                    "module_class": "fx-filter-grid-module",
                    "class": "col-md-3 col-lg-2",
                    "remove": ['top-subsectors'],
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
                        id: 'tot-oda',  // TOTAL ODA
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#tot-oda",
                        config: {
                            container: "#tot-oda",
                            adapter: {
                                type: "standard",
                                xDimensions: 'year',
                                yDimensions: 'unitcode',
                                valueDimensions: 'value',
                                seriesDimensions: ['flowcategory']
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "line",
                                        events: {
                                            load: function(event) {
                                                amplify.publish('fx.browse.chart.faosector.loaded', this);
                                            }
                                        }
                                    },
                                    exporting:{
                                        chartOptions:{
                                            legend:{
                                                enabled:true
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
                        allowedFilter: [ 'donorcode', 'purposecode', 'year', 'channelsubcategory_code', 'channelcode'],
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
                                                    "to": 2014
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
                                        "year"
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
                                            "columns": ["flowcategory"],
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
                        id: 'top-recipients', // TOP Recipients
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#top-recipients",
                        config: {
                            container: "#top-recipients",
                            adapter: {
                                type: "standard",
                                xDimensions: 'recipientcode',
                                yDimensions: 'unitname',
                                valueDimensions: 'value',
                                seriesDimensions: ['flowcategory'],
                                sort: false
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column",
                                        events: {
                                            load: function(event) {
                                                if (this.options.chart.forExport) {
                                                    this.xAxis[0].update ({
                                                        categories: this.xAxis[0].categories,
                                                        labels: {
                                                            style: {
                                                                fontSize: '6px'
                                                            }
                                                        }
                                                    }, false);

                                                    Highcharts.each(this.series, function (series) {
                                                        series.update({
                                                            dataLabels: {
                                                                enabled: true,
                                                                style: {
                                                                    fontSize: '6px'
                                                                }
                                                            }
                                                        }, false);
                                                    });
                                                    this.redraw();
                                                }
                                            }
                                        }
                                    },
                                    exporting:{
                                        chartOptions:{
                                            legend:{
                                                enabled:true
                                            }
                                        }
                                    },
                                    legend: {
                                        enabled: true
                                    },
                                    tooltip: {
                                        useHTML:true,
                                        formatter: function(){
                                            return '<div style="width: 200px; white-space:normal"><b>' +this.x + ': ' + '</b><br/>' +
                                                Highcharts.numberFormat(this.y, 2, '.', ',') + ' USD Mil' + '</div>';
                                        }
                                    },
                                    colors: ['#5691c3']
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['donorcode', 'purposecode', 'year'],
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
                                                    "to": 2014
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
                                        "recipientcode"
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
                                        },
                                        {
                                            "columns": ["flowcategory"],
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
                        id: 'top-sectors', // TOP SECTORS
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#top-sectors",
                        config: {
                            container: "#top-sectors",
                            adapter: {
                                type: "standard",
                                xDimensions: 'parentsector_code',
                                yDimensions: 'unitname',
                                valueDimensions: 'value',
                                seriesDimensions: ['flowcategory'],
                                sort: false
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column",
                                        events: {
                                            load: function(event) {
                                                if (this.options.chart.forExport) {
                                                    this.xAxis[0].update ({
                                                        categories: this.xAxis[0].categories,
                                                        labels: {
                                                            style:{
                                                                width:'80px',
                                                                fontSize: '6px'
                                                            }
                                                        }
                                                    }, false);

                                                    Highcharts.each(this.series, function (series) {
                                                        series.update({
                                                            dataLabels: {
                                                                enabled: true,
                                                                style: {
                                                                    fontSize: '6px'
                                                                }
                                                            }
                                                        }, false);
                                                    });
                                                    this.redraw();
                                                }
                                            }
                                        }
                                    },
                                    exporting:{
                                        chartOptions:{
                                            legend:{
                                                enabled:true
                                            }
                                        }
                                    },
                                    legend: {
                                        enabled: true
                                    },
                                    xAxis: {
                                        labels: {
                                            style:{
                                                width:'80px'
                                            },
                                            rotation: -45
                                        }
                                    },
                                    // plotOptions: {
                                    //   column: DF3328{
                                    //      colorByPoint: true
                                    //  }
                                    // },
                                    tooltip: {
                                        formatter: function(){
                                            return '<b>' +this.x + ': ' + '</b><br/>' +
                                                Highcharts.numberFormat(this.y, 2, '.', ',') + ' USD Mil'
                                        }
                                    },
                                    colors: ['#39B7CD']

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
                                                    "to": 2014
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
                                        },
                                        {
                                            "columns": ["flowcategory"],
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
                        id: 'top-subsectors',    // Top sub-sectors pie
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#top-subsectors",
                        config: {
                            container: "#top-subsectors",
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
                                    exporting:{
                                        chartOptions:{
                                            title: {
                                                text: ''
                                            },
                                            legend: {
                                                align: 'center',
                                                layout: 'vertical',
                                                //symbolHeight:2,
                                                //symbolPadding: 0,
                                                //symbolWidth: 2,
                                                useHTML: true,
                                                labelFormatter: function() {
                                                    var val = this.y;
                                                    if (val.toFixed(0) < 1) {
                                                        val = (val * 1000).toFixed(2) + ' K'
                                                    } else {
                                                        val = val.toFixed(2) + ' USD Mil'
                                                    }

                                                    return '<div style="width:200px"><span style="float:left;  font-size:9px">' + this.name.trim() +': '+ this.percentage.toFixed(2) + '% ('+ val+ ')</span></div>';

                                                    // return '<div style="width:200px"><span style="float:left;  font-size:9px">' + this.name.trim() +': '+ Highcharts.numberFormat(this.percentage, 2) + '% (' + Highcharts.numberFormat(this.y, 2)+ ' USD Mil)</b></span></div>';
                                                }
                                            }
                                            /** legend: {
                                                align: 'center',
                                                verticalAlign: 'bottom',
                                                layout: 'vertical',
                                                x:0,
                                                y:0,
                                                useHTML: true,
                                                labelFormatter: function() {
                                                    return '<div style="width:200px"><span style="float:left">' + this.name.trim() +': '+ Highcharts.numberFormat(this.percentage, 2) + '% (' + Highcharts.numberFormat(this.y, 2)+ ' USD Mil)</b></span></div>';
                                                }
                                            }**/
                                        }
                                    },
                                    legend: {
                                        align: 'center',
                                        verticalAlign: 'bottom',
                                        layout: 'horizontal',
                                        x:0,
                                        y:0//,
                                        /**itemStyle: {
                                            width: 250
                                        },**/
                                    },
                                    tooltip: {
                                        style: {width: '200px', whiteSpace: 'normal'},
                                        // pointFormat: '<b>{point.percentage:.2f}% ({point.y:.2f} USD Mil)</b>',
                                        formatter: function () {
                                            var val = this.y;
                                            if (val.toFixed(0) < 1) {
                                                val = (val * 1000).toFixed(2) + ' K'
                                            } else {
                                                val = val.toFixed(2) + ' USD Mil'
                                            }

                                            return '<b>'+this.percentage.toFixed(2) + '% ('+ val+ ')</b>';
                                        }
                                    },
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
                                                        Math.round(this.point.percentage)
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
                        //FAO Sub sectors needs purposecode
                        allowedFilter: ['donorcode', 'year', 'purposecode', 'channelsubcategory_code', 'channelcode'],
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
                                                    "to": 2014
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
                        id: 'top-channels', // TOP Channels
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#top-channels",
                        config: {
                            container: "#top-channels",
                            adapter: {
                                type: "standard",
                                xDimensions: 'channelsubcategory_code',
                                yDimensions: 'unitname',
                                valueDimensions: 'value',
                                seriesDimensions: ['flowcategory'],
                                sort: false
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column",
                                        events: {
                                            load: function(event) {
                                                if (this.options.chart.forExport) {
                                                    this.xAxis[0].update ({
                                                        categories: this.xAxis[0].categories,
                                                        labels: {
                                                            style: {
                                                                fontSize: '6px'
                                                            }
                                                        }
                                                    }, false);

                                                    Highcharts.each(this.series, function (series) {
                                                        series.update({
                                                            dataLabels: {
                                                                enabled: true,
                                                                style: {
                                                                    fontSize: '6px'
                                                                }
                                                            }
                                                        }, false);
                                                    });
                                                    this.redraw();
                                                }
                                            }
                                        }
                                    },
                                    exporting:{
                                        chartOptions:{
                                            legend:{
                                                enabled:true
                                            }
                                        }
                                    },
                                   /** legend: {
                                        enabled: true,
                                        align: 'center',
                                        verticalAlign: 'bottom',
                                        layout: 'horizontal',
                                        x:0,
                                        y:0

                                    },**/

                                    tooltip: {
                                        useHTML:true,
                                        formatter: function(){
                                            return '<div style="width: 200px; white-space:normal"><b>' +this.x + ': ' + '</b><br/>' +
                                                Highcharts.numberFormat(this.y, 2, '.', ',') + ' USD Mil' + '</div>';
                                        }
                                    },
                                    colors: ['#5663c3']

                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['donorcode', 'purposecode', 'year'],
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
                                                    "to": 2014
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
                                        },
                                        {
                                            "columns": ["flowcategory"],
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
                        id: 'oda-regional', // Regional Distribution
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        container: "#oda-regional",
                        config: {
                            container: "#oda-regional",
                            adapter: {
                                type: "standard",
                                xDimensions: 'unitcode',
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
                                    exporting:{
                                        chartOptions:{
                                            legend:{
                                                enabled:true
                                            }
                                        }
                                    },
                                    legend: {
                                        reversed: true
                                    },
                                    yAxis: {
                                        title: {
                                            text: '%',
                                            align: 'high'
                                        }
                                    },
                                    xAxis: {
                                        labels: {
                                            enabled: true,
                                            step: 1
                                        }
                                    },
                                    tooltip: {
                                        formatter: function(){
                                            return '<b>' +this.series.name +' - ' +this.x +':' + '</b><br/>'  +' <b>'+   Highcharts.numberFormat(this.point.percentage, 2) + '% </b>'+
                                                ' ('+ Highcharts.numberFormat(this.y, 2, '.', ',') + ' USD Mil)'
                                        }
                                    }
                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['donorcode', 'purposecode', 'year', 'channelsubcategory_code', 'channelcode'],
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
                                                    "to": 2014
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
                                        "unitcode", "un_continent_code"
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
                        id: 'country-map',
                        type: 'map',
                        class: "fx-map-chart",
                        //needed if layout = injected
                        container: "#country-map",
                        config: {
                            container: "#country-map",
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
                        allowedFilter: ['donorcode', 'purposecode', 'year', 'channelsubcategory_code', 'channelcode'],
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
                                                    "to": 2014
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
                                    "query": "WHERE gaul0<>?",
                                    "queryParameters": [{"value": "NA"}]
                                }
                            }
                        ]
                    }

                ]
            }
        },

        "country_donor": {

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
                    "remove": ['top-sectors'],
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
                                "defaultcodes": [],
                                "onlyValueText": true,
                                "enableMultiselection": false,
                                "filter": {
                                    "uid": "crs_dac",
                                    "version": "2016",
                                    "level" : 1,
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
                    "title": "Sub Sector",
                    "module_class": "fx-filter-grid-module",
                    "class": "col-md-3 col-lg-2",
                    "remove": ['top-subsectors'],
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
                        id: 'tot-oda',  // TOTAL ODA
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#tot-oda",
                        config: {
                            container: "#tot-oda",
                            adapter: {
                                type: "standard",
                                xDimensions: 'year',
                                yDimensions: 'unitcode',
                                valueDimensions: 'value',
                                seriesDimensions: ['flowcategory']
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "line",
                                        events: {
                                            load: function(event) {
                                                amplify.publish('fx.browse.chart.faosector.loaded', this);
                                            }
                                        }
                                    },
                                    exporting:{
                                        chartOptions:{
                                            legend:{
                                                enabled:true
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
                        allowedFilter: ['recipientcode', 'donorcode', 'purposecode', 'year', 'channelsubcategory_code', 'channelcode'],
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
                                                    "to": 2014
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
                                       "year"
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
                                            "columns": ["flowcategory"],
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
                        id: 'top-sectors', // TOP SECTORS
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#top-sectors",
                        config: {
                            container: "#top-sectors",
                            adapter: {
                                type: "standard",
                                xDimensions: 'parentsector_code',
                                yDimensions: 'unitname',
                                valueDimensions: 'value',
                                seriesDimensions: ['flowcategory'],
                                sort: false
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column",
                                        events: {
                                            load: function(event) {
                                                if (this.options.chart.forExport) {
                                                    this.xAxis[0].update ({
                                                        categories: this.xAxis[0].categories,
                                                        labels: {
                                                            style:{
                                                                width:'80px',
                                                                fontSize: '6px'
                                                            }
                                                        }
                                                    }, false);

                                                    Highcharts.each(this.series, function (series) {
                                                        series.update({
                                                            dataLabels: {
                                                                enabled: true,
                                                                style: {
                                                                    fontSize: '6px'
                                                                }
                                                            }
                                                        }, false);
                                                    });
                                                    this.redraw();
                                                }
                                            }
                                        }
                                    },
                                    exporting:{
                                        chartOptions:{
                                            legend:{
                                                enabled:true
                                            },
                                            xAxis: {
                                                labels: {
                                                    style:{
                                                        width:'80px'
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    legend: {
                                        enabled: true
                                    },
                                    xAxis: {
                                        labels: {
                                            style:{
                                                width:'80px'
                                            },
                                           rotation: -45
                                        }
                                    },
                                    // plotOptions: {
                                    //   column: {
                                    //      colorByPoint: true
                                    //  }
                                    // },
                                    tooltip: {
                                        formatter: function(){
                                            return '<b>' +this.x + ': ' + '</b><br/>' +
                                                Highcharts.numberFormat(this.y, 2, '.', ',') + ' USD Mil'
                                        }
                                    },
                                    colors: ['#39B7CD']

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
                                                    "to": 2014
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
                                        },
                                        {
                                            "columns": ["flowcategory"],
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
                        id: 'top-subsectors',    // Top sub-sectors pie
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#top-subsectors",
                        config: {
                            container: "#top-subsectors",
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
                                    exporting:{
                                        chartOptions:{
                                            title: {
                                                text: ''
                                            },
                                            legend: {
                                                align: 'center',
                                                layout: 'vertical',
                                                //symbolHeight:2,
                                                //symbolPadding: 0,
                                                //symbolWidth: 2,
                                                useHTML: true,
                                                labelFormatter: function() {
                                                    var val = this.y;
                                                    if (val.toFixed(0) < 1) {
                                                        val = (val * 1000).toFixed(2) + ' K'
                                                    } else {
                                                        val = val.toFixed(2) + ' USD Mil'
                                                    }

                                                    return '<div style="width:200px"><span style="float:left;  font-size:9px">' + this.name.trim() +': '+ this.percentage.toFixed(2) + '% ('+ val+ ')</span></div>';

                                                    // return '<div style="width:200px"><span style="float:left;  font-size:9px">' + this.name.trim() +': '+ Highcharts.numberFormat(this.percentage, 2) + '% (' + Highcharts.numberFormat(this.y, 2)+ ' USD Mil)</b></span></div>';
                                                }
                                            }
                                            /** legend: {
                                                align: 'center',
                                                verticalAlign: 'bottom',
                                                layout: 'vertical',
                                                x:0,
                                                y:0,
                                                useHTML: true,
                                                labelFormatter: function() {
                                                    return '<div style="width:200px"><span style="float:left">' + this.name.trim() +': '+ Highcharts.numberFormat(this.percentage, 2) + '% (' + Highcharts.numberFormat(this.y, 2)+ ' USD Mil)</b></span></div>';
                                                }
                                            }**/
                                        }
                                    },
                                    legend: {
                                        align: 'center',
                                        verticalAlign: 'bottom',
                                        layout: 'horizontal',
                                        x:0,
                                        y:0//,
                                        /**itemStyle: {
                                            width: 250
                                        },**/
                                    },
                                    tooltip: {
                                        style: {width: '200px', whiteSpace: 'normal'},
                                        // pointFormat: '<b>{point.percentage:.2f}% ({point.y:.2f} USD Mil)</b>',
                                        formatter: function () {
                                            var val = this.y;
                                            if (val.toFixed(0) < 1) {
                                                val = (val * 1000).toFixed(2) + ' K'
                                            } else {
                                                val = val.toFixed(2) + ' USD Mil'
                                            }

                                            return '<b>'+this.percentage.toFixed(2) + '% ('+ val+ ')</b>';
                                        }
                                    },
                                   // tooltip: {
                                      //  style: {width: '200px', whiteSpace: 'normal'},
                                      //  pointFormat: '<b>{point.percentage:.2f}% ({point.y:.2f} USD Mil)</b>'
                                  //  },
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
                                                        Math.round(this.point.percentage)
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
                        //FAO Sub sectors needs purposecode
                        allowedFilter: ['recipientcode', 'donorcode', 'year', 'purposecode', 'channelsubcategory_code', 'channelcode'],
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
                                                    "to": 2014
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
                        id: 'top-channels', // TOP Channels
                        type: 'chart',
                        class: "fx-timeseries-ecample",
                        //needed if layout = injected
                        container: "#top-channels",
                        config: {
                            container: "#top-channels",
                            adapter: {
                                type: "standard",
                                xDimensions: 'channelsubcategory_code',
                                yDimensions: 'unitname',
                                valueDimensions: 'value',
                                seriesDimensions: ['flowcategory'],
                                sort:false
                            },
                            template: {
                                //"title": "Top 25..."
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column",
                                        events: {
                                            load: function(event) {
                                                if (this.options.chart.forExport) {
                                                    this.xAxis[0].update ({
                                                        categories: this.xAxis[0].categories,
                                                        labels: {
                                                            style: {
                                                                fontSize: '6px'
                                                            }
                                                        }
                                                    }, false);

                                                    Highcharts.each(this.series, function (series) {
                                                        series.update({
                                                            dataLabels: {
                                                                enabled: true,
                                                                style: {
                                                                    fontSize: '6px'
                                                                }
                                                            }
                                                        }, false);
                                                    });
                                                    this.redraw();
                                                }
                                            }
                                        }
                                    },
                                    exporting:{
                                        chartOptions:{
                                            legend:{
                                                enabled:true
                                            }
                                        }
                                    },
                                  /**  legend: {
                                        enabled: true,
                                        align: 'center',
                                        verticalAlign: 'bottom',
                                        layout: 'horizontal',
                                        x:0,
                                        y:0
                                    },**/
                                    tooltip: {
                                        useHTML:true,
                                        formatter: function(){
                                            return '<div style="width: 200px; white-space:normal"><b>' +this.x + ': ' + '</b><br/>' +
                                                Highcharts.numberFormat(this.y, 2, '.', ',') + ' USD Mil' + '</div>';
                                        }
                                    },
                                    colors: ['#5663c3']

                                }
                            }
                        },
                        // for now it takes the id, TODO: add uid as well
                        allowedFilter: ['recipientcode', 'donorcode', 'purposecode', 'year'],
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
                                                    "to": 2014
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
                                        },
                                        {
                                            "columns": ["flowcategory"],
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
                    }

                ]
            }
        }

    }



});