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
    'config/browse/config-oda',
    'config/browse/Config-oecd-fao',
    'config/browse/config-development-indicators',
    'lib/utils',
    'amplify',
    'bootstrap'
], function ($, $UI, View, TitleSubView, FilterSubView, DashboardOecdSubView ,DashboardIndicatorsSubView, DashboardModel, template, i18nLabels, E, BaseEvents, BrowseOecdConfig, BrowseOecdFaoSectorsConfig, BrowseIndicatorsConfig, Utils) {

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
        events: {
            TITLE_ADD_ITEM: 'fx.title.item.add',
            FAO_SECTOR_CHART_LOADED: 'fx.browse.chart.faosector.loaded',
            BAR_CHART_LOADED: 'fx.browse.chart.bar.loaded',
            SUB_SECTORS_FILTER_READY: 'fx.filters.list.subsectors.ready',
            TIMERANGE_FILTER_READY: 'fx.filters.list.timerange.ready',
            COUNTRY_FILTER_READY: 'fx.filters.list.recipients.ready',
            FILTER_ON_RESET: 'fx.filter.list.onreset'
        },
        topics: {
            COUNTRY: 'country',
            SECTOR: 'sector',
            DONOR: 'donor',
            COUNTRY_DONOR: 'country_donor'
        },

        dashboardModel: {
            COUNTRY:'selected_country',
            TOPIC: 'topic',
            LABEL: 'label'
        },
        ids: {
            RECIPIENT_COUNTRY: 'recipientcode',
            DONOR: 'donorcode'
        },
        datasetType: {
            oecd_uid: "adam_usd_commitment",
            writable: true
        },
        config_types: {
            FAO: 'FAO',
            BASE: 'BASE'
        }
    };

    var uidChanged =  false;

    /**
     *
     * Creates a new Browse By View
     * Browse By View comprises of a series of subviews: filter view and 2 dashboard views (development indicators and oda)
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
           // this.recipientcode =  params.recipientcode;
            uidChanged = false;
            this.datasetType = s.datasetType;

            // Change JQuery-UI plugin names to fix name collision with Bootstrap
           // $.widget.bridge('uitooltip', $.ui.tooltip);


            View.prototype.initialize.call(this, arguments);
        },

        getTemplateData: function () {
            return i18nLabels;
         },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            //update State
            amplify.publish(E.STATE_CHANGE, {menu: 'browse', breadcrumb: this._initMenuBreadcrumbItem()});

            this._initVariables();

            this._bindEventListeners();

        },

        render: function () {
            View.prototype.render.apply(this, arguments);

            this._initSubViews();
        },

        _initSubViews: function() {
            View.prototype.render.apply(this, arguments);

            var config = BrowseOecdConfig[this.browse_type];
            var configFao = BrowseOecdFaoSectorsConfig[this.browse_type];

            if (!config || !config.dashboard || !config.filter) {
                alert(" HERE Impossible to find configuration for topic: " + this.browse_type);
                return;
            }

            var titleSubView = new TitleSubView({autoRender: true, container: this.$el.find(s.css_classes.TITLE_BAR_ITEMS), title: i18nLabels.selections});
            this.subview('title', titleSubView);

            var filtersSubView = new FilterSubView({autoRender: true, container: this.$el.find(s.css_classes.FILTER_HOLDER), config: config.filter});
            this.subview('filters', filtersSubView);

            this.odaDashboardModel = new DashboardModel();

            //DASHBOARD 1: ODA
            this.baseDashboardConfig = config.dashboard,
            this.faoDashboardConfig = configFao.dashboard;

            var dashboardOecdSubView = new DashboardOecdSubView({autoRender: false, container: this.$el.find(s.css_classes.DASHBOARD_OECD_HOLDER), topic: this.browse_type, model:this.odaDashboardModel});
            dashboardOecdSubView.setDashboardConfig(this.baseDashboardConfig, s.config_types.BASE);

            this.subview('oecdDashboard', dashboardOecdSubView);

           //DASHBOARD 2: Development Indicators
            if(this.browse_type === s.topics.COUNTRY || this.browse_type === s.topics.DONOR) {

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

        _initMenuBreadcrumbItem: function() {
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



           amplify.subscribe(BaseEvents.FILTER_ON_READY, this, this._filtersLoaded);



            //======================================================================================
          //  amplify.subscribe(s.events.BAR_CHART_LOADED, this, this._barChartLoaded);

            //amplify.subscribe(s.events.SUB_SECTORS_FILTER_READY, this, this._subSectorFilterLoaded);
            //amplify.subscribe(s.events.TIMERANGE_FILTER_READY, this, this._timerangeFilterLoaded);
            //amplify.subscribe(s.events.COUNTRY_FILTER_READY, this, this._countryFilterLoaded);


            amplify.subscribe(BaseEvents.FILTER_ON_CHANGE, this, this._updateDashboard);

            amplify.subscribe(s.events.FILTER_ON_RESET, this, this._resetDashboard);



        },

        /**
         * When filters have all loaded, then the TitleView is built using the currently selected filters
         * @param selectedFilterItems
         * @private
         */
        _filtersLoaded: function (selectedFilterItems){

            console.log("CALLED _filtersLoaded ========== ", selectedFilterItems);

            this.subview('title').setLabels(selectedFilterItems);
            this.subview('title').build();

            this._setOdaDashboardModelValues();
            this.subview('oecdDashboard').renderDashboard();


            if(this.browse_type === s.topics.COUNTRY || this.browse_type === s.topics.DONOR){
                this._setIndicatorDashboardModelValues();
                this.subview('indicatorsDashboard').renderDashboard();
            }

        },


        /**
         * When a filter selection changes, each dashboard Sub View is refreshed
         * @param selected filter
         * @private
         */
        _updateDashboard: function (selectedfilter){
            console.log("=============== _updateDashboard 1 ");
            console.log(selectedfilter);

           var purposecodeItemHasChanged = false, recipientcodeItemHasChanged = false, parentsectorcodeItemHasChanged = false;


            if(selectedfilter) {
               var values = selectedfilter.values.values;



            amplify.publish(s.events.TITLE_ADD_ITEM, this._getTitleItem(selectedfilter));



            switch (this.subview('filters').isFAOSectorsSelected()) {
                    case true:
                        this.subview('oecdDashboard').setDashboardConfig(this.faoDashboardConfig, s.config_types.FAO);
                        break;
                    case false:
                        //console.log("=============== _updateDashboard 3 ");

                        this.subview('oecdDashboard').setDashboardConfig(this.baseDashboardConfig, s.config_types.BASE);
                        break;
                }

                if(selectedfilter.id === 'oda') {
                    this.datasetType.oecd_uid = selectedfilter.value;
                }

            //console.log("=============== _updateDashboard 3i ");


            if(selectedfilter.id === 'recipientcode') {
                    if(selectedfilter.regioncode)
                        this.regioncode = selectedfilter.regioncode;
                    else
                        this.regioncode = null;

                 recipientcodeItemHasChanged = true;
                }

                if(selectedfilter.id === 'purposecode') {
                    purposecodeItemHasChanged = true;
                }


                if(selectedfilter.id === 'parentsector_code') {
                    parentsectorcodeItemHasChanged = true;
                }


               this.removeItems = this.subview('filters').getConfigPropValue(selectedfilter.id, 'remove');


                        //original
                       // this.subview('oecdDashboard').updateDashboardConfig(this.datasetType.oecd_uid, this.subview('filters').isFilterSelected('parentsector_code'), this.subview('filters').isFilterSelected('purposecode'), this.subview('filters').isFilterSelected('recipientcode'), this.regioncode, this.removeItems);


                   this.subview('oecdDashboard').updateDashboardConfigNew(this.datasetType.oecd_uid, selectedfilter, this.removeItems);


                   this._setOdaDashboardModelValues();
                   var ovalues = this.subview('filters').getFilterValues();
                   this.subview('oecdDashboard').rebuildDashboard(ovalues);


                    if(this.browse_type === s.topics.COUNTRY || this.browse_type === s.topics.DONOR){
                        this._setIndicatorDashboardModelValues();
                        var ivalues = this.subview('filters').getIndicatorsValues();
                        this.subview('indicatorsDashboard').rebuildDashboard(ivalues);
                    }
            }
        },

        _getTitleItem: function(item){

            var titleItem = {}, labels = item.values.labels;

            titleItem.id = item.id;

            var key = Object.keys(labels)[0];
            titleItem.label = labels[key];

            return titleItem;
        },

        _unbindEventListeners: function () {

            amplify.unsubscribe(BaseEvents.FILTER_ON_READY, this._filtersLoaded);
            amplify.unsubscribe(BaseEvents.FILTER_ON_CHANGE, this._updateDashboard);


            //==================================
          // Remove listeners
          //  amplify.unsubscribe(s.events.BAR_CHART_LOADED, this._barChartLoaded);
            amplify.unsubscribe(s.events.SUB_SECTORS_FILTER_READY, this._subSectorFilterLoaded);
            amplify.unsubscribe(s.events.TIMERANGE_FILTER_READY, this._timerangeFilterLoaded);
            amplify.unsubscribe(s.events.COUNTRY_FILTER_READY, this._countryFilterLoaded);

            amplify.unsubscribe(s.events.FILTER_ON_RESET, this._resetDashboard);
        },

        _updateFixedTitle: function () {
            $(s.css_classes.TITLE_BAR_ITEMS_FIXED).empty();
            this.subview('title').cloneTitle().appendTo(s.css_classes.TITLE_BAR_ITEMS_FIXED);
        },


        _resetDashboard: function (resetItemName) {

            this.removeItems = this.subview('filters').getConfigPropValue(resetItemName, 'remove');

            if(this.removeItems){
              this.subview('oecdDashboard').showHiddenDashboardItems(this.removeItems);
              this.removeItems = null;
            }

            //console.log(this.subview('oecdDashboard'));
            this.subview('oecdDashboard').updateDashboardConfig(this.datasetType.oecd_uid, this.subview('filters').isFilterSelected('parentsector_code'), this.subview('filters').isFilterSelected('purposecode'),  this.subview('filters').isFilterSelected('recipientcode'), this.regioncode, this.removeItems);
            var ovalues = this.subview('filters').getOECDValues();

            //console.log(this.subview('title'));

            this.subview('title').removeItem(resetItemName);
            this._setOdaDashboardModelValues();

            this.subview('oecdDashboard').rebuildDashboard([ovalues]);

             if(this.browse_type === 'country' || this.browse_type === 'donor'){
               this._setIndicatorDashboardModelValues();

               console.log("RENDER CALLED: _resetDashboard ================");

              this.subview('indicatorsDashboard').renderDashboard();
             }


        },

        /** _updateIndicatorDashboardModel: function(key, value){
             this.dashboardModel.set(key, value);
         },**/


        _setIndicatorDashboardModelValues: function(){
            var country  = this.subview('title').getItemText(s.ids.RECIPIENT_COUNTRY);
            var donor = this.subview('title').getItemText(s.ids.DONOR);

            if(donor.length > 0)
                country = donor;

            this.indicatorsDashboardModel.set(s.dashboardModel.COUNTRY, country);
        },

        _setOdaDashboardModelValues: function(){
            this.odaDashboardModel.set(s.dashboardModel.LABEL, this.subview('title').getTitleAsArray());
        },

        backToTop: function(e) {

          e.preventDefault();
          e.stopPropagation();

          $('html, body').animate({scrollTop: 0}, 'slow');return false;

        },

        dispose: function () {

            this._unbindEventListeners();

            View.prototype.dispose.call(this, arguments);
        }

   });

    return BrowseByView;
});
