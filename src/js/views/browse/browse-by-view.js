/*global define, amplify*/
define([
    'jquery',
    'jquery-ui',
    'views/base/view',
    'views/common/title-view',
    'views/browse/filter-view',
    'views/browse/oda-dashboard-view',
    'views/browse/development-indicators-dashboard-view',
    'models/browse/dashboard',
    'text!templates/browse/browse.hbs',
    'i18n!nls/browse',
    'config/Events',
    'config/browse/Events',
    'config/browse/config-development-indicators',
    'config/browse/config-by-topic',
    'config/browse/config-by-filter-values',
    'config/browse/config-browse',
    'lib/utils',
    'amplify',
    'bootstrap',
    'underscore'
], function ($, $UI, View, TitleSubView, FilterSubView, DashboardOecdSubView, DashboardIndicatorsSubView, DashboardModel, template, i18nLabels, Events, BaseBrowseEvents, BrowseIndicatorsConfig, ConfigByTopic, ConfigByFilterValues, BaseBrowseConfig, Utils) {

    'use strict';

    var s = {
        css_classes: {
            TITLE_BAR: "#fx-title",
            TITLE_BAR_ITEMS: "#fx-title-items",
            TITLE_BAR_ITEMS_FIXED: "#browse-title-bar-fixed",
            BACK_TO_TOP_FIXED: "#browse-top-link-fixed",
            FILTER_HOLDER: "#browse-filter-holder",
            DASHBOARD_OECD_HOLDER: "#browse-oecd-content",
            DASHBOARD_INDICATORS_HOLDER: "#browse-indicator-content"
        },
        dashboardModel: {
            COUNTRY: 'selected_country',
            TOPIC: 'topic',
            LABEL: 'label'
        }
    };


    /**
     *
     * Creates a new Browse By View
     * Browse By View comprises of a series of subviews: filter view and 2 dashboard views (development indicators and oecd/oda)
     * @class BrowseByView
     * @extends View
     */
    var BrowseByView = View.extend({

        // Automatically render after initialize
        autoRender: true,

        className: 'browse',

        // Save the template string in a prototype property.
        // This is overwritten with the compiled template function.
        // In the end you might want to used precompiled templates.
        template: template,

        events: {
            'click #backToTopBtn': 'backToTop'
        },

        initialize: function (params) {
            this.browse_type = params.filter;
            this.page = params.page;
            this.datasetType = BaseBrowseConfig.dashboard.DEFAULT_UID;
            this.topicConfig = ConfigByTopic[this.browse_type];
            this.filterValuesConfig = ConfigByFilterValues[this.browse_type];

            View.prototype.initialize.call(this, arguments);
        },

        getTemplateData: function () {
            return i18nLabels;
        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            //update State
            amplify.publish(Events.STATE_CHANGE, {menu: 'browse', breadcrumb: this._initMenuBreadcrumbItem()});

            this._initVariables();

            this._bindEventListeners();

        },

        render: function () {
            View.prototype.render.apply(this, arguments);

            this._loadDashboardConfigurations();
        },


        /**
         * Based on the view the appropriate JS configuration files are loaded via requireJS
         * @private
         */
        _loadDashboardConfigurations: function () {
            require(['config/browse/config-other-' + this.browse_type, 'config/browse/config-fao-' + this.browse_type], _.bind(this._initSubViews, this));
        },


        /**
         * Initializes all sub views: Title, Filters, oecd/oda Dashboard and Indicators Dashboard
         * @private
         */

        _initSubViews: function (ConfigOther, ConfigFAO) {

            if (!ConfigOther || !ConfigOther.dashboard || !ConfigOther.filter) {
                alert("Impossible to find default ODA dashboard/filter configuration for the topic: " + this.browse_type);
                return;
            }

            if (!ConfigFAO || !ConfigFAO.dashboard || !ConfigFAO.filter) {
                alert("Impossible to find default FAO dashboard/filter configuration for the topic: " + this.browse_type);
                return;
            }

            this.otherSectorsDashboardConfig = ConfigOther.dashboard;
            this.faoSectorDashboardConfig = ConfigFAO.dashboard;


            //Set default dashboard configuration
            if (ConfigOther.id === BaseBrowseConfig.dashboard.DEFAULT_CONFIG) {
                this.defaultDashboardConfig = ConfigOther;
            } else if (ConfigFAO.id === BaseBrowseConfig.dashboard.DEFAULT_CONFIG) {
                this.defaultDashboardConfig = ConfigFAO;
            }


            var titleSubView = new TitleSubView({
                autoRender: true,
                container: this.$el.find(s.css_classes.TITLE_BAR_ITEMS),
                title: i18nLabels.selections
            });
            this.subview('title', titleSubView);

            var filtersSubView = new FilterSubView({
                autoRender: true,
                container: this.$el.find(s.css_classes.FILTER_HOLDER),
                config: this.defaultDashboardConfig.filter
            });
            this.subview('filters', filtersSubView);

            this.odaDashboardModel = new DashboardModel();

            //DASHBOARD 1: ODA
            var dashboardOecdSubView = new DashboardOecdSubView({
                autoRender: false,
                container: this.$el.find(s.css_classes.DASHBOARD_OECD_HOLDER),
                topic: this.browse_type,
                model: this.odaDashboardModel
            });
            dashboardOecdSubView.setDashboardConfig(this.defaultDashboardConfig.dashboard);

            this.subview('oecdDashboard', dashboardOecdSubView);

            //DASHBOARD 2: Development Indicators
            if (this.browse_type === BaseBrowseConfig.topic.BY_COUNTRY || this.browse_type === BaseBrowseConfig.topic.BY_RESOURCE_PARTNER) {

                var configIndicators = BrowseIndicatorsConfig[this.browse_type];

                if (!configIndicators || !configIndicators.items) {
                    alert("Impossible to find configuration for Development Indicators: ");
                    return;
                }

                this.indicatorsDashboardConfig = configIndicators;
                this.indicatorsDashboardModel = new DashboardModel();

                var dashboardIndicatorsSubView = new DashboardIndicatorsSubView({
                    autoRender: false,
                    container: this.$el.find(s.css_classes.DASHBOARD_INDICATORS_HOLDER),
                    topic: this.browse_type,
                    model: this.indicatorsDashboardModel
                });
                dashboardIndicatorsSubView.setDashboardConfig(this.indicatorsDashboardConfig);

                this.subview('indicatorsDashboard', dashboardIndicatorsSubView);

            }

        },

        /**
         * Create the breadcrumb for the menu, indicating the current browse by view
         * @private
         */
        _initMenuBreadcrumbItem: function () {
            var label = "";
            var self = this;

            if (typeof self.browse_type !== 'undefined') {
                label = i18nLabels[self.browse_type];
            }

            return Utils.createMenuBreadcrumbItem(label, self.browse_type, self.page);
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

            if (payload["props"]) {
                this.subview('oecdDashboard').setProperties(payload["props"]);
            }

            this.subview('title').setLabels(selectedFilterItems);
            this.subview('title').build();

            this._setOdaDashboardModelValues();

            this.subview('oecdDashboard').renderDashboard();

            if (this.browse_type === BaseBrowseConfig.topic.BY_COUNTRY || this.browse_type === BaseBrowseConfig.topic.BY_RESOURCE_PARTNER) {
                this._setIndicatorDashboardModelValues();
                this.subview('indicatorsDashboard').renderDashboard();
            }

        },


        /**
         * When a filter selection changes, each Dashboard and Title Sub View is rebuilt/refreshed
         * @param selected filter
         * @private
         */
        _updateDashboard: function (selectedfilter) {

            var ovalues = this.subview('filters').getFilterValues(), confPath, displayConfigForSelectedFilter, displayConfigForSelectedFilterValues, dashboardConfigChanged;

            //console.log("================= _updateDashboard =============== ");
            //console.log(ovalues);

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
                        this.subview('oecdDashboard').setProperties(selectedfilter['props']);
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

                    if (this.filterValuesConfig) {
                        displayConfigForSelectedFilterValues = this.filterValuesConfig[selectedfilter.id];
                        var item = _.find(displayConfigForSelectedFilterValues, function (item) {
                            return item.value === "";
                        });

                        if (item && item.config) {
                            confPath = item.config.path;

                            if (item.display)
                                displayConfigForSelectedFilter = item.display;
                        }
                    }


                    if (confPath || displayConfigForSelectedFilter)
                        this._setDashboardConfiguration(confPath, ovalues, displayConfigForSelectedFilter);
                }

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
                require(['config/browse/' + confPath], function (dialog) {
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

            // Set Sector Related Dashboard Configuration
            switch (this.subview('filters').isFAOSectorsSelected()) {
                case true:
                    //  console.log(this.faoSectorDashboardConfig);
                    this.subview('filters').clearFilterValue(BaseBrowseConfig.filter.SECTOR, ovalues);
                    this.subview('oecdDashboard').setDashboardConfig(this.faoSectorDashboardConfig);
                    break;
                case false:
                    this.subview('oecdDashboard').setDashboardConfig(dashboardConfig);
                    break;
            }


            // Hide/Show Dashboard Items
            this.subview('oecdDashboard').updateDashboardTemplate(displayConfigForSelectedFilter);

            // Update Dashboard Items Configuration
            this.subview('oecdDashboard').updateItemsConfig();

            // Update Dashboard Model
            this._setOdaDashboardModelValues();


            //console.log("================= _rebuildDashboard END =============== ");
            // console.log(ovalues);

            // Rebuild OECD Dashboard
            this.subview('oecdDashboard').rebuildDashboard(ovalues);

            // Rebuild Development Indicators Dashboard
            if (this.browse_type === BaseBrowseConfig.topic.BY_COUNTRY || this.browse_type === BaseBrowseConfig.topic.BY_RESOURCE_PARTNER) {
                this._setIndicatorDashboardModelValues();
                var ivalues = this.subview('filters').getIndicatorsValues();
                this.subview('indicatorsDashboard').rebuildDashboard(ivalues);
            }

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


        _setIndicatorDashboardModelValues: function () {
            var country = this.subview('title').getItemText(BaseBrowseConfig.filter.RECIPIENT_COUNTRY);
            var donor = this.subview('title').getItemText(BaseBrowseConfig.filter.RESOURCE_PARTNER);

            if (donor.length > 0)
                country = donor;

            this.indicatorsDashboardModel.set(s.dashboardModel.COUNTRY, country);
        },

        _setOdaDashboardModelValues: function () {
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

    return BrowseByView;
});
