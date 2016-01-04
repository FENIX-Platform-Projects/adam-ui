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
        SWITCH: "input[type='radio']",
        SWITCH_CHECKED: "input[type='radio']:checked",
        TAB: ".tab-container [data-visualization]",
        REMOVE_BTN: "[data-action='remove']",
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

        add: function (obj) {

            log.info("Add result:");
            log.info(obj);

            var template = Handlebars.compile(resultTemplate),
                $li = $(template($.extend(true, {}, i18nLabels, obj.request.selection.labels, obj))),
                o = $.extend(true, obj, {$el: $li});

            this._bindObjEventListeners(o);

            this._onTabChange(o.$el);

            this.$list.append($li);

            return $li;

        },

        renderObj: function (obj) {

            obj.ready = true;

            this._setStatus(obj, "ready");

            //TODO render chart and olap

        },

        errorObj: function (obj) {
            log.error("Error on result:");
            log.error(obj);

            this._setStatus(obj, "error");

            //TODO handle error

        },

        _bindObjEventListeners: function (obj) {

            var $el = obj.$el;

            $el.find(s.SWITCH).on('change', _.bind(this._onSwitchChange, this, obj));

            $el.find(s.REMOVE_BTN).on('click', _.bind(this._onRemoveItem, this, obj));

        },

        _setStatus: function (obj, status) {

            log.info("Set '" + status + "' for result id: " + obj.id);
            log.info(obj);

            obj.$el.attr("data-status", status);
        },

        _onSwitchChange: function (obj) {
            log.info("Change visualization for result id: " + obj.id);

            this._onTabChange(obj.$el);
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

        _onTabChange: function ($li) {

            var $checked = $li.find(s.SWITCH_CHECKED);

            $li.find(s.TAB).hide();

            $li.find('[data-visualization="' + $checked.val() + '"]').show();

            log.info("Show tab: " + $checked.val());

        },

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
        }


    });

    return ResultsView;
});
