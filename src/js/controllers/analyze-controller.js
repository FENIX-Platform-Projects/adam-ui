/*global define*/
define([
    'chaplin',
    'controllers/base/controller',
    'views/analyze-view',
    'views/analyze/compare/compare-view',
    'views/analyze/projects/projects-view'
], function (Chaplin, Controller, AnalyzeView, CompareView, ProjectsView) {

    'use strict';

   var page_type;

    var AnalyzeController = Controller.extend({

        show: function (params) {
           this.view = new AnalyzeView({
                region: 'main',
                page: Backbone.history.fragment
            });
        },

        compare: function (params, route) {
            this.view = new CompareView({
                region: 'main',
                filter: route.action
            });
        },


        projects: function (params, route) {
           this.view = new ProjectsView({
                region: 'main',
                filter: route.action,
                page: Backbone.history.fragment
            });
        }

    });

    return AnalyzeController;
});
