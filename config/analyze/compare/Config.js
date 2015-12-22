/*global define*/

define(function () {

    'use strict';

    return {

        "selectors": {

            //selector id
            "country-country": {

                //semantic values of the selector: used if multiple selector refer to the same dimension
                "subject": "recipient",

                //body sent to msd/codes/filter
                "cl": {
                    "uid": "crs_recipients",
                    "version": "2015"
                    //, level: 3,
                    //levels: 3
                },

                //html selector configuration
                "selector": {
                    "type": "tree", //tree | list
                    //"source" : "codelist | static" // if type:list
                    "default": [130] //selected codes by default,
                    //, "max" : 2 //max number of selectable item
                    //"disabled" : true //if present and true the selector is initially disabled
                },

                "filter": {
                    "type": "dynamic", //dynamic | static: for dynamic or static section of D3P filter
                    "process": '{"recipientcode": { "codes":[{"uid": "{{uid}}", "version": "{{version}}", "codes": [{{{codes}}}] } ]}}'
                }

                //, dependencies : {} //dependencies with other selectors
            },

            "country-region": {

                "subject": "recipient",

                "cl": {
                    "uid": "crs_regions_countries",
                    "version": "2015"
                },
                "selector": {
                    "type": "tree"
                },
                "filter": {
                    "type": "dynamic",
                    //TODO change to template uid and version as in 'country-country'
                    "process": '{"recipientcode": { "codes":[{"uid": "crs_recipients", "version": "2015", "codes": [{{{codes}}}] } ]}}'
                }
            },

            "regional-aggregation": {

                "subject": "recipient",

                "cl": {
                    "uid": "crs_regional_projects",
                    "version": "2015"
                },
                "selector": {
                    "type": "tree"
                },

                "filter": {
                    "type": "dynamic",
                    //TODO change to template uid and version as in 'country-country'
                    "process": '{"recipientcode": { "codes":[{"uid": "crs_recipients", "version": "2015", "codes": [{{{codes}}}] } ]}}'
                }
            },

            "donor": {
                "cl": {
                    "uid": "crs_donors",
                    "version": "2015"
                },
                "selector": {
                    "type": "tree",
                    "default": [1012]
                },
                "filter": {
                    "type": "dynamic",
                    "process": '{"donorcode": { "codes":[{"uid": "{{uid}}", "version": "{{version}}", "codes": [{{{codes}}}] } ]}}'
                }
            },

            "delivery": {
                "cl": {
                    "uid": "crs_channels",
                    "version": "2015",
                    "level": 3,
                    "levels": 3
                },
                "selector": {
                    "type": "tree",
                    "default": [44006]
                },
                "filter": {
                    "type": "dynamic",
                    "process": '{"channelcode": { "codes":[{"uid": "{{uid}}", "version": "{{version}}", "codes": [{{{codes}}}] } ]}}'
                }
            },

            "sector": {
                "cl": {
                    "uid": "crs_dac",
                    "version": "2015",
                    "level": 1,
                    "levels": 1
                },
                "selector": {
                    "type": "tree",
                    "default": [60010]
                },

                "filter": {
                    "type": "dynamic",
                    //TODO change to template uid and version as in 'country-country'
                    "process": '{"sectorcode": { "codes":[{"uid": "crs_sectors", "version": "{{version}}", "codes": [{{{codes}}}] } ]}}'
                }
            },

            "sub-sector": {

                "cl": {
                    "uid": "crs_dac",
                    "version": "2015",
                    "level": 2,
                    "levels": 2
                },

                "selector": {
                    "type": "tree",
                    "default": [11430],
                    "disabled" : true
                },

                "filter": {
                    "type": "dynamic",
                    //TODO change to template uid and version as in 'country-country'
                    "process": '{"purposecode": { "codes":[{"uid": "crs_purposes", "version": "{{version}}", "codes": [{{{codes}}}] } ]}}'
                },

                dependencies : {
                    "sector" : "parent"
                }
            },

            "oda": {
                "cl": {
                    "uid": "crs_flow_amounts",
                    "version": "2015"
                },
                "selector": {
                    "type": "dropdown",
                    "source": "codelist",
                    "default": ["adam_usd_commitment"]
                },
                "filter": {
                    "type": "static"
                }
            },

            "year-from": {

                "selector": {
                    "type": "dropdown",
                    "source": "static",
                    "from": 2000,
                    "to": 2013
                },

                "filter": {
                    "type": "static",
                    "process": '{"year": { "time":[{"from": "{{year-from}}", "to": "{{year-to}}" } ]}}'
                }
            },

            "year-to": {

                "selector": {
                    "type": "dropdown",
                    "source": "static",
                    "from": 2000,
                    "to": 2013,
                    "default": [2013]
                },

                "filter": {
                    "type": "static"
                    //, "process": '{"year": { "time":[{"from": "{{year-from}}", "to": "{{year-to}}" } ]}}' //Not used
                },

                dependencies : {
                    "year-from" : "min"
                }

            }
        },

        "filter": {
            "name": "filter",
            "parameters": {
                "rows": {
                    "flowcode": {
                        "codes": [
                            {
                                "uid": "crs_flow_types",
                                "version": "2015",
                                "codes": ["10_12", "10_11", "10_13", "10_19"]
                            }
                        ]
                    }
                }
            }
        },

        "processesOrder" : ['flowcode', 'sectorcode', 'recipientcode', 'donorcode',  'year', 'purposecode' ],

        "maxCombinations" : 20 //Max number of requests to d3p,

    }

});