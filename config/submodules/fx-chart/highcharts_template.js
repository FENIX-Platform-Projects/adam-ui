/*global define*/
define(function () {

    'use strict';

    return {

        //Line chart
        chart: {
            events: {},

            type: 'line', //Tipo di grafico:  area, areaspline, boxplot, bubble, column, line, pie, scatter, spline

            alignTicks: false,
            backgroundColor: '#FFFFFF', //Colore di background
            //borderColor: '#3fa8da', //Colore bordo intorno
            //borderWidth: 1, //Spessore bordo intorno
            //borderRadius: 0, //Smusso bordo intorno
            //margin: [5,5,5,5], //Margine intorno (vince sullo spacing)
           // spacing: [20, 1, 1, 1],//Spacing intorno (molto simile al margin - Di default il bottom è 15, qui l'ho messo a 10 per essere uguale agli altri)
            //plotBackgroundColor: 'red', //Colore di background solo area chart
            plotBorderColor: '#ffffff', //Colore bordo intorno solo area chart
            plotBorderWidth: 0, //Spessore bordo intorno solo area chart
            //showAxes: false, //Mostra gli assi quando le serie sono aggiunte dinamicamente
            style: {
                fontFamily: 'FrutigerLTW02-45Light', // Font di tutto
                fontSize: '12px', // La dimensione qui vale solo per i titoli
                fontWeight: 300 // Con Roboto è molto bello giocare con i pesi
            },
            zoomType: 'xy', //Attiva lo zoom e stabilisce in quale dimensione
            //selectionMarkerFill: 'rgba(0,0,0,0.25)',//Colore di fonfo della selezione per lo zoom (trasparente per far vedere sotto)



            resetZoomButton: {
                position: {
                    align: 'right', //Allineamento zoom orizzontale
                    //verticalAlign:'middle' //Allineamento zoom verticale
                    x: -10 //Posizione del pulsante rispetto all'allineamento (valori positivi > destra) e al PLOT

                },
                theme: {
                    fill: '#FFFFFF', //Colore di background pulsante reset zoom
                    stroke: '#666666', //Colore di stroke pulsante reset zoom
                    width: 60, //Larghezza del pulsante reset
                    //r:0, //Smusso pulsante reset zoom
                    style: {
                        textAlign: 'center', //CSS style aggiunto da me per centrare il testo
                        fontSize: 10
                    },
                    states: {
                        hover: {
                            fill: '#e6e6e6', //Colore di background hover pulsante reset zoom
                            stroke: '#666666', //Colore di stroke hover pulsante reset zoom
                            style: {
                                //color: 'white' //Colore testo hover pulsante reset zoom
                            }
                        }
                    }
                }

            }
        },
        colors: [ //Colori delle charts
            '#56adc3',
            '#5691c3',
            '#5663c3',
            '#d2ccbf',
            '#DF3328',
            '#F1E300',
            '#F7AE3C',
            '#DF3328',
            '#2e8bcc',
            '#339933',
            '#e51400',
            '#ffc40d',
            '#f39c12',
            '#e671b8',
            '#7b4f9d',
            '#8cbf26',
            '#ff0097',
            '#00aba9',
            '#1abc9c',
            '#16a085',
            '#2ecc71',
            '#27ae60',
            '#3498db',
            '#2980b9',
            '#9b59b6',
            '#8e44ad',
            '#34495e',
            '#2c3e50',
            '#f1c40f',
            '#e67e22',
            '#d35400',
            '#e74c3c',
            '#c0392b'
        ],
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
        },
        exporting: {
            buttons: {
                contextButton: {
                    _titleKey:"doptions",
                    text: 'Download',
                    menuItems: [{
                        textKey: 'downloadPNG',
                        onclick: function () {
                            this.exportChart();
                        }
                    }, {
                        textKey: 'downloadJPEG',
                        onclick: function () {
                            this.exportChart({
                                type: 'image/jpeg'
                            });
                        }
                    }]
                }
              },
            chartOptions:{
                title: {
                    text: '',
                    style: {
                        fontSize: '12px'
                    }
                },
                subtitle: {
                    text: '',
                   // style: {
                      //  fontSize: '10px'
                    //}
                    style: {
                        fontSize: '9px',
                        lineHeight: '15em'
                    }
                },
                legend:{
                    title: {
                        text: ''
                    }
                }
            }
          },
      /**  legend: {
            align: 'center',
            verticalAlign: 'bottom',
            layout: 'horizontal',
            x:0,
            y:0,
            itemStyle: {
                fontWeight: 'normal'
            },
            title: {
                text: 'Click to hide/show'
            }
        },**/
      legend: {
            align: 'right',
            verticalAlign: 'top',
            layout: 'vertical',
            x:0,
            y:100,
            itemStyle: {
                fontWeight: 'normal'
            },
            title: {
                text: 'Click to hide/show'
            }
        },
        title: {
            //enabled: false,
            text: '',
            x: -20 //center
        },
        subtitle: {
            text: '<b>Hover for values and click and drag to zoom</b>'
        },
        xAxis: {
            gridLineWidth: 1, // IMPORTANTE - Attiva le linee verticali
            lineColor: '#e0e0e0',
            tickColor: '#e0e0e0',
            gridLineColor: '#eeeeee',
            tickLength: 7,
            //tickmarkPlacement: 'on', Per partire dall'origine
          /**  labels: {
                y: 25,
                style: {
                    color: '#666666',
                    fontWeight: '300',
                    fontSize: 12
                }
            },**/
            //type: 'datetime',
/*            dateTimeLabelFormats: { // don't display the dummy year
                //month: '%e. %b',
                year: '%Y'
            },*/
            title: {
                enabled: false,
                text: 'null'
            }
        },
        yAxis: {
            gridLineWidth: 1, // IMPORTANTE - Attiva le linee verticali
            lineWidth: 1,
            //tickWidth: 1,
            lineColor: '#e0e0e0',
            gridLineColor: '#eeeeee',
            labels: {
                style: {
                    color: '#666666',
                    fontWeight: '300',
                    fontSize: 12
                }
            },
            title: {
                enabled: false,
                text: 'null'
            },
            plotLines: [
                {
                    value: 0,
                    width: 1
                }
            ]
        },
        tooltip: {
            //valueSuffix: '',
            // backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderWidth: 1,
            shadow: true,
            crosshairs: "mixed",
           // shared: true
        }

    };
});