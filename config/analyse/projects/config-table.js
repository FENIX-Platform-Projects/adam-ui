/*global define*/

define(function () {

    'use strict';

    return {
        dashboard: {
            //default dataset id
            uid: "adam_usd_commitment",

            items: [
                {
                    id: "projects",
                    type: 'custom',
                    config: {
                        "groupedRow": false,
                        "formatter": "localstring",
                        "showRowHeaders": true,
                        "rows": ["recipientcode", "donorcode", "agencyname", "projecttitle",  "year", "parentsector_code_EN", "purposecode_EN", "value"],
                        "aggregations": [],
                        inputFormat: "fenixtool",

                        config: {
                            pageSize: 150,
                            autoSelectFirstRow: false,
                            columns: [
                                {id: "recipientcode", width: 150},
                                {id: "donorcode", width: 150},
                                {id: "agencyname", width: 100},
                                {id: "projecttitle", width: 200},
                                {id: "year", width: 100},
                                {id: "parentsector_code_EN", width: 100},
                                {id: "purposecode_EN", width: 100},
                                {id: "value", width: 100}
                            ]
                        }
                    },

                    filterFor: {
                        "filter_projects": ['recipientcode', 'donorcode', 'parentsector_code', 'purposecode', 'year']
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
                                    "recipientcode",
                                    "donorcode",
                                    "projecttitle",
                                    "year",
                                    "agencyname",
                                    "parentsector_code",
                                    "purposecode",
                                    "value"
                                ],
                                "rows": {
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
                            "rid": {"uid": "filter_projects"}
                        },
                        {
                            "name": "group",
                            "parameters": {
                                "by": [
                                    "recipientcode", "donorcode", "projecttitle", "year", "agencyname", "parentsector_code", "purposecode"
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
                        }
                    ]
                }
            ]
        }
    }


});