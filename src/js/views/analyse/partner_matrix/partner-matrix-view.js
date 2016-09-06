/*global define, amplify*/
define([
    'jquery',
    'jquery-ui',
    'views/base/view',
    'views/common/title-view',
    'views/analyse/partner_matrix/filter-view',
    'views/analyse/partner_matrix/dashboard-view',
    'models/analyse/dashboard',
    'text!templates/analyse/partner_matrix/partner-matrix.hbs',
    'i18n!nls/analyse',
    'config/Events',
    'config/Config',
    'config/browse/Events',
    'config/analyse/partner_matrix/config',
    'config/analyse/partner_matrix/config-by-topic',
    'config/analyse/partner_matrix/config-partner-matrix',
    'lib/utils',
    'amplify',
    'bootstrap',
    'underscore'
], function ($, $UI, View, TitleSubView, FilterSubView, DashboardSubView, DashboardModel, template, i18nLabels, Events, GeneralConfig, BaseBrowseEvents, Config, ConfigByTopic, BasePartnerMatrixConfig, Utils) {

    'use strict';

    var s = {
        css_classes: {
            TITLE_BAR_ITEMS: "#fx-title-items",
            BACK_TO_TOP_FIXED: "#analyse-partner-matrix-top-link-fixed",
            FILTER_HOLDER: "#analyse-partner-matrix-filter-holder",
            DASHBOARD_HOLDER: "#analyse-partner-matrix-content"
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

        events: {
            'click #backToTopBtn': 'backToTop'
        },

        initialize: function (params) {
            this.analyse_type = params.filter;
            this.browse_type = BasePartnerMatrixConfig.dashboard.DEFAULT_TOPIC;
            this.page = params.page;
            this.datasetType = GeneralConfig.DEFAULT_UID;
            this.topicConfig = ConfigByTopic[this.browse_type];

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
            require(['config/analyse/partner_matrix/config-' + this.browse_type], _.bind(this._initSubViews, this));
        },

        /**
         * Initializes all sub views: Title, Filters, oecd/oda Dashboard and Indicators Dashboard
         * @private
         */

        _initSubViews: function(Config) {
            View.prototype.render.apply(this, arguments);

            if (!Config || !Config.dashboard || !Config.filter) {
                alert("Impossible to find default dashboard/filter configuration for the topic: " + this.browse_type);
                return;
            }

            this.defaultDashboardConfig = Config;
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
            this.odaDashboardModel = new DashboardModel();

            // Set DASHBOARD Sub View
            var dashboardSubView = new DashboardSubView({
                autoRender: false,
                container: this.$el.find(s.css_classes.DASHBOARD_HOLDER),
                topic: this.browse_type,
                model: this.odaDashboardModel
            });
            dashboardSubView.setDashboardConfig(this.defaultDashboardConfig.dashboard);

            this.subview('dashboard', dashboardSubView);

        },

        _initMenuBreadcrumbItem: function() {
            var label = "";
            var self = this;

            if (typeof self.analyse_type !== 'undefined') {
                label = i18nLabels[self.analyse_type];
            }

            return Utils.createMenuBreadcrumbItem(label, self.analyse_type, self.page);
        },

        _initVariables: function () {
            // Initialize bootstrap affix: Locks ('sticks') section, appears when scrolling
            $(s.css_classes.BACK_TO_TOP_FIXED).affix({});

        },

        _bindEventListeners: function () {
            amplify.subscribe(BaseBrowseEvents.FILTER_ON_READY, this, this._filtersLoaded);
            amplify.subscribe(BaseBrowseEvents.FILTER_ON_CHANGE, this, this._updateDashboard);
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

        },


        /**
         * When a filter selection changes, each Dashboard and Title Sub View is rebuilt/refreshed
         * @param selected filter
         * @private
         */
        _updateDashboard: function (selectedfilter) {

            var ovalues = this.subview('filters').getFilterValues(), confPath, displayConfigForSelectedFilter, displayConfigForSelectedFilterValues, dashboardConfigChanged;

            console.log("================= _updateDashboard =============== ");
            console.log(ovalues);

            if (selectedfilter) {

                // If selected filter has a value
                if (selectedfilter.values.values.length > 0) {

                    // Update the TitleView (Add Item)
                    amplify.publish(Events.TITLE_ADD_ITEM, this._getTitleItem(selectedfilter));

                    // Configuration display (if appropriate)
                    if (this.topicConfig) {
                        displayConfigForSelectedFilter = this.topicConfig[selectedfilter.id];
                    }

                    // Update dashboard properties
                    if (selectedfilter['props']) {
                        this.subview('dashboard').setProperties(selectedfilter['props']);
                    }


                    this._setDashboardConfiguration(confPath, ovalues, displayConfigForSelectedFilter);

                }
                // Else selected filter has no value (i.e.there has been a de-selection/removal)
                else {

                    //console.log("================= _updateDashboard: "+selectedfilter.id+" is  0 =============== ");

                    // Update the TitleView (Remove Item)
                    amplify.publish(Events.TITLE_REMOVE_ITEM, selectedfilter.id);

                    // Re-configure display (if appropriate)
                    if (selectedfilter.dependencies && this.topicConfig) {
                        displayConfigForSelectedFilter = this.topicConfig[selectedfilter.dependencies[0]];
                    }

                }

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
            //console.log("================= _setDashboardConfiguration Start =============== ");
            //console.log(ovalues);

            if (confPath) {
                require(['config/analyse/' + confPath], function (dialog) {
                    self._rebuildDashboard(ovalues, displayConfigForSelectedFilter, dialog.dashboard);
                });
            } else {
                self._rebuildDashboard(ovalues, displayConfigForSelectedFilter, this.otherSectorsDashboardConfig);
            }
        },

        /**
         * Rebuild the dashboard
         * @param ovalues
         * @param displayConfigForSelectedFilter
         * @param dashboardConfig
         * @private
         */

        _rebuildDashboard: function (ovalues, displayConfigForSelectedFilter, dashboardConfig) {

            this.subview('dashboard').setDashboardConfig(dashboardConfig);


            // Hide/Show Dashboard Items
            this.subview('dashboard').updateDashboardTemplate(displayConfigForSelectedFilter);


            // Update Dashboard Model
            this._setDashboardModelValues();


            //console.log("================= _rebuildDashboard END =============== ");
            // console.log(ovalues);

            // Rebuild Dashboard
            this.subview('dashboard').rebuildDashboard(ovalues);

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
            amplify.unsubscribe(BaseBrowseEvents.FILTER_ON_READY, this._filtersLoaded);
            amplify.unsubscribe(BaseBrowseEvents.FILTER_ON_CHANGE, this._updateDashboard);
        },


        _setDashboardModelValues: function () {
            this.odaDashboardModel.set(s.dashboardModel.LABEL, this.subview('title').getTitleAsArray());
        },

        backToTop: function (e) {

            e.preventDefault();
            e.stopPropagation();

            $('html, body').animate({scrollTop: 0}, 'slow');
            return false;

        },

        dispose: function () {

            this._unbindEventListeners();

            View.prototype.dispose.call(this, arguments);
        }

    });

    return ResourcePartnerMatrixView;
});
