/*global define*/

define(function () {

    'use strict';

    return {
        filter: {
            donorcode: {
                selector: {
                    id: "dropdown",
                    default: ["7"], // Netherlands
                    config: { //Selectize configuration
                        maxItems: 1
                    }
                },
                className: "col-sm-3",
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
            }
        },


        dashboard: {
            //default dataset id
            uid: "adam_usd_commitment",

            items: [
            ]
        }
        }
    });