/*global define, amplify*/
define([
    'jquery',
    'underscore',
    'views/base/view',
    'text!templates/analyse/comp_advantage/table-dashboard.hbs',
    'fx-dashboard/start',
    'lib/utils',
    'config/Config',
    'i18n!nls/analyse',
    'i18n!nls/analyse-comp-advantage',
    'config/analyse/comp_advantage/Events',
    'views/common/progress-bar',
    'handlebars',
    'lib/config-utils',
    'amplify'
], function ($, _, View, template, Dashboard, Utils, GeneralConfig, i18nLabels, i18nDashboardLabels, BaseEvents, ProgressBar, Handlebars, ConfigUtils) {

    'use strict';

    var defaultOptions = {
        container: '-container',
        PROGRESS_BAR_CONTAINER: '#analyse-ca-progress-bar-holder',
        paths: {
            TABLE_ITEM: 'views/analyse/comp_advantage/table-item'
        },
        events: {
            CHANGE: 'change'
        },
        itemTypes: {
            CHART: 'chart'
        },
        css: {
            COLLAPSE: 'collapse'
        }
    };

    /**
     *
     * Creates a new Table View, which is composed of a custom Table and associated filter item
     * Instantiates the FENIX dashboard submodule and responsible for the table dashboard related functionality.
     * @class TableView
     * @extends View
     */

    var TableView = View.extend({

        // Automatically render after initialize
        autoRender: false,

        className: 'dashboard-comp-advantage',

        // Save the template string in a prototype property.
        // This is overwritten with the compiled template function.
        // In the end you might want to used precompiled templates.
        template: template,

        initialize: function (params) {
            $.extend(true, this, defaultOptions);
            var self = this;


            this.dashboards = [];
            this.container = params.container;
            this.model = params.model;
            this.model.on(self.events.CHANGE, this.render, this);
            this.source = $(this.template).prop('outerHTML');

            //Initialize Progress Bar
            this.progressBar = new ProgressBar({
                container: self.PROGRESS_BAR_CONTAINER
            });


            View.prototype.initialize.call(this, arguments);

        },

        getTemplateData: function () {
            return i18nLabels;
        },

        render: function () {
            this.setElement(this.container);
            this._unbindEventListeners();

            // Update the language related labels in the item configurations (charts)
            for (var it in this.config.items) {
                var item = this.config.items[it];
              //  this._updateChartExportTitles(this.config.items[it], i18nDashboardLabels[item.id], this.model.get('label'));
            }

            $(this.el).html(this.getTemplateFunction());

        },

        attach: function () {
            View.prototype.attach.call(this, arguments);

            this.$el = $(this.el);

            this.configUtils = new ConfigUtils();
        },


        getTemplateFunction: function () {

            // Update the language related labels in the dashboard template


            this.compiledTemplate = Handlebars.compile(this.source);

            var model = this.model.toJSON();

            var data = $.extend(true, model, i18nLabels, i18nDashboardLabels);

            return this.compiledTemplate(data);

        },

        setDashboardConfig: function (config) {
            this.baseConfig = config;

            this.config = config;
            this.config_type = config.id;
            this.config.baseItems = config.items;
            this.config.environment = GeneralConfig.ENVIRONMENT;

        },


        updateDashboardItemConfiguration: function (itemid, property, values) {
            var item = _.filter(this.config.items, {id: itemid})[0];

            if (item) {
                if (item.config && item.config[property]) {
                    if (values[0] === 'false' || values[0] === 'true')
                        item.config[property] = $.parseJSON(values[0]); // returns a Boolean
                    else
                        item.config[property] = values[0];

                }
            }
        },

        renderDashboard: function () {
            var self = this;

            this.config.el = this.$el;

            // the path to the custom item is registered
            this.config.itemsRegistry = {
                custom: {
                    path: self.paths.TABLE_ITEM
                }
            };

            this.dashboard = new Dashboard(this.config);

            this._bindEventListeners();

            this._loadProgressBar();

        },

        _disposeDashboards: function () {
            if (this.dashboard && $.isFunction(this.dashboard.dispose)) {
                this.dashboard.dispose();
            }
        },


        _collapseDashboardItem: function (itemId) {
            // Hide/collapse Item container
            var itemContainerId = '#' + itemId + this.container;

            $(this.source).find(itemContainerId).addClass(this.css.COLLAPSE);

        },

        _expandDashboardItem: function (itemId) {
            // Show Item container
            var itemContainerId = '#' + itemId + this.container;
            $(this.source).find(itemContainerId).removeClass(this.css.COLLAPSE);
        },


        _showDashboardItem: function (itemId) {
            // Show Item container
            var itemContainerId = '#' + itemId + this.container;
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

        /*_updateChartExportTitles: function (chartItem, title, subtitle) {

           if (chartItem.config.config ) {
                var chartItemTitle = chartItem.config.config.exporting.chartOptions.title,
                    chartItemSubTitle = chartItem.config.config.exporting.chartOptions.subtitle;

                if (!chartItemTitle || !chartItemSubTitle) {
                    chartItemTitle = chartItem.config.config.exporting.chartOptions.title = {};
                    chartItemSubTitle = chartItem.config.config.exporting.chartOptions.subtitle = {};
                }

                chartItemTitle.text = title;
                chartItemSubTitle.text = subtitle;
            }
        },*/

        rebuildDashboard: function (filter) {
            var self = this;

            this._disposeDashboards();
            this.config.filter = filter;


            // the path to the custom item is registered
            this.config.itemsRegistry = {
                custom: {
                    path:self.paths.TABLE_ITEM
                }
            };

            // Build new dashboard
            this.dashboard = new Dashboard(this.config);


            // Bind the events
            this._bindEventListeners();

            // Load Progress bar
            this._loadProgressBar();

        },


        getDashboardConfig: function () {
            return this.config;
        },

        _loadProgressBar: function () {

            this.progressBar.reset();
            this.progressBar.show();

        },


        _bindEventListeners: function () {

            var self = this, increment = 0, percent = Math.round(100 / this.config.items.length);


            this.dashboard.on('ready', function () {
                self.progressBar.finish();
            });

            this.dashboard.on('ready.item', function () {
                increment = increment + percent;
                self.progressBar.update(increment);
            });
        },



        _unbindEventListeners: function () {
            // Remove listeners

        },

        dispose: function () {

            this._disposeDashboards();

            this._unbindEventListeners();

            View.prototype.dispose.call(this, arguments);
        }


    });

    return TableView;
});
