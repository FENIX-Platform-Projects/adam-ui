/*global define*/

define(function () {

    'use strict';

    return {

            dashboard: {
                //default dataset id
                uid: "adam_usd_commitment",

                items: [
                    {
                        id: 'home-map',
                        type: 'map',
                        config: {
                            geoSubject: 'gaul0',
                            colorRamp: 'Blues',//'GnBu',  //Blues, Greens,
                            //colorRamp values: http://fenixrepo.fao.org/cdn/fenix/fenix-ui-map-datasets/colorramp.png

                            legendtitle: 'ODA 2014',

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
                            //parentsector_code: ["600"],
                            year: [{value: 2014, parent: 'from'}, {value: 2014, parent:  'to'}]
                        },
                        //["10019", 94.14012907569995, "160", 5 more...]
                        //[ "10019", "160", "million_usd", "Million USD", "Upper Middle Income Countries and Territories
                       // (UMICs)", "Mauritius", "Million USD" ]
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
        }



});