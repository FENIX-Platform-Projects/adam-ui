/*global define*/
define([
    'chaplin',
    'controllers/base/controller',
    'views/analyze-view',
    'views/analyze/compare/compare-view'
], function (Chaplin, Controller, AnalyzeView, CompareView) {

    'use strict';

    var AnalyzeController = Controller.extend({

        show: function (params) {
           this.view = new AnalyzeView({
                region: 'main',
                page: Backbone.history.fragment
            });
        },

        compare: function (params) {
            this.view = new CompareView({
                region: 'main',
                filter: params.filter
            });
        }

    });

    return AnalyzeController;
});
