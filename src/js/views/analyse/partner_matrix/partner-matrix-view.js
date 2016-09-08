/*global define, amplify*/
define([
    'jquery',
    'jquery-ui',
    'views/base/view',
    'views/common/title-view',
    'views/analyse/partner_matrix/filter-view',
    'views/analyse/partner_matrix/dashboard-view',
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
], function ($, $UI, View, TitleSubView, FilterSubView, DashboardSubView, DashboardTableSubView, DashboardModel, TableModel, template, i18nLabels, Events, GeneralConfig, BaseMatrixEvents, BasePartnerMatrixConfig, Utils) {

    'use strict';

    var s = {
        css_classes: {
            TITLE_BAR_ITEMS: "#fx-title-items",
            BACK_TO_TOP_FIXED: "#analyse-partner-matrix-top-link-fixed",
            FILTER_HOLDER: "#analyse-partner-matrix-filter-holder",
            DASHBOARD_HOLDER: "#analyse-partner-matrix-content",
            DASHBOARD_TABLE_HOLDER: "#analyse-table-content"
        },
        dashboardModel: {
            COUNTRY: 'selected_country',
            TOPIC: 'topic',
            LABEL: 'label'
        }
    };


    /**
     *
     * Creates a new Resource Partner Matrix View
     * Browse By View comprises of a series of subviews: title view, filter view and 1 dashboard view
     * @class BrowseByView
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
           // this.topicConfig = ConfigByTopic[this.topic];

            View.prototype.initialize.call(this, arguments);
        },

        getTemplateData: function () {
            return i18nLabels;
        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            //update State
            amplify.publish(Events.STATE_CHANGE, {menu: 'analyse', breadcrumb: this._initMenuBreadcrumbItem()});

            this._initVariables();

            this._bindEventListeners();

        },

        render: function () {
            View.prototype.render.apply(this, arguments);

            this._loadDashboardConfigurations();
        },

        /**
         * Based on the view the appropriate JS configuration file are loaded via requireJS
         * @private
         */
        _loadDashboardConfigurations: function () {
            require(['config/analyse/partner_matrix/config-' + this.topic, 'config/analyse/partner_matrix/config-table-' + this.topic], _.bind(this._initSubViews, this));
        },

        /**
         * Initializes all sub views: Title, Filters, oecd/oda Dashboard and Indicators Dashboard
         * @private
         */

        _initSubViews: function (Config, TableConfig) {
            View.prototype.render.apply(this, arguments);

            if (!Config || !Config.dashboard || !Config.filter) {
                alert("Impossible to find default dashboard/filter configuration for the topic: " + this.topic);
                return;
            }

            if (!TableConfig || !TableConfig.dashboard) {
                alert("Impossible to find default dashboard/filter configuration for the topic: " + this.topic);
                return;
            }

            this.defaultDashboardConfig = Config;
            this.tableDashboardConfig = TableConfig;

            this.otherSectorsDashboardConfig = Config.dashboard;

            // Set TITLE Sub View
            var titleSubView = new TitleSubView({
                autoRender: true,
                container: this.$el.find(s.css_classes.TITLE_BAR_ITEMS),
                title: i18nLabels.selections
            });
            this.subview('title', titleSubView);

            // Set Filter Sub View
            var filtersSubView = new FilterSubView({
                autoRender: true,
                container: this.$el.find(s.css_classes.FILTER_HOLDER),
                config: this.defaultDashboardConfig.filter
            });
            this.subview('filters', filtersSubView);

            // Set Dashboard Model
            this.dashboardModel = new DashboardModel();

            // Set DASHBOARD Sub View
            var dashboardSubView = new DashboardSubView({
                autoRender: false,
                container: this.$el.find(s.css_classes.DASHBOARD_HOLDER),
                topic: this.topic,
                model: this.dashboardModel
            });
            dashboardSubView.setDashboardConfig(this.defaultDashboardConfig.dashboard);

            this.subview('dashboard', dashboardSubView);

            this.tableDashboardModel = new TableModel();

           // Set DASHBOARD Table Sub View
            var dashboardTableSubView = new DashboardTableSubView({
                autoRender: false,
                container: this.$el.find(s.css_classes.DASHBOARD_TABLE_HOLDER),
                topic: this.topic,
                model: this.tableDashboardModel
            });

            dashboardTableSubView.setDashboardConfig(this.tableDashboardConfig.dashboard);

            this.subview('tableDashboard', dashboardTableSubView);

        },

        _initMenuBreadcrumbItem: function () {
            var label = "";
            var self = this;

            if (typeof self.analyse_type !== 'undefined') {
                label = i18nLabels[self.analyse_type];
            }

            return Utils.createMenuBreadcrumbItem(label, self.analyse_type, self.page);
        },

        _initVariables: function () {
            // Initialize bootstrap affix: Locks ('sticks') section, appears when scrolling
            // $(s.css_classes.BACK_TO_TOP_FIXED).affix({});

        },

        _bindEventListeners: function () {
            amplify.subscribe(BaseMatrixEvents.FILTER_ON_READY, this, this._filtersLoaded);
            amplify.subscribe(BaseMatrixEvents.FILTER_ON_CHANGE, this, this._updateDashboard);
        },

        /**
         * When filters have all loaded - the TitleView is built using the currently selected filters and the dashboards rendered
         * @param selectedFilterItems (payload)
         * @private
         */
        _filtersLoaded: function (payload) {

            var selectedFilterItems = payload.labels;

            // Set Dashboard Properties
            if (payload["props"]) {
                this.subview('dashboard').setProperties(payload["props"]);
            }

            // Build Title View
            this.subview('title').setLabels(selectedFilterItems);
            this.subview('title').build();

            // Set Dashboard Model
            this._setDashboardModelValues();

            // Render Dashboard Model
            this.subview('dashboard').renderDashboard();

            this.subview('tableDashboard').renderDashboard();

        },



        /**
         * When a filter selection changes, each Dashboard and Title Sub View is rebuilt/refreshed
         * @param selected filter
         * @private
         */
        _updateDashboard: function (selectedfilter) {

            var ovalues = this.subview('filters').getFilterValues(), confPath, displayConfigForSelectedFilter, displayConfigForSelectedFilterValues, dashboardConfigChanged;

            // console.log("================= ovalues =============== ");
            // console.log(ovalues);

            //console.log("================= selectedfilter =============== ");
            // console.log(selectedfilter);

            if (selectedfilter) {

                // If selected filter has a value
                if (selectedfilter.values.values.length > 0) {

                    // Update the TitleView (Add Item)
                    amplify.publish(Events.TITLE_ADD_ITEM, this._getTitleItem(selectedfilter));

                    // Configuration display (if appropriate)
                   // if (this.topicConfig) {
                      //  displayConfigForSelectedFilter = this.topicConfig[selectedfilter.id];
                  //  }

                    // Set dashboard configuration
                    if (selectedfilter['props']) {
                        if (selectedfilter['props']['selected_topic']) {
                            confPath = selectedfilter['props']['selected_topic'];
                            this.topic = confPath;
                        }
                    }


                }
                // Else selected filter has no value (i.e.there has been a de-selection/removal)
                else {

                    // Update the TitleView (Remove Item)
                    amplify.publish(Events.TITLE_REMOVE_ITEM, selectedfilter.id);

                    // Set dashboard configuration
                    if (selectedfilter['props']) {
                        if (selectedfilter['props']['selected_topic']) {
                            confPath = selectedfilter['props']['selected_topic'];
                            this.topic = confPath;
                        }
                    }

                    // Re-configure display (if appropriate)
                   // if (selectedfilter.dependencies && this.topicConfig) {
                      //  displayConfigForSelectedFilter = this.topicConfig[selectedfilter.dependencies[0]];
                   // }

                }


                // console.log("================= _updateDashboard: OTHER =============== ");
                this._setDashboardConfiguration(confPath, ovalues, displayConfigForSelectedFilter);

            }

        },


        /**
         * Load the appropriate JS configuration file via require, if appropriate
         * @param confPath
         * @param ovalues
         * @param displayConfigForSelectedFilter
         * @private
         */
        _setDashboardConfiguration: function (confPath, ovalues, displayConfigForSelectedFilter) {
            var self = this;
            // console.log("================= _setDashboardConfiguration Start =============== ");
            //console.log(ovalues);

            if (confPath !== this.topic){
                if (confPath) {
                    require(['config/analyse/partner_matrix/config-' + confPath, 'config/analyse/partner_matrix/config-table-' + confPath], function (dialog, dialog2) {
                        self._rebuildDashboard(ovalues, displayConfigForSelectedFilter, dialog.dashboard, dialog2.dashboard);
                    });
                }
            }
            else {
                self._rebuildDashboard(ovalues, displayConfigForSelectedFilter, self.subview('dashboard').getDashboardConfig(), self.subview('tableDashboard').getDashboardConfig());
            }
        },

        /**
         * Rebuild the dashboard
         * @param ovalues
         * @param displayConfigForSelectedFilter
         * @param dashboardConfig
         * @private
         */

        _rebuildDashboard: function (ovalues, displayConfigForSelectedFilter, dashboardConfig, tableDashboardConfig) {

            //console.log("================= _rebuildDashboard 1 =============== ");
            //console.log(dashboardConfig);

            this.subview('dashboard').setDashboardConfig(dashboardConfig);
            this.subview('tableDashboard').setDashboardConfig(tableDashboardConfig);

            // console.log("================= _rebuildDashboard 2 =============== ");
            // console.log(displayConfigForSelectedFilter);
            // Hide/Show Dashboard Items

            this.subview('dashboard').updateDashboardTemplate(displayConfigForSelectedFilter);
            this.subview('tableDashboard').updateDashboardTemplate(displayConfigForSelectedFilter);

            // Update Dashboard Model
            this._setDashboardModelValues();


            //console.log("================= _rebuildDashboard 3 =============== ");
            // console.log(ovalues);

            // Rebuild Dashboard
            this.subview('dashboard').rebuildDashboard(ovalues, this.topic);
            this.subview('tableDashboard').rebuildDashboard(ovalues, this.topic);
        },


        _getTitleItem: function (item) {

            var titleItem = {}, labels = item.values.labels;

            titleItem.id = item.id;

            var key = Object.keys(labels)[0];
            titleItem.label = labels[key];

            return titleItem;
        },

        _unbindEventListeners: function () {
            // Remove listeners
            amplify.unsubscribe(BaseMatrixEvents.FILTER_ON_READY, this._filtersLoaded);
            amplify.unsubscribe(BaseMatrixEvents.FILTER_ON_CHANGE, this._updateDashboard);

        },


        _setDashboardModelValues: function () {
            this.dashboardModel.set(s.dashboardModel.LABEL, this.subview('title').getTitleAsArray());
            this.tableDashboardModel.set(s.dashboardModel.LABEL, this.subview('title').getTitleAsArray());
        },


        dispose: function () {

            this._unbindEventListeners();

            View.prototype.dispose.call(this, arguments);
        }

    });

    return ResourcePartnerMatrixView;
});
