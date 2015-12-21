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
                    "default": [130] //selected codes by default
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
                    "levels": 3
                },
                "selector": {
                    "type": "tree",
                    "default": [60010]
                },
                "dependencies": {
                    "refresh": ["sub-sector"]
                },
                "filter": {
                    "type": "dynamic",
                    "process": '{"sectorcode": { "codes":[{"uid": "{{uid}}", "version": "{{version}}", "codes": [{{{codes}}}] } ]}}'
                }
            },

            "sub-sector": {
                "cl": {
                    "uid": "crs_dac",
                    "version": "2015",
                    "level": 3,
                    "levels": 3
                },
                "selector": {
                    "type": "tree",
                    "default": [11430]
                },
                "filter": {
                    "type": "dynamic",
                    "process": '{"purposecode": { "codes":[{"uid": "{{uid}}", "version": "{{version}}", "codes": [{{{codes}}}] } ]}}'
                }
            },

            "oda": {
                "cl": {
                    "uid": "crs_flow_amounts",
                    "version": "2015"
                },
                "selector": {
                    "type": "dropdown",
                    "source": "codelist"
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
                "dependencies": {
                    "lower": ["sub-sector"]
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

        "processesOrder" : ['flowcode', 'sectorcode', 'recipientcode', 'donorcode',  'year', 'purposecode' ]
    }

});