/*global define, Promise, amplify */

define([
    "jquery",
    "loglevel",
    'underscore',
    'fx-dashboard/config/errors',
    'fx-dashboard/config/events',
    'fx-dashboard/config/config',
    'text!templates/analyse/projects/table-item.hbs',
    'fx-table/start',
    'fx-filter/start',
    'fx-common/pivotator/fenixtool',
    'lib/utils',
    'i18n!nls/table',
    'i18n!nls/filter',
    'fx-common/utils',
    'handlebars',
    'amplify'
], function ($, log, _, ERR, EVT, C, Template, OlapCreator, Filter, FenixTool, Utils, i18nTableLabels, i18nLabels, FxUtils, Handlebars) {

    'use strict';

    var Model;

    var s = {
        TABLE_INFO: "#table-info",
        TABLE: "#table",
        TABLE_SIZE: "#table-size"
    };

    var defaultOptions = {};

    /**
     *
     * Returns a customised item for the Table Dashboard View
     * Formats the payload and renders the table template
     * @class TableItem
     */

    function TableItem(o) {

        var self = this;
        this.model = {};

        $.extend(true, this, defaultOptions, o);
        this.$el = $(this.el);

        this._renderTemplate();

        this._initVariables();

        this._render();

        this._bindEventListeners();

        //force async execution
        window.setTimeout(function () {
            self.status.ready = true;
            amplify.publish(self._getEventName(EVT.SELECTOR_READY), self);
            self._trigger("ready");
        }, 0);

        return this;
    }

    /**
     * Disposition method
     * Mandatory method
     */
    TableItem.prototype.dispose = function () {

        this._dispose();

        log.info("Selector disposed successfully");

    };

    /**
     * refresh method
     * Mandatory method
     */
    TableItem.prototype.refresh = function () {

        log.info("Item refresh successfully");

    };

    /**
     * pub/sub
     * @return {Object} component instance
     */
    TableItem.prototype.on = function (channel, fn, context) {
        var _context = context || this;
        if (!this.channels[channel]) {
            this.channels[channel] = [];
        }
        this.channels[channel].push({context: _context, callback: fn});

        return this;
    };

    TableItem.prototype._trigger = function (channel) {

        if (!this.channels[channel]) {
            return false;
        }
        var args = Array.prototype.slice.call(arguments, 1);
        for (var i = 0, l = this.channels[channel].length; i < l; i++) {
            var subscription = this.channels[channel][i];
            subscription.callback.apply(subscription.context, args);
        }

        return this;
    };

    TableItem.prototype._getStatus = function () {
        return this.status;
    };

    TableItem.prototype._renderTemplate = function () {
        this.indicatortemplate = Handlebars.compile(Template);

        var labels = $.extend(true, i18nTableLabels);
        

        var data = $.extend(true, {data:  this.model}, labels);
        var html = this.indicatortemplate(data);

        $(this.el).html(html);
    };

    TableItem.prototype._initVariables = function () {

        this.fenixTool = new FenixTool();

        //Init status
        this.status = {};

        // pub/sub
        this.channels = {};

        //TODO
    };

    TableItem.prototype._render = function () {
            var metadata = this.model.metadata.dsd.columns;
            this._processPayload();
    };

    TableItem.prototype._processPayload = function () {

        this.config.model = this.model;
        this.config.el = s.TABLE;

        for (var d in this.config.derived) {
            this.config.aggregations.push(d);
        }

        this.olap = new OlapCreator(this.config);

    };


    TableItem.prototype._getUpdatedFilterConfig = function (items) {
        var conf = $.extend(true, {}, items),
            values = {},
            updatedConf = FxUtils.mergeConfigurations(conf, values);

        _.each(updatedConf, _.bind(function (obj, key) {

            if (!obj.template) {
                obj.template = {};
            }
            //Add i18n label
            obj.template.title = Utils.getI18nLabel(key, i18nLabels, "filter_");

        }, this));

        return updatedConf;

    };

    TableItem.prototype._getOlapConfigFromFilter = function () {
        var values = this.filter.getValues();
        var groupedRow = false;

        if (values.values.groupedRow.length > 0) {
            groupedRow = true;
        }

        this.config.groupedRow = groupedRow;

        return this.config;

    };


    TableItem.prototype._destroyCustomItem = function () {
        //TODO
        log.info("Destroyed Custom: " + this.id);
    };

    TableItem.prototype._bindEventListeners = function () {
        var self = this;

       this.olap.on('ready', function () {
            var rowSize = this.olap.model.rows.length;

           if(rowSize> 0) {
                 $(self.el).find(s.TABLE_SIZE).html(rowSize);
           }
           else {
               $(self.el).find(s.TABLE_SIZE).html(0);
               this.$el.html("");
           }
       });
    };

    TableItem.prototype._unbindEventListeners = function () {
       //this.olap.off('ready');
       //this.filter.off('ready');
    };

    TableItem.prototype._dispose = function () {

        this._unbindEventListeners();

        this._destroyCustomItem();

    };

    TableItem.prototype._getEventName = function (evt) {

        return this.controller.id + evt;
    };

    return TableItem;

});