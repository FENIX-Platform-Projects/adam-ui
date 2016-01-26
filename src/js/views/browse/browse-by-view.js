/*global define, amplify*/
define([
    'jquery',
    'jquery-ui',
    'views/base/view',
    'fx-ds/start',
    'fx-filter/start',
    'common/Fx-title-bar',
    'text!templates/browse/browse.hbs',
    'text!templates/browse/dashboard.hbs',
    'i18n!nls/browse',
    'config/Events',
    'config/Config',
    'config/browse/Config',
    'config/browse/Config-fao-sectors',
    'fx-filter/Fx-filter-configuration-creator',
    'handlebars',
    'lib/utils',
    'lib/config-utils',
    'q',
    'amplify',
    'select2'

], function ($, $UI, View, Dashboard, Filter, TitleBar, template, browseByDashboardTemplate, i18nLabels, E, C, BrowseConfig, BrowseFaoSectorsConfig, FilterConfCreator, Handlebars, Utils, ConfigUtils,  Q) {

    'use strict';

    var s = {
        css_classes: {
            TOPIC_CONTENT_BROWSE: "#browse-topic-content",
            FILTER_BROWSE: "filter-browse",
            FILTER_SUBMIT_BROWSE: "#filter-submit-btn-browse",

            SIDE_BROWSE: "#side-browse",

            DASHBOARD_BROWSE_CONTAINER: '#dashboard-adam-container',

            TITLE_BAR: "#fx-title"
        },
        events: {
            SECTOR_LIST_CHANGE: 'fx.filter.list.change.sectorcode',
            UID_LIST_CHANGE: 'fx.filter.list.change.uid',
            LIST_SELECTIONS: 'fx.filter.list.selections.',
            LIST_CHANGE: 'fx.filter.list.change.',
            TITLE_ADD_ITEM: 'fx.title.item.add',
            SECTOR_CHART_LOADED: 'fx.browse.chart.sector.loaded'
        },
        listTypes: {
            SECTOR_LIST: 'sectorcode',
            UID_LIST: 'uid'
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

        className: 'analysis',

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

            this.configUtils = new ConfigUtils();

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

            this._showBrowseTopic(this.browse_type);

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
            this.$topicContentBrowse = this.$el.find(s.css_classes.TOPIC_CONTENT_BROWSE);

            this.$filterSubmitBrowse = this.$el.find(s.css_classes.FILTER_SUBMIT_BROWSE);

            this.$titleBar = this.$el.find(s.css_classes.TITLE_BAR);

            this.$sideBrowse = this.$el.find(s.css_classes.SIDE_BROWSE);

        },

        _bindEventListeners: function () {

            var self = this;
          //  self.titleBar.destroy();

           // amplify.subscribe(s.events.SECTOR_LIST_CHANGE, this, this._onSectorChange);

            amplify.subscribe(s.events.SECTOR_CHART_LOADED, this, this._sectorChartLoaded);

            this.$filterSubmitBrowse.on('click', function (e, data) {



                // show title bar
                self.titleBar.showItems();

                var filter = {};
                var values = self.filterBrowse.getValues();

                var isFAORelated = self.configUtils.objectContainsValue(values, '9999');
                var sectorSelected= self._hasSelections('sectorcode', values);
                var subSectorSelected = self._hasSelections('purposecode', values);

                switch(isFAORelated){
                    case true:
                        self.baseDashboardConfig = self.dashboardFAOConfig;
                      //  self._updateConfigurationsWithFaoRelatedSectors2(values, sectorcodeObj);
                        break;
                    case false:
                        self.baseDashboardConfig = self.dashboardConfig;
                        var item1 = _.filter(self.dashboardConfig.items, {id:'item-1'})[0];
                        self._updateItem1ChartConfiguration(item1, sectorSelected, subSectorSelected);
                        break;
                }

               if(uidChanged) {
                    self.baseDashboardConfig.uid = self.datasetType.uid;
                }

                // Set the sector and sub sector code lists references
                // Updated to match the references as declared in the dataset metadata for the sectorcode and purposecode fields
                if(sectorSelected){
                    values['sectorcode'].codes[0].uid = 'crs_sectors';
                }

                // Set Subsectors to crs_purposes
                if(subSectorSelected) {
                    values['purposecode'].codes[0].uid = 'crs_purposes';
                 }

                 self._rebuildBrowseDashboard(self.baseDashboardConfig, [values]);
                // IF REBUILD NOT REQUIRED: self.browseDashboard.filter([values]);

            });

        },

        _updateItem1ChartConfiguration: function (item1, sectorSelected, subSectorSelected) {
            // Set either sectorcode or purposecode as the series in the first chart config
            // Check the current selection via seriesname in config
            var seriesname = item1.config.adapter.seriesDimensions[0];

            var configFind = subSectorSelected && seriesname !== 'purposecode' ? 'sectorcode': 'purposecode';
            var configReplace = subSectorSelected && seriesname !== 'purposecode' ? 'purposecode': 'sectorcode';

            // modify chartconfig seriesdimension
            this.configUtils.findAndReplace(item1.config.adapter, configFind, configReplace);

            // modify group by in filter
            var grpByConfig = this.configUtils.findByPropValue(item1.filter,  "name", "pggroup");
            this.configUtils.findAndReplace(grpByConfig, configFind, configReplace);
        },

        _updateConfigurationsWithFaoRelatedSectors2: function (values, sectorvaluesobj) {
            // If no purposecodes have been selected
            if(this._hasNoSelections('purposecode', values)){
                // Get the purposecode filter component, which will contain all
                // the purposecodes (sub-sectors) associated with the selected 'FAO-related Sectors'
                var purposeCodeComponent = this.filterBrowse.getDomain("purposecode");

                if(purposeCodeComponent){
                    var codes = [];

                    //======= UPDATE VALUES CONFIG
                    // Add purposecode to values
                    values['purposecode'] = {};
                    values['purposecode'].codes = [];
                    values['purposecode'].codes[0] = $.extend(true, {}, sectorvaluesobj); // clone the codes configuration of sectorvaluesobj

                    // Get the source of the purposecode component
                    // and populate the codes array with the IDs of the source items
                    $.each(purposeCodeComponent.options.source, function( index, sourceItem ) {
                        codes.push(sourceItem.id);
                    });

                    values['purposecode'].codes[0].codes = codes;
                    values['purposecode'].codes[0].uid = 'crs_purposes';

                }
            }

            // Set Values sectorcode to be removed
            values['sectorcode'] = {};
            values['sectorcode'].removeFilter = true;

        },

        _updateConfigurationsWithFaoRelatedSectors: function (values, sectorvaluesobj) {
            // If no purposecodes have been selected
            if(this._hasNoSelections('purposecode', values)){
               // Get the purposecode filter component, which will contain all
               // the purposecodes (sub-sectors) associated with the selected 'FAO-related Sectors'
                var purposeCodeComponent = this.filterBrowse.getDomain("purposecode");

                if(purposeCodeComponent){
                    var codes = [];

                    //======= UPDATE VALUES CONFIG
                    // Add purposecode to values
                    values['purposecode'] = {};
                    values['purposecode'].codes = [];
                    values['purposecode'].codes[0] = $.extend(true, {}, sectorvaluesobj); // clone the codes configuration of sectorvaluesobj

                    // Get the source of the purposecode component
                    // and populate the codes array with the IDs of the source items
                    $.each(purposeCodeComponent.options.source, function( index, sourceItem ) {
                        codes.push(sourceItem.id);
                    });

                    values['purposecode'].codes[0].codes = codes;
                    values['purposecode'].codes[0].uid = 'crs_purposes';

                }
            }

            //======= UPDATE DASHBOARD CONFIG
            // Get the dashboard items which have a group filter
            // Then either remove sectorcode from the associated 'by' array (i.e. array size > 1)
            // Or remove the group filter entirely if the 'by' array only contains sectorcode (i.e. array size = 1)
            $.each(this.dashboardConfig.items, function(index, dbItem) {
                var grpFilter = _.filter(dbItem.filter, {name:'group'})[0];

                if (grpFilter) {
                    if (_.intersection(['sectorcode'], grpFilter.parameters.by).length > 0) {  // Check if sectorcode is present in the 'by' array

                        if (grpFilter.parameters.by.length > 1) {
                            var arr = grpFilter.parameters.by;
                            var result = _.without(arr, 'sectorcode'); // Remove sectorcode from Group by array
                            grpFilter.parameters.by = result;
                        } else {
                            // Remove group by filter if sectorcode was the only Group by array item
                            var filterIdx = this.dashboardConfig.items[index].filter.indexOf(grpFilter);
                            this.dashboardConfig.items[index].filter.splice(filterIdx, 1);
                        }
                    }
                }
            });

            // Set Values sectorcode to be removed
            values['sectorcode'] = {};
            values['sectorcode'].removeFilter = true;

        },

        _resetDashboardConfiguration: function (values, sectorvaluesobj) {

            //======= UPDATE DASHBOARD CONFIG
            // Get the dashboard items which have a group filter
            // Then either remove sectorcode from the associated 'by' array (i.e. array size > 1)
            // Or remove the group filter entirely if the 'by' array only contains sectorcode (i.e. array size = 1)
            $.each(this.dashboardConfig.items, function(index, dbItem) {
                var grpFilter = _.filter(dbItem.filter, {name:'group'})[0];

                if (grpFilter) {
                    if (_.intersection(['sectorcode'], grpFilter.parameters.by).length > 0) {  // Check if sectorcode is present in the 'by' array

                        if (grpFilter.parameters.by.length > 1) {
                            var arr = grpFilter.parameters.by;
                            var result = _.without(arr, 'sectorcode'); // Remove sectorcode from Group by array
                            grpFilter.parameters.by = result;
                        } else {
                            // Remove group by filter if sectorcode was the only Group by array item
                            var filterIdx = this.dashboardConfig.items[index].filter.indexOf(grpFilter);
                            this.dashboardConfig.items[index].filter.splice(filterIdx, 1);
                        }
                    }
                }
            });

        },

        _onSectorChange: function (s) {
            var self = this;

            if(s.value){
               var pcfilter= _.find(this.filterConfig, function(obj){
                   return obj.components[0].name === 'purposecode';
                });

                if(pcfilter){
                    var filter =   pcfilter.components[0].config.filter;
                    filter.codes = [];
                    filter.codes.push(s.value);
                    delete filter["level"];

                    pcfilter.components[0].config.filter = filter;

                    Q.all([
                        self.filterConfCreator._createCodelistHierarchyPromiseData(pcfilter)
                    ]).spread(function(result1) {

                        var result = [];
                        var children = self._getPropByString(result1[0], "children");

                        _.each(children, function (d) {
                             result.push({"id": d.code, "text": d.title[Utils.getLocale()]});
                        });

                        result.sort(function(a, b){
                                if (a.text < b.text)
                                    return -1;
                                if (a.text > b.text)
                                    return 1;
                                return 0;
                        });


                        self.filterBrowse.setDomain("purposecode", result);

                    }).done(function() {
                        if(self.firstLoad) {
                            self.firstLoad = false;
                            // show title
                            self.titleBar.showItems();
                            self._renderBrowseDashboard(self.dashboardConfig);
                        }
                      }
                    );
                }
            }
        },

        _onDatasetChange: function (data) {
            var self = this;
            if(data.value){
                if(this.dashboardConfig)  {

                    if(data.value !== this.dashboardConfig.uid) {
                        uidChanged = true;
                        this.datasetType.uid = data.value;
                    }
                    else {
                        uidChanged = false;
                    }

                   // console.log("====================_onDatasetChange uidChanged ");
                   // console.log(uidChanged );


                }
            }
        },

        _getObjectByValue: function (id, data){
                var allChildren = _.flatten(_.pluck(data,'codes'));

                var childHasValue = _.find(allChildren,function(child){
                    if(child)   {
                        if (child.codes[0] == id){
                            return child;
                        }
                    }
                });

                return childHasValue;
        },

        _hasSelections: function (id, data){
            if( _.has(data, id)){
                if (_.has(data[id], 'codes')) {
                  return true;
                }
            }
        },


        _hasNoSelections: function (id, data){
            if( _.has(data, id)){
                return _.has(data[id], 'removeFilter');
            }
        },

        _onBrowseTopicChange: function (topic) {
            this._showBrowseTopic(topic);
        },



        _showBrowseTopic: function (topic) {
            var self = this;

             //Inject HTML
           var source = $(browseByDashboardTemplate).find("[data-topic='" + topic + "']"),
               template = Handlebars.compile(source.prop('outerHTML'));

            this.$topicContentBrowse.html(template);
            
           this._renderBrowseComponents(topic);

        },


        _renderBrowseComponents: function (topic) {
            var config = BrowseConfig[topic];
            var configFao = BrowseFaoSectorsConfig[topic];


            if (!config || !config.dashboard || !config.filter) {
                alert(" HERE Impossible to find configuration for topic: " + topic);
                return;
            }

           this._renderTitleBar();

           this.filterConfig = config.filter;


            // Add List Change listeners
            for(var idx in this.filterConfig) {
              amplify.subscribe(s.events.LIST_CHANGE + this.filterConfig[idx].components[0].name, this, this._onChangeEvent);
            }

        
          /** var recipientfilter= _.find(this.filterConfig, function(obj){
                return obj.components[0].name === 'recipientcode';
           });


           if(recipientfilter && this.recipientcode){
               var codes = [];
               codes.push(this.recipientcode);

               console.log(codes);
               recipientfilter.components[0].config.defaultcodes = codes;
               this.dashboardConfig.filter[0].parameters.rows.recipientcode.codes[0].codes = codes
           }**/

            this.dashboardConfig = config.dashboard;
            this.dashboardFAOConfig = configFao.dashboard;

            this._renderBrowseFilter(this.filterConfig);

           //this._renderBrowseDashboard(this.dashboardConfig);


        },


        _renderTitleBar: function(){
            this.titleBar = new TitleBar();
            this.titleBar.init({
                container: this.$titleBar
            });
            this.titleBar.render();
        },

        _addSelectedItemToTitle: function(item){
           // console.log("======================== _addSelectedItemToTitle")
            //console.log(item)

            //update Title
            amplify.publish(s.events.TITLE_ADD_ITEM, item);
        },

        _updateDashboardTitles : function (filter) {
            //console.log(filter)



        },



        _onChangeEvent: function(item){

            if(item.name === s.listTypes.SECTOR_LIST){
                this._onSectorChange(item);
            }

            if(item.name === s.listTypes.UID_LIST){
                this._onDatasetChange(item);
            }

           // console.log("======================== _onChangeEvent")
           // console.log(item)
            //update Title
            amplify.publish(s.events.TITLE_ADD_ITEM, item);
        },


        _renderBrowseDashboard: function (config) {

            if (this.browseDashboard && this.browseDashboard.destroy) {
                this.browseDashboard.destroy();
            }


            this.browseDashboard = new Dashboard({

                //Ignored if layout = injected
                container: s.css_classes.DASHBOARD_BROWSE_CONTAINER,
                layout: "injected"
            });

            this.browseDashboard.render(config);

        },

        _rebuildBrowseDashboard: function (config, filter) {

            if (this.browseDashboard && this.browseDashboard.destroy) {
                this.browseDashboard.destroy();
            }


            this.browseDashboard = new Dashboard({

                //Ignored if layout = injected
                container: s.css_classes.DASHBOARD_BROWSE_CONTAINER,
                layout: "injected"
            });

            this.browseDashboard.rebuild(config, filter);

        },

        _renderBrowseFilter: function (config) {

            var self = this;

            this.filterConfCreator = new FilterConfCreator();

            this.filterConfCreator.getConfiguration(config)
                .then(function (c) {

                    self.filterBrowse = new Filter();

                    self.filterBrowse.init({
                        container: s.css_classes.FILTER_BROWSE,
                       // layout: 'fluidGrid'
                        layout: 'bootstrapfluidGridSystem'
                    });

                    var adapterMap = {};

                    self.filterBrowse.add(c, adapterMap);
                    
                }).then(function () {

                // initialize Bootstarp tooltip
                $('[data-toggle="tooltip"]').tooltip();


            });

        },

       _getPropByString: function(obj, propString) {
        if (!propString)
            return obj;

           var prop, candidate;

           prop = propString;
           candidate = obj[prop];

            if (candidate) {
                obj = candidate;
                if(obj.hasOwnProperty(prop)) {
                   this._getPropByString(obj, prop);
                }
            }

        return obj;
    },

       _compare: function(a, b){
            if (a.label < b.label)
                return -1;
             if (a.label > b.label)
                return 1;
           return 0;
       },

        _unbindEventListeners: function () {
          // Remove listeners

            amplify.unsubscribe(s.events.SECTOR_CHART_LOADED, this._sectorChartLoaded);

            for(var idx in this.filterConfig) {
                amplify.unsubscribe(s.events.LIST_CHANGE + this.filterConfig[idx].components[0].name, this._onChangeEvent);
            }

        },

        _sectorChartLoaded: function (chart) {

           // if(chart.series[0].name == "FAO")
            //chart.series[0].update({name: "BeBee"}, false);
            //chart.redraw();
        },


        dispose: function () {

            this._unbindEventListeners();

            View.prototype.dispose.call(this, arguments);
        }

   });

    return BrowseByView;
});
