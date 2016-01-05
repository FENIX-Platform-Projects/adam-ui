/*global define, amplify*/
define([
    'jquery',
    'underscore',
    'fx-c-c/start',
    'views/base/view',
    'text!templates/analyze/compare/results.hbs',
    'text!templates/analyze/compare/result.hbs',
    'i18n!nls/analyze',
    'config/Events',
    'config/Config',
    'config/analyze/compare/Config',
    'handlebars',
    'loglevel',
    //TODO REMOVE ME
    'text!../../../../../submodules/fenix-ui-chart-creator/tests/fenix/data/afo/scattered_data.json',
    'amplify'
], function ($, _, ChartCreator, View, template, resultTemplate, i18nLabels, E, GC, AC, Handlebars, log, TEST_MODEL) {

    'use strict';

    var s = {
        LIST: "#results-list",
        TABS_CONTROLLERS: "a[data-toggle='tab']",
        TAB: ".tab-container [data-visualization]",
        REMOVE_BTN: "[data-control='remove']",
        RELOAD_BTN: "[data-control='reload']",
        TABLE_CONTAINER: "[data-content='ready'] [data-visualization='table'] [data-container='table']",
        CHART_CONTAINER: "[data-content='ready'] [data-visualization='chart'] [data-container='chart']"
    };

    var ResultsView = View.extend({

        // Automatically render after initialize
        autoRender: true,

        className: 'analyze-compare-results',

        template: template,

        initialize: function (params) {

            View.prototype.initialize.call(this, arguments);
        },

        getTemplateData: function () {
            return i18nLabels;
        },

        attach: function () {
            View.prototype.attach.call(this, arguments);

            this._initVariables();

        },

        _initVariables: function () {

            this.$list = this.$el.find(s.LIST);

            this.currentObjs = [];
        },

        _initObj: function (obj) {

            obj.tabs = {};

        },

        add: function (obj) {
            log.info("Add result:");
            log.info(obj);

            var template = Handlebars.compile(resultTemplate),
                $li = $(template($.extend(true, {}, i18nLabels, obj.request.selection.labels, obj))),
                o = $.extend(true, obj, {$el: $li});

            this._bindObjEventListeners(o);

            this._initObj(obj);

            this.$list.prepend($li);

            //Add obj to current objs
            this.currentObjs.push(obj);

            return $li;

        },

        renderObj: function (obj) {
            log.info("Render result:");
            log.info(obj);

            this._setStatus(obj, "ready");

            this._renderObj(obj);
        },


        _renderObj: function (obj) {

            //show default tab
            var $tabs = obj.$el.find(s.TABS_CONTROLLERS),
                $candidate = $tabs.filter("[data-visualization='"+AC.resultDefaultTab+"']");

            if ($candidate.length < 1) {
                $candidate = $tabs.first();

                log.warn("Impossible to find default tab '"+AC.resultDefaultTab+"'. Showing first tab instead")
            }

            $candidate.tab('show');

        },

        errorObj: function (obj) {
            log.error("Error on result:");
            log.error(obj);

            this._setStatus(obj, "error");
        },

        _bindObjEventListeners: function (obj) {

            var $el = obj.$el;

            $el.find(s.TABS_CONTROLLERS).on('shown.bs.tab', _.bind(this._onSwitchChange, this, obj));

            $el.find(s.REMOVE_BTN).on('click', _.bind(this._onRemoveItem, this, obj));

            $el.find(s.RELOAD_BTN).on('click', _.bind(this._onReloadClick, this, obj));

        },

        _setStatus: function (obj, status) {
            log.info("Set '" + status + "' for result id: " + obj.id);

            obj.status = status;

            obj.$el.attr("data-status", obj.status);
        },

        _onSwitchChange: function (obj, e) {
            log.info("Change visualization for result id: " + obj.id);

            obj.tab = $(e.target).attr("data-visualization"); // newly activated tab
            obj.previousTab = $(e.relatedTarget).attr("data-visualization"); // previous active tab

            log.info("Show tab: " + obj.tab);

            this._onTabChange(obj);
        },

        _onRemoveItem: function (obj) {
            log.info("Remove event for result id: " + obj.id);

            this.removeItem(obj);
        },

        _onReloadClick : function (obj) {
            log.info("Requesting reload result id: " + obj.id);

            amplify.publish(E.RELOAD_RESULT, obj);
        },

        _unbindObjEventListeners: function (obj) {

            var $el = obj.$el;

            $el.find(s.TABS_CONTROLLERS).off();

            $el.find(s.REMOVE_BTN).off();

        },

        _onTabChange: function (obj) {

            if (obj.status !== 'ready') {
                log.warn("Obj does not have a 'ready' state. State found: '" + obj.status +"'" );
                return;
            }

            if (obj.status === 'ready' && obj.tabs.hasOwnProperty(obj.tab) && obj.tabs[obj.tab].ready === true) {
                log.info("Tab '" + obj.tab + "' already initialized");
                return;
            }

            log.info("Initializing tab '" + obj.tab + "'");

            //Init tab status
            obj.tabs[obj.tab] = {
                ready: true
            };

            //tab callback
            if ($.isFunction(this["_tab_" + obj.tab])) {

                log.info("Invoking '" + obj.tab + "' tab callback");

                this["_tab_" + obj.tab].call(this, obj);

            } else {

                log.info("Callback for '" + obj.tab + "' tab not found");
            }

        },

        //Tab callback

        _tab_chart: function (obj) {
            log.info("'Chart' callback");

            var status = obj.tabs[obj.tab];

            status.creator = new ChartCreator();

            status.instances = [];

            // Consistent Time series Chart

            $.when(status.creator.init({
                //TODO uncomment
                //model: obj.model,
                model: JSON.parse(TEST_MODEL),
                adapter: {
                    type: "timeserie",
                    xDimensions: 'time',
                    yDimensions: 'Element',
                    valueDimensions: 'value',
                    seriesDimensions: []
                },
                template: {},
                creator: {}
            })).then(function (creator) {

                var intance = creator.render({
                    container: obj.$el.find(s.CHART_CONTAINER),
                    creator: {
                        chartObj: {
                            chart: {
                                type: 'line'
                            },
                            plotOptions: {
                                column: {
                                    stacking: 'normal'
                                }
                            }
                        }
                    }
                });

                status.instances.push(intance);



            });

        },

        _tab_table: function (obj) {
            log.info("'Table' callback");



        },

        // end tab callback

        removeItem: function (obj) {

            this._unbindObjEventListeners(obj);

            //destroy creators
            _.each(obj.tabs, function (status, tab) {

                if (status.instances && Array.isArray(status.instances)){

                    _.each(status.instances, function (inst) {

                       if ($.isFunction(inst.destroy)) {
                           log.warn("Destroy instance here");
                           //inst.destroy.call(inst);
                       }
                    });
                }

            });

            this._remove(obj.$el);

        },

        _remove: function ($el) {

            $el.remove();
        },

        _emptyResults : function () {

            _.each(this.currentObjs, _.bind(this._onRemoveItem, this));

            this.currentObjs = [];

            log.info("Results list emptied");
        },

        reset: function () {

            this._emptyResults();


            log.info("Results reset");
        },

        dispose: function () {

            this._emptyResults();

            View.prototype.dispose.call(this, arguments);
        }


    });

    return ResultsView;
});
