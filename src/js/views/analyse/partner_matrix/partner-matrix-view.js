/*global define, amplify*/
define([
    'jquery',
    'jquery-ui',
    'views/base/view',
    'views/common/title-view',
    'views/analyse/partner_matrix/filter-view',
    'views/analyse/partner_matrix/dashboard-charts-view',
    'views/analyse/partner_matrix/dashboard-table-view',
    'models/analyse/dashboard',
    'models/analyse/table',
    'text!templates/analyse/partner_matrix/partner-matrix.hbs',
    'i18n!nls/analyse',
    'config/Events',
    'config/Config',
    'config/analyse/partner_matrix/Events',
    'config/analyse/partner_matrix/config-partner-matrix',
    'lib/utils',
    'amplify',
    'bootstrap',
    'underscore'
], function ($, $UI, View, TitleSubView, FilterSubView, DashboardChartsSubView, DashboardTableSubView, DashboardModel, TableModel, template, i18nLabels, Events, GeneralConfig, BaseMatrixEvents, BasePartnerMatrixConfig, Utils) {

    'use strict';

    var s = {
        css_classes: {
            TITLE_BAR_ITEMS: "#analyse-partner-matrix-fx-title-items",
            FILTER_HOLDER: "#analyse-partner-matrix-filter-holder",
            DASHBOARD_CHARTS_HOLDER: "#analyse-partner-matrix-charts-content",
            DASHBOARD_TABLE_HOLDER: "#analyse-partner-matrix-table-content"
        },
        dashboardModel: {
            LABEL: 'label'
        },
        paths: {
          CHARTS_CONFIG: 'config/analyse/partner_matrix/config-charts-',
          TABLE_CONFIG: 'config/analyse/partner_matrix/config-table-'
        }
    };


    /**
     *
     * Creates a new Resource Partner Matrix View
     * Resource Partner Matrix View comprises of a series of subviews: title view, filter view and 2 dashboard views (charts dashboard and table dashboard)
     * @class ResourcePartnerMatrixView
     * @extends View
     */
    var ResourcePartnerMatrixView = View.extend({

        // Automatically render after initialize
        autoRender: true,

        className: 'analyse-partner-matrix',

        // Save the template string in a prototype property.
        // This is overwritten with the compiled template function.
        // In the end you might want to used precompiled templates.
        template: template,


        initialize: function (params) {
            this.analyse_type = params.filter;
            this.topic = BasePartnerMatrixConfig.dashboard.DEFAULT_TOPIC;
            this.page = params.page;
            this.datasetType = GeneralConfig.DEFAULT_UID;

            View.prototype.initialize.call(this, arguments);
        },

        getTemplateData: function () {
            return i18nLabels;
        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            //update State
            amplify.publish(Events.STATE_CHANGE, {menu: 'analyse', breadcrumb: this._initMenuBreadcrumbItem()});

            this._bindEventListeners();

        },

        render: function () {
            View.prototype.render.apply(this, arguments);

            this._loadConfigurations();
        },

        /**
         * Based on the topic (topic is determined by the current filter selections - see filter-view) the appropriate JS configuration files are loaded via requireJS
         * @private
         */
        _loadConfigurations: function () {
            require([s.paths.CHARTS_CONFIG + this.topic, s.paths.TABLE_CONFIG + this.topic], _.bind(this._initSubViews, this));
        },

        /**
         * Initializes all sub views: Title, Filter, Table Dashboard and Charts Dashboard
         * @private
         */

        _initSubViews: function (ChartsConfig, TableConfig) {
            View.prototype.render.apply(this, arguments);

            // Charts Dashboard/filter Configuration
            if (!ChartsConfig || !ChartsConfig.dashboard || !ChartsConfig.filter) {
                alert("Impossible to find CHARTS dashboard/filter configuration for the topic: " + this.topic);
                return;
            }

            // Table Dashboard Configuration
            if (!TableConfig || !TableConfig.dashboard) {
                alert("Impossible to find TABLE dashboard configuration for the topic: " + this.topic);
                return;
            }

            this.chartsConfig = ChartsConfig;
            this.tableConfig = TableConfig;

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
                config: this.chartsConfig.filter
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
            this.tableDashboardModel = new TableModel();

            // Set DASHBOARD Table Sub View
            var dashboardTableSubView = new DashboardTableSubView({
                autoRender: false,
                container: this.$el.find(s.css_classes.DASHBOARD_TABLE_HOLDER),
                topic: this.topic,
                model: this.tableDashboardModel
            });
            dashboardTableSubView.setDashboardConfig(this.tableConfig.dashboard);
            this.subview('tableDashboard', dashboardTableSubView);

        },

        /**
         * Initializes the menu breadcrumb for the page
         * @private
         */
        _initMenuBreadcrumbItem: function () {
            var label = "";
            var self = this;

            if (typeof self.analyse_type !== 'undefined') {
                label = i18nLabels[self.analyse_type];
            }

            return Utils.createMenuBreadcrumbItem(label, self.analyse_type, self.page);
        },


        _bindEventListeners: function () {
            amplify.subscribe(BaseMatrixEvents.FILTER_ON_READY, this, this._filtersLoaded);
            amplify.subscribe(BaseMatrixEvents.FILTER_ON_CHANGE, this, this._updateDashboards);
        },

        /**
         * When filters have all loaded - the TitleView is built using the currently selected filters and the dashboards rendered
         * @param payload Selected Filter Items
         * @private
         */
        _filtersLoaded: function (payload) {

            var selectedFilterItems = payload.labels;

            // Set Dashboard Properties
            if (payload["props"]) {
                this.subview('chartsDashboard').setProperties(payload["props"]);
                this.subview('tableDashboard').setProperties(payload["props"]);
            }

            // Build Title View
            this.subview('title').setLabels(selectedFilterItems);
            this.subview('title').build();

            // Update Dashboard Models (with labels - see _updateChartsDashboardModelValues)
            this._updateChartsDashboardModelValues();
            this._updateTableDashboardModelValues();

            // Render each Dashboard
            this.subview('chartsDashboard').renderDashboard();
            this.subview('tableDashboard').renderDashboard();

        },


        /**
         * When a filter selection changes, each Dashboard and Title Sub View is rebuilt/refreshed
         * @param selectedFilter The selected filter which has changed
         * @private
         */
        _updateDashboards: function (selectedFilter) {

            var filterValues = this.subview('filters').getFilterValues(), filterDerivedTopic;

            // console.log("================= filter values =============== ");
            // console.log(values);

            //console.log("================= selectedfilter =============== ");
            // console.log(selectedfilter);

            if (selectedFilter) {

                // If the selected filter has a value
                if (selectedFilter.values.values.length > 0) {

                    // Update the TitleView (Add Item)
                    amplify.publish(Events.TITLE_ADD_ITEM, this._createTitleItem(selectedFilter));

                    // Get topic
                    if (selectedFilter['props']) {
                        if (selectedFilter['props']['selected_topic']) {
                            filterDerivedTopic = selectedFilter['props']['selected_topic'];
                        }
                    }


                    if(selectedFilter.values.values[0] === 'all'){
                        filterValues = this.subview('filters').clearFilterValue(selectedFilter.id,  this.subview('filters').getFilterValues());


                     // Update the TitleView (Remove Item)
                     amplify.publish(Events.TITLE_REMOVE_ITEM, selectedFilter.id);

                    // Get topic
                    if (selectedFilter['props']) {
                        if (selectedFilter['props']['selected_topic']) {
                            filterDerivedTopic = selectedFilter['props']['selected_topic'];
                        }
                    }
                    }

                    this._getDashboardConfiguration(filterDerivedTopic, filterValues);
                }
               /* // Else selected filter has no value (i.e.there has been a de-selection)
                else {

                    // Update the TitleView (Remove Item)
                    amplify.publish(Events.TITLE_REMOVE_ITEM, selectedFilter.id);

                    // Get topic
                    if (selectedFilter['props']) {
                        if (selectedFilter['props']['selected_topic']) {
                            filterDerivedTopic = selectedFilter['props']['selected_topic'];
                        }
                    }
                }

                // Get Topic Related Dashboard Configuration
                this._getDashboardConfiguration(filterDerivedTopic, filterValues);
*/
            }

        },


        /**
         * Gets the appropriate JS configuration file via requireJS, if the topic has changed
         * @param filterDerivedTopic
         * @param filterValues
         * @private
         */
        _getDashboardConfiguration: function (filterDerivedTopic, filterValues) {
            var self = this;
            // console.log("================= _getDashboardConfiguration Start =============== ");
            //console.log(filtervalues);

            // If the topic has changed, rebuild dashboards with new configuration
            if (filterDerivedTopic && filterDerivedTopic !== this.topic) {
                // Re set the current topic
                this.topic = filterDerivedTopic;

                //Load new configuration files
                require([s.paths.CHARTS_CONFIG + filterDerivedTopic, s.paths.TABLE_CONFIG + filterDerivedTopic], function (TopicChartsConfig, TopicTableConfig) {
                    // Rebuild dashboards with new configurations
                    self._rebuildDashboards(filterValues, TopicChartsConfig.dashboard, TopicTableConfig.dashboard);
                });
            }
            else {
                // Rebuild dashboards with existing configurations
                self._rebuildDashboards(filterValues, self.subview('chartsDashboard').getDashboardConfig(), self.subview('tableDashboard').getDashboardConfig());
            }
        },

        /**
         * Rebuild the dashboards
         * @param filterValues
         * @param chartsDashboardConfig
         * @param tableDashboardConfig
         * @private
         */

        _rebuildDashboards: function (filterValues, chartsDashboardConfig, tableDashboardConfig) {

            //console.log("================= _rebuildDashboards 1 =============== ");
            //console.log(dashboardConfig);

            // Set Dashboard Configuration
            this.subview('chartsDashboard').setDashboardConfig(chartsDashboardConfig);
            this.subview('tableDashboard').setDashboardConfig(tableDashboardConfig);

            // Update Dashboard Models (with labels - see _updateChartsDashboardModelValues)
            this._updateChartsDashboardModelValues();
            this._updateTableDashboardModelValues();


            //console.log("================= _rebuildDashboard 3 =============== ");
            // console.log(ovalues);

            // Rebuild Dashboards
            this.subview('chartsDashboard').rebuildDashboard(filterValues, this.topic);
            this.subview('tableDashboard').rebuildDashboard(filterValues, this.topic);
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
            amplify.unsubscribe(BaseMatrixEvents.FILTER_ON_READY, this._filtersLoaded);
            amplify.unsubscribe(BaseMatrixEvents.FILTER_ON_CHANGE, this._updateDashboards);

        },


        _updateChartsDashboardModelValues: function () {
            this.chartsDashboardModel.set(s.dashboardModel.LABEL, this.subview('title').getTitleAsArray());
        },

        _updateTableDashboardModelValues: function () {
            this.tableDashboardModel.set(s.dashboardModel.LABEL, this.subview('title').getTitleAsArray());
        },


        dispose: function () {

            this._unbindEventListeners();

            View.prototype.dispose.call(this, arguments);
        }

    });

    return ResourcePartnerMatrixView;
});
