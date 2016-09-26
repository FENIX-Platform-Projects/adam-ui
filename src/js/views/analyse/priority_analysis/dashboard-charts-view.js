/*global define, amplify*/
define([
    'jquery',
    'underscore',
    'views/base/view',
    'text!templates/analyse/priority_analysis/charts-dashboard.hbs',
    'fx-dashboard/start',
    'lib/utils',
    'config/Config',
    'i18n!nls/analyse',
    'i18n!nls/analyse-priority-analysis',
    'config/analyse/priority_analysis/Events',
    'handlebars',
    'lib/config-utils',
    'config/submodules/fx-chart/highcharts_template',
    'config/submodules/fx-chart/jvenn_template',
    'views/common/progress-bar',
    'amplify'
], function ($, _, View, template, Dashboard, Utils, GeneralConfig, i18nLabels, i18nDashboardLabels, BaseEvents, Handlebars, ConfigUtils, HighchartsTemplate, JVennTemplate, ProgressBar) {

    'use strict';

    var defaultOptions = {
        item_container_id: '-container',
        PROGRESS_BAR_CONTAINER: '#analyse-pa-charts-progress-bar-holder',
        events: {
            CHANGE: 'change'
        },
        itemTypes: {
            CHART: 'chart',
            VENN: 'venn'
        },
        css: {
            COLLAPSE: 'collapse'
        }
    };

    /**
     *
     * Creates a new Charts Dashboard View
     * Instantiates the FENIX dashboard submodule, ProgressBar and responsible for all charts dashboard related functionality.
     * Including updates to the Dashboard model.
     * @class ChartsDashboardView
     * @extends View
     */

    var ChartsDashboardView = View.extend({

        // DO NOT automatically render after initialize
        autoRender: false,

        className: 'analyse-priority-analysis-dashboard-charts',

        // Save the template string in a prototype property.
        // This is overwritten with the compiled template function.
        // In the end you might want to used precompiled templates.
        template: template,

        initialize: function (params) {
            this.topic = params.topic;
            //this.model = params.model;
            this.container = params.container;
            this.model.on(defaultOptions.events.CHANGE, this.render, this);
            this.dashboards = [];

            this.source = $(this.template).find("[data-topic='" + this.topic + "']").prop('outerHTML');

           // console.log("INITIALIZE FOR "+this.topic);
            //console.log(this.source)
            //Initialize Progress Bar
            this.progressBar = new ProgressBar({
                container: defaultOptions.PROGRESS_BAR_CONTAINER
            });



            View.prototype.initialize.call(this, arguments);

        },

        getTemplateData: function () {
            return i18nLabels;
        },

        render: function () {
           // this.el = this.container;
            this._unbindEventListeners();

            // Update the language related labels in the dashboard item configurations
            for (var it in this.config.items) {
                var item = this.config.items[it];
                this._updateChartExportTitles(this.config.items[it], i18nDashboardLabels[item.id], this.model.get('label'));
            }


            $(this.container).html(this.getTemplateFunction());
        },

        attach: function () {
            View.prototype.attach.call(this, arguments);

            this.configUtils = new ConfigUtils();
        },


        getTemplateFunction: function () {
            this.compiledTemplate = Handlebars.compile(this.source);
            var model = this.model.toJSON();

            // Update the language related labels in the dashboard template
            var data = $.extend(true, model, i18nLabels, i18nDashboardLabels);

            return this.compiledTemplate(data);

        },

        setDashboardConfig: function (config) {
            this.baseConfig = config;

            this.config = config;
            this.config_type = config.id;
            this.config.baseItems = config.items;
            this.config.environment = GeneralConfig.ENVIRONMENT;

            var baseTemplate =  HighchartsTemplate;

            // Sets Highchart config for each chart
            _.each(this.config.items, _.bind(function (item) {
                if (!_.isEmpty(item)) {
                    if (item.type == defaultOptions.itemTypes.CHART) {
                        if(item.config.type == defaultOptions.itemTypes.VENN){
                            baseTemplate =  JVennTemplate;
                        }

                        if (item.config.config) {
                            item.config.config = $.extend(true, {}, baseTemplate, item.config.config);
                        } else {
                            item.config.config = $.extend(true, {}, baseTemplate);
                        }
                    }
                }

            }, this));


        },



        updateDashboardItemConfiguration: function (itemid, property, values) {
            var item = _.filter(this.config.items, {id: itemid})[0];

            if (item) {
                if (item.config && item.config[property]) {
                    if(values[0] === 'false' || values[0] === 'true')
                        item.config[property] = $.parseJSON(values[0]); // returns a Boolean
                    else
                        item.config[property] = values[0];

                }
            }
        },

        renderDashboard: function () {
            this.render();

            this.config.el = this.container;
            this.dashboard = new Dashboard(this.config);

            this._bindEventListeners();
            this._loadProgressBar();
        },


        clear: function () {
            this.container.empty();
        },

        _disposeDashboards: function () {
            if (this.dashboard && $.isFunction(this.dashboard.dispose)) {
                 this.dashboard.dispose();
            }
        },


        _collapseDashboardItem: function (itemId) {
            // Hide/collapse Item container
            var itemContainerId = '#' + itemId + defaultOptions.item_container_id;

            $(this.source).find(itemContainerId).addClass(defaultOptions.css.COLLAPSE);

        },

        _expandDashboardItem: function (itemId) {
            // Show Item container
            var itemContainerId = '#' + itemId + defaultOptions.item_container_id;
            $(this.source).find(itemContainerId).removeClass(defaultOptions.css.COLLAPSE);
        },


        _showDashboardItem: function (itemId) {
            // Show Item container
            var itemContainerId = '#' + itemId + defaultOptions.item_container_id;
            $(this.source).find(itemContainerId).show();
        },

        updateDashboardTemplate: function (filterdisplayconfig) {

            if (filterdisplayconfig) {

                var hide = filterdisplayconfig.hide;
                var show = filterdisplayconfig.show;

                for (var idx in hide) {
                    this._collapseDashboardItem(hide[idx]); // in the template
                }

                for (var idx in show) {
                    this._expandDashboardItem(show[idx]); // in the template
                }

            }

        },


        updateDashboardConfigUid: function (uid) {
            this.config.uid = uid;
        },

        showHiddenDashboardItems: function (showItems) {
            if (showItems) {
                for (var itemId in showItems) {
                    this._showDashboardItem(showItems[itemId]);
                }
            }

        },

        setProperties: function (props) {
            if (props) {
                if (props["oda"])
                    this.config.uid = props["oda"];

            }
        },

        _updateChartExportTitles: function (chartItem, title, subtitle) {

            if (chartItem.config.config) {
                var chartItemTitle = chartItem.config.config.exporting.chartOptions.title,
                    chartItemSubTitle = chartItem.config.config.exporting.chartOptions.subtitle;

                if (!chartItemTitle || !chartItemSubTitle) {
                    chartItemTitle = chartItem.config.config.exporting.chartOptions.title = {};
                    chartItemSubTitle = chartItem.config.config.exporting.chartOptions.subtitle = {};
                }

                chartItemTitle.text = title;
                chartItemSubTitle.text = subtitle;
            }
        },



        getDashboardConfig: function () {
            return this.config;
        },




        _loadProgressBar: function () {
            var self = this, increment = 0, percent = Math.round(100 / this.config.items.length);

            this.progressBar.reset();
            this.progressBar.show();


            this.dashboard.on('ready', function () {
                self.progressBar.finish();
               // amplify.publish(BaseEvents.DASHBOARD_ON_READY);
            });


            this.dashboard.on('ready.item', function () {
                increment = increment + percent;
                self.progressBar.update(increment);
            });


        },


        _bindEventListeners: function () {

        },


        _unbindEventListeners: function () {
            // Remove listeners

        },

        dispose: function () {

           // console.log("======================== DISPOSE ME CHARTS=================");
            this._disposeDashboards();

            this._unbindEventListeners();

            View.prototype.dispose.call(this, arguments);
        }


    });

    return ChartsDashboardView;
});
