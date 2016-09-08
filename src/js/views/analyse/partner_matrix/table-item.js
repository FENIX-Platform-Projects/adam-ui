/*global define, Promise, amplify */

define([
    "jquery",
    "loglevel",
    'underscore',
    'fx-dashboard/config/errors',
    'fx-dashboard/config/events',
    'fx-dashboard/config/config',
    'text!templates/analyse/partner_matrix/table-item.hbs',
    'fx-table/start',
    'fx-filter/start',
    'fx-common/pivotator/fenixtool',
    'config/analyse/partner_matrix/config-table-filter',
    'lib/utils',
    'i18n!nls/filter',
    'fx-common/utils',
    'handlebars',
    'amplify'
], function ($, log, _, ERR, EVT, C, Template, OlapCreator, Filter, FenixTool, FilterModel, Utils, i18nLabels, FxUtils, Handlebars) {

    'use strict';

    var Model;

    var s = {
        CONFIGURATION_EXPORT: "#configuration-export",
        FILTER_INTERACTION: "#filter-interaction",
        OLAP_INTERACTION: "#olap-interaction"
    };

    var defaultOptions = {
    };

    /**
     *
     * Returns a customised item for the Table Dashboard View
     * Formats the payload and renders the table template
     * @class TableItem
     */

    function TableItem(o) {

        var self = this;

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
        $(this.el).html(this.indicatortemplate);

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

        this.controller._trigger('table_ready', {data: {size: this.model.size}});

        console.log("================ RENDER ITEM ================");
        console.log(this);
        if (this.model.size > 0) {
            var metadata = this.model.metadata.dsd.columns;
            this._processPayload();
        }

    };


    TableItem.prototype._processPayload = function () {

        var config = this._getUpdatedFilterConfig(FilterModel);

        this.filter = new Filter({
            el: s.FILTER_INTERACTION,
            items: config
        });

        this.filter.on("ready", _.bind(function () {

            var config = this._getOlapConfigFromFilter();

            config = $.extend(true, {}, {
                    model: this.model,
                    el: s.OLAP_INTERACTION
                }, config
            );


            for(var d in config.derived)
            {
                config.aggregations.push(d);
            }

           // console.log("============  UPDATE TABLE ITEM ============");
            //console.log(JSON.stringify(config));



            this.olap = new OlapCreator(config);
        }, this));

        this.filter.on("change", _.bind(function () {

            var config = this._getOlapConfigFromFilter();
           // config.inputFormat =  'fenixtool';

           // console.log("============  UPDATE TABLE ITEM ============");
           // console.log(JSON.stringify(config));


            this.olap.update(config);

        }, this));

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
            obj.template.title = Utils.getI18nLabel(key, i18nLabels, "filter_"+this.topic+"_");

        }, this));

        return updatedConf;

    };

    TableItem.prototype._getOlapConfigFromFilter = function () {
        var values = this.filter.getValues();
        var groupedRow = false;

        if(values.values.groupedRow.length>0){
           groupedRow=true;
        }

        this.config.groupedRow = groupedRow;

        return this.config;

    };


    TableItem.prototype._destroyCustomItem = function () {

        //TODO
        log.info("Destroyed Custom: " + this.id);
    };

    TableItem.prototype._bindEventListeners = function () {
        // amplify.subscribe(s.events.CUSTOM_ITEM_COUNTRY_RESPONSE, this, this._showCountryIndicators);
    };

    TableItem.prototype._unbindEventListeners = function () {
        //TODO
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