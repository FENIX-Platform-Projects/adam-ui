/*global define, amplify*/
define([
    'jquery',
    'underscore',
    'views/base/view',
    'text!templates/browse/indicators-dashboard.hbs',
    'text!templates/browse/indicators.hbs',
    'fx-ds/start',
    'lib/utils',
    'handlebars',
    'lib/config-utils',
    'amplify'
], function ($, _, View, template, indicatorsTemplate, Dashboard, Utils, Handlebars, ConfigUtils) {

    'use strict';

    var s = {
        css_classes: {
            INDICATORS_DASHBOARD_BROWSE_CONTAINER: '#dashboard-indicators-container'
        },
        events: {
            CUSTOM_ITEM_COUNTRY_RESPONSE: 'fx.dashboard.custom.item.response.country-indicator-1'
        }
    };

    var DashboardIndicatorsView = View.extend({

        // Automatically render after initialize
        autoRender: true,

        className: 'dashboard-indicators',

        // Save the template string in a prototype property.
        // This is overwritten with the compiled template function.
        // In the end you might want to used precompiled templates.
        template: template,

        initialize: function (params) {
            this.topic = params.topic

            View.prototype.initialize.call(this, arguments);
        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            this.configUtils = new ConfigUtils();

            this._bindEventListeners();

        },

        getTemplateFunction: function() {
            var source = $(this.template).find("[data-topic='" + this.topic + "']");
            return Handlebars.compile(source.prop('outerHTML'));
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

        updateDashboardConfig: function(uid, sectorSelected, subSectorSelected){

            this.config.uid = uid;

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

            var data = this._processData(payload.model.data);


           this.indicatortemplate = Handlebars.compile(indicatorsTemplate);
           var html = this.indicatortemplate({data: data});

            $(payload.container).html(html);

        },

        _processData: function (data, indicatorIndex, sourceIndex) {


            var newdata = {};
            var indicators = [];
            var footnote = [];

            var valueIndex = 1, indicatorIndex = 2,sourceIndex = 0, noteIndex = 3, periodIndex = 0;

            var results = [], results2 = [], count = 1;
            for (var i = 0, len = data.length; i < len; ++i) {
                var indicatorObj =  {};
                indicatorObj.name = data[i][indicatorIndex];
                indicatorObj.value = data[i][valueIndex];
                indicatorObj.period = data[i][periodIndex];
                indicatorObj.source = data[i][sourceIndex];
                indicatorObj.note = data[i][noteIndex];


                if ($.inArray(indicatorObj.source+indicatorObj.note, results) < 0) {
                    var sourceObj =  {};
                    indicatorObj.footnote = count;
                    sourceObj.sourceid = indicatorObj.source+indicatorObj.note;

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
            }

            newdata.indicators = indicators;
            newdata.footnotes = footnote;

           // console.log(newdata.indicators);
            //console.log(newdata.footnotes);
            return newdata;
        },

        dispose: function () {
            this._unbindEventListeners();
            View.prototype.dispose.call(this, arguments);
        }

    });

    return DashboardIndicatorsView;
});
