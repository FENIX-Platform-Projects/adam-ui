/*global define*/

define(function () {

    'use strict';

    return {
            dashboard: {
                //default dataset id
                uid: "adam_usd_commitment",

                items: [
                    {
                        id: "priority-analysis",
                        type: 'custom',
                        config: {
                            "groupedRow":false,
                            "formatter":"localstring",
                            "showRowHeaders":true,
                            "values":[],
                            "rows":[ "purposecode",  "projecttitle","projectshortdescription"],
                            "aggregations":[],
                            inputFormat : "fenixtool"
                        },

                        filterFor: {
                            "filter_total_ODA": ['year', 'donorcode', 'recipientcode']
                        },

                        postProcess: [
                            {
                                "name": "filter",
                                "sid": [
                                    {
                                        "uid": "adam_usd_commitment"
                                    }
                                ],
                                "parameters": {
                                    "columns": [
                                        "purposecode",
                                        "projecttitle",
                                        "projectshortdescription"
                                    ],
                                    "rows": {
                                        "donorcode": {
                                            "codes": [
                                                {
                                                    "uid": "crs_donors",
                                                    "version": "2016",
                                                    "codes": [
                                                        "1"
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
                                "rid":{"uid":"filter_total_ODA"}
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "purposecode",  "projecttitle", "projectshortdescription"
                                    ],
                                    "aggregations": [

                                    ]
                                }
                            }
                        ]
                    }
                ]
            }
       }


});