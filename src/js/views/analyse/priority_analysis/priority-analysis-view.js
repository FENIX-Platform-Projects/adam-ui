/*global define, amplify*/
define([
    'jquery',
    'jquery-ui',
    'views/base/view',
    'views/common/title-view',
    'views/analyse/priority_analysis/filter-view',
    'views/analyse/priority_analysis/dashboard-charts-view',
    'views/analyse/priority_analysis/dashboard-priorities-view',
    'models/analyse/dashboard',
    'models/analyse/table',
    'text!templates/analyse/priority_analysis/priority-analysis.hbs',
    'i18n!nls/analyse',
    'config/Events',
    'config/Config',
    'config/analyse/priority_analysis/Events',
    'config/analyse/priority_analysis/config-charts',
    'config/analyse/priority_analysis/config-table',
    'config/analyse/priority_analysis/config-priority-analysis',
    'config/analyse/priority_analysis/config-filter',
    'lib/utils',
    'amplify',
    'underscore'
], function ($, $UI, View, TitleSubView, FilterSubView, DashboardChartsSubView, DashboardPrioritiesSubView, DashboardModel, TableModel, template, i18nLabels, Events, GeneralConfig, BasePriorityAnalysisEvents,  ChartsConfig, TableConfig, BasePriorityAnalysisConfig, BaseFilterConfig, Utils, amplify, _) {

    'use strict';

    var s = {
        css_classes: {
            TITLE_BAR_ITEMS: "#analyse-pa-fx-title-items",
            FILTER_HOLDER: "#analyse-pa-filter-holder",
            DASHBOARD_CHARTS_HOLDER: "#analyse-pa-charts-content",
            DASHBOARD_PRIORITIES_HOLDER: "#analyse-pa-priorities-content"
        },
        dashboardModel: {
            LABEL: 'label'
        },
        values: {
            ALL: 'all'
        },
        paths: {
          VENN_CONFIG: 'config/analyse/priority_analysis/config-venn-'
        }
    };


    /**
     *
     * Creates a new Priority Analysis View View
     * Resource Priority Analysis View comprises of a series of subviews: title view, filter view and 2 dashboard views (prioritiesDashboard and chartsDashboard)
     * @class PriorityAnalysisView
     * @extends View
     */
    var PriorityAnalysisView = View.extend({

        // Automatically render after initialize
        autoRender: true,

        className: 'analyse-priority-analysis',

        // Save the template string in a prototype property.
        // This is overwritten with the compiled template function.
        // In the end you might want to used precompiled templates.
        template: template,


        initialize: function (params) {
            this.analyse_type = params.filter;
            this.topic = BasePriorityAnalysisConfig.dashboard.DEFAULT_TOPIC;
            this.page = params.page;
            this.datasetType = GeneralConfig.DEFAULT_UID;

            View.prototype.initialize.call(this, arguments);
        },

        getTemplateData: function () {
            return i18nLabels;
        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            this.$el = $(this.el);

            //update State
            amplify.publish(Events.STATE_CHANGE, {menu: 'analyse', breadcrumb: this._createMenuBreadcrumbItem()});

            this._bindEventListeners();

        },

        render: function () {
            View.prototype.render.apply(this, arguments);

            this._loadConfigurations();
        },

        /**
         * Based on the topic, which is determined by the current filter selections (see filter-view)
         * the appropriate dashboard JS configuration files are loaded via requireJS
         * @private
         */
        _loadConfigurations: function () {
           // require([s.paths.CHARTS_CONFIG + this.topic, s.paths.TABLE_CONFIG + this.topic], _.bind(this._initSubViews, this));
            require([s.paths.VENN_CONFIG + this.topic], _.bind(this._initSubViews, this));
        },

        /**
         * Initializes all sub views: Title, Filter, Priorities Dashboard and Charts Dashboard
         * @param VennConfig Venn Item configuration
         * @private
         */

        _initSubViews: function (VennConfig) {

            View.prototype.render.apply(this, arguments);

            // Filter Configuration
            if (!BaseFilterConfig || !BaseFilterConfig.filter) {
                alert("Impossible to find filter configuration for the topic: " + this.topic);
                return;
            }


            // Charts Dashboard Configuration
            if (!ChartsConfig || !ChartsConfig.dashboard) {
                alert("Impossible to find CHARTS dashboard/filter configuration for the topic: " + this.topic);
                return;
            }

            // Table Dashboard Configuration
            if (!TableConfig || !TableConfig.dashboard) {
                alert("Impossible to find TABLE dashboard configuration for the topic: " + this.topic);
                return;
            }

            // Venn Configuration
            if (!VennConfig || !VennConfig.dashboard) {
                alert("Impossible to find VENN dashboard configuration for the topic: " + this.topic);
                return;
            }


            this.chartsConfig = ChartsConfig;

            // Append Venn item to table Config
            TableConfig.dashboard.items.push(VennConfig.dashboard.items[0]);
            this.prioritiesConfig = TableConfig;

            // Set TITLE Sub View
            var titleSubView = new TitleSubView({
                autoRender: true,
                container: this.$el.find(s.css_classes.TITLE_BAR_ITEMS),
                title: i18nLabels.selections
            });
            this.subview('title', titleSubView);

            // Set FILTER Sub View
            var filtersSubView = new FilterSubView({
                autoRender: true,
                container: this.$el.find(s.css_classes.FILTER_HOLDER),
                config: BaseFilterConfig.filter
            });
            this.subview('filters', filtersSubView);

            // Set CHARTS DASHBOARD Model
            this.chartsDashboardModel = new DashboardModel();

            // Set CHARTS DASHBOARD Sub View
            var dashboardChartsSubView = new DashboardChartsSubView({
                autoRender: false,
                container: this.$el.find(s.css_classes.DASHBOARD_CHARTS_HOLDER),
                topic: this.topic,
                model: this.chartsDashboardModel
            });
            dashboardChartsSubView.setDashboardConfig(this.chartsConfig.dashboard);
            this.subview('chartsDashboard', dashboardChartsSubView);

            // Set TABLE DASHBOARD Model
            this.prioritiesDashboardModel = new TableModel();

            // Set DASHBOARD Table Sub View
            var dashboardPrioritiesSubView = new DashboardPrioritiesSubView({
                autoRender: false,
                container: this.$el.find(s.css_classes.DASHBOARD_PRIORITIES_HOLDER),
                topic: this.topic,
                model: this.prioritiesDashboardModel
            });
            dashboardPrioritiesSubView.setDashboardConfig(this.prioritiesConfig.dashboard);
            this.subview('prioritiesDashboard', dashboardPrioritiesSubView);

        },

        /**
         * Create the Menu breadcrumb item for the page
         * @private
         */
        _createMenuBreadcrumbItem: function () {
            var label = "";
            var self = this;

            if (typeof self.analyse_type !== 'undefined') {
                label = i18nLabels[self.analyse_type];
            }

            return Utils.createMenuBreadcrumbItem(label, self.analyse_type, self.page);
        },


        _bindEventListeners: function () {
            amplify.subscribe(BasePriorityAnalysisEvents.FILTER_ON_READY, this, this._filtersLoaded);
            amplify.subscribe(BasePriorityAnalysisEvents.FILTER_ON_CHANGE, this, this._filtersChanged);
            amplify.subscribe(BasePriorityAnalysisEvents.VENN_ON_CHANGE, this, this._renderChartsDashboards);

        },

        /**
         * When the filters have all loaded the TitleView is built using the currently selected filter values
         * and the dashboards are rendered
         * @param payload Selected Filter Items
         * @private
         */
        _filtersLoaded: function (payload) {

            var selectedFilterItems = payload.labels;

            // Set Dashboard Properties
            if (payload["props"]) {
              //  this.subview('chartsDashboard').setProperties(payload["props"]);
                this.subview('prioritiesDashboard').setProperties(payload["props"]);
            }

            // Build Title View
            this.subview('title').setLabels(selectedFilterItems);
            this.subview('title').build();

            // Update Dashboard Models (with labels - see _updateChartsDashboardModelValues)
            //this._updateChartsDashboardModelValues();
            this._updatePrioritiesDashboardModelValues();

            // Render each Dashboard
           // this.subview('chartsDashboard').renderDashboard();
            this.subview('prioritiesDashboard').renderDashboard();

        },


        /**
         * When a filter selection changes the view is updated
         * @param changedFilter The filter which has changed
         * @private
         */
        _filtersChanged: function (changedFilter) {

            var allFilterValues = this.subview('filters').getFilterValues();

            this._updateView(changedFilter, allFilterValues);

        },

        /**
         * Each Dashboard and Title Sub View is rebuilt/refreshed
         * @param changedFilter The filter which has changed
         * @param allFilterValues All (selected) filter values
         * @private
         */

        _updateView: function (changedFilter, allFilterValues) {

            var filterValues = allFilterValues;

            // console.log("================= filter values =============== ");
            // console.log(filterValues);

            //console.log("================= selectedfilter =============== ");
            //console.log(changedFilter);

            if (changedFilter) {

                var topic = this.topic, selections;

                // If the changed filter has a value
                if (changedFilter.values.values.length > 0) {

                    // Get topic
                    if (changedFilter['props']) {

                        var selectedTopicObj = _.find(changedFilter['props'], function(obj){
                             if(obj['selected_topic'])
                                return obj;
                        });

                        var selectionsObj = _.find(changedFilter['props'], function(obj){
                            if(obj['selections'])
                                return obj;
                        });

                        if (selectedTopicObj) {
                            topic = selectedTopicObj["selected_topic"];
                        }
                        if (selectionsObj) {
                            selections = selectionsObj['selections'];
                        }
                    }

                    // All is selected
                    if (changedFilter.values.values[0] === s.values.ALL) {

                        // Update the TitleView (Remove Item)
                        amplify.publish(Events.TITLE_REMOVE_ITEM, changedFilter.id);

                    } else {
                        // Update the TitleView (Add Item)
                        amplify.publish(Events.TITLE_ADD_ITEM, this._createTitleItem(changedFilter));
                    }

                    this._getDashboardConfiguration(topic, filterValues, selections);
                }

            }

        },


        _renderChartsDashboards: function (newValues) {

            //console.log("================= _renderChartsDashboards =============== ");

            var filterValues = this.subview('filters').getFilterValues(), filterDerivedTopic;


            var extendedFilterValues = $.extend(true, filterValues, newValues);

           // console.log("======================================= filterValues ");
           // console.log(filterValues);
           // console.log("======================================= extendedFilterValues");
            //console.log(extendedFilterValues);

            this.chartsConfig.dashboard.filter = extendedFilterValues;

            this._updateChartsDashboardModelValues();

            this.subview('chartsDashboard').setDashboardConfig(this.chartsConfig.dashboard);
            this.subview('chartsDashboard').renderDashboard();


            //console.log("================= selectedfilter =============== ");
            // console.log(selectedfilter);


        },

        /**
         * Get the appropriate Dashboard JS configuration file via requireJS, if the topic has changed
         * @param topic
         * @param filterValues
         * @private
         */
        _getDashboardConfiguration: function (topic, filterValues, props) {
            var self = this;
            // console.log("================= _getDashboardConfiguration Start =============== ");
            //console.log(filtervalues);

            // If the topic has changed, rebuild dashboards with new configuration
            if (topic !== this.topic) {
                // Re set the current topic
                this.topic = topic;

                //Load new configuration files
                require([s.paths.VENN_CONFIG + topic], function (TopicVennConfig) {

                    var venn  =  _.find(self.prioritiesConfig.dashboard.items, function(o){
                        return o.id === BasePriorityAnalysisConfig.items.VENN_DIAGRAM;
                    });

                    if(venn) {
                        self.prioritiesConfig.dashboard.items.pop();
                    }

                    self.prioritiesConfig.dashboard.items.push(TopicVennConfig.dashboard.items[0]);


                    // Rebuild dashboards with new configurations
                    self._rebuildDashboards(filterValues, self.prioritiesConfig.dashboard, props);
                });
            }
            else {
                // Rebuild dashboards with existing configurations
                self._rebuildDashboards(filterValues, self.subview('prioritiesDashboard').getDashboardConfig(), props);
            }
        },

        /**
         * Rebuild the dashboards
         * @param filterValues
         * @param prioritiesDashboardConfig
         * @private
         */

        _rebuildDashboards: function (filterValues, prioritiesDashboardConfig, props) {

            //console.log("================= _rebuildDashboards 1 =============== ");
            //console.log(dashboardConfig);

            // Set Dashboard Configuration
           // this.subview('chartsDashboard').setDashboardConfig(chartsDashboardConfig);
            this.subview('prioritiesDashboard').setDashboardConfig(prioritiesDashboardConfig);

            // Update Dashboard Models (with labels - see _updateChartsDashboardModelValues)
           // this._updateChartsDashboardModelValues();
            this._updatePrioritiesDashboardModelValues();


            //console.log("================= _rebuildDashboard 3 =============== ");
            // console.log(ovalues);

            // Rebuild Dashboards
           // this.subview('chartsDashboard').rebuildDashboard(filterValues, this.topic);
            this.subview('prioritiesDashboard').rebuildDashboard(filterValues, this.topic, props);
        },


        /**
         * Create the Title Item (from the filterItem's id and label)
         * @param filterItem
         * @private
         */

        _createTitleItem: function (filterItem) {

            var titleItem = {}, labels = filterItem.values.labels;

            titleItem.id = filterItem.id;

            var key = Object.keys(labels)[0];
            titleItem.label = labels[key];

            return titleItem;
        },

        _unbindEventListeners: function () {
            // Remove listeners
            amplify.unsubscribe(BasePriorityAnalysisEvents.FILTER_ON_READY, this._filtersLoaded);
            amplify.unsubscribe(BasePriorityAnalysisEvents.FILTER_ON_CHANGE, this._filtersChanged);
            amplify.unsubscribe(BasePriorityAnalysisEvents.FILTER_ON_CHANGE, this._renderChartsDashboards);

        },


        _updateChartsDashboardModelValues: function () {
            this.chartsDashboardModel.set(s.dashboardModel.LABEL, this.subview('title').getItemText("year"));
        },

        _updatePrioritiesDashboardModelValues: function () {
            //console.log(this.subview('title').getTitleAsArray());

            this.prioritiesDashboardModel.set(s.dashboardModel.LABEL, this.subview('title').getItemText("recipientcode"));
        },


        dispose: function () {

            this._unbindEventListeners();

            View.prototype.dispose.call(this, arguments);
        }

    });

    return PriorityAnalysisView;
});
