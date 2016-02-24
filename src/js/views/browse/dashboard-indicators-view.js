/*global define, amplify*/
define([
    'jquery',
    'underscore',
    'views/base/view',
    'text!templates/browse/indicators-dashboard.hbs',
    'text!templates/browse/indicators.hbs',
    'fx-ds/start',
    'lib/utils',
    'i18n!nls/browse',
    'handlebars',
    'lib/config-utils',
    'amplify'
], function ($, _, View, template, indicatorsTemplate, Dashboard, Utils, i18nLabels, Handlebars, ConfigUtils) {

    'use strict';

    var s = {
        css_classes: {
            INDICATORS_DASHBOARD_BROWSE_CONTAINER: '#dashboard-indicators-container'
        },
        events: {
            CUSTOM_ITEM_COUNTRY_RESPONSE: 'fx.dashboard.custom.item.response.country-indicator-1'
        },
        indicatorIds : {
          INCOME_LEVEL: 'INCOME.LEVEL'
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

            this.indicatortemplate = Handlebars.compile(indicatorsTemplate);
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
                indicatornameIndex = this._findWithAttr(metadata, "id", "indicatorcode_"+Utils.getLocale());

            var newdata = {};
            var indicators = [],
                footnote = [],
                linkArray = [],
                sourceArray = [];

            var results = [], results2 = [], count = 1;
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


                if(indicatorObj.value === null && indicatorObj.item){
                    indicatorObj.value = indicatorObj.item;
                }

                if(indicatorObj.source === null){
                    indicatorObj.source = "";
                }

                if(indicatorObj.css)
                  indicatorObj.css = indicatorObj.css.replace(/\./g, "_");

                if ($.inArray(indicatorObj.source+indicatorObj.note, results) < 0) {

                    var sourceObj =  {};
                    indicatorObj.footnote = count;
                    sourceObj.sourceid = indicatorObj.source+indicatorObj.note;

                    if(indicatorObj.source.split(";").length > 0){
                        sourceObj.sourceArray = indicatorObj.source.split(";")
                    } else if (indicatorObj.source) {
                        sourceObj.sourceArray = sourceArray.push(indicatorObj.source);
                    }

                    if(indicatorObj.link.split(";").length > 0){
                        sourceObj.linkArray = indicatorObj.link.split(";")
                    } else if (indicatorObj.link) {
                        sourceObj.linkArray = linkArray.push(indicatorObj.link);
                    }

                    sourceObj.link = indicatorObj.link;
                    sourceObj.note = indicatorObj.note;

                    if(indicatorObj.source.length === 0)
                        sourceObj.source = indicatorObj.note;
                    else
                        sourceObj.source = indicatorObj.source + ": " +indicatorObj.note;

                    sourceObj.footnote = count;

                    results.push(indicatorObj.source+indicatorObj.note);
                    footnote.push(sourceObj);
                    count ++;
                } else {
                    var result = _.findWhere(footnote, {sourceid: indicatorObj.source+indicatorObj.note});

                    indicatorObj.footnote = result.footnote;
                }

                indicators.push(indicatorObj);

                 //console.log(indicators);

            }

            //console.log(indicators);
            indicators.sort(this._sortByName);

            // Move Income Level to the first position
            var toIndex = 0;
            var fromIndex = _.chain(indicators).pluck("code").indexOf(s.indicatorIds.INCOME_LEVEL).value();
            indicators.splice(toIndex,0,indicators.splice(fromIndex,1)[0]);

            // console.log("AFTER==========");
            //console.log(indicators);
            newdata.indicators = indicators;
            newdata.footnotes = footnote;

           // console.log(newdata.indicators);
           // console.log(newdata.footnotes);
            return newdata;
        },


        _sortByName: function (a, b) {
           var aName = a.name.toLowerCase();
           var bName = b.name.toLowerCase();
            return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
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
