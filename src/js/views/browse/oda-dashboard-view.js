/*global define, amplify*/
define([
    'jquery',
    'underscore',
    'views/base/view',
    'text!templates/browse/oda-dashboard.hbs',
    //'fx-ds/start',
    'config/browse/config-browse',
    'fx-dashboard/start',
    'lib/utils',
    'i18n!nls/browse',
    'i18n!nls/browse-dashboard',
    'handlebars',
    'lib/config-utils',
    'config/submodules/fx-chart/highcharts_template',
    'views/common/progress-bar',
    'amplify'
], function ($, _, View, template, BaseBrowseConfig, Dashboard, Utils, i18nLabels, i18nDashboardLabels, Handlebars, ConfigUtils, HighchartsTemplate, ProgressBar) {

    'use strict';

    var s = {
        css_classes: {
            DASHBOARD_BROWSE_CONTAINER: '#dashboard-browse-container'
        },
        events: {
            FAO_SECTOR_CHART_LOADED: 'fx.browse.chart.faosector.loaded'
        },
        config_types: {
            FAO_SECTOR: 'FAO_SECTOR',
            OTHER_SECTORS: 'OTHER_SECTORS',
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
            //this.model.on("change", this.render);
            this.dashboards = [];

            this.source = $(this.template).find("[data-topic='" + this.topic + "']");//.prop('outerHTML');

            this.pb = new ProgressBar({
             el: '#progress-bar'
            });

            View.prototype.initialize.call(this, arguments);

            //this.render();
        },

        getTemplateData: function () {
            return i18nLabels;
        },

        render: function () {
            this.setElement(this.container);
           this._unbindEventListeners();



          //  console.log("RENDER ========== ");

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

        setDashboardConfig: function(config){
            this.baseConfig = config;
            //console.log("=============== RE-SET DASHBOARD CONFIG items ");
            //console.log(this.baseConfig.items.length);
           // console.log("================================== ");


            this.config = config;
            this.config_type = config.id;
            this.config.baseItems = config.items;
            this.config.environment = BaseBrowseConfig.dashboard.ENVIRONMENT;

            // Sets Highchart config for each chart
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
        },



        renderDashboard: function () {
         var self = this;

           // console.log("=============== RENDER CALLED  ");
           // console.log(this.baseConfig.items.length);
           // console.log("================================== ");

            //console.log("renderDashboard");
           // console.log(this.config);



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



           // this.dashboards.push(new Dashboard(this.config));


            this.dashboard = new Dashboard(this.config);

            this._loadProgressBar();


           // console.log("renderDashboard:this.dashboards ");
           // console.log(this.dashboards);
          //  this.browseDashboard.render(this.config);
        },




        _disposeDashboards : function () {
            if (this.dashboard && $.isFunction(this.dashboard.dispose)) {
                this.dashboard.dispose();
            }
        },

       /* _disposeDashboards : function () {

            _.each( this.dashboards, _.bind(function (dashboard) {
                if (dashboard && $.isFunction(dashboard.dispose)) {
                    dashboard.dispose();
                }
            }, this));

            this.dashboards = [];
        },
*/


        _removeDashboardItem: function (itemId) {

            // Remove Item from config Items
            this.config.items = _.reject( this.config.items, function(el) { return el.id === itemId; });



        },

        _collapseDashboardItem: function (itemId) {
            //console.log("===================== COLLAPSE: "+'#'+itemId);


            // Hide Item container
            var itemContainerId = '#'+itemId + s.item_container_id;
           // console.log(itemContainerId);
           // console.log($(this.source).find(itemContainerId));
            $(this.source).find(itemContainerId).addClass('collapse');

        },

        _expandDashboardItem: function (itemId) {
           // console.log("===================== EXPAND: "+'#'+itemId + s.item_container_id);
            // Show Item container
            var itemContainerId = '#'+itemId + s.item_container_id;
            $(this.source).find(itemContainerId).removeClass('collapse');
        },


        _hideDashboardItem: function (itemId) {
           // console.log("===================== HIDE: "+'#'+itemId + s.item_container_id);
            // Remove Item from config Items
            this.config.items = _.reject( this.config.items, function(el) { return el.id === itemId; });

            // Hide Item container
            var itemContainerId = '#'+itemId + s.item_container_id;
            $(this.source).find(itemContainerId).hide();

        },

        _showDashboardItem: function (itemId) {
           // console.log("===================== SHOW: "+'#'+itemId + s.item_container_id);
            // Show Item container
            var itemContainerId = '#'+itemId + s.item_container_id;
            $(this.source).find(itemContainerId).show();
        },

        updateDashboardTemplate: function(filterdisplayconfig){

            if(filterdisplayconfig){

                var hide = filterdisplayconfig.hide;
                var show = filterdisplayconfig.show;

                for(var idx in hide){
                    //this._removeDashboardItem(hide[idx]); // from configuration -  need to find a way to properly clone config!
                    this._collapseDashboardItem(hide[idx]); // in the template
                }

                for(var idx in show){
                    this._expandDashboardItem(show[idx]); // in the template
                }

            }

        },



      updateDashboardConfigUid: function(uid){
        this.config.uid = uid;
      },


      /*  updateDashboardConfig: function(uid, sectorSelected, subSectorSelected, recipientSelected, regioncode, removeItems){

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
                   // this._updateItem1ChartConfiguration(item1, sectorSelected, subSectorSelected);
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
*/
        showHiddenDashboardItems: function(showItems){
            if(showItems){
                for(var itemId in showItems){
                    this._showDashboardItem(showItems[itemId]);
                }
            }

        },


        setProperties: function (props) {
            if(props){
                if(props["regioncode"])
                    this.regioncode = props["regioncode"];
                else
                    this.regioncode = null;

                if(props["gaulcode"])
                    this.gaulcode = props["gaulcode"];
                else
                    this.gaulcode = null;

                if(props["oda"])
                    this.config.uid = props["oda"];


            } else {
                this.regioncode = null;
                this.gaulcode = null;
            }
        },

        updateItemsConfig: function () {
            this._updateDashboardRegionalMapConfiguration();
        },

        _updateDashboardRegionalMapConfiguration: function () {
             var map = _.filter(this.config.items, {id:'regional-map'})[0];
             var regioncode = this.regioncode;
             var gaulcode = this.gaulcode;

              if(map && regioncode){

                 if(map.filter && map.filter.un_region_code){
                     map.filter.un_region_code = [];

                     if(regioncode)
                         map.filter.un_region_code.push(regioncode)
                 }

                 if(map.config && map.config.fenix_ui_map){
                     if(gaulcode) {
                         map.config.fenix_ui_map.zoomToCountry = [];
                         map.config.fenix_ui_map.zoomToCountry.push(gaulcode);
                     }
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


        //rebuildDashboard: function (filter) {

           // if (this.dashboard && $.isFunction(this.dashboard.refresh)) {
                //console.log("REFRESH");
              //  this.dashboard.refresh(filter);
           // }
       // },

        rebuildDashboard: function (filter) {
          var self = this;
            console.log("=============== REBUILD CALLED  ");

           this._disposeDashboards();

           this.config.filter = filter;

           this.dashboard =  new Dashboard(
               this.config
           );

            this._loadProgressBar();


          // this.dashboards.push(new Dashboard(
            //   this.config
          // ));





            // console.log("renderDashboard:this.dashboards ");
            // console.log(this.dashboards);
            //  this.browseDashboard.render(this.config);





            console.log("======================== FINAL VALUES FOR DASHBOARD ========== ", filter);
            //console.log("========================= rebuild",  this.dashboards);

            //console.log(filter);
          //  if (this.browseDashboard && this.browseDashboard.destroy) {
            //    this.browseDashboard.destroy();
           // }

            //this.browseDashboard = new Dashboard({

                //Ignored if layout = injected
              //  container: s.css_classes.DASHBOARD_BROWSE_CONTAINER,
               // layout: "injected"
           // });

           // _.each( this.dashboards, _.bind(function (dashboard) {
               // console.log(dashboard);
               // console.log($.isFunction(dashboard.refresh)
              //  if (dashboard && $.isFunction(dashboard.refresh)) {
                    //console.log("REFRESH");
                 //   dashboard.refresh(filter);
               // }
           // }, this));



            //if (this.browseDashboard && $.isFunction(this.browseDashboard.refresh)) {
             //   this.browseDashboard.refresh(values);
            //}

            //this.browseDashboard.rebuild(this.config, filter);
        },


        _loadProgressBar: function () {
            var self = this;

            this.pb.reset();
            this.pb.show();


            var percent = 100 / this.config.items.length;
            this.dashboard.on('ready', function () {
                self.pb.finish();
            });

            var count = 0;
            this.dashboard.on('itemready', function () {
                count = count + percent;
                self.pb.update(count);
            });

        },



        _bindEventListeners: function () {
          //  amplify.subscribe("BEFORE_RENDER", this, this._setChartOptions);
            // Add List Change listeners
           // amplify.subscribe(s.events.FAO_SECTOR_CHART_LOADED, this, this._sectorChartLoaded);



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

            this._disposeDashboards();

            this._unbindEventListeners();

            View.prototype.dispose.call(this, arguments);
        }


    });

    return DashboardView;
});
