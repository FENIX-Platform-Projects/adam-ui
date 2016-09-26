/*global define*/

define(function () {

    'use strict';

    return {
            dashboard: {

                //default dataset id
                uid: "adam_usd_commitment",

                items: [
                    {
                        id: "comp_advantage",
                        type: 'custom',
                        config: {
                            "groupedRow":false,
                            "aggregationFn":{"value":"sum"},
                            "formatter":"localstring",
                            "decimals":2,
                            "pageSize": "150",
                            "showRowHeaders":true,
                            "rows":["purposecode_EN", "recipientcode_EN", "year", "delivery",  "fao_delivery", "total_fao_delivery", "advantage_ratio", "ratio"], //"delivery",  "fao_delivery", "total_fao_delivery", "advantage_ratio", "ratio"
                            //"rows":["purposecode_EN", "recipientcode_EN", "year", "ratio"], //"delivery",  "fao_delivery", "total_fao_delivery", "advantage_ratio", "ratio"


                            "aggregations":[],
                           // "values":["delivery",  "fao_delivery", "total_fao_delivery", "advantage_ratio"],
                          //  inputFormat : "fenixtool",

                            config: {
                                pageSize: 150,
                                height: 700,
                                customRowAttribute : function(record,rn,grid){
                                    this.autoSelectFirstRow = false;

                                    if (record[7] === 'YES'){
                                        return 'style="background-color:#e6ffe6"';
                                    } else {
                                        return 'style="background-color:#f4f4f4"'
                                    }
                                },
                                columns: [
                                    {id: "purposecode_EN", width: 250},
                                    {id: "recipientcode_EN", width: 170},
                                    {id: "year", width: 70, align: 'center'},
                                    {id: "delivery", width: 100,  align: 'center',
                                        renderer: function (value, record, columnObj, grid, colNo, rowNo) {
                                            var val = value;

                                            if(val && val > 0 && val < 100 ){
                                                val = parseFloat(val).toFixed(2);
                                            }

                                        return  val;
                                    }},
                                    {id: "fao_delivery",  width: 100,
                                        renderer: function (value, record, columnObj, grid, colNo, rowNo) {
                                            var val = value;

                                            if(val && val > 0 && val < 100 ){
                                                val = parseFloat(val).toFixed(2);
                                            }
                                            return  val;
                                        }},
                                    {id: "total_fao_delivery",
                                        renderer: function (value, record, columnObj, grid, colNo, rowNo) {
                                            var val = value;

                                            if(val && val > 0 && val < 100 ){
                                                val = parseFloat(val).toFixed(2);
                                            }
                                            return  val;
                                        }},
                                    {id: "advantage_ratio",
                                        renderer: function (value, record, columnObj, grid, colNo, rowNo) {
                                            var val = value;
                                            if(val && val > 0){
                                                val = parseFloat(val).toFixed(4);
                                            }
                                            return  val;
                                        }},
                                    {
                                        id: 'ratio', width: 100,
                                        renderer: function (value, record1, columnObj, grid, colNo, rowNo) {
                                            var lowCase = value.toLowerCase();
                                            var newCase = lowCase.charAt(0).toUpperCase() + lowCase.slice(1);

                                            //console.log(this);

                                            var fmt = '<span>' + newCase+'</span>'
                                            if (value === 'YES') {
                                              // console.log();

                                                fmt = newCase;
                                            // fmt = '<span style="color:green; font-weight: bold" >' +newCase +'</span>';


                                            }



                                            return fmt;
                                        }
                                    }]

                            }
                        },

                        filterFor: {
                            "filter_fca": ['year', 'recipientcode'],
                        },

                        postProcess: [
                            {
                                "name": "filter",
                                "sid": [
                                    {
                                        "uid": "adam_comparative_advantage"
                                    }
                                ],
                                "parameters": {
                                    "columns": [
                                        "recipientcode",
                                        "sector",
                                        "purposecode",
                                        "year",
                                        "delivery",
                                        "fao_delivery",
                                        "total_fao_delivery",
                                        "advantage_ratio",
                                        "ratio"
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
                                        "recipientcode": {
                                            "codes": [
                                                {
                                                    "uid": "crs_recipients",
                                                    "version": "2016",
                                                    "codes": [
                                                        "625"
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                },
                                "rid": {
                                    "uid": "filter_fca"
                                }
                            }
                        ]
                    }
                ]
            }
       }


});