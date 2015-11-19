/*global define, amplify*/
define([
    'views/base/view',
    'fx-ds/start',
    'fx-filter/start',
    'text!templates/analysis/analysis.hbs',
    'text!templates/analysis/topics-flude.hbs',
    'text!templates/analysis/topics-faostat.hbs',
    'i18n!nls/analysis',
    'i18n!nls/topics-flude',
    'i18n!nls/topics-faostat',
    'config/Events',
    'config/Config',
    'text!config/analysis/flude-topics.json',
    'text!config/analysis/faostat-topics.json',
    'config/analysis/topics-flude',
    'config/analysis/topics-faostat',
    'fx-filter/Fx-filter-configuration-creator',
    'handlebars',
    'amplify',
    'select2',
    'jstree',
    'highcharts-export'
], function (View, Dashboard, Filter, template, topicsFludeTemplate, topicsFaostatTemplate, i18nLabels, topicFludeLabels, topicFaostatLabels, E, C, FludeTopics, FaostatTopics, TopicFludeConfig, TopicFaostatConfig, FilterConfCreator, Handlebars) {

    'use strict';

    var s = {
        TOPIC_SELECTOR_FLUDE: "#flude-topic-selector",
        TOPIC_SELECTOR_FAOSTAT: "#faostat-topic-selector",
        TOPIC_CONTENT_FLUDE: "#flude-topic-content",
        TOPIC_CONTENT_FAOSTAT: "#faostat-topic-content",
        FILTER_OPENER_FAOSTAT: ".filter-opener-faostat",
        FILTER_OPENER_FLUDE: ".filter-opener-flude",
        FILTER_CONTAINER_FLUDE: "#filter-container-flude",
        FILTER_CONTAINER_FAOSTAT: "#filter-container-faostat",
        FILTER_FLUDE: "filter-flude",
        FILTER_FAOSTAT: "filter-faostat",
        FILTER_SUBMIT_FLUDE: "#filter-submit-btn-flude",
        FILTER_SUBMIT_FAOSTAT: "#filter-submit-btn-faostat",

        SIDE_FLUDE: "#side-flude",
        SIDE_FAOSTAT: "#side-faostat",
        TOGGLE_SIDE_FAOSTAT: "#toggle-side-faostat",

        DOWNLOAD_BTN_FLUDE: "#flude-download-btn",

        DASHBOARD_FLUDE_CONTAINER: '#dashboard-flude-container',
        DASHBOARD_FAOSTAT_CONTAINER: '#dashboard-faostat-container'

    };

    var AnalysisView = View.extend({

        // Automatically render after initialize
        autoRender: true,

        className: 'analysis',

        // Save the template string in a prototype property.
        // This is overwritten with the compiled template function.
        // In the end you might want to used precompiled templates.
        template: template,

        getTemplateData: function () {
            return i18nLabels;
        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            //update State
            amplify.publish(E.STATE_CHANGE, {menu: 'analysis'});

            this._initVariables();

            this._initComponents();

            this._bindEventListeners();

        },

        _initVariables: function () {

            this.$topicSelectorFlude = this.$el.find(s.TOPIC_SELECTOR_FLUDE);
            this.$topicSelectorFaostat = this.$el.find(s.TOPIC_SELECTOR_FAOSTAT);
            this.$topicContentFlude = this.$el.find(s.TOPIC_CONTENT_FLUDE);
            this.$topicContentFaostat = this.$el.find(s.TOPIC_CONTENT_FAOSTAT);

            this.$filterOpenerFlude = this.$el.find(s.FILTER_OPENER_FLUDE);
            this.$filterOpenerFaostat = this.$el.find(s.FILTER_OPENER_FAOSTAT);
            this.$filterContainerFlude = this.$el.find(s.FILTER_CONTAINER_FLUDE);
            this.$filterContainerFaostat = this.$el.find(s.FILTER_CONTAINER_FAOSTAT);

            this.$filterSubmitFaostat = this.$el.find(s.FILTER_SUBMIT_FAOSTAT);
            this.$filterSubmitFlude = this.$el.find(s.FILTER_SUBMIT_FLUDE);

            this.$sideFlude = this.$el.find(s.SIDE_FLUDE);
            this.$sideFaostat = this.$el.find(s.SIDE_FAOSTAT);

            this.$toggleFaostatSideBtn = this.$el.find(s.TOGGLE_SIDE_FAOSTAT);

            this.$downloadBtnFlude = this.$el.find(s.DOWNLOAD_BTN_FLUDE);

        },

        _bindEventListeners: function () {

            var self = this;

            this.$topicSelectorFlude.on("change", function (e) {
                self._onFludeTopicChange(e.val);
            });

            this.$topicSelectorFaostat.on("change", function (e) {
                self._onFaostatTopicChange(e.val);
            });

            this.$filterSubmitFaostat.on('click', function (e, data) {

                var filter = {};
                var values = self.filterFaostat.getValues();
                // TODO: funzione per distruggere dashboard e ricrearla con gli items giusti:

/*                 var filteredConfig = self._getFilteredConfig(values, self.$faostatDashboardConfig);
                 self._renderFaostatDashboard(filteredConfig);
                 self.faostatDashboard.filter([values]);
 */

                // TODO: it's an array
                self.faostatDashboard.filter([values]);
            });

            this.$filterSubmitFlude.on('click', function (e, data) {

                var filter = {};
                var values = self.filterFlude.getValues();
                // TODO: funzione per distruggere dashboard e ricrearla con gli items giusti:
                /*
                 var filteredConfig = self._getFilteredConfig(values, self.$faostatDashboardConfig);
                 self._renderFaostatDashboard(filteredConfig);
                 self.fludeDashboard.filter([values]);
                 */

                // TODO: it's an array
                self.fludeDashboard.filter([values]);
            });

            this.$toggleFaostatSideBtn.on('click', function () {

                self.$sideFlude.toggleClass('col-xs-6').toggleClass('col-xs-12');
            

                 if (!self.$sideFaostat.is(':visible')) {
                     self.$sideFaostat.show();
                     self._loadFaostatForTheFirstTime();
                 } else {
                     self.$sideFaostat.hide()
                 }


                $("body").toggleClass('super-extreme-filter');
                
		amplify.publish("fx.window.resize");
		$(window).trigger('resize');
                window.dispatchEvent(new Event('resize'));

                window.setTimeout(function () {
			amplify.publish("fx.window.resize");
                    $(window).trigger('resize');
                    window.dispatchEvent(new Event('resize'));
                }, 100);


            });
        },

        _loadFaostatForTheFirstTime : function () {

            if (this._faostatIsAlreadyInitialized === true ){
                return;
            }

            this._faostatIsAlreadyInitialized = true;

            var confFS =  JSON.parse(FaostatTopics);

            this._onFaostatTopicChange(confFS.data[0].id);

        },

        _onFludeTopicChange: function (topic) {

            this._configureFludeDownload(topic);

            this._showFludeTopic(topic);

        },

        _configureFludeDownload: function (topic) {

            this.$downloadBtnFlude.attr("href", C.DOWNLOAD_FILE_SYSTEM_ROOT + TopicFludeConfig[topic].download.target)

        },

        _onFaostatTopicChange: function (topic) {

            this._showFaostatTopic(topic);

        },

        _showFludeTopic: function (topic) {

            //Inject HTML
            var source = $(topicsFludeTemplate).find("[data-topic='" + topic + "']"),
                template = Handlebars.compile(source.prop('outerHTML')),
                html = template(topicFludeLabels[topic]);

            this.$topicContentFlude.html(html);

            this._renderFludeComponents(topic);

        },

        _showFaostatTopic: function (topic) {

            //Inject HTML
            var source = $(topicsFaostatTemplate).find("[data-topic='" + topic + "']"),
                template = Handlebars.compile(source.prop('outerHTML')),
                html = template(topicFaostatLabels[topic]);

            this.$topicContentFaostat.html(html);

            this._renderFaostatComponents(topic);

        },

        _initComponents: function () {

            //Flude

            var conf = JSON.parse(FludeTopics);

            this.$topicSelectorFlude.select2(conf);

            this.$topicSelectorFlude.select2('data', conf.data[0]);
            this._onFludeTopicChange(conf.data[0].id);

            //Faostat

            var confFS =  JSON.parse(FaostatTopics);
            this.$topicSelectorFaostat.select2(confFS);
            this.$topicSelectorFaostat.select2('data', confFS.data[0]);


        },

        _renderFludeComponents: function (topic) {

            var config = TopicFludeConfig[topic];

            if (!config || !config.dashboard || !config.filter) {
                alert("Impossible to find configuration for topic: " + topic);
                return;
            }

            var filterConfig = config.filter;

            this._renderFludeFilter(filterConfig);

            this._renderFludeDashboard(config.dashboard);

        },

        _updateDashboardTitles : function (filter) {

            //console.log(filter)



        },

        _renderFaostatComponents: function (topic) {

            var config = TopicFaostatConfig[topic];

            if (!config || !config.dashboard || !config.filter) {
                alert("Impossible to find configuration for topic: " + topic);
                return;
            }

            var filterConfig = config.filter;

            this._renderFaostatFilter(filterConfig);

            this._renderFaostatDashboard(config.dashboard);

        },

        _renderFludeDashboard: function (config) {

            if (this.fludeDashboard && this.fludeDashboard.destroy) {
                this.fludeDashboard.destroy();
            }


            this.fludeDashboard = new Dashboard({

                //Ignored if layout = injected
                container: s.DASHBOARD_FLUDE_CONTAINER,
                layout: "injected"
            });

            this.fludeDashboard.render(config);

        },

        _renderFaostatDashboard: function (config) {

            if (this.faostatDashboard && this.faostatDashboard.destroy) {
                this.faostatDashboard.destroy();
            }

            this.faostatDashboard = new Dashboard({

                //Ignored if layout = injected
                container: s.DASHBOARD_FAOSTAT_CONTAINER,

                layout: "injected"
            });

            this.faostatDashboard.render(config);

        },

        _renderFludeFilter: function (config) {

            var self = this;

            this.filterConfCreator = new FilterConfCreator();

            this.filterConfCreator.getConfiguration(config)
                .then(function (c) {

                    self.filterFlude = new Filter();

                    self.filterFlude.init({
                        container: s.FILTER_FLUDE,
                        layout: 'fluidGrid'
                    });

                    var adapterMap = {};

                    self.filterFlude.add(c, adapterMap);

                });

        },

        _renderFaostatFilter: function (config) {

            var self = this;

            this.filterConfCreator = new FilterConfCreator();

            this.filterConfCreator.getConfiguration(config)
                .then(function (c) {

                    self.filterFaostat = new Filter();

                    self.filterFaostat.init({
                        container: s.FILTER_FAOSTAT,
                        layout: 'fluidGrid'
                    });

                    var adapterMap = {};

                    self.filterFaostat.add(c, adapterMap);

                });

        }

    });

    return AnalysisView;
});
