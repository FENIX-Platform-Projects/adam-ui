/*global define*/
define([
    'chaplin',
    'controllers/base/controller',
    'views/analyse-view',
    'views/analyse/priority_analysis/priority-analysis-view',
    'views/analyse/compare/compare-view',
    'views/analyse/partner_matrix/partner-matrix-view',
    // 'views/analyze/projects/projects-view'
], function (Chaplin, Controller, AnalyzeView, PriorityAnalysisView, CompareView, ResourcePartnerMatrixView /**, , ProjectsView**/) {

    'use strict';

    var page_type;

    var AnalyzeController = Controller.extend({

        show: function (params) {
            this.view = new AnalyzeView({
                region: 'main',
                page: Backbone.history.fragment
            });
        },

        priority_analysis: function (params, route) {
            this.view = new PriorityAnalysisView({
                region: 'main',
                filter: route.action,
                page: Backbone.history.fragment
            });
        },

        compare: function (params, route) {
            this.view = new CompareView({
                region: 'main',
                filter: route.action,
                page: Backbone.history.fragment
            });
        },

        partner_matrix: function (params, route) {
            this.view = new  ResourcePartnerMatrixView({
                region: 'main',
                filter: route.action,
                page: Backbone.history.fragment
            });
        }





        // projects: function (params, route) {
        //  this.view = new ProjectsView({
        //    region: 'main',
        //   filter: route.action,
        //   page: Backbone.history.fragment
        // });
        // }

    });

    return AnalyzeController;
});
