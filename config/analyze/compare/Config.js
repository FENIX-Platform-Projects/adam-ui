/*global define*/

define(function () {

    'use strict';

    return {

        "country-country": {

            //body sent to msd/codes/filter
            "cl": {
                "uid": "crs_recipients",
                "version": "2015"
                //, level: 3,
                //levels: 3
            },

            //selector configuration
            "selector": {
                "type": "tree", //tree or list
                //"source" : "codelist | static" // if type:list
                "default": [130] //selected codes by default
            }
        },

        "country-region": {
            "cl": {
                "uid": "crs_regions_countries",
                "version": "2015"
            },
            "selector": {
                "type": "tree"
            }
        },

        "regional-aggregation": {
            "cl": {
                "uid": "crs_regional_projects",
                "version": "2015"
            },
            "selector": {
                "type": "tree"
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
            }
        },

        "delivery": {
            "cl": {
                "uid": "crs_channels",
                "version": "2015"
            },
            "selector": {
                "type": "tree",
                "default": [40000]
            }
        },

        "sector": {
            "cl": {
                "uid": "crs_dac",
                "version": "2015"
            },
            "selector": {
                "type": "tree",
                "default": [600]
            },
            "dependencies": {
                "refresh": ["sub-sector"]
            }
        },

        "sub-sector": {
            "cl": {
                "uid": "crs_dac",
                "version": "2015",
                level: 3,
                levels: 3
            },
            "selector": {
                "type": "tree",
                "default": [11430]
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
            }
        },

        "year-to": {
            "selector": {
                "type": "dropdown",
                "source": "static",
                "from": 2000,
                "to": 2013,
                "default": [2013]
            }

        }

    }

});