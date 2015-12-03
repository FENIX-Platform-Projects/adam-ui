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
    'amplify',
    'select2',
    'jstree',
    'highcharts-export'

], function (View, Dashboard, Filter, template, browseByDashboardTemplate, modulesTemplate, i18nLabels, topicFludeLabels, moduleLabels, E, C, FludeTopics, TopicFludeConfig, FilterConfCreator, Handlebars, Utils) {

    'use strict';

    var s = {
        TOPIC_SELECTOR_FLUDE: "#flude-topic-selector",
        TOPIC_CONTENT_FLUDE: "#flude-topic-content",
        FILTER_OPENER_FLUDE: ".filter-opener-flude",
        FILTER_CONTAINER_FLUDE: "#filter-container-flude",
        FILTER_FLUDE: "filter-flude",
        FILTER_SUBMIT_FLUDE: "#filter-submit-btn-flude",

        SIDE_FLUDE: "#side-flude",


        DASHBOARD_FLUDE_CONTAINER: '#dashboard-flude-container'


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

            this._bindEventListeners();

            this.browse_type ? this._showFludeTopic(this.browse_type) :  this._displayBrowseOptions() ;
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

            this.$topicSelectorFlude = this.$el.find(s.TOPIC_SELECTOR_FLUDE);
            this.$topicContentFlude = this.$el.find(s.TOPIC_CONTENT_FLUDE);

            this.$filterOpenerFlude = this.$el.find(s.FILTER_OPENER_FLUDE);
            this.$filterContainerFlude = this.$el.find(s.FILTER_CONTAINER_FLUDE);

            this.$filterSubmitFlude = this.$el.find(s.FILTER_SUBMIT_FLUDE);

            this.$sideFlude = this.$el.find(s.SIDE_FLUDE);



        },

        _bindEventListeners: function () {

            var self = this;

            this.$topicSelectorFlude.on("change", function (e) {
                self._onFludeTopicChange(e.val);
            });

            this.$filterSubmitFlude.on('click', function (e, data) {

                var filter = {};
                var values = self.filterFlude.getValues();

                console.log(values);

                // TODO: funzione per distruggere dashboard e ricrearla con gli items giusti:
                /*
                 var filteredConfig = self._getFilteredConfig(values, self.$faostatDashboardConfig);
                 self._renderFaostatDashboard(filteredConfig);
                 self.fludeDashboard.filter([values]);
                 */

                // TODO: it's an array
                self.fludeDashboard.filter([values]);
            });

        },

        _onFludeTopicChange: function (topic) {
            this._showFludeTopic(topic);
        },



        _showFludeTopic: function (topic) {
            console.log("_showFludeTopic = "+ topic);

            var self = this;

            //Inject HTML
           var source = $(browseByDashboardTemplate).find("[data-topic='" + topic + "']"),
               template = Handlebars.compile(source.prop('outerHTML')),
               html = template(topicFludeLabels[topic]);

            this.$topicContentFlude.html(html);



            this._renderFludeComponents(topic);

        },


        _initComponents: function () {

            //Flude

            var conf = JSON.parse(FludeTopics);

            this.$topicSelectorFlude.select2(conf);

            this.$topicSelectorFlude.select2('data', conf.data[0]);
           // this._onFludeTopicChange(conf.data[0].id);  // sets first item as default


        },

        _renderFludeComponents: function (topic) {

            console.log("_renderFludeComponents = "+ topic);

            var config = TopicFludeConfig[topic];

            if (!config || !config.dashboard || !config.filter) {
                alert(" HERE Impossible to find configuration for topic: " + topic);
                return;
            }

            var filterConfig = config.filter;

           this._renderFludeFilter(filterConfig);

           // this._renderFludeDashboard(config.dashboard);


        },

        _updateDashboardTitles : function (filter) {

            //console.log(filter)



        },


        _renderFludeDashboard: function (config) {

            if (this.fludeDashboard && this.fludeDashboard.destroy) {
                this.fludeDashboard.destroy();
            }

            console.log(config);

            this.fludeDashboard = new Dashboard({

                //Ignored if layout = injected
                container: s.DASHBOARD_FLUDE_CONTAINER,
                layout: "injected"
            });

            this.fludeDashboard.render(config);

        },

        _renderFludeFilter: function (config) {

            var self = this;

            this.filterConfCreator = new FilterConfCreator();

            this.filterConfCreator.getConfiguration(config)
                .then(function (c) {
                    console.log("====================== GET CONFIG ===============");
                    console.log(c);
                    self.filterFlude = new Filter();

                    self.filterFlude.init({
                        container: s.FILTER_FLUDE,
                        layout: 'fluidGrid'
                    });

                    var adapterMap = {};

                    self.filterFlude.add(c, adapterMap);

                });

        },

        _displayBrowseOptions: function () {
            var template = Handlebars.compile(modulesTemplate),
                html = template({modules: moduleLabels["modules"]});

           this.$el.html(html);
        }



    });

    return BrowseView;
});
