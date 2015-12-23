/*global define, amplify*/
define([
    'views/base/view',
    'fx-ds/start',
    'fx-filter/start',
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
    'q',
    'amplify',
    'select2',
    'jstree',
    'highcharts-export'

], function (View, Dashboard, Filter, template, browseByDashboardTemplate, i18nLabels, E, C, BrowseConfig, BrowseFaoSectorsConfig, FilterConfCreator, Handlebars, Utils, Q) {

    'use strict';

    var s = {
        css_classes: {
            TOPIC_CONTENT_BROWSE: "#browse-topic-content",
            FILTER_BROWSE: "filter-browse",
            FILTER_SUBMIT_BROWSE: "#filter-submit-btn-browse",

            SIDE_BROWSE: "#side-browse",

            DASHBOARD_BROWSE_CONTAINER: '#dashboard-adam-container'
        },
        events: {
            SECTOR_LIST_CHANGE: 'fx.filter.list.change.sectorcode',
            UID_LIST_CHANGE: 'fx.filter.list.change.uid'
        },
        datasetChanged: false,
        datasetType: {"uid": "usd_commitment"}
    };

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
            this.datasetChanged = s.datasetChanged;
            this.datasetType = s.datasetType;


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

            this.$sideBrowse = this.$el.find(s.css_classes.SIDE_BROWSE);

        },

        _bindEventListeners: function () {

            var self = this;

            amplify.subscribe(s.events.SECTOR_LIST_CHANGE, this, this._onSectorChange);

            amplify.subscribe(s.events.UID_LIST_CHANGE, this, this._onDatasetChange);

            this.$filterSubmitBrowse.on('click', function (e, data) {

                var filter = {};
                var values = self.filterBrowse.getValues();
                var sectorcodeObj = self._getObjectByValue('9999',values);

                // Set Sectors to crs_sectors
                if(!this._hasNoSelections('sectorcode', values)){
                    values['sectorcode'].codes[0].uid = 'crs_sectors';
                }
                // Set Subsectors to crs_purposes
                if(!this._hasNoSelections('purposecode', values)){
                    values['purposecode'].codes[0].uid = 'crs_purposes';
                }

                // Update Dashboard Config and Rebuild if uid changed
                if(self.datasetChanged) {
                    self.dashboardConfig.uid = self.datasetType.uid;
                    self.dashboardFAOConfig.uid = self.datasetType.uid;

                    if(sectorcodeObj)   {
                        self._updateConfigurationsWithFaoRelatedSectors2(values, sectorcodeObj);
                        self._rebuildBrowseDashboard(self.dashboardFAOConfig, [values]);
                    }
                    else
                      self._rebuildBrowseDashboard(self.dashboardConfig, [values]);

                }
                else {
                    // Update Dashboard Config and values if FAO Related Sectors selected
                    if(sectorcodeObj) {
                        self._updateConfigurationsWithFaoRelatedSectors2(values, sectorcodeObj);
                        self._rebuildBrowseDashboard(self.dashboardFAOConfig, [values]);
                    } else {
                        self.browseDashboard.filter([values]);
                    }
                }

            });

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

                    });
                }
            }
        },

        _onDatasetChange: function (data) {
            if(data.value){
                if(this.dashboardConfig)  {
                    if(data.value !== this.dashboardConfig.uid) {
                        this.datasetChanged = true;
                        this.datasetType.uid = data.value;
                    }
                    else
                        this.datasetChanged = false;
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

            //update State
           // amplify.publish(E.STATE_CHANGE, {menu: 'browse', breadcrumb: this._initMenuBreadcrumbItem()});

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

           this.filterConfig = config.filter;

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

           this._renderBrowseDashboard(this.dashboardConfig);


        },

        _updateDashboardTitles : function (filter) {

            //console.log(filter)



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
                        layout: 'fluidGrid'
                    });

                    var adapterMap = {};

                    self.filterBrowse.add(c, adapterMap);

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
       }


   });

    return BrowseByView;
});
