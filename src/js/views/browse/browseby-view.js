/*global define, amplify*/
define([
    'jquery',
    'jquery-ui',
    'views/base/view',
    'views/common/title-view',
    'views/browse/filter-view',
    'views/browse/dashboard-view',
    'views/browse/dashboard-indicators-view',
    'text!templates/browse/browse.hbs',
    'i18n!nls/browse',
    'config/Events',
    'config/browse/Config',
    'config/browse/Config-fao-sectors',
    'config/browse/Config-indicators',
    'lib/utils',
    'amplify'

], function ($, $UI, View, TitleSubView, FilterSubView, DashboardSubView, DashboardIndicatorsSubView, template, i18nLabels, E, BrowseConfig, BrowseFaoSectorsConfig, BrowseIndicatorsConfig, Utils) {

    'use strict';

    var s = {
        css_classes: {
            SIDE_BROWSE: "#side-browse",
            TITLE_BAR: "#fx-title",
            FILTER_HOLDER: "#browse-filter-holder",
            DASHBOARD_HOLDER: "#browse-topic-content",
            DASHBOARD_INDICATORS_HOLDER: "#browse-indicator-content"
        },
        events: {
            TITLE_ADD_ITEM: 'fx.title.item.add',
            FAO_SECTOR_CHART_LOADED: 'fx.browse.chart.faosector.loaded',
            SUB_SECTORS_FILTERS_READY: 'fx.filters.list.subsectors.ready',
            FILTER_ON_CHANGE: 'fx.filter.list.onchange'
        },
        ids: {
            uid:'uid'
        },
        datasetType: {
            "uid": "adam_usd_commitment",
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


            var config = BrowseConfig[this.browse_type];
            var configFao = BrowseFaoSectorsConfig[this.browse_type];
            var configIndicators = BrowseIndicatorsConfig["country"];

            if (!config || !config.dashboard || !config.filter) {
                alert(" HERE Impossible to find configuration for topic: " + this.browse_type);
                return;
            }

            if (!configIndicators || !configIndicators.dashboard) {
                alert(" HERE Impossible to find configuration for Indicators: ");
                return;
            }

            this.titleSubView = new TitleSubView({autoRender: true, container: this.$el.find(s.css_classes.TITLE_BAR)});
            this.filtersSubView = new FilterSubView({autoRender: true, container: this.$el.find(s.css_classes.FILTER_HOLDER), config: config.filter});

            //DASHBOARD 1
            this.baseDashboardConfig = config.dashboard, this.faoDashboardConfig = configFao.dashboard;
            this.dashboardSubView = new DashboardSubView({autoRender: true, container: this.$el.find(s.css_classes.DASHBOARD_HOLDER), topic: this.browse_type});
            this.dashboardSubView.setDashboardConfig(this.baseDashboardConfig);

            //DASHBOARD 2
            this.indicatorsDashboardConfig = configIndicators.dashboard;
            this.dashboardIndicatorsSubView = new DashboardIndicatorsSubView({autoRender: true, container: this.$el.find(s.css_classes.DASHBOARD_INDICATORS_HOLDER), topic: "country"});
            this.dashboardIndicatorsSubView.setDashboardConfig(this.indicatorsDashboardConfig);

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

            this.$sideBrowse = this.$el.find(s.css_classes.SIDE_BROWSE);

        },

        _bindEventListeners: function () {

            amplify.subscribe(s.events.FAO_SECTOR_CHART_LOADED, this, this._sectorChartLoaded);

            amplify.subscribe(s.events.SUB_SECTORS_FILTERS_READY, this, this._subSectorFilterLoaded);

            amplify.subscribe(s.events.FILTER_ON_CHANGE, this, this._updateDashboard);

        },

        _updateDashboard: function (item){
            amplify.publish(s.events.TITLE_ADD_ITEM, item);
            this.titleSubView.show();

            if(!this.firstLoad) {
                switch (this.filtersSubView.isFAOSectorsSelected()) {
                    case true:
                        this.dashboardSubView.setDashboardConfig(this.faoDashboardConfig);
                        break;
                    case false:
                        this.dashboardSubView.setDashboardConfig(this.baseDashboardConfig);
                        break;
                }

                if(item.name === 'uid') {
                    this.datasetType.uid = item.value;
                }

                this.dashboardSubView.updateDashboardConfig(this.datasetType.uid, this.filtersSubView.isFilterSelected('sectorcode'), this.filtersSubView.isFilterSelected('purposecode'));

                var values = this.filtersSubView.getValues();
                this.dashboardSubView.rebuildDashboard([values]);

                // REBUILD DASHBOARD 2!!!!
            }
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

            var series = chart.series,
                i=0;

            for(; i<series.length; i++) {
                //series[i].legendItem.translate(-15, 0);
                //series[i].checkbox.style.marginRight = '-12px';
            }
        },


        _subSectorFilterLoaded: function (chart) {
            if(this.firstLoad) {
                this.firstLoad = false;
                // show title
                this.titleSubView.show();
                this.dashboardSubView.renderDashboard();
                this.dashboardIndicatorsSubView.renderDashboard();
            }
        },


        dispose: function () {

            this._unbindEventListeners();

            View.prototype.dispose.call(this, arguments);
        }

   });

    return BrowseByView;
});
