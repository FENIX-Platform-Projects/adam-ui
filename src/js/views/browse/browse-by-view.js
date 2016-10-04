/*global define, amplify*/
define([
    'jquery',
    'jquery-ui',
    'views/base/view',
    'views/common/title-view',
    'views/browse/filter-view',
    'views/browse/oecd-dashboard-view',
    'views/browse/development-indicators-dashboard-view',
    'models/browse/dashboard',
    'text!templates/browse/browse.hbs',
    'i18n!nls/browse',
    'config/Events',
    'config/Config',
    'config/browse/Events',
    'config/browse/dashboards/indicators/config-development-indicators',
    'config/browse/display/config-by-filter-selections',
    'config/browse/config-browse',
    'lib/utils',
    'amplify',
    'bootstrap',
    'underscore'
], function ($, $UI, View, TitleSubView, FilterSubView, DashboardOecdSubView, DashboardIndicatorsSubView, DashboardModel, template, i18nLabels, Events, GeneralConfig, BaseBrowseEvents, BrowseIndicatorsConfig, DisplayConfigByFilterSelections, BaseBrowseConfig, Utils) {

    'use strict';

    var s = {
        css_classes: {
            TITLE_BAR_ITEMS: "#fx-title-items",
            BACK_TO_TOP_FIXED: "#browse-top-link-fixed",
            FILTER_HOLDER: "#browse-filter-holder",
            DASHBOARD_OECD_HOLDER: "#browse-oecd-content",
            DASHBOARD_INDICATORS_HOLDER: "#browse-indicator-content"
        },
        dashboardModel: {
            COUNTRY: 'selected_country',
            TOPIC: 'topic',
            LABEL: 'label'
        },
        values: {
            ALL: 'all'
        },
        paths: {
            OECD_DASHBOARD_FAO_SECTORS_CONFIG: 'config/browse/dashboards/oecd/fao_sectors/config-',
            OECD_DASHBOARD_OTHER_SECTORS_CONFIG: 'config/browse/dashboards/oecd/other_sectors/config-',
            OECD_DASHBOARD: 'config/browse/dashboards/oecd/',
            DISPLAY: 'config/browse/display/'
        }
    };


    /**
     *
     * Creates a new Browse By View
     * Browse By View comprises of a series of subviews: title view, filter view and 2 dashboard views (development indicators and oecd)
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
            this.datasetType = GeneralConfig.DEFAULT_UID;


            // Display can be configured based on the current Browse Type filter selections: i.e. Hide/Show dashboard items based on the current Browse type and/or selected filter values
            this.filterSelectionsTypeDisplayConfig = DisplayConfigByFilterSelections[this.browse_type];

            View.prototype.initialize.call(this, arguments);
        },

        getTemplateData: function () {
            return i18nLabels;
        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            this.$el = $(this.el);

            //update State
            amplify.publish(Events.STATE_CHANGE, {menu: 'browse', breadcrumb: this._createMenuBreadcrumbItem()});

            this._initVariables();

            this._bindEventListeners();

        },

        render: function () {
            View.prototype.render.apply(this, arguments);

            this._loadDashboardConfigurations();
        },


        /**
         * Based on the browse type, which is determined by the selected browse by section
         * the appropriate dashboard JS configuration files are loaded via requireJS
         * @private
         */
        _loadDashboardConfigurations: function () {
            require([s.paths.OECD_DASHBOARD_OTHER_SECTORS_CONFIG + this.browse_type, s.paths.OECD_DASHBOARD_FAO_SECTORS_CONFIG + this.browse_type], _.bind(this._initSubViews, this));
        },



        /**
         * Initializes all sub views: Title, Filter, oecd/oda Dashboard and Indicators Dashboard
         * @param ConfigOtherSectors Other Sectors configuration
         * @param ConfigFAOSectors FAO sectors configuration
         * @private
         */

        _initSubViews: function (ConfigOtherSectors, ConfigFAOSectors) {

            if (!ConfigOtherSectors || !ConfigOtherSectors.dashboard || !ConfigOtherSectors.filter) {
                alert("Impossible to find default ODA dashboard/filter configuration for the topic: " + this.browse_type);
                return;
            }

            if (!ConfigFAOSectors || !ConfigFAOSectors.dashboard || !ConfigFAOSectors.filter) {
                alert("Impossible to find default FAO dashboard/filter configuration for the topic: " + this.browse_type);
                return;
            }

            this.otherSectorsDashboardConfig = ConfigOtherSectors.dashboard;
            this.faoSectorDashboardConfig = ConfigFAOSectors.dashboard;


            //Set default dashboard configuration
            if (ConfigOtherSectors.id === BaseBrowseConfig.dashboard.DEFAULT_CONFIG) {
                this.defaultDashboardConfig = ConfigOtherSectors;
            } else if (ConfigFAOSectors.id === BaseBrowseConfig.dashboard.DEFAULT_CONFIG) {
                this.defaultDashboardConfig = ConfigFAOSectors;
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
                config: this.defaultDashboardConfig.filter
            });
            this.subview('filters', filtersSubView);

            // Set ODA DASHBOARD Model
            this.odaDashboardModel = new DashboardModel();

            // Set DASHBOARD 1 Sub View: ODA
            var dashboardOecdSubView = new DashboardOecdSubView({
                autoRender: false,
                container: this.$el.find(s.css_classes.DASHBOARD_OECD_HOLDER),
                topic: this.browse_type,
                model: this.odaDashboardModel
            });
            dashboardOecdSubView.setDashboardConfig(this.defaultDashboardConfig.dashboard);

            this.subview('oecdDashboard', dashboardOecdSubView);

            // Set DASHBOARD 2 Sub View: Development Indicators
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
         * Create the Menu breadcrumb item for the page
         * @private
         */
        _createMenuBreadcrumbItem: function () {
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
            amplify.subscribe(BaseBrowseEvents.FILTER_ON_CHANGE, this, this._filtersChanged);
        },

        /**
         * When the filters have all loaded the TitleView is built using the currently selected filter values
         * and the dashboards are rendered
         * @param payload Selected Filter Items
         * @private
         */
        _filtersLoaded: function (payload) {

            var selectedFilterItems = payload.labels, displayConfigForFilter, dashboardConfPath;

            // Set Dashboard 1 (ODA) Properties
            if (payload["props"]) {
                this.subview('oecdDashboard').setProperties(payload["props"]);
            }

            // Build Title View
            this.subview('title').setLabels(selectedFilterItems);
            this.subview('title').build();

            // Set ODA Dashboard Model Values
            this._setOdaDashboardModelValues();

            var allFilterValues = this.subview('filters').getFilterValues();

            for (var idx in allFilterValues.values){
                displayConfigForFilter = this.filterSelectionsTypeDisplayConfig[idx];
                var filterValue = allFilterValues.values[idx][0];

                if(displayConfigForFilter) {

                 //   console.log("========================= displayConfigForFilter ");
                 //   console.log(displayConfigForFilter);

                    var item = this._checkConfigForValue(displayConfigForFilter, filterValue);

                    /*var item = _.find(displayConfigForFilter, function (item) {
                        if(item.value){
                            return item.value === filterValue ? item : item.value === null;
                        }
                    });*/



                    if (item) {
                        displayConfigForFilter = item;

                        if(item.config) {
                            dashboardConfPath = item.config.path;
                            break;
                        }

                    }
                }
            }

           // console.log("============== PROPS ============== ");
           // console.log(": display config = ", displayConfigForFilter, " dashboard config = ", dashboardConfPath);


            this._getDashboardConfiguration(dashboardConfPath, allFilterValues, displayConfigForFilter);

            // Render Dashboard 1: ODA
           // this.subview('oecdDashboard').renderDashboard();

            // Render Dashboard 2: Development Indicators (if appropriate)
            if (this.browse_type === BaseBrowseConfig.topic.BY_COUNTRY || this.browse_type === BaseBrowseConfig.topic.BY_RESOURCE_PARTNER) {
                this._setIndicatorDashboardModelValues();
                this.subview('indicatorsDashboard').renderDashboard();
            }

        },


        /**
         * When a filter selection changes the view is updated
         * @param changedFilter The filter which has changed
         * @private
         */
        _filtersChanged: function (changedFilter) {

            var allFilterValues = this.subview('filters').getFilterValues();

            this._updateView(changedFilter, allFilterValues);


            // console.log("================= _updateDashboard =============== ");
           // console.log(this.subview('filters'));

          //  var ovalues = this.subview('filters').getFilterValues(), confPath, displayConfigForSelectedFilter, displayConfigForSelectedFilterValues, dashboardConfigChanged;

            //console.log("================= _updateDashboard =============== ");
            //console.log(ovalues);


        },

        /**
         * Each Dashboard and Title Sub View is rebuilt/refreshed
         * @param changedFilter The filter which has changed
         * @param allFilterValues All (selected) filter values
         * @private
         */

        _updateView: function (changedFilter, allFilterValues) {

            var filterValues = allFilterValues;

            var dashboardConfPath, displayConfigForFilter;


            // console.log("================= filter values =============== ");
            // console.log(filterValues);

           // console.log("================= selectedfilter =============== ");
           // console.log(changedFilter);

            if (changedFilter) {

                // If selected filter has a value
                if (changedFilter.values.values.length > 0) {

                    var displayConfig = this.filterSelectionsTypeDisplayConfig[changedFilter.id];


                    if(displayConfig) {
                        displayConfigForFilter = this.filterSelectionsTypeDisplayConfig[changedFilter.id];
                    }


                    // Re-configure display (if appropriate)
                    if (this.filterSelectionsTypeDisplayConfig) {

                        // All is selected
                        if (changedFilter.values.values[0] === s.values.ALL) {

                            if(changedFilter.dependencies) {
                                // get the display configuration for the dependency
                                // e.g. When All Sub sectors selected, the view rebuilt with Sector (i.e. dependency) display
                                displayConfigForFilter = this.filterSelectionsTypeDisplayConfig[changedFilter.dependencies[0]];
                            }


                            // Update the TitleView (Remove Item)
                            amplify.publish(Events.TITLE_REMOVE_ITEM, changedFilter.id);

                        } else {
                            // Update the TitleView (Add Item)
                            amplify.publish(Events.TITLE_ADD_ITEM, this._createTitleItem(changedFilter));
                        }

                         if(displayConfig) {

                        //    console.log(changedFilter.id, changedFilter.values.values[0]);


                            var item = this._checkConfigForValue(displayConfig, changedFilter.values.values[0]);


                           //  console.log(item);


                           /* var item = _.find(displayConfig, function (item) {
                                console.log(item, changedFilter.values.values[0]);

                                if(item.value){
                                    return item.value === changedFilter.values.values[0] ? item : item.value === null;
                                }

                                //return item.value === changedFilter.values.values[0] ? item : item.value === null;
                            });*/

                            if (item) {
                                 displayConfigForFilter = item;

                                 if(item.config)
                                   dashboardConfPath = item.config.path;
                            } else{
                                var defaultItem = this._getDefaultLayout(displayConfig);

                              //  console.log(defaultItem);

                                if(defaultItem)
                                     displayConfigForFilter = defaultItem;
                             }
                        }
                    }

                    //console.log("============== PROPS ============== ");
                   // console.log(changedFilter.id, ": display config = ", displayConfigForFilter, " dashboard config = ", dashboardConfPath);


                    // Update dashboard properties
                    if (changedFilter['props']) {
                        this.subview('oecdDashboard').setProperties(changedFilter['props']);
                    }

                    this._getDashboardConfiguration(dashboardConfPath, filterValues, displayConfigForFilter);

                }
            }


         /*       // Else selected filter has no value (i.e.there has been a de-selection/removal)
                else {

                    //console.log("================= _updateDashboard: "+changedFilter.id+" is  0 =============== ");

                    // Update the TitleView (Remove Item)
                    amplify.publish(Events.TITLE_REMOVE_ITEM, changedFilter.id);

                    // Re-configure display (if appropriate)
                    if (changedFilter.dependencies && this.browseTypeDisplayConfig) {
                        displayConfigForSelectedFilter = this.browseTypeDisplayConfig[changedFilter.dependencies[0]];
                    }

                    if (this.selectedValuesDisplayConfig) {
                        displayConfigForSelectedFilterValues = this.selectedValuesDisplayConfig[changedFilter.id];
                        var item = _.find(displayConfigForSelectedFilterValues, function (item) {
                            return item.value === "";
                        });

                        if (item && item.config) {
                            confPath = item.config.path;

                            if (item.display)
                                displayConfigForSelectedFilter = item.display;
                        }
                    }


                    // if (confPath || displayConfigForSelectedFilter)
                    // this._setDashboardConfiguration(confPath, ovalues, displayConfigForSelectedFilter);
                }

                this._getDashboardConfiguration(confPath, filterValues, displayConfigForSelectedFilter);

            }*/


        },


        _checkConfigForValue: function (config, filterValue){
                return _.find(config, function (item) {

                    if(item.value){
                        return item.value === filterValue;
                        // return item.value === filterValue ? item : item.value === "";
                    }
                });
        },

        _getDefaultLayout: function (config){
            return _.find(config, function (item) {
                if(item.layout){
                    return item.layout === "default";
                }
            });
        },

        /**
         * Get the appropriate Dashboard JS configuration file via requireJS, if the topic has changed
         * @param topic
         * @param filterValues
         * @private
         */

        /**
         * Load the appropriate JS configuration file via require, if appropriate
         * @param dashboardConfPath
         * @param filterValues
         * @param displayConfigForSelectedFilter
         * @private
         */
        _getDashboardConfiguration: function (dashboardConfPath, filterValues, displayConfigForSelectedFilter) {
            var self = this;
            //console.log("================= _setDashboardConfiguration Start =============== ");
            //console.log(ovalues);

            if (dashboardConfPath) {
                require([s.paths.OECD_DASHBOARD + dashboardConfPath], function (NewDashboardConfig) {
                    self._rebuildDashboard(filterValues, displayConfigForSelectedFilter, NewDashboardConfig.dashboard);
                });
            } else {
                self._rebuildDashboard(filterValues, displayConfigForSelectedFilter, this.otherSectorsDashboardConfig);
            }
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
            this.subview('oecdDashboard').rebuildDashboard(ovalues, displayConfigForSelectedFilter);

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
            amplify.unsubscribe(BaseBrowseEvents.FILTER_ON_CHANGE, this._filtersChanged);
        },


        _setIndicatorDashboardModelValues: function () {
            var country = this.subview('title').getItemText(BaseBrowseConfig.filter.RECIPIENT_COUNTRY);
            var donor = this.subview('title').getItemText(BaseBrowseConfig.filter.RESOURCE_PARTNER);

            if (donor.length > 0)
                country = donor;

            this.indicatorsDashboardModel.set(s.dashboardModel.COUNTRY, country);
        },

        _setOdaDashboardModelValues: function () {
            this.odaDashboardModel.set(s.dashboardModel.LABEL, this.subview('title').getTitleAsLabel());
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
