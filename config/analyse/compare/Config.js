/*global define*/

define(function () {

    'use strict';

    return {

        analysis: {
            box : {
                tab : "chart",
                hideFlipButton : true,
                faces : ["front"],
                tabConfig: {
                    chart: {
                        toolbar: {
                            template: "<div data-selector='compare'></div>",
                            config: {
                                compare: {
                                    selector: {
                                        id: "dropdown",
                                        source: [
                                            {value: "donorcode", label: "Resource Partner"},
                                            {value: "parentsector_code", label: "Sector"},
                                        ],
                                        default: ["donorcode"],
                                        config: {
                                            maxItems: 1
                                        }
                                    },
                                    template: {
                                        title: "Compare by"
                                    }
                                }
                            }
                        },
                        config: function (model, values) {

                            var order = ["donorcode", "parentsector_code"];

                            var config = {
                                aggregationFn: {"value": "sum", "Value": "sum", "VALUE": "sum"},
                                formatter: "value",
                                decimals: 2,
                                hidden: [],
                                series: order,
                                useDimensionLabelsIfExist: true,
                                x: ["year"],
                                aggregations: [],
                                y: ["value"],
                                type: "line",
                                createConfiguration: function (model, config) {

                                    var compare = values.values.compare[0],
                                        index = order.indexOf(compare),
                                        colors = ["red"],
                                        used = {};

                                    for (var ii in model.cols) {

                                        if (model.cols.hasOwnProperty(ii)) {
                                            i = model.cols[ii];
                                            config.xAxis.categories.push(i.title[this.lang]);
                                        }
                                    }

                                    for (var i in model.rows) {

                                        var name = model.rows[i],
                                            compareByValue = name[index];

                                        var s = {
                                            name: name.join(" / "),
                                            data: model.data[i]
                                        };

                                        var color = used[compareByValue];

                                        if (!color) {
                                            used[compareByValue] = colors.shift();
                                            color = used[compareByValue]
                                        }

                                        s.color = color;

                                        config.series.push(s);

                                    }

                                    return config;
                                }
                            };

                            return config;
                        }
                    }
                }
            }
        },

        filter: {
            items: {
                recipientcode: {
                    selector: {
                        id: "tree",
                        hideSummary: true, //Hide selection summary,
                        config: { //Selectize configuration
                            plugins: ['remove_button'],
                            mode: 'multi'
                        }
                    },
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
                        id: "tree",
                        default: ["2", "7"], // Belgium, Netherlands
                        hideSummary: true, //Hide selection summary,
                        config: { //Selectize configuration
                            plugins: ['remove_button'],
                            mode: 'multi'
                        }
                    },
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
                parentsector_code: {
                    selector: {
                        id: "tree",
                        config: { //Selectize configuration
                            maxItems: 1,
                            plugins: ['remove_button'],
                            mode: 'multi'
                        },
                        default : ["311", "600"],
                        hideSummary: true, //Hide selection summary,
                    },
                    cl: {
                        uid: "crs_dac",
                        version: "2016",
                        level: 1,
                        levels: 1
                    },
                    template: {
                        hideSwitch: true,
                        hideRemoveButton: true
                    }
                },
                purposecode: {
                    selector: {
                        id: "tree",
                        config: {
                            plugins: ['remove_button'],
                            mode: 'multi'
                        },
                        hideSummary: true, //Hide selection summary,
                    },
                    cl: {
                        // codes: ["60010", "60020", "60030", "60040", "60061", "60062", "60063"],
                        "uid": "crs_dac",
                        "version": "2016",
                        "level": 2,
                        "levels": 2
                    },
                    template: {
                        hideSwitch: true,
                        hideRemoveButton: true
                    },
                    dependencies: {
                        "parentsector_code": {id: "parent", event: "select"} //obj or array of obj
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
                        },
                        hideSummary: true, //Hide selection summary,
                    },
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
                        hideSummary: true, //Hide selection summary,
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
                },
                oda: {
                    selector: {
                        id: "dropdown",
                        default: ['adam_usd_commitment'],
                        config: { //Selectize configuration
                            maxItems: 1
                        },
                        hideSummary: true, //Hide selection summary,
                    },
                    cl: {
                        uid: "crs_flow_amounts",
                        version: "2016"
                    },
                    template: {
                        hideHeaderIcon: false,
                        hideSwitch: true,
                        hideRemoveButton: true
                    }
                }
            }
        }
    }

});