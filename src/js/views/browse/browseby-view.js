/*global define, amplify*/
define([
    'jquery',
    'jquery-ui',
    'views/base/view',
    'views/common/title-view',
    'views/browse/filter-view',
    'views/browse/dashboard-oecd-view',
    'views/browse/dashboard-indicators-view',
    'models/browse/dashboard',
    'text!templates/browse/browse.hbs',
    'i18n!nls/browse',
    'config/Events',
    'config/browse/Config-oecd',
    'config/browse/Config-oecd-fao',
    'config/browse/Config-indicators',
    'lib/utils',
    'amplify',
    'bootstrap'

], function ($, $UI, View, TitleSubView, FilterSubView, DashboardOecdSubView, DashboardIndicatorsSubView, DashboardModel, template, i18nLabels, E, BrowseOecdConfig, BrowseOecdFaoSectorsConfig, BrowseIndicatorsConfig, Utils) {

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
            SUB_SECTORS_FILTERS_READY: 'fx.filters.list.subsectors.ready',
            FILTER_ON_CHANGE: 'fx.filter.list.onchange',
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
            this.firstLoad = true;

            // Change JQuery-UI plugin names to fix name collision with Bootstrap
            $.widget.bridge('uitooltip', $.ui.tooltip);


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

            this.dashboardModel = new DashboardModel();

            //DASHBOARD 1
            this.baseDashboardConfig = config.dashboard,
            this.faoDashboardConfig = configFao.dashboard;

            var dashboardOecdSubView = new DashboardOecdSubView({autoRender: false, container: this.$el.find(s.css_classes.DASHBOARD_OECD_HOLDER), topic: this.browse_type, model:this.dashboardModel});
            dashboardOecdSubView.setDashboardConfig(this.baseDashboardConfig, s.config_types.BASE);

            this.subview('oecdDashboard', dashboardOecdSubView);

            //DASHBOARD 2, render indicators dashboard if browse_type =
            if(this.browse_type === s.topics.COUNTRY || this.browse_type === s.topics.DONOR){
                var configIndicators = BrowseIndicatorsConfig[this.browse_type];

                if (!configIndicators || !configIndicators.dashboard) {
                    alert("Impossible to find configuration for Indicators: ");
                    return;
                }

                this.indicatorsDashboardConfig = configIndicators.dashboard;

                var dashboardIndicatorsSubView = new DashboardIndicatorsSubView({autoRender: false, container: this.$el.find(s.css_classes.DASHBOARD_INDICATORS_HOLDER), topic: this.browse_type, model:this.dashboardModel});
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
          // $(s.css_classes.TITLE_BAR_ITEMS_FIXED).affix({});
          $(s.css_classes.BACK_TO_TOP_FIXED).affix({});
           //$('#test').affix({});


            //DELETE THIS --- updated in updateDashboard
           //$(s.css_classes.TITLE_BAR_ITEMS_FIXED).empty();
           //$('ul[class*="fx-title-items"]').clone().removeClass('list-inline fx-title-resume').appendTo(s.css_classes.TITLE_BAR_ITEMS_FIXED);

        },

        _bindEventListeners: function () {

            amplify.subscribe(s.events.FAO_SECTOR_CHART_LOADED, this, this._sectorChartLoaded);

          //  amplify.subscribe(s.events.BAR_CHART_LOADED, this, this._barChartLoaded);

            amplify.subscribe(s.events.SUB_SECTORS_FILTERS_READY, this, this._subSectorFilterLoaded);

            amplify.subscribe(s.events.FILTER_ON_CHANGE, this, this._updateDashboard);

            amplify.subscribe(s.events.FILTER_ON_RESET, this, this._resetDashboard);


        },

        _updateDashboard: function (item){
           // console.log("=============== _updateDashboard ");
            amplify.publish(s.events.TITLE_ADD_ITEM, item);
           // this.subview('title').show();
           // this._updateFixedTitle();


           // if(!this.firstLoad) {
                switch (this.subview('filters').isFAOSectorsSelected()) {
                    case true:
                        this.subview('oecdDashboard').setDashboardConfig(this.faoDashboardConfig, s.config_types.FAO);
                        break;
                    case false:
                        this.subview('oecdDashboard').setDashboardConfig(this.baseDashboardConfig, s.config_types.BASE);
                        break;
                }

                if(item.name === 'uid') {
                    this.datasetType.oecd_uid = item.value;
                }

                if(item.name === 'recipientcode') {
                    if(item.regioncode)
                        this.regioncode = item.regioncode;
                    else
                        this.regioncode = null;
                }

                //if(item.name === 'recipientcode') {
                 // console.log('recipientcode has been activated');
               // }

               //this.removeItems = this.subview('filters').getConfigPropValue(item.name, 'remove');

            // console.log(item.name, this.removeItems);

                // REBUILD DASHBOARD 1
               if(!this.firstLoad  && item.name != 'parentsector_code') {
                  // var regionValue = this.subview('filters').getRecipentRegionValue();
                   this.subview('oecdDashboard').updateDashboardConfig(this.datasetType.oecd_uid, this.subview('filters').isFilterSelected('parentsector_code'), this.subview('filters').isFilterSelected('purposecode'), this.subview('filters').isFilterSelected('recipientcode'), this.regioncode, this.removeItems);
                   this._setDashboardModelValues();
                   var ovalues = this.subview('filters').getOECDValues();
                   this.subview('oecdDashboard').rebuildDashboard([ovalues]);
               }

                // REBUILD DASHBOARD 2
                if(this.browse_type === s.topics.COUNTRY || this.browse_type === s.topics.DONOR){
                  //  if(item.name === 'recipientcode' || item.name === 'donorcode') {
                        this._setIndicatorDashboardModelCountry();
                        var ivalues = this.subview('filters').getIndicatorsValues();
                        this.subview('indicatorsDashboard').rebuildDashboard([ivalues]);
                  //  }
                }
          //  }
        },

        _unbindEventListeners: function () {
          // Remove listeners
            amplify.unsubscribe(s.events.FAO_SECTOR_CHART_LOADED, this._sectorChartLoaded);
          //  amplify.unsubscribe(s.events.BAR_CHART_LOADED, this._barChartLoaded);
            amplify.unsubscribe(s.events.SUB_SECTORS_FILTERS_READY, this._subSectorFilterLoaded);
            amplify.unsubscribe(s.events.FILTER_ON_CHANGE, this._updateDashboard);
            amplify.unsubscribe(s.events.FILTER_ON_RESET, this._resetDashboard);
        },

        _updateFixedTitle: function () {
            $(s.css_classes.TITLE_BAR_ITEMS_FIXED).empty();
            this.subview('title').cloneTitle().appendTo(s.css_classes.TITLE_BAR_ITEMS_FIXED);
        },

        _sectorChartLoaded: function (chart) {
            //console.log(chart.series[0].name);
            //var isPurposes = this.subview('filters').isFilterSelected('purposecode');
            //console.log(isPurposes);

            //if((chart.series[0].name).trim() == "Million USD")    {
             //   chart.series[0].update({name: "FAO-Related Sectors"}, false);
              //  chart.redraw();
           // }


            // centre the chart bar
            // chart.series[1].points[3].graphic.translate(-10,0);


        },

      _subSectorFilterLoaded: function (chart) {
         //  console.log("SUB SECTOR FILTER LOADED ");
            if(this.firstLoad) {
                 this.firstLoad = false;
                // show title
               // this.subview('title').show();


                this._setDashboardModelValues();
                this.subview('oecdDashboard').renderDashboard();

               // if(this.browse_type === 'country_sector' || this.browse_type === 'donor_sector'){
                 //   this._setIndicatorDashboardModelCountry();
                  //  this.subview('indicatorsDashboard').renderDashboard();
               // }

            }
            else {
                    this.subview('oecdDashboard').updateDashboardConfig(this.datasetType.oecd_uid, this.subview('filters').isFilterSelected('parentsector_code'), this.subview('filters').isFilterSelected('purposecode'),  this.subview('filters').isFilterSelected('recipientcode'), this.regioncode, this.removeItems);
                    this._setDashboardModelValues();
                    var ovalues = this.subview('filters').getOECDValues();
                    this.subview('oecdDashboard').rebuildDashboard([ovalues]);
            }
        },

        _resetDashboard: function (resetItem) {
          //  console.log("============ RESET DASHBOARD =====");


            //console.log(this.subview('oecdDashboard'));
            this.subview('oecdDashboard').updateDashboardConfig(this.datasetType.oecd_uid, this.subview('filters').isFilterSelected('parentsector_code'), this.subview('filters').isFilterSelected('purposecode'),  this.subview('filters').isFilterSelected('recipientcode'), this.regioncode, this.removeItems);
            var ovalues = this.subview('filters').getOECDValues();

            //console.log(this.subview('title'));

            this.subview('title').removeItem(resetItem);
            this._setDashboardModelValues();

            this.subview('oecdDashboard').rebuildDashboard([ovalues]);
        },

        /** _updateIndicatorDashboardModel: function(key, value){
             this.dashboardModel.set(key, value);
         },**/

        _updateDashboardModel: function(key, value){
            this.dashboardModel.set(key, value);
        },

        _setIndicatorDashboardModelCountry: function(){
            var country = this.subview('title').getItemText(s.ids.RECIPIENT_COUNTRY);
            var donor = this.subview('title').getItemText(s.ids.DONOR);

            if(donor.length > 0)
                this._updateDashboardModel(s.dashboardModel.COUNTRY, donor);
            else
                this._updateDashboardModel(s.dashboardModel.COUNTRY, country);

        },

        _setDashboardModelValues: function(){
            // console.log("_setDashboardModelValues ", this.subview('title').getTitleAsArray());
             this._updateDashboardModel(s.dashboardModel.LABEL, this.subview('title').getTitleAsArray());
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
