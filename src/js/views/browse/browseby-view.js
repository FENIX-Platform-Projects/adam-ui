/*global define, amplify*/
define([
    'jquery',
    'jquery-ui',
    'views/base/view',
    'views/common/title-view',
    'views/browse/filter-view',
    'views/browse/dashboard-oecd-view',
    'views/browse/dashboard-indicators-view',
    'models/browse/indicators',
    'text!templates/browse/browse.hbs',
    'i18n!nls/browse',
    'config/Events',
    'config/browse/Config-oecd',
    'config/browse/Config-oecd-fao',
    'config/browse/Config-indicators',
    'lib/utils',
    'amplify'

], function ($, $UI, View, TitleSubView, FilterSubView, DashboardOecdSubView, DashboardIndicatorsSubView, IndicatorsModel, template, i18nLabels, E, BrowseOecdConfig, BrowseOecdFaoSectorsConfig, BrowseIndicatorsConfig, Utils) {

    'use strict';

    var s = {
        css_classes: {
            TITLE_BAR: "#fx-title",
            TITLE_BAR_ITEMS: "#fx-title-items",
            FILTER_HOLDER: "#browse-filter-holder",
            DASHBOARD_OECD_HOLDER: "#browse-oecd-content",
            DASHBOARD_INDICATORS_HOLDER: "#browse-indicator-content"
        },
        events: {
            TITLE_ADD_ITEM: 'fx.title.item.add',
            FAO_SECTOR_CHART_LOADED: 'fx.browse.chart.faosector.loaded',
            SUB_SECTORS_FILTERS_READY: 'fx.filters.list.subsectors.ready',
            FILTER_ON_CHANGE: 'fx.filter.list.onchange'
        },
        indicatorDashboardModel: {
            COUNTRY:'country',
            TOPIC: 'topic'
        },
        ids: {
            RECIPIENT_COUNTRY: 'recipientcode',
            DONOR: 'donorcode'
        },
        datasetType: {
            oecd_uid: "adam_usd_commitment",
            writable: true
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

            //DASHBOARD 1
            this.baseDashboardConfig = config.dashboard, this.faoDashboardConfig = configFao.dashboard;
            var dashboardOecdSubView = new DashboardOecdSubView({autoRender: true, container: this.$el.find(s.css_classes.DASHBOARD_OECD_HOLDER), topic: this.browse_type});
            dashboardOecdSubView.setDashboardConfig(this.baseDashboardConfig);
            this.subview('oecdDashboard', dashboardOecdSubView);

            //DASHBOARD 2, render indicators dashboard if browse_type =
            if(this.browse_type === 'country_sector' || this.browse_type === 'donor_sector'){
                var configIndicators = BrowseIndicatorsConfig[this.browse_type];

                if (!configIndicators || !configIndicators.dashboard) {
                    alert(" HERE Impossible to find configuration for Indicators: ");
                    return;
                }

                this.indicatorsDashboardConfig = configIndicators.dashboard;
                this.indicatorsModel = new IndicatorsModel();

                var dashboardIndicatorsSubView = new DashboardIndicatorsSubView({autoRender: false, container: this.$el.find(s.css_classes.DASHBOARD_INDICATORS_HOLDER), topic: this.browse_type, model:this.indicatorsModel});
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

        },

        _bindEventListeners: function () {

            amplify.subscribe(s.events.FAO_SECTOR_CHART_LOADED, this, this._sectorChartLoaded);

            amplify.subscribe(s.events.SUB_SECTORS_FILTERS_READY, this, this._subSectorFilterLoaded);

            amplify.subscribe(s.events.FILTER_ON_CHANGE, this, this._updateDashboard);

        },

        _updateDashboard: function (item){
            amplify.publish(s.events.TITLE_ADD_ITEM, item);
            this.subview('title').show();

           // if(!this.firstLoad) {
                switch (this.subview('filters').isFAOSectorsSelected()) {
                    case true:
                        this.subview('oecdDashboard').setDashboardConfig(this.faoDashboardConfig);
                        break;
                    case false:
                        this.subview('oecdDashboard').setDashboardConfig(this.baseDashboardConfig);
                        break;
                }

                if(item.name === 'uid') {
                    this.datasetType.oecd_uid = item.value;
                }


                // REBUILD DASHBOARD 1
               if(!this.firstLoad  && item.name != 'sectorcode') {
                   this.subview('oecdDashboard').updateDashboardConfig(this.datasetType.oecd_uid, this.subview('filters').isFilterSelected('sectorcode'), this.subview('filters').isFilterSelected('purposecode'));
                   var ovalues = this.subview('filters').getOECDValues();
                   this.subview('oecdDashboard').rebuildDashboard([ovalues]);
               }

                // REBUILD DASHBOARD 2
                if(this.browse_type === 'country_sector' || this.browse_type === 'donor_sector'){
                    if(item.name === 'recipientcode' || item.name === 'donorcode') {
                      //  console.log("REBUILD DASHBOARD INDICATORS ")
                        this._setIndicatorDashboardModelCountry();
                        var ivalues = this.subview('filters').getIndicatorsValues();
                        this.subview('indicatorsDashboard').rebuildDashboard([ivalues]);
                    }
                }
          //  }
        },

        _unbindEventListeners: function () {
          // Remove listeners
            amplify.unsubscribe(s.events.FAO_SECTOR_CHART_LOADED, this._sectorChartLoaded);
            amplify.unsubscribe(s.events.SUB_SECTORS_FILTERS_READY, this._subSectorFilterLoaded);
            amplify.unsubscribe(s.events.FILTER_ON_CHANGE, this._updateDashboard);
        },

        _sectorChartLoaded: function (chart) {
             if((chart.series[0].name).trim() == "Million USD")    {
                chart.series[0].update({name: "FAO-Related Sectors"}, false);
                chart.redraw();
            }

        },

      _subSectorFilterLoaded: function (chart) {
         //  console.log("SUB SECTOR FILTER LOADED ");
            if(this.firstLoad) {
                 this.firstLoad = false;
                // show title
               // this.subview('title').show();



               this.subview('oecdDashboard').renderDashboard();

               // if(this.browse_type === 'country_sector' || this.browse_type === 'donor_sector'){
                 //   this._setIndicatorDashboardModelCountry();
                  //  this.subview('indicatorsDashboard').renderDashboard();
               // }

            }
            else {
                    this.subview('oecdDashboard').updateDashboardConfig(this.datasetType.oecd_uid, this.subview('filters').isFilterSelected('sectorcode'), this.subview('filters').isFilterSelected('purposecode'));
                    var ovalues = this.subview('filters').getOECDValues();
                    this.subview('oecdDashboard').rebuildDashboard([ovalues]);
            }
        },

         _updateIndicatorDashboardModel: function(key, value){
             this.indicatorsModel.set(key, value);
         },

        _setIndicatorDashboardModelCountry: function(){
            var country = this.subview('title').getItemText(s.ids.RECIPIENT_COUNTRY);
            var donor = this.subview('title').getItemText(s.ids.DONOR);

            if(donor.length > 0)
                this._updateIndicatorDashboardModel(s.indicatorDashboardModel.COUNTRY, donor);
            else
                this._updateIndicatorDashboardModel(s.indicatorDashboardModel.COUNTRY, country);

        },

        dispose: function () {

            this._unbindEventListeners();

            View.prototype.dispose.call(this, arguments);
        }

   });

    return BrowseByView;
});
