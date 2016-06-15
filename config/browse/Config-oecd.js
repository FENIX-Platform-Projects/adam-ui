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
                uid: {
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
                            series: ["flowcategory"], // series
                            y: ["value"],//Y dimension
                            aggregationFn: {"value": "sum"},
                            useDimensionLabelsIfExist: true,// || default raw else fenixtool

                            // filterFor: ['parentsector_code', 'purposecode', 'year-from', 'year-to'],
                            config: {
                                xAxis: {
                                    type: 'datetime'
                                }
                            }
                        },

                        filter: { //FX-filter format
                            parentsector_code: ["600"],
                            year: [{value: 2000, parent: 'from'}, {value: 2014, parent:  'to'}]
                        },

                        postProcess: [
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
                            }]
                    },
                    {
                        id: 'top-partners', // TOP DONORS
                        type: 'chart',
                        config: {
                            type: "column",
                            x: ["donorcode"], //x axis
                            series: ["flowcategory"], // series
                            y: ["value"],//Y dimension
                            aggregationFn: {"value": "sum"},
                            useDimensionLabelsIfExist: true,// || default raw else fenixtool

                            // filterFor: ['parentsector_code', 'purposecode', 'year-from', 'year-to'],
                            config: {
                                colors: ['#008080']
                            }
                        },
                        filter: { //FX-filter format
                            parentsector_code: ["600"],
                            year: [{value: 2000, parent: 'from'}, {value: 2014, parent:  'to'}]

                        },
                        postProcess: [
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
                            }]
                    },
                    {
                        id: 'top-recipients', // TOP RECIPIENTS
                        type: 'chart',
                        config: {
                            type: "column",
                            x: ["recipientcode"], //x axis
                            series: ["flowcategory"], // series
                            y: ["value"],//Y dimension
                            aggregationFn: {"value": "sum"},
                            useDimensionLabelsIfExist: true,// || default raw else fenixtool

                            // filterFor: ['parentsector_code', 'purposecode', 'year-from', 'year-to'],
                            config: {
                                colors: ['#5DA58D']
                            }

                        },
                        filter: { //FX-filter format
                            parentsector_code: ["600"],
                            year: [{value: 2000, parent: 'from'}, {value: 2014, parent:  'to'}]

                        },
                        postProcess: [
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
                                            "columns": ["flowcategory"],
                                            "rule": "pgfirst"
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
                        id: 'top-channels', // TOP CHANNELS OF DELIVERY
                        type: 'chart',
                        config: {
                            type: "column",
                            x: ["channelsubcategory_code"], //x axis
                            series: ["flowcategory"], // series
                            y: ["value"],//Y dimension
                            aggregationFn: {"value": "sum"},
                            useDimensionLabelsIfExist: true,// || default raw else fenixtool

                            // filterFor: ['parentsector_code', 'purposecode', 'year-from', 'year-to'],
                            config: {
                                colors: ['#56adc3']
                            }

                        },
                        filter: { //FX-filter format
                            parentsector_code: ["600"],
                            year: [{value: 2000, parent: 'from'}, {value: 2014, parent:  'to'}]
                        },
                        postProcess: [
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
                            }]
                    },

                    {
                        id: 'top-subsectors', // TOP SUB SECTORS
                        type: 'chart',
                        config: {
                            type: "pie",
                            x: ["purposecode"], //x axis and series
                            series: ["flowcategory"], // series
                            y: ["value"],//Y dimension
                            aggregationFn: {"value": "sum"},
                            useDimensionLabelsIfExist: true,// || default raw else fenixtool

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
                            year: [{value: 2000, parent: 'from'}, {value: 2014, parent:  'to'}]

                        },
                        postProcess: [
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
                                            style :{
                                                fontWeight: 'normal',
                                                textShadow: '0'
                                            },
                                            formatter: function(){
                                                var percent =  Math.round(this.point.percentage);
                                                if(percent > 0)
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
                                exporting:{
                                    chartOptions:{
                                        legend:{
                                            title: '',
                                            enabled:true,
                                            itemStyle: {
                                                fontSize:'9px',
                                            },
                                            useHTML: true,
                                            labelFormatter: function () {
                                                console.log(this.options);
                                                console.log(this.options.dataLabels);

                                               // var opts = JSON.parse(JSON.stringify(Object.keys(this.options)));
                                              //  console.log(opts);

                                              //  console.log(opts.dataLabels);

                                              return '<div style="width:200px"><span style="float:left;  font-size:9px">'+ this.name +' (' + this.yData + ' USD Mil)</span></div>';
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
                                    formatter: function(){
                                        return '<b>' +this.series.name + ':' + '</b><br/>'  +' <b>'+   Highcharts.numberFormat(this.point.percentage, 4) + '% </b>'+
                                            ' ('+ Highcharts.numberFormat(this.y, 2, '.', ',') + ' USD Mil)'
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
                                            "columns": ["flowcategory"],
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
                        config: {
                            geoSubject: 'gaul0',
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
                                }
                            }
                        },

                        filter: { //FX-filter format
                            parentsector_code: ["600"],
                            year: [{value: 2000, parent: 'from'}, {value: 2014, parent:  'to'}]

                        },
                        postProcess: [
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
        }
    }


});