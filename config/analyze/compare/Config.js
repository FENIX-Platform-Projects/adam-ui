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
                    "uid": "crs_recipientcountries", //for pure country list "crs_recipients"
                    "version": "2016"
                    //, level: 3,
                    //levels: 3,
                },

                //html selector configuration
                "selector": {
                    "type": "tree", //tree | list
                    //"source" : "codelist | static" // if type:list
                    "default": [625 /*, 261, 269 */], //selected codes by default,
                    //, "max" : 2 //max number of selectable item
                    //"disabled" : true //if present and true the selector is initially disabled
                    //"config" : { core: { multiple: true } } //specific jstree or select2 config
                    "blacklist": [] //code to exclude from the codelist
                },

                "filter": {
                    "dimension": "recipientcode",
                    "type": "dynamic", //dynamic | static: for dynamic or static section of D3P filter
                    "process": '{"recipientcode": { "codes":[{"uid": "crs_recipients", "version": "{{version}}", "codes": [{{{codes}}}] } ]}}'
                },

                //dependencies with other selectors
                "dependencies": {
                    "compare": "focus"
                },

                // validation
                "validation": {
                    //"mandatory" : true //mandatory selector. Default false
                }
            },

            "country-region": {

                "subject": "recipient",

                "cl": {
                    "uid": "crs_regions_countries",
                    "version": "2016"
                },

                "selector": {
                    "type": "tree",
                    "blacklist": [298, 189, 289, 498, 389, 380, 489, 798, 789, 689, 619, 679, 89, 589, 889] //code to exclude from the codelist
                },

                "dependencies": {
                    "compare": "focus"
                },

                "filter": {
                    "dimension": "recipientcode",
                    "type": "dynamic",
                    //TODO change to template uid and version as in 'country-country'
                    "process": '{"recipientcode": { "codes":[{"uid": "crs_recipients", "version": "{{{version}}}", "codes": [{{{codes}}}] } ]}}'
                },

                "validation": {
                    //"mandatory" : true
                }
            },

            "regional-aggregation": {

                "subject": "recipient",

                "cl": {
                    "uid": "crs_regional_projects",
                    "version": "2016"
                },

                "selector": {
                    "type": "tree"
                },

                "dependencies": {
                    "compare": "focus"
                },

                "filter": {
                    "dimension": "recipientcode",
                    "type": "dynamic",
                    //TODO change to template uid and version as in 'country-country'
                    "process": '{"recipientcode": { "codes":[{"uid": "crs_recipients", "version": "{{{version}}}", "codes": [{{{codes}}}] } ]}}'
                },

                "validation": {
                    //"mandatory" : true
                }
            },

            "donor": {

                "cl": {
                    "uid": "crs_donors",
                    "version": "2016"
                },

                "selector": {
                    "type": "tree",
                    //"default": [1012]
                },

                "dependencies": {
                    "compare": "focus"
                },

                "filter": {
                    "dimension": "donorcode",
                    "type": "dynamic",
                    "process": '{"donorcode": { "codes":[{"uid": "{{uid}}", "version": "{{version}}", "codes": [{{{codes}}}] } ]}}'
                },

                "validation": {
                    //"mandatory" : true
                }
            },

            "delivery": {

                "cl": {
                    "uid": "crs_channels",
                    "version": "2016",
                    "level": 3,
                    "levels": 3
                },

                "selector": {
                    "type": "tree",
                    // "default": [44006]
                },

                "dependencies": {
                    "compare": "focus"
                },

                "filter": {
                    "dimension": "channelcode",
                    "type": "dynamic",
                    "process": '{"channelcode": { "codes":[{"uid": "{{{uid}}}", "version": "{{version}}", "codes": [{{{codes}}}] } ]}}'
                },

                "validation": {
                    //"mandatory" : true
                }
            },

            "sector": {

                "cl": {
                    "uid": "crs_dac",
                    "version": "2016",
                    "level": 1,
                    "levels": 1
                },

                "selector": {
                    "type": "tree",
                    "default": [600]
                },

                "dependencies": {
                    "compare": "focus"
                },

                "filter": {
                    "dimension": "sectorcode",
                    "type": "dynamic",
                    //TODO change to template uid and version as in 'country-country'
                    "process": '{"parentsector_code": { "codes":[{"uid": "{{{uid}}}", "version": "{{version}}", "codes": [{{{codes}}}] } ]}}'
                },

                "validation": {
                    //"mandatory" : true
                }
            },

            "sub-sector": {

                "cl": {
                    "uid": "crs_dac",
                    "version": "2016",
                    "level": 2,
                    "levels": 2
                },

                "selector": {
                    "type": "tree",
                    //"default": [31165]
                },

                "filter": {
                    "dimension": "purposecode",
                    "type": "dynamic",
                    //TODO change to template uid and version as in 'country-country'
                    "process": '{"purposecode": { "codes":[{"uid": "crs_purposes", "version": "{{version}}", "codes": [{{{codes}}}] } ]}}'
                },

                "dependencies": {
                    "sector": "parent",
                    "compare": "focus"
                },

                "validation": {
                    //"mandatory" : true
                }
            },

            "oda": {
                "cl": {
                    "uid": "crs_flow_amounts",
                    "version": "2016"
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
                    "to": 2014
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
                    "to": 2014,
                    "default": [2014]
                },

                "filter": {
                    "type": "static"
                    //, "process": '{"year": { "time":[{"from": "{{year-from}}", "to": "{{year-to}}" } ]}}' //Not used
                },

                "dependencies": {
                    "year-from": "min"
                }

            }
        },

        "filter": {
            "name": "filter",
            "parameters": {
                "rows": {},
                //"columns" : [] // dynamically filled by controller
            }
        },

        "processesOrder": ['flowcode', 'year', 'sectorcode', 'recipientcode', 'donorcode', 'purposecode', 'delivery'],

        "maxCombinations": 20, //Max number of requests to d3p

        "compareBy": "recipient", //recipient || donor || delivery || sector || sub-sector

        "selectorFocusedClass": "selector-focused", //class to highlight a selector

        "mandatorySelectorClass": "selector-mandatory", // class for mandatory selectors

        "resultDefaultTab": "chart", //Default tab to show for result,

        "advancedOptionsSelector": ".advanced-option",

        "showAdvancedOptions": false

    }

});