/*global define, amplify*/
define([
    'views/base/view',
    'fx-ds/start',
    'fx-filter/start',
    'text!templates/browse/browse.hbs',
    'text!templates/browse/dashboard.hbs',
    'text!templates/common/modules.hbs',
    'i18n!nls/browse',
    'i18n!nls/topics-flude',
    'i18n!nls/browse-modules',
    'config/Events',
    'config/Config',
    'text!config/browse/flude-topics.json',
    'config/browse/Config',
    'fx-filter/Fx-filter-configuration-creator',
    'handlebars',
    'lib/utils',
    'q',
    'amplify',
    'select2',
    'jstree',
    'highcharts-export'

], function (View, Dashboard, Filter, template, browseByDashboardTemplate, modulesTemplate, i18nLabels, topicFludeLabels, moduleLabels, E, C, FludeTopics, BrowseConfig, FilterConfCreator, Handlebars, Utils, Q) {

    'use strict';

    var s = {
        css_classes: {
            TOPIC_SELECTOR_BROWSE: "#browse-topic-selector",
            TOPIC_CONTENT_BROWSE: "#browse-topic-content",
            FILTER_OPENER_BROWSE: ".filter-opener-browse",
            FILTER_CONTAINER_BROWSE: "#filter-container-browse",
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

    var BrowseView = View.extend({

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

            this._initComponents();

            this.browse_type ? this._showBrowseTopic(this.browse_type) :  this._displayBrowseOptions() ;

            this._bindEventListeners();
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

            this.$topicSelectorFlude = this.$el.find(s.css_classes.TOPIC_SELECTOR_BROWSE);
            this.$topicContentFlude = this.$el.find(s.css_classes.TOPIC_CONTENT_BROWSE);

            this.$filterOpenerFlude = this.$el.find(s.css_classes.FILTER_OPENER_BROWSE);
            this.$filterContainerFlude = this.$el.find(s.css_classes.FILTER_CONTAINER_BROWSE);

            this.$filterSubmitBrowse = this.$el.find(s.css_classes.FILTER_SUBMIT_BROWSE);

            this.$sideFlude = this.$el.find(s.css_classes.SIDE_BROWSE);



        },

        _bindEventListeners: function () {

            var self = this;

            amplify.subscribe(s.events.SECTOR_LIST_CHANGE, this, this._onSectorChange);

            amplify.subscribe(s.events.UID_LIST_CHANGE, this, this._onDatasetChange);

            this.$topicSelectorFlude.on("change", function (e) {
                self._onBrowseTopicChange(e.val);
            });

            this.$filterSubmitBrowse.on('click', function (e, data) {

                var filter = {};
                var values = self.filterBrowse.getValues();
                console.log(values);

                // Update Dashboard Config and Rebuild if uid changed
                if(self.datasetChanged){
                   self.dashboardConfig.uid =  self.datasetType.uid;
                   self._rebuildBrowseDashboard(self.dashboardConfig, [values]);
                } else {
                    self.browseDashboard.filter([values]);
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

        _onBrowseTopicChange: function (topic) {
            this._showBrowseTopic(topic);
        },



        _showBrowseTopic: function (topic) {
            var self = this;

            //Inject HTML
           var source = $(browseByDashboardTemplate).find("[data-topic='" + topic + "']"),
               template = Handlebars.compile(source.prop('outerHTML')),
               html = template(topicFludeLabels[topic]);

            this.$topicContentFlude.html(html);



            this._renderBrowseComponents(topic);

        },


        _initComponents: function () {

            //Flude

            var conf = JSON.parse(FludeTopics);

            this.$topicSelectorFlude.select2(conf);

            this.$topicSelectorFlude.select2('data', conf.data[0]);
           // this._onFludeTopicChange(conf.data[0].id);  // sets first item as default


        },

        _renderBrowseComponents: function (topic) {
            var config = BrowseConfig[topic];

            if (!config || !config.dashboard || !config.filter) {
                alert(" HERE Impossible to find configuration for topic: " + topic);
                return;
            }

           this.filterConfig = config.filter;
           this.dashboardConfig = config.dashboard;

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

        _displayBrowseOptions: function () {
            var template = Handlebars.compile(modulesTemplate),
                html = template({modules: moduleLabels["modules"]});

           this.$el.html(html);
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

    return BrowseView;
});
