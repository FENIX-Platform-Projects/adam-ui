/*global define, amplify*/
define([
    'jquery',
    'underscore',
    'views/base/view',
    'text!templates/browse/oecd-dashboard.hbs',
    'fx-ds/start',
    'lib/utils',
    'handlebars',
    'lib/config-utils',
    'amplify'
], function ($, _, View, template, Dashboard, Utils, Handlebars, ConfigUtils) {

    'use strict';

    var s = {
        css_classes: {
            DASHBOARD_BROWSE_CONTAINER: '#dashboard-browse-container'
        },
        events: {
            FAO_SECTOR_CHART_LOADED: 'fx.browse.chart.faosector.loaded'
        },
        config_types: {
            FAO: 'FAO',
            BASE: 'BASE'
        }
    };

    var DashboardView = View.extend({

        // Automatically render after initialize
        autoRender: true,

        className: 'dashboard-browse',

        // Save the template string in a prototype property.
        // This is overwritten with the compiled template function.
        // In the end you might want to used precompiled templates.
        template: template,

        initialize: function (params) {
            this.topic = params.topic

            View.prototype.initialize.call(this, arguments);
        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            this.configUtils = new ConfigUtils();

            this._bindEventListeners();

        },

        setDashboardConfig: function(config, type){
            this.config = config;
            this.config_type = type || s.config_types.BASE;
        },

        renderDashboard: function () {

            if (this.browseDashboard && this.browseDashboard.destroy) {
                this.browseDashboard.destroy();
            }

            this.browseDashboard = new Dashboard({

                //Ignored if layout = injected
                container: s.css_classes.DASHBOARD_BROWSE_CONTAINER,
                layout: "injected"
            });



            this.browseDashboard.render(this.config);
        },

        updateDashboardConfig: function(uid, sectorSelected, subSectorSelected){
            var item1 = _.filter(this.config.items, {id:'item-1'})[0];

            switch(this.config_type == s.config_types.FAO){
                case true:
                    this._updateFAOItem1ChartConfiguration(item1, sectorSelected, subSectorSelected);
                    break;
                case false:
                    this._updateItem1ChartConfiguration(item1, sectorSelected, subSectorSelected);
                    break;
            }

            this.config.uid = uid;

        },

        _updateFAOItem1ChartConfiguration: function (item1, sectorSelected, subSectorSelected) {

            // Set either sectorcode or purposecode as the series in the first chart config
            // Check the current selection via seriesname in config
            var seriesname = item1.config.adapter.seriesDimensions[0];

            var configFind = subSectorSelected && seriesname !== 'purposecode' ? 'sectorcode': 'purposecode';
            var configReplace = subSectorSelected && seriesname !== 'purposecode' ? 'purposecode': 'sectorcode';

            // modify chartconfig seriesdimension
            this.configUtils.findAndReplace(item1.config.adapter, configFind, configReplace);

            // modify group by in filter
            var grpByConfig = this.configUtils.findByPropValue(item1.filter,  "name", "pggroup");

            if(subSectorSelected)
                grpByConfig.parameters.by = ["purposecode", "year"];
            else
                grpByConfig.parameters.by = ["year"];

        },
        _updateItem1ChartConfiguration: function (item1, sectorSelected, subSectorSelected) {
            // Set either sectorcode or purposecode as the series in the first chart config
            // Check the current selection via seriesname in config
            var seriesname = item1.config.adapter.seriesDimensions[0];

            var configFind = subSectorSelected && seriesname !== 'purposecode' ? 'sectorcode': 'purposecode';
            var configReplace = subSectorSelected && seriesname !== 'purposecode' ? 'purposecode': 'sectorcode';

            // modify chartconfig seriesdimension
            this.configUtils.findAndReplace(item1.config.adapter, configFind, configReplace);

            // modify group by in filter
            var grpByConfig = this.configUtils.findByPropValue(item1.filter,  "name", "pggroup");
            this.configUtils.findAndReplace(grpByConfig, configFind, configReplace);
        },

        rebuildDashboard: function (filter) {

            if (this.browseDashboard && this.browseDashboard.destroy) {
                this.browseDashboard.destroy();
            }

            this.browseDashboard = new Dashboard({

                //Ignored if layout = injected
                container: s.css_classes.DASHBOARD_BROWSE_CONTAINER,
                layout: "injected"
            });

            this.browseDashboard.rebuild(this.config, filter);
        },


        getTemplateFunction: function() {
            var source = $(this.template).find("[data-topic='" + this.topic + "']");
            return Handlebars.compile(source.prop('outerHTML'));
        },


        _bindEventListeners: function () {

          //  amplify.subscribe("BEFORE_RENDER", this, this._setChartOptions);
            // Add List Change listeners
            amplify.subscribe(s.events.FAO_SECTOR_CHART_LOADED, this, this._sectorChartLoaded);


        },

        _sectorChartLoaded: function (chart) {
            if((chart.series[0].name).trim() == "Million USD")    {
                chart.series[0].update({name: "FAO-Related Sectors"}, false);
                chart.redraw();
            }

            var series = chart.series,
                i=0;

            for(; i<series.length; i++) {
                //series[i].legendItem.translate(-15, 0);
                //series[i].checkbox.style.marginRight = '-12px';
            }
        },

        _unbindEventListeners: function () {
            // Remove listeners
            amplify.unsubscribe(s.events.FAO_SECTOR_CHART_LOADED, this._sectorChartLoaded);
        },

        dispose: function () {
            this._unbindEventListeners();
            View.prototype.dispose.call(this, arguments);
        }

    });

    return DashboardView;
});
