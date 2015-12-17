/*global define*/
define([
    'controllers/base/controller',
    'views/analyze/compare/compare-view'
], function (Controller, View) {

    'use strict';

    var AnalyzeController = Controller.extend({

        show: function (params) {

            this.view = new View({
                region: 'main',
                filter: params.filter
            });
        }

    });

    return AnalyzeController;
});
