/*global define, amplify*/
define([
    'jquery',
    'underscore',
    'views/base/view',
    'text!templates/analyze/priority/dashboard.hbs',
    'fx-dashboard/start',
    'lib/utils',
    'i18n!nls/browse',
    'i18n!nls/priority-dashboard',
    'handlebars',
    'lib/config-utils',
    'config/submodules/fx-chart/highcharts_template',
    'amplify'
], function ($, _, View, template, Dashboard, Utils, i18nLabels, i18nDashboardLabels, Handlebars, ConfigUtils, HighchartsTemplate) {

    'use strict';

    var s = {
        css_classes: {
            DASHBOARD_BROWSE_CONTAINER: '#dashboard-browse-container'
        },
        events: {
            FAO_SECTOR_CHART_LOADED: 'fx.browse.chart.faosector.loaded'
        },
        config_types: {
            FAO: 'FAO',
            BASE: 'BASE'
        },
        item_container_id: '-container',
        total_oda_id: 'tot-oda'
    };

    var DashboardView = View.extend({

        // Automatically render after initialize
        autoRender: false,

        className: 'dashboard-browse',

        // Save the template string in a prototype property.
        // This is overwritten with the compiled template function.
        // In the end you might want to used precompiled templates.
        template: template,

        initialize: function (params) {
            this.topic = params.topic;
            this.model.on("change", this.render, this);


            console.log(this.topic);

            //this.model.on("change", this.render);
            this.dashboards = [];

            this.source = $(this.template);//.find("[data-topic='" + this.topic + "']");//.prop('outerHTML');

            View.prototype.initialize.call(this, arguments);

            //this.render();
        },

        getTemplateData: function () {
            return i18nLabels;
        },

        render: function () {
            this.setElement(this.container);
            this._unbindEventListeners();



            console.log("RENDER ========== ");

            for(var it in this.config.items){

                var item = this.config.items[it];
                this._updateChartExportTitles(this.config.items[it], i18nDashboardLabels[item.id], this.model.get('label'));
            }

            $(this.el).html(this.getTemplateFunction());
        },

        attach: function () {
            View.prototype.attach.call(this, arguments);

            this.configUtils = new ConfigUtils();

            this._bindEventListeners();

        },


    getTemplateFunction: function() {
           this.compiledTemplate = Handlebars.compile(this.source.prop('outerHTML'));

            var model = this.model.toJSON();

       //console.log(model);
            var data = $.extend(true, model, i18nLabels, i18nDashboardLabels);

            return this.compiledTemplate(data);

        },

        setDashboardConfig: function(config, type){
            this.config = config;
           // console.log(config.items);

            this.config.baseItems = config.items;
            this.config_type = type || s.config_types.BASE;
            this.config.environment = 'develop'


            _.each(this.config.items, _.bind(function ( item ) {
                if (!_.isEmpty(item)) {
                        if(item.type == "chart"){
                            if(item.config.config){
                               item.config.config = $.extend(true, {}, HighchartsTemplate, item.config.config);
                            } else {
                               item.config.config =  $.extend(true, {}, HighchartsTemplate);
                            }
                        }
                }

            }, this));


            //  console.log("setDashboardConfig DONE");

        },



        renderDashboard: function () {

         //console.log("renderDashboard");



           // if (this.browseDashboard && this.browseDashboard.destroy) {
              //  this.browseDashboard.destroy();
            //}


            this.config.el = this.$el;

            var data_id =   this.$el.find("[data-item='tot-oda']");




           // console.log( $(this.el).length);

           // this.browseDashboard = new Dashboard({

                //Ignored if layout = injected
               // container: s.css_classes.DASHBOARD_BROWSE_CONTAINER,
               // layout: "injected"
           // });

            console.log("renderDashboard");
            console.log(this.config);

            this.dashboards.push(new Dashboard(this.config));

           // console.log("renderDashboard:this.dashboards ");
           // console.log(this.dashboards);
          //  this.browseDashboard.render(this.config);
        },



        _disposeDashboards : function () {

           // console.log("_disposeDashboards:this.dashboards ");
            //console.log(this.dashboards);

            _.each( this.dashboards, _.bind(function (dashboard) {
                if (dashboard && $.isFunction(dashboard.dispose)) {
                    dashboard.dispose();
                }
            }, this));

            this.dashboards = [];
        },

        _hideDashboardItem: function (itemId) {
            // Remove Item from config Items
            this.config.items = _.reject( this.config.items, function(el) { return el.id === itemId; });

            // Hide Item container
            var itemContainerId = '#'+itemId + s.item_container_id;
            $(this.source).find(itemContainerId).hide();

        },

        _showDashboardItem: function (itemId) {
            // Show Item container
            var itemContainerId = '#'+itemId + s.item_container_id;
            $(this.source).find(itemContainerId).show();
        },

        updateDashboardConfig: function(uid, sectorSelected, subSectorSelected, recipientSelected, regioncode, removeItems){

           // console.log("================ updateDashboardConfig");
          //  console.log(uid + ' | '+ sectorSelected+ ' | '+subSectorSelected+ ' | '+ recipientSelected+ ' | '+ regioncode+ ' | '+ removeItems);
            this.config.items = this.config.baseItems; // Reset Config Items

            var item1 = _.filter(this.config.items, {id: s.total_oda_id})[0];


          //  console.log(item1);

            switch(this.config_type == s.config_types.FAO){
                case true:
                    //console.log("updateFAOConfig ");
                    this._updateFAOItem1ChartConfiguration(item1, sectorSelected, subSectorSelected);
                    break;
                case false:
                    this._updateItem1ChartConfiguration(item1, sectorSelected, subSectorSelected);
                    break;
            }


            if(recipientSelected) {
                this._updateRegionalMapConfiguration(regioncode);
            }

            this.config.uid = uid;

            if(removeItems){
                for(var itemId in removeItems){
                    this._hideDashboardItem(removeItems[itemId]);
                }
            }

        },

        showHiddenDashboardItems: function(showItems){
            if(showItems){
                for(var itemId in showItems){
                    this._showDashboardItem(showItems[itemId]);
                }
            }

        },

        _updateRegionalMapConfiguration: function (regioncode) {
             var map = _.filter(this.config.items, {name:'region-map'})[0];

            //console.log(regioncode);
             if(map){
                 // modify regioncode
                 var filterConfig = this.configUtils.findByPropValue(map.filter,  "name", "filter");

                 if(filterConfig.parameters.rows.regioncode){
                     filterConfig.parameters.rows.regioncode.codes[0].codes = [];

                     if(regioncode)
                        filterConfig.parameters.rows.regioncode.codes[0].codes.push(regioncode)
                 }

             }

        },

        _updateFAOItem1ChartConfiguration: function (item1, sectorSelected, subSectorSelected) {

           // console.log("_updateFAOItem1ChartConfiguration");

            // Set either parentsector_code or purposecode as the series in the first chart config
            // Check the current selection via seriesname in config
            var seriesname = item1.config.adapter.seriesDimensions[0];

           // console.log(sectorSelected, subSectorSelected);
            //console.log(seriesname);

            var configFind = subSectorSelected && seriesname !== 'purposecode' ? 'parentsector_code': 'purposecode';
            var configReplace = subSectorSelected && seriesname !== 'purposecode' ? 'purposecode': 'parentsector_code';


            //console.log(configFind, configReplace);

            // modify chartconfig seriesdimension
            this.configUtils.findAndReplace(item1.config.adapter, configFind, configReplace);

            // modify group by in filter
            var grpByConfig = this.configUtils.findByPropValue(item1.filter,  "name", "pggroup");

            if(subSectorSelected)
                grpByConfig.parameters.by = ["purposecode", "year"];
            else
                grpByConfig.parameters.by = ["year"];

        },
        _updateItem1ChartConfiguration: function (item1, sectorSelected, subSectorSelected) {
            // Set either parentsector_code or purposecode as the series in the first chart config
            // Check the current selection via seriesname in config
          //  var seriesname = item1.config.adapter.seriesDimensions[0];
            var seriesname = item1.config.series[0];

            var configFind = subSectorSelected && seriesname !== 'purposecode' ? 'parentsector_code': 'purposecode';
            var configReplace = subSectorSelected && seriesname !== 'purposecode' ? 'purposecode': 'parentsector_code';

          //  console.log(seriesname);
          //  console.log(subSectorSelected);
          //  console.log(configFind);
          //  console.log(configReplace);

            // modify chartconfig seriesdimension
            this.configUtils.findAndReplace(item1.config, configFind, configReplace);

            // modify group by in filter
            var grpByConfig = this.configUtils.findByPropValue(item1.postProcess,  "name", "pggroup");
         //   console.log(grpByConfig);

            this.configUtils.findAndReplace(grpByConfig, configFind, configReplace);
        },

        _updateChartExportTitles: function (chartItem, title, subtitle) {

            if( chartItem.config.config) {
                var chartItemTitle = chartItem.config.config.exporting.chartOptions.title,
                    chartItemSubTitle = chartItem.config.config.exporting.chartOptions.subtitle;

                if(!chartItemTitle || !chartItemSubTitle){
                    chartItemTitle = chartItem.config.config.exporting.chartOptions.title = {};
                    chartItemSubTitle = chartItem.config.config.exporting.chartOptions.subtitle = {};
                }

                chartItemTitle.text = title;
                chartItemSubTitle.text = subtitle;
            }
        },

        rebuildDashboard: function (filter) {
            console.log("rebuild", filter);
            console.log("rebuild",  this.dashboards);
          //  if (this.browseDashboard && this.browseDashboard.destroy) {
            //    this.browseDashboard.destroy();
           // }

            //this.browseDashboard = new Dashboard({

                //Ignored if layout = injected
              //  container: s.css_classes.DASHBOARD_BROWSE_CONTAINER,
               // layout: "injected"
           // });

            _.each( this.dashboards, _.bind(function (dashboard) {
               // console.log(dashboard);
               // console.log($.isFunction(dashboard.refresh)
                if (dashboard && $.isFunction(dashboard.refresh)) {
                    console.log("REFRESH");
                    dashboard.refresh(filter);
                }
            }, this));



            //if (this.browseDashboard && $.isFunction(this.browseDashboard.refresh)) {
             //   this.browseDashboard.refresh(values);
            //}

            //this.browseDashboard.rebuild(this.config, filter);
        },



        _bindEventListeners: function () {
          //  amplify.subscribe("BEFORE_RENDER", this, this._setChartOptions);
            // Add List Change listeners
            amplify.subscribe(s.events.FAO_SECTOR_CHART_LOADED, this, this._sectorChartLoaded);


        },

        _sectorChartLoaded: function (chart) {
            if((chart.series[0].name).trim() == "Million USD")    {
                chart.series[0].update({name: "FAO-Related Sectors"}, false);
                chart.redraw();
            }
        },

        _unbindEventListeners: function () {
            // Remove listeners
            amplify.unsubscribe(s.events.FAO_SECTOR_CHART_LOADED, this._sectorChartLoaded);
        },

        dispose: function () {
            this._unbindEventListeners();
            View.prototype.dispose.call(this, arguments);
        }

    });

    return DashboardView;
});
