/*global define*/
define(function () {

    'use strict';

    return {

        chart: {
            spacing: [10, 10, 27, 10], // better spacing when chart exports

            events: {
                load: function (event) {


                    Highcharts.setOptions({
                        lang: {
                            toggleDataLabels: 'Display/hide values on the chart',
                            download: 'Download chart options'
                        }
                    });

                    if(this.series.length < 2){
                        $.each(this.series, function (i, serie) {
                               serie.update({
                                    showInLegend: false
                                })
                        });
                        //this.redraw();
                    }

                    if (this.options.chart.forExport) {
                        this.xAxis[0].update({
                            categories: this.xAxis[0].categories,
                            labels: {
                                style: {
                                    width: '50px',
                                    fontSize: '6px'
                                },
                                step: 1
                            }
                        }, false);

                        Highcharts.each(this.yAxis, function (y) {
                            y.update({
                                title: {
                                    style: {
                                        fontSize: '6px'
                                    }
                                },
                                labels: {
                                    style: {
                                        fontSize: '6px'
                                    }
                                }
                            }, false);
                        });

                        $.each(this.series, function (i, serie) {
                            if(!serie.visible){
                                serie.update({
                                    showInLegend: false
                                })
                            } else {
                                if(serie.options.dataLabels.enabled){
                                         serie.update({
                                          marker : {
                                             radius: 2
                                         },
                                         dataLabels: {
                                           enabled: true,
                                          style: {
                                            fontSize: '6px'
                                         }
                                         }
                                     })
                                }
                           }
                        });

                      /**  Highcharts.each(this.series, function (series) {
                            series.update({
                                marker : {
                                    radius: 2
                                },
                                dataLabels: {
                                    enabled: true,
                                    style: {
                                        fontSize: '6px',
                                        color: series.color,
                                        textShadow: 0
                                    }
                                }
                            }, false);
                        });**/
                        this.redraw();
                    }


                },
                beforePrint: function (event) {


                    Highcharts.setOptions({
                        lang: {
                            toggleDataLabels: 'Display/hide values on the chart',
                            download: 'Download chart options'
                        }
                    });

                    if(this.series.length < 2){
                        $.each(this.series, function (i, serie) {
                            serie.update({
                                showInLegend: false
                            })
                        });
                        this.redraw();
                    }

                    if (this.options.chart.forExport) {
                        this.xAxis[0].update({
                            categories: this.xAxis[0].categories,
                            labels: {
                                style: {
                                    width: '50px',
                                    fontSize: '6px'
                                },
                                step: 1
                            }
                        }, false);

                        Highcharts.each(this.yAxis, function (y) {
                            y.update({
                                title: {
                                    style: {
                                        fontSize: '6px'
                                    }
                                },
                                labels: {
                                    style: {
                                        fontSize: '6px'
                                    }
                                }
                            }, false);
                        });

                        $.each(this.series, function (i, serie) {
                            if(!serie.visible){
                                serie.update({
                                    showInLegend: false
                                })
                            } else {
                                if(serie.options.dataLabels.enabled){
                                    serie.update({
                                        marker : {
                                            radius: 2
                                        },
                                        dataLabels: {
                                            enabled: true,
                                            style: {
                                                fontSize: '6px'
                                            }
                                        }
                                    })
                                }
                            }
                        });

                        /**  Highcharts.each(this.series, function (series) {
                            series.update({
                                marker : {
                                    radius: 2
                                },
                                dataLabels: {
                                    enabled: true,
                                    style: {
                                        fontSize: '6px',
                                        color: series.color,
                                        textShadow: 0
                                    }
                                }
                            }, false);
                        });**/
                        this.redraw();
                    }


                }
            }

        },

        credits: {
            enabled: true,
            position: {
                align: 'left',
                x: 5
            },
            text: 'Source: OECD-CRS',
            href: ''
        },


        exporting: {
            sourceWidth: 700,
            buttons: {
                contextButton: {

                    text: "Download",
                    _titleKey: "download"

                    //, menuItems: [{
                    //    textKey: 'downloadPNG',
                    //    onclick: function () {
                    //        this.exportChart();
                    //    }
                    // }, {
                    //   textKey: 'downloadJPEG',
                    //  onclick: function () {
                    //      this.exportChart({
                    //         type: 'image/jpeg'
                    //    });
                    // }
                    // }]
                },
                toggleDataLabelsButton: {
                    text: "Display Values",
                    _titleKey: "toggleDataLabels",
                    onclick: function (){

                        var button = this.exportSVGElements[2],
                            $button = $(button.element.lastChild),
                        text = $button.text() == "Display Values" ? "Hide Values" : "Display Values";

                        button.attr({
                          text: text
                        });

                        for(var idx = 0; idx < this.series.length; idx++){
                            var opt = this.series[idx].options;
                            var isShown = !opt.dataLabels.enabled;
                            this.series[idx].update({dataLabels: {enabled: isShown,  style: {
                               // fontSize: '7px',
                                color: this.series[idx].color,
                                textShadow: 0
                            }}});
                        }

                    }
                }/**,
                printButton: {
                     text: "Print",
                   // _titleKey: "toggleDataLabels",
                    onclick: function (){
                        var chart = $(this.renderTo).highcharts();
                        //console.lo
                        $(this.renderTo).find('.highcharts-button').hide();
                        $(this.renderTo).find('.highcharts-subtitle').hide();
                        $(this.renderTo).find('.highcharts-legend-title').hide();

                        chart.print();

                        $(this.renderTo).find('.highcharts-button').show();
                        $(this.renderTo).find('.highcharts-subtitle').show();
                        $(this.renderTo).find('.highcharts-legend-title').show();
                        //alert(this.renderTo)
                        //this.setTitle("Hello");

                       // this.print();
                    }
                }**/
            },


            chartOptions: {

                xAxis: {
                    labels: {
                        y: 15,
                        style: {
                            fontSize: '6px'
                        }
                    }
                },
                yAxis: {
                    title: {
                        style: {
                            fontSize: '7px'
                        }
                    },
                    labels: {
                        style: {
                            fontSize: '6px'
                        }
                    }
                },
                title: {
                    style: {
                        fontSize: '8px',
                        fontWeight: 'bold'
                    }
                },
                subtitle: {
                    style: {
                        fontSize: '8px'
                    },
                    align: 'center'
                },
                credits: {
                    style: {
                        fontSize: '6px',
                        margin: '30px'
                    }

                },
                legend: {
                    title: {
                        text: null
                    },
                    labelFormatter: function(){
                        return '<span style="color:'+this.color+'">'+this.name+'</span>';
                    },
                    itemStyle: {
                        fontSize: '6px'//,
                        //fontWeight: 'bold'
                    },
                    enabled: false//, only one series and all info in title and subtitle
                },
                plotOptions: {
                    series: {
                        lineWidth: 1
                    }
                },
                series: {
                   // marker : {
                   //     radius: 2
                  // },
                    dataLabels: {
                        enabled: false
                       // style: {
                           // fontSize: '6px',
                           // color: this.series.color,
                           // textShadow: 0
                       // }
                    }
                }

            }


        },

        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                showInLegend: true // shows legend for pie
            }
        },
        legend: {
            title: {
                text: 'Click to hide/show'
            },
            itemStyle: {
                fontSize: '12px'
            }
        },

        subtitle: {
            text: '<b>Hover for values and click and drag to zoom</b>',
            align: 'left',
            x: 10
        },

        yAxis: [{ //Primary Axis
            title: {
               enabled: true,
               text: 'USD Millions'
             }
        }],


        tooltip: {
            formatter: function () {
                var unit = 'USD Mil';

                if(this.series.name.indexOf('%') >=0)
                    unit = '%'

                return '<b>' + this.x + ': ' +
                    this.series.name + '</b><br/>' +
                    Highcharts.numberFormat(this.y, 2, '.', ',') + ' '+unit;

            }
        }

    };
});