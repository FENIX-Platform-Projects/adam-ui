/*global define*/
define(function () {

    'use strict';

    return {

        chart: {
            spacing: [10, 10, 15, 10], // better spacing when chart exports

            events: {
                load: function (event) {
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

        credits: {
            enabled: true,
            position: {
                align: 'left',
                x: 10
            },
            text: 'Source: OECD',
            href: ''
        },


        exporting: {
            buttons: {
                contextButton: {
                    _titleKey: "doptions",
                    text: "Download"//,
                    // menuItems: [{
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
                }
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
                    }
                },
                credits: {
                    style: {
                        fontSize: '6px'
                    }
                },
                legend: {
                    enabled: false//, only one series and all info in title and subtitle
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
            x: -20
        },

        yAxis: {
            title: {
                enabled: true,
                text: 'Million USD'
            }
        },
        tooltip: {
            formatter: function () {
                return '<b>' + this.x + ': ' +
                    this.series.name + '</b><br/>' +
                    Highcharts.numberFormat(this.y, 2, '.', ',') + ' USD Mil'
            }
        }

    };
});