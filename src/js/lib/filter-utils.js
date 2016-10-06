/*global define, requirejs*/
define([
    'jquery',
    'underscore',
    'fx-common/utils',
    'lib/utils',
    'config/Config',
    'i18n!nls/filter'
], function ($, _, FxUtils, Utils, BaseConfig, i18nLabels) {

    'use strict';

    function FilterUtils() {
        return this;
    }


    /**
     * Updates the filter configuration including setting the language related labels in the filter template
     * Returns: Updated Configuration
     * @returns {Object} updatedConf
     * @private
     */
    FilterUtils.prototype.getUpdatedFilterConfig = function (config) {
        var conf = $.extend(true, {}, config),
            values = {},
            updatedConf = FxUtils.mergeConfigurations(conf, values);

        _.each(updatedConf, _.bind(function (obj, key) {

            if (!obj.template) {
                obj.template = {};
            }
            //Add i18n label
            obj.template.title = Utils.getI18nLabel(key, i18nLabels, "filter_");
            obj.template.headerIconTooltip = Utils.getI18nLabel(key, i18nLabels, "filter_tooltip_");

        }, this));

        return updatedConf;
    };



    /**
     *  Process the time range so that it complies with the expected D3S format
     * @param filter
     * @returns {Object} filter
     */
    FilterUtils.prototype.processTimeRange = function (filter) {

        var year_from = filter.values[BaseConfig.SELECTORS.YEAR_FROM], year_to = filter.values[BaseConfig.SELECTORS.YEAR_TO];

        //reformat to and from years
        filter.values.year[0].value = year_from[0];
        filter.values.year[1].value = year_to[0];

        filter.labels.year.range = year_from[0] + '-' + year_to[0];
        filter.labels[BaseConfig.SELECTORS.YEAR_FROM] = [];
        filter.labels[BaseConfig.SELECTORS.YEAR_TO] = [];

        return filter;
    };



    /**
     *  Process the ODA so that it complies with the expected D3S format
     * @param filter
     * @returns {Object} filter
     */
    FilterUtils.prototype.processODA = function (filter) {

        var enumeration = [], oda = filter.values[BaseConfig.SELECTORS.ODA][0];
        enumeration.push(oda);

        filter.values[BaseConfig.SELECTORS.ODA] = {};
        filter.values[BaseConfig.SELECTORS.ODA].enumeration = enumeration;


        return filter;
    };



    FilterUtils.prototype.getPropertiesObject = function (id, value) {
        var additionalProperties = {};
        additionalProperties[id] = value;

        return additionalProperties;
    };



    FilterUtils.prototype.clearSelectize = function (el, id) {
        var filterItem = el.find("[data-selector="+id+"]")[0];
        var selectize = $(filterItem).find("[data-role=dropdown]")[0].selectize;
        selectize.clear(true);
    };



    /**
     *  Get the filter configuration associated to the ID
     * @param id
     * @returns {Object} values
     * @private
     */

    FilterUtils.prototype.getFilterConfigById = function (config, id) {
        var filter;

        $.each(config, function (key, obj) {
            if (key === id) {
                return filter = obj;
            }
        });

        return filter;
    };



    /**
     * Get the Object from the data based on the id (key)
     * @param id
     * @param data
     * @returns {*}
     * @private
     */
    FilterUtils.prototype.getObject = function (id, data) {
        if (_.has(data, id)) {
            if (data[id].length > 0 || !_.isEmpty(data[id])) {
                return data[id];
            }
        }
    };


    return FilterUtils;
});
