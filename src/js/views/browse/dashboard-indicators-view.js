/*global define, amplify*/
define([
    'jquery',
    'underscore',
    'views/base/view',
    'text!templates/browse/indicators-dashboard.hbs',
    'text!templates/browse/indicators-country.hbs',
    'text!templates/browse/indicators-donor.hbs',
    'text!templates/browse/indicators-indicator-partial.hbs',
    'text!templates/browse/indicators-footer-partial.hbs',
    'fx-ds/start',
    'lib/utils',
    'i18n!nls/browse',
    'handlebars',
    'lib/config-utils',
    'amplify'
], function ($, _, View, template, indicatorsCountryTemplate, indicatorsDonorTemplate, indicatorPartialTemplate, footerPartialTemplate, Dashboard, Utils, i18nLabels, Handlebars, ConfigUtils) {

    'use strict';

    var s = {
        css_classes: {
            INDICATORS_DASHBOARD_BROWSE_CONTAINER: '#dashboard-indicators-container'
        },
        events: {
            CUSTOM_ITEM_COUNTRY_RESPONSE: 'fx.dashboard.custom.item.response.country-indicator-1'
        },
        indicatorsOrder : [ 'INCOME.LEVEL', 'POP.TOT',  'NET.ODA.REC',  'SI.POV.GINI', 'NY.GNP.ATLS.CD', 'RUR.POP.PERC', 'NET.ODA.REC.PC', 'ODA.GNI', 'NY.GNP.PCAP.CD', 'NODA', 'AGRI.LAND.PERC', 'DT.ODA.ODAT.GN.ZS'],
        indicatorProperties : {
            CODE: 'code',
            GINI_CODE: 'SI.POV.GINI'
        },
        views : {
            DONOR: 'donor',
            COUNTRY: 'country'
        }
    };

    var DashboardIndicatorsView = View.extend({

        // Automatically render after initialize
        autoRender: false,

        className: 'dashboard-indicators',

        // Save the template string in a prototype property.
        // This is overwritten with the compiled template function.
        // In the end you might want to used precompiled templates.
        template: template,

        events: {
            'click .anchor': 'anchor'
        },

        initialize: function (params) {
            this.topic = params.topic;

            this.model.on("change", this.render, this);
            //this.model.on("change", this.render);

            View.prototype.initialize.call(this, arguments);

            //this.render();
        },

        getTemplateData: function () {
            return i18nLabels;
        },

       anchor: function(e) {
           e.preventDefault();
           e.stopPropagation();

          var nameLink = e.currentTarget.name;

          $('html, body').animate({
           scrollTop: $('#'+nameLink).offset().top
          }, 1000);

       },

        render: function () {
            this.setElement(this.container);
            this._unbindEventListeners();


            $(this.el).hide();
            $(this.el).html(this.getTemplateFunction());
        },

        attach: function () {
            View.prototype.attach.call(this, arguments);

            this.configUtils = new ConfigUtils();

            this._bindEventListeners();

        },

        getTemplateFunction: function() {
            var source = $(this.template).find("[data-topic='" + this.topic + "']").prop('outerHTML');
            var template = Handlebars.compile(source);

            var model = this.model.toJSON();
            var data = $.extend(true, model, i18nLabels);

            var indicatorsPartial = Handlebars.compile(indicatorPartialTemplate);
            Handlebars.registerPartial('indicatorPartial', indicatorsPartial);

            var indicatorsFooterPartial = Handlebars.compile(footerPartialTemplate);
            Handlebars.registerPartial('indicatorsFooterPartial', indicatorsFooterPartial);

            return template(data);
        },

        setDashboardConfig: function(config){
            this.config = config;
        },

        renderDashboard: function () {

            if (this.indicatorsDashboard && this.indicatorsDashboard.destroy) {
                this.indicatorsDashboard.destroy();
            }

            this.indicatorsDashboard = new Dashboard({

                //Ignored if layout = injected
                container: s.css_classes.INDICATORS_DASHBOARD_BROWSE_CONTAINER,
                layout: "injected"
            });


            this.indicatorsDashboard.render(this.config);
        },


        rebuildDashboard: function (filter) {

            if (this.indicatorsDashboard && this.indicatorsDashboard.destroy) {
                this.indicatorsDashboard.destroy();
            }

            this.indicatorsDashboard = new Dashboard({

                //Ignored if layout = injected
                container: s.css_classes.DASHBOARD_BROWSE_CONTAINER,
                layout: "injected"
            });

           this.indicatorsDashboard.rebuild(this.config, filter);
        },


        _bindEventListeners: function () {
            // Add List Change listeners
            amplify.subscribe(s.events.CUSTOM_ITEM_COUNTRY_RESPONSE, this, this._showCountryIndicators);
        },



        _unbindEventListeners: function () {
            // Remove listeners
            amplify.unsubscribe(s.events.CUSTOM_ITEM_COUNTRY_RESPONSE, this._showCountryIndicators);
        },


        _showCountryIndicators: function (payload) {

            var metadata = payload.model.metadata.dsd.columns;
            var data = this._processData(payload.model.data, metadata, payload.config.order);

            data = $.extend(true, data, i18nLabels);

            this.indicatortemplate = Handlebars.compile(indicatorsCountryTemplate);

            if(this.topic == s.views.DONOR){
                this.indicatortemplate = Handlebars.compile(indicatorsDonorTemplate);
            }

            var html = this.indicatortemplate({data: data});

            if(payload.model.size > 0) {
                $(this.el).show();
                $(payload.container).html(html);
            }

        },


        _processData: function (data, metadata, order) {
            var valueIndex = this._findArrayItemIndex(order, "value"),
                sourceIndex = this._findArrayItemIndex(order, "source"),
                noteIndex = this._findArrayItemIndex(order, "note"),
                periodIndex = this._findArrayItemIndex(order, "period"),
                linkIndex = this._findArrayItemIndex(order, "link"),
                indicatorcodeIndex = this._findArrayItemIndex(order, "indicatorcode"),
                itemnameIndex = this._findWithAttr(metadata, "id", "itemcode_"+Utils.getLocale()),
                indicatornameIndex = this._findWithAttr(metadata, "id", "indicatorcode_"+Utils.getLocale()),
                unitnameIndex = this._findWithAttr(metadata, "id", "unitcode_"+Utils.getLocale());

            var newdata = {};
            var indicators = [],
                footnote = [],
                linkArray = [],
                sourceArray = [];

            var results = [], results2 = [], count = 1;
            var hasGINI = false;

            // Create Array of Indicator Objects
            for (var i = 0, len = data.length; i < len; ++i) {
                var indicatorObj =  {};

                //indicatorObj.name = data[i][data[i].length-1];
                indicatorObj.name = data[i][indicatornameIndex];
                indicatorObj.css = data[i][indicatorcodeIndex];
                indicatorObj.code = data[i][indicatorcodeIndex];
                indicatorObj.item = data[i][itemnameIndex];
                indicatorObj.value = data[i][valueIndex];
                indicatorObj.period = data[i][periodIndex];
                indicatorObj.source = data[i][sourceIndex];
                indicatorObj.note = data[i][noteIndex];
                indicatorObj.link = data[i][linkIndex];
                indicatorObj.unit = data[i][unitnameIndex];

                // Track the presence of the
                if(indicatorObj.code ===  s.indicatorProperties.GINI_CODE){
                    hasGINI = true;
                }

                if(indicatorObj.unit === null){
                    indicatorObj.unit = "";
                }

                if(indicatorObj.value === null && indicatorObj.item){
                    indicatorObj.value = indicatorObj.item;
                }

                if(indicatorObj.source === null){
                    indicatorObj.source = "";
                }

                if(indicatorObj.css)
                  indicatorObj.css = indicatorObj.css.replace(/\./g, "_");

                indicators.push(indicatorObj);

            }

           // Reorder the Indicators Array, based on the 'code' order in the indicators order Array
           indicators = this._reorderArrayByProperty(s.indicatorsOrder, indicators, s.indicatorProperties.CODE);

           // console.log(indicators);

            // Add the Footnote details to the reordered indicators

            for (var j = 0, len = indicators.length; j < len; ++j) {
                var indicatorObj  =  indicators[j];

                if ($.inArray(indicatorObj.source + indicatorObj.note, results) < 0) {

                    var sourceObj = {};
                    indicatorObj.footnote = count;
                    sourceObj.sourceid = indicatorObj.source + indicatorObj.note;

                    if (indicatorObj.source.split(";").length > 0) {
                        sourceObj.sourceArray = indicatorObj.source.split(";")
                    } else if (indicatorObj.source) {
                        sourceObj.sourceArray = sourceArray.push(indicatorObj.source);
                    }

                    if (indicatorObj.link.split(";").length > 0) {
                        sourceObj.linkArray = indicatorObj.link.split(";")
                    } else if (indicatorObj.link) {
                        sourceObj.linkArray = linkArray.push(indicatorObj.link);
                    }

                    sourceObj.link = indicatorObj.link;
                    sourceObj.note = indicatorObj.note;

                    if (indicatorObj.source.length === 0)
                        sourceObj.source = indicatorObj.note;
                    else
                        sourceObj.source = indicatorObj.source + ": " + indicatorObj.note;

                    sourceObj.footnote = count;

                    results.push(indicatorObj.source + indicatorObj.note);
                    footnote.push(sourceObj);
                    count++;
                } else {
                    var result = _.findWhere(footnote, {sourceid: indicatorObj.source + indicatorObj.note});

                    indicatorObj.footnote = result.footnote;
                }
            }

            // Move Income Level to the first position
          //  var toIndex = 0;
          //  var fromIndex = _.chain(indicators).pluck("code").indexOf(s.indicatorIds.INCOME_LEVEL).value();
          //  indicators.splice(toIndex,0,indicators.splice(fromIndex,1)[0]);

            // console.log("AFTER==========");
            //console.log(indicators);
            newdata.indicators = indicators;
            if(hasGINI)
                newdata.colIdx = 3;
             else
                newdata.colIdx = 4;

            newdata.footnotes = footnote;

           // console.log(newdata);
           // console.log(newdata.indicators);
           // console.log(newdata.footnotes);
            return newdata;
        },

        _reorderArrayByProperty: function (array_with_order, array_to_order, orderByProperty) {
            var reordered_array = [],
                len = array_to_order.length,
                index, current;

            for (; len--;) {
                current = array_to_order[len];
                index = array_with_order.indexOf(current[orderByProperty]);
                reordered_array[index] = current;
            }

            // filters out any undefined items in the reordered array
            reordered_array = reordered_array.filter(function(e){return e});

            return reordered_array;

        },

        _findIndexForPropValue: function (columns, prop, value) {

           var valueIdx = -1;

           for (var i = 0, len = columns.length; i < len; ++i) {
                var obj = columns[i];
                if(obj[prop] === value){
                    valueIdx = i;
                    break;
                }
           }

            return valueIdx;
        },

        _findArrayItemIndex: function (columns, value) {

            var valueIdx = -1;

            for (var i = 0, len = columns.length; i < len; ++i) {
                var obj = columns[i];
                if(obj === value){
                    valueIdx = i;
                    break;
                }
            }

            return valueIdx;
        },


        _findWithAttr: function (array, attr, value) {
            for(var i = 0; i < array.length; i += 1) {
                if(array[i][attr] === value) {
                    return i;
                }
            }
       },


        dispose: function () {
            this._unbindEventListeners();
            View.prototype.dispose.call(this, arguments);
        }

    });

    return DashboardIndicatorsView;
});
