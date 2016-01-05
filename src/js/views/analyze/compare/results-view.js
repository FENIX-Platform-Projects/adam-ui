/*global define, amplify*/
define([
    'jquery',
    'underscore',
    'views/base/view',
    'text!templates/analyze/compare/results.hbs',
    'text!templates/analyze/compare/result.hbs',
    'i18n!nls/analyze',
    'config/Events',
    'config/Config',
    'config/browse/Config',
    'handlebars',
    'loglevel',
    'amplify'
], function ($, _, View, template, resultTemplate, i18nLabels, E, GC, BC, Handlebars, log) {

    'use strict';

    var s = {
        LIST: "#results-list",
        SWITCH: "a[data-toggle='tab']",
        SWITCH_CHECKED: "input[type='radio']:checked",
        TAB: ".tab-container [data-visualization]",
        REMOVE_BTN: "[data-control='remove']",
        TABLE_CONTAINER: "[data-visualization='table'] [data-container]",
        CHART_CONTAINER: "[data-visualization='chart'] [data-container]"
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
        },

        _initObj: function (obj) {

            obj.tab = "table";

            obj.tabs = {};

        },

        add: function (obj) {
            log.info("Add result:");
            log.info(obj);

            var template = Handlebars.compile(resultTemplate),
                $li = $(template($.extend(true, {}, i18nLabels, obj.request.selection.labels, obj))),
                o = $.extend(true, obj, {$el: $li});

            this._initObj(obj);

            this._bindObjEventListeners(o);

            this.$list.append($li);

            return $li;

        },

        renderObj: function (obj) {

            obj.ready = true;

            this._setStatus(obj, "ready");

            this._onTabChange(obj);
        },

        errorObj: function (obj) {
            log.error("Error on result:");
            log.error(obj);

            this._setStatus(obj, "error");

            //TODO handle error

        },

        _bindObjEventListeners: function (obj) {

            var $el = obj.$el;

            $el.find(s.SWITCH).on('shown.bs.tab', _.bind(this._onSwitchChange, this, obj));

            $el.find(s.REMOVE_BTN).on('click', _.bind(this._onRemoveItem, this, obj));

        },

        _setStatus: function (obj, status) {
            log.info("Set '" + status + "' for result id: " + obj.id);
            log.info(obj);

            obj.$el.attr("data-status", status);
        },

        _onSwitchChange: function (obj, e) {
            log.info("Change visualization for result id: " + obj.id);

            obj.tab = $(e.target).attr("data-visualization"); // newly activated tab
            obj.previousTab = $(e.relatedTarget).attr("data-visualization"); // previous active tab

            log.info("Show tab: " + obj.tab);

            this._onTabChange(obj);
        },

        _onRemoveItem: function (obj) {
            log.info("Remove result id: " + obj.id);

            this.removeItem(obj);
        },

        _unbindObjEventListeners: function (obj) {

            var $el = obj.$el;

            $el.find(s.SWITCH).off();

            $el.find(s.REMOVE_BTN).off();

        },

        _onTabChange: function (obj) {

            if (obj.ready === true && obj.tabs.hasOwnProperty(obj.tab) && obj.tabs[obj.tab].ready === true) {
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

        },

        _tab_table: function (obj) {
            log.info("'Table' callback");

        },

        // end tab callback

        removeItem: function (obj) {

            this._unbindObjEventListeners(obj);

            this._remove(obj.$el);

            //TODO destroy

        },

        _remove: function ($el) {

            $el.remove();
        },

        reset: function () {
            log.info("Results reset");

            this.$list.empty();

            //TODO destroy itmes
        }


    });

    return ResultsView;
});
