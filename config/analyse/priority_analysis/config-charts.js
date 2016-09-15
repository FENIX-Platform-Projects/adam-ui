/*global define*/

define(function () {

    'use strict';

    return {

        filter: {
            recipientcode: {
                selector: {
                    id: "dropdown",
                    default: ["625"], // afghanistan
                    config: { //Selectize configuration
                        maxItems: 1,
                        placeholder: "All",
                        plugins: ['remove_button'],
                        mode: 'multi'
                    }
                },
                className: "col-sm-4",
                cl: {
                    uid: "crs_recipients",
                    version: "2016",
                    level: 1,
                    levels: 1
                },
                template: {
                    hideSwitch: true,
                    hideRemoveButton: true
                }
            },
            donorcode: {
                selector: {
                    id: "dropdown",
                    config: { //Selectize configuration
                        maxItems: 1,
                        placeholder: "All",
                        plugins: ['remove_button'],
                        mode: 'multi'
                    }
                },
                className: "col-sm-4",
                cl: {
                    uid: "crs_donors",
                    version: "2016",
                    level: 1,
                    levels: 1
                },
                template: {
                    hideSwitch: true,
                    hideRemoveButton: true
                }
            },
                "year-from": {
                    selector: {
                        id: "dropdown",
                        from: 2000,
                        to: 2014,
                        default: [2000],
                        config: { //Selectize configuration
                            maxItems: 1
                        }
                    },
                    className: "col-sm-2",
                    format: {
                        type: "static",
                        output: "time"
                    },
                    template: {
                        hideSwitch: true,
                        hideRemoveButton: true
                    }
                },
                "year-to": {
                    selector: {
                        id: "dropdown",
                        from: 2000,
                        to: 2014,
                        default: [2014],
                        config: {
                            maxItems: 1
                        }
                    },
                    className: "col-sm-2",
                    format: {
                        type: "static",
                        output: "time"
                    },

                    dependencies: {
                        "year-from": {id: "min", event: "select"}
                    },

                    template: {
                        hideSwitch: true,
                        hideRemoveButton: true
                    }
                }
            },


            dashboard: {
                //default dataset id
                uid: "adam_usd_commitment",

                items: [
                    {
                        id: 'venn-analysis',
                        type: 'chart',
                        config: {
                            type: "venn",
                            renderer: "jvenn",
                            x: ["donorname"], //x axis and series
                            series: ["recipientname"], // series
                            y: ["donorname"],//Y dimension
                            aggregationFn: {"value": "sum"},
                            useDimensionLabelsIfExist: false,// || default raw else fenixtool
                            // filterFor: ['parentsector_code', 'purposecode', 'year-from', 'year-to'],
                            config: {
                                fnClickCallback: function(){
                                    console.log("============ IN CALLBACK ===========");
                                    var value = "";
                                    if(this.listnames.length == 1){
                                        value += "Elements X only in "
                                    } else {
                                        value += "Common X elements in "
                                    }

                                    for (var name in this.listnames){
                                        value += this.listnames[name] + " ";
                                    }
                                    value += ":\n";

                                    for (var val in this.list){
                                        value += this.list[val] + "\n";
                                    }
                                    alert(value);
                                }
                            }

                        },
                        filter: { //FX-filter format

                           // recipientcode: ['Afghanistan', 'Bangladesh', 'Belize'],
                          //  year: [{value: "2000", parent: 'from'}, {value: "2014", parent: 'to'}]

                           recipientname: ['Afghanistan', 'Bangladesh', 'Belize'],
                           year : [2014]//,
                         //  recipientcode: ["600"],
                         //  donorcode: ["600"]
                        },
                        postProcess: [
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "recipientname", "donorname"
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
                                            "columns": ["flowcategory"],
                                            "rule": "first"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "select",
                                "parameters": {
                                    "query": "WHERE recipientname<>?",
                                    "queryParameters": [{"value": "NA"}]
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "recipientname": "DESC"
                                }
                            }
                           ]
                    }
                ]
            }
    }


});