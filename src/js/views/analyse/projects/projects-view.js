/*global define, amplify*/
define([
    'jquery',
    'jquery-ui',
    'views/base/view',
    'views/common/title-view',
    'views/analyse/projects/filter-view',
    'views/analyse/projects/dashboard-table-view',
    'models/analyse/dashboard',
    'models/analyse/table',
    'text!templates/analyse/projects/projects.hbs',
    'i18n!nls/analyse',
    'config/Events',
    'config/Config',
    'config/analyse/projects/config-projects',
    'config/analyse/projects/Events',
    'config/analyse/projects/config-filter',
    'config/analyse/projects/config-table-other-sectors',
    'config/analyse/projects/config-table-fao-sectors',
    'lib/utils',
    'amplify',
    'underscore'
], function ($, $UI, View, TitleSubView, FilterSubView, DashboardTableSubView, DashboardModel, TableModel, template, i18nLabels, Events, GeneralConfig, BaseProjectsConfig, BaseProjectsEvents, BaseFilterConfig, TableConfigOtherSectors, TableConfigFAOSectors, Utils, amplify, _) {

    'use strict';

    var s = {
        css_classes: {
            TITLE_BAR_ITEMS: "#analyse-projects-fx-title-items",
            FILTER_HOLDER: "#analyse-projects-filter-holder",
            DASHBOARD_TABLE_HOLDER: "#analyse-projects-table-content"
        },
        dashboardModel: {
            LABEL: 'label'
        },
        values: {
            ALL: 'all'
        }
    };


    /**
     *
     * Creates a new ProjectsView View
     * Projects View comprises of a series of subviews: title view, filter view and 2 dashboard views (charts dashboard and table dashboard)
     * @class ProjectsView
     * @extends View
     */
    var ProjectsView = View.extend({

        // Automatically render after initialize
        autoRender: true,

        className: 'analyse-comp-advantage',

        // Save the template string in a prototype property.
        // This is overwritten with the compiled template function.
        // In the end you might want to used precompiled templates.
        template: template,


        initialize: function (params) {
            this.analyse_type = params.filter;
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

            this._initSubViews();
        },


        /**
         * Initializes all sub views: Title, Filter, Table Dashboard and Charts Dashboard
         * @private
         */

        _initSubViews: function () {

            View.prototype.render.apply(this, arguments);

            // Filter Configuration
            if (!BaseFilterConfig || !BaseFilterConfig.filter) {
                alert("Impossible to find filter configuration ");
                return;
            }

            // Table Dashboard Configuration for Other Sectors
            if (!TableConfigOtherSectors || !TableConfigOtherSectors.dashboard) {
                alert("Impossible to find Other Sectors TABLE dashboard configuration" );
                return;
            }

            // Table Dashboard Configuration for FAO Sectors
            if (!TableConfigFAOSectors || !TableConfigFAOSectors.dashboard) {
                alert("Impossible to find FAO Sectors TABLE dashboard configuration" );
                return;
            }


            //Set default dashboard configuration
            if (TableConfigOtherSectors.id === BaseProjectsConfig.dashboard.DEFAULT_CONFIG) {
                this.tableConfig = TableConfigOtherSectors;
            } else if (TableConfigFAOSectors.id === BaseProjectsConfig.dashboard.DEFAULT_CONFIG) {
                this.tableConfig = TableConfigFAOSectors;
            }

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

            // Set TABLE DASHBOARD Model
            this.tableDashboardModel = new TableModel();

            // Set DASHBOARD Table Sub View
            var dashboardTableSubView = new DashboardTableSubView({
                autoRender: false,
                container: this.$el.find(s.css_classes.DASHBOARD_TABLE_HOLDER),
                model: this.tableDashboardModel
            });
            dashboardTableSubView.setDashboardConfig(this.tableConfig.dashboard);
            this.subview('tableDashboard', dashboardTableSubView);

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
            amplify.subscribe(BaseProjectsEvents.FILTER_ON_READY, this, this._filtersLoaded);
            amplify.subscribe(BaseProjectsEvents.FILTER_ON_CHANGE, this, this._filtersChanged);
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
                this.subview('tableDashboard').setProperties(payload["props"]);
            }

            // Build Title View
            this.subview('title').setLabels(selectedFilterItems);
            this.subview('title').build();

            // Update Dashboard Models (with labels - see _updateChartsDashboardModelValues)
            this._updateTableDashboardModelValues();

            // Render each Dashboard
            this.subview('tableDashboard').renderDashboard();

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

        _updateView: function (changedFilterItems, allFilterValues) {

            var filterValues = allFilterValues;

            // console.log("================= filter values =============== ");
            // console.log(" filter values: ", filterValues, " changedfilter values: ", changedFilter);

            if (changedFilterItems) {

                if($.isArray(changedFilterItems)){

                    this._setItemTitle(changedFilterItems);

                    var dashboardConfig = this.subview('tableDashboard').getDashboardConfig();
                    var config = this.tableConfig;

                    // check filter values contains 9999
                    for(var idx in changedFilterItems){
                        var changedFilter = changedFilterItems[idx];
                        if (changedFilter.values.values.length > 0) {
                            if (changedFilter.id === GeneralConfig.SELECTORS.SECTOR) {
                               if(changedFilter.values.values[0] === '9999'){
                                   console.log("============== FAO ", config);
                                   config = TableConfigFAOSectors;
                                   dashboardConfig = TableConfigFAOSectors.dashboard;
                               } else {
                                   console.log("============== OTHER ", config);
                                   config = TableConfigOtherSectors;
                                   dashboardConfig = TableConfigOtherSectors.dashboard;
                               }
                               break;
                            }
                        }
                    }


                    console.log("============== CONFIG ", dashboardConfig.items[0]);

                    this._getDashboardConfiguration(filterValues, dashboardConfig);
                }
            }

          /*  if (changedFilter) {

                // If the changed filter has a value
                if (changedFilter.values.values.length > 0) {


                    // All is selected
                    if (changedFilter.values.values[0] === s.values.ALL) {

                        // Update the TitleView (Remove Item)
                        amplify.publish(Events.TITLE_REMOVE_ITEM, changedFilter.id);

                    } else {
                        // Update the TitleView (Add Item)
                        amplify.publish(Events.TITLE_ADD_ITEM, this._createTitleItem(changedFilter));
                    }

                    this._getDashboardConfiguration(filterValues);
                }

            }*/

        },

        _setItemTitle: function (changedFilterItems){
            for(var idx in changedFilterItems){
                var changedFilter = changedFilterItems[idx];
                if (changedFilter.values.values.length > 0) {
                    // All is selected
                    if (changedFilter.values.values[0] === s.values.ALL) {
                        // Update the TitleView (Remove Item)
                        amplify.publish(Events.TITLE_REMOVE_ITEM, changedFilter.id);
                    } else {
                        // Update the TitleView (Add Item)
                        amplify.publish(Events.TITLE_ADD_ITEM, this._createTitleItem(changedFilter));
                    }
                }
            }
        },

        /**
         * Get the appropriate Dashboard JS configuration file via requireJS, if the topic has changed
         * @param topic
         * @param filterValues
         * @private
         */
        _getDashboardConfiguration: function (filterValues, tableConfig) {
            var self = this;

            // Rebuild dashboards with existing configurations
            //self._rebuildDashboards(filterValues, self.subview('tableDashboard').getDashboardConfig());
            self._rebuildDashboards(filterValues, tableConfig);
        },

        /**
         * Rebuild the dashboards
         * @param filterValues
         * @param tableDashboardConfig
         * @private
         */

        _rebuildDashboards: function (filterValues, tableDashboardConfig) {

            //console.log("================= _rebuildDashboards 1 =============== ");
            //console.log(dashboardConfig);

            // Set Dashboard Configuration
            this.subview('tableDashboard').setDashboardConfig(tableDashboardConfig);

            // Update Dashboard Models (with labels - see _updateChartsDashboardModelValues)
            this._updateTableDashboardModelValues();


            //console.log("================= _rebuildDashboard 3 =============== ");
            // console.log(ovalues);

            // Rebuild Dashboards
            this.subview('tableDashboard').rebuildDashboard(filterValues);
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
            amplify.unsubscribe(BaseProjectsEvents.FILTER_ON_READY, this._filtersLoaded);
            amplify.unsubscribe(BaseProjectsEvents.FILTER_ON_CHANGE, this._filtersChanged);

        },


        _updateTableDashboardModelValues: function () {
            this.tableDashboardModel.set(s.dashboardModel.LABEL, this.subview('title').getTitleAsLabel());
        },


        dispose: function () {

            this._unbindEventListeners();

            View.prototype.dispose.call(this, arguments);
        }

    });

    return ProjectsView;
});
