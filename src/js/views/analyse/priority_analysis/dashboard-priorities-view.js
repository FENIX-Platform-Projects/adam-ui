/*global define, amplify*/
define([
    'jquery',
    'underscore',
    'views/base/view',
    'text!templates/analyse/priority_analysis/priorities-dashboard.hbs',
    'fx-dashboard/start',
    'lib/utils',
    'config/Config',
    'i18n!nls/analyse',
    'i18n!nls/analyse-priority-analysis',
    'config/analyse/priority_analysis/Events',
    'config/submodules/fx-chart/jvenn_template',
    'config/analyse/priority_analysis/config-priority-analysis',
    'views/common/progress-bar',
    'handlebars',
    'lib/config-utils',
    'amplify'
], function ($, _, View, template, Dashboard, Utils, GeneralConfig, i18nLabels, i18nDashboardLabels, BaseEvents,  JVennTemplate, BasePriorityAnalysisConfig, ProgressBar, Handlebars, ConfigUtils) {

    'use strict';

    var defaultOptions = {
        container: '-container',
        PROGRESS_BAR_CONTAINER: '#analyse-pa-priorities-progress-bar-holder',
        paths: {
            TABLE_ITEM: 'views/analyse/priority_analysis/table-item'
        },
        events: {
            CHANGE: 'change'
        },
        itemTypes: {
            CHART: 'chart',
            VENN: 'venn'
        },
        css: {
            COLLAPSE: 'collapse'
        }
    };

    /**
     *
     * Creates a new PrioritiesView, which is composed of a custom Table and Venn Chart
     * Instantiates the FENIX dashboard submodule and responsible for the priorities dashboard related functionality.
     * @class TableView
     * @extends View
     */

    var PrioritiesView = View.extend({

        // Automatically render after initialize
        autoRender: false,

        className: 'dashboard-priorities',

        // Save the template string in a prototype property.
        // This is overwritten with the compiled template function.
        // In the end you might want to used precompiled templates.
        template: template,

        initialize: function (params) {
            this.topic = params.topic;

            this.model.on(defaultOptions.events.CHANGE, this.render, this);
            this.dashboards = [];

            this.source = $(this.template).prop('outerHTML');

            //Initialize Progress Bar
            this.progressBar = new ProgressBar({
                container: defaultOptions.PROGRESS_BAR_CONTAINER
            });

            View.prototype.initialize.call(this, arguments);

        },

        getTemplateData: function () {
            return i18nLabels;
        },

        render: function () {
            this.setElement(this.container);
            this._unbindEventListeners();

            // Update the language related labels in the item configurations (charts)
            for (var it in this.config.items) {
                var item = this.config.items[it];
              //  this._updateChartExportTitles(this.config.items[it], i18nDashboardLabels[item.id], this.model.get('label'));
            }

            $(this.el).html(this.getTemplateFunction());
        },

        attach: function () {
            View.prototype.attach.call(this, arguments);

            this.$el = $(this.el);

            this.configUtils = new ConfigUtils();
        },


        getTemplateFunction: function () {

            // Update the language related labels in the dashboard template

            this.compiledTemplate = Handlebars.compile(this.source);

            var model = this.model.toJSON();

            var data = $.extend(true, model, i18nLabels, i18nDashboardLabels);

            return this.compiledTemplate(data);

        },

        setDashboardConfig: function (config) {
            this.baseConfig = config;

            this.config = config;
            this.config_type = config.id;
            this.config.baseItems = config.items;
            this.config.environment = GeneralConfig.ENVIRONMENT;

            var baseTemplate =  JVennTemplate;

            // Sets Highchart config for each chart
            _.each(this.config.items, _.bind(function (item) {
                if (!_.isEmpty(item)) {
                    if (item.type == defaultOptions.itemTypes.CHART) {
                        if (item.config.config) {
                            item.config.config = $.extend(true, {}, baseTemplate, item.config.config);
                        } else {
                            item.config.config = $.extend(true, {}, baseTemplate);
                        }
                    }
                }

            }, this));


        },


        updateDashboardItemConfiguration: function (itemid, property, values) {
            var item = _.filter(this.config.items, {id: itemid})[0];

            if (item) {
                if (item.config && item.config[property]) {
                    if (values[0] === 'false' || values[0] === 'true')
                        item.config[property] = $.parseJSON(values[0]); // returns a Boolean
                    else
                        item.config[property] = values[0];

                }
            }
        },

        renderDashboard: function () {
            var self = this;

            this.config.el = this.$el;

            if(this.config.items.length > 0)
                this.config.items[0].config.topic = this.topic;


            // the path to the custom item is registered
            this.config.itemsRegistry = {
                custom: {
                    path: 'views/analyse/priority_analysis/table-item'
                }
            };

            this.dashboard = new Dashboard(this.config);

            this._bindEventListeners();

            this._loadProgressBar();

        },

        _disposeDashboards: function () {
            if (this.dashboard && $.isFunction(this.dashboard.dispose)) {
                this.dashboard.dispose();
            }
        },


        _collapseDashboardItem: function (itemId) {
            // Hide/collapse Item container
            var itemContainerId = '#' + itemId + defaultOptions.container;

            $(this.source).find(itemContainerId).addClass(defaultOptions.css.COLLAPSE);

        },

        _expandDashboardItem: function (itemId) {
            // Show Item container
            var itemContainerId = '#' + itemId + defaultOptions.container;
            $(this.source).find(itemContainerId).removeClass(defaultOptions.css.COLLAPSE);
        },


        _showDashboardItem: function (itemId) {
            // Show Item container
            var itemContainerId = '#' + itemId + defaultOptions.container;
            $(this.source).find(itemContainerId).show();
        },

        updateDashboardTemplate: function (filterdisplayconfig) {

            if (filterdisplayconfig) {

                var hide = filterdisplayconfig.hide;
                var show = filterdisplayconfig.show;

                for (var idx in hide) {
                    this._collapseDashboardItem(hide[idx]); // in the template
                }

                for (var idx in show) {
                    this._expandDashboardItem(show[idx]); // in the template
                }

            }

        },

        updateDashboardConfigUid: function (uid) {
            this.config.uid = uid;
        },

        showHiddenDashboardItems: function (showItems) {
            if (showItems) {
                for (var itemId in showItems) {
                    this._showDashboardItem(showItems[itemId]);
                }
            }

        },

        setProperties: function (props) {

            if (props) {

                this._updateItems(props);

                if (props["oda"])
                    this.config.uid = props["oda"];

            }
        },

        /*_updateChartExportTitles: function (chartItem, title, subtitle) {

           if (chartItem.config.config ) {
                var chartItemTitle = chartItem.config.config.exporting.chartOptions.title,
                    chartItemSubTitle = chartItem.config.config.exporting.chartOptions.subtitle;

                if (!chartItemTitle || !chartItemSubTitle) {
                    chartItemTitle = chartItem.config.config.exporting.chartOptions.title = {};
                    chartItemSubTitle = chartItem.config.config.exporting.chartOptions.subtitle = {};
                }

                chartItemTitle.text = title;
                chartItemSubTitle.text = subtitle;
            }
        },*/

        rebuildDashboard: function (filter, topic, props) {
            var self = this;

            this._disposeDashboards();
            this.config.filter = filter;


            if(props)
              this._updateItems(props);

          /*  if(selections) {

                var keys;
                // find item
                for (var idx in selections) {
                    var item = selections[idx];

                    if(_.contains(Object.keys(item), BasePriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED)){
                        keys = item;
                    }

                    this._updateDashboardItem(BasePriorityAnalysisConfig.items.VENN_DIAGRAM, item);
                }

                if(keys) {
                    var fao = {fao: keys[BasePriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED]};
                    this._updateDashboardItem(BasePriorityAnalysisConfig.items.VENN_DIAGRAM, fao);

                    // set recipient selection info on table config, to understand selection status
                    this.config.items[0].config.selections = keys;
                }

            }*/

            // Re-Render the source template
            if (topic) {
                this.topic = topic;
                this.source = $(this.template).prop('outerHTML');
                this.render();
            }


            if(this.config.items.length > 0)
                this.config.items[0].config.topic = this.topic;


            // the path to the custom item is registered
            this.config.itemsRegistry = {
                custom: {
                    path: defaultOptions.paths.TABLE_ITEM
                }
            };

            // Build new dashboard
            this.dashboard = new Dashboard(this.config);


            // Bind the events
            this._bindEventListeners();

            // Load Progress bar
            this._loadProgressBar();

        },


        _updateItems: function(props){

            var selectionsObj = _.find(props, function(obj){
                if(obj['selections'])
                    return obj;
            });

            if (selectionsObj) {
                var selections = selectionsObj['selections'];
                var keys;
                // find item
                for (var idx in selections) {
                    var item = selections[idx];

                    if(_.contains(Object.keys(item), BasePriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED)){
                        keys = item;
                    }

                    this._updateDashboardItem(BasePriorityAnalysisConfig.items.VENN_DIAGRAM, item);
                }

                if(keys) {
                    var fao = {fao: keys[BasePriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED]};
                    this._updateDashboardItem(BasePriorityAnalysisConfig.items.VENN_DIAGRAM, fao);

                    // set recipient selection info on table config, to understand selection status
                    this.config.items[0].config.selections = keys;
                }
            }
        },

        getDashboardConfig: function () {
            return this.config;
        },


        _updateDashboardItem: function(itemid, props){

            for(var idx in props){
                var type = idx;
                var value = props[idx];

                // find item
                var item =  _.find(this.config.items, function(o){
                    return o.id === itemid;
                });

                // update the process
                if(item) {
                    var process = _.filter(item.postProcess, function(obj){
                        return obj.rid && obj.rid.uid === type;
                    });

                    // update the indicator value
                    if(process && process.length === 1)
                        var label = value;
                        if(i18nDashboardLabels[value])
                            label = i18nDashboardLabels[value];

                        process[0].parameters.value = i18nDashboardLabels[type] + ' ('+ label +')';
                }

            }
        },


        _loadProgressBar: function () {

            this.progressBar.reset();
            this.progressBar.show();

        },


        _bindEventListeners: function () {

            var self = this, increment = 0, percent = Math.round(100 / this.config.items.length);


            this.dashboard.on('ready', function () {
                self.progressBar.finish();
            });

            this.dashboard.on('ready.item', function () {
                increment = increment + percent;
                self.progressBar.update(increment);
            });

            this.dashboard.on('click.item', function (values) {

                // reset others
                $("div[id^='resultC']").css('color', 'black');

                //set selected
                $(values.selected).css('color', 'red');

                var listnames = values.listnames;
                var list = values.list;
                var series = values.series;

                var title = "";
                if (listnames.length == 1) {
                    title += i18nDashboardLabels.prioritiesOnlyIn + " ";
                } else {
                    title += i18nDashboardLabels.commonPrioritiesIn + " ";
                }

                // get first list
                var firstList = listnames[0];

                // find associated series code/label list
                var seriesCodeLabels= _.find(series,function(rw){
                    return rw.name == firstList;
                });

                // title
                var count = 0;
                for (var name in listnames) {
                    title += listnames[name];

                    if(count < listnames.length-2){
                        title += ", ";
                    }

                    if(count == listnames.length - 2){
                        title += " "+i18nDashboardLabels.and + " ";
                    }

                    count++;
                }

                $('#'+values.id+'-title').html(title);

                // priorities list
                var value = "";
                var codes = [];
                var codeGroups = [];
                if (seriesCodeLabels) {
                    for (var val in list) {
                        var label = list[val];
                        var id = seriesCodeLabels.codelist.find(function(o){
                            if (o.title=== label) {
                                return o;
                            }
                        }).id;


                        codes.push(id);

                        var codeGrp = id.substring(0, 2);

                        if($.inArray(codeGrp, codeGroups) === -1) {
                            codeGroups.push(codeGrp);
                            if(codeGroups.length > 1){
                                value += "\n";
                            }
                        }

                        //value += label + " - " + id+ "\n";
                        value += label + "\n";

                    }
                }

                // No priorities
                if(value.length === 0){
                   value = i18nDashboardLabels.none;
                }


                $('#'+values.id+'-info').val(value);

                if(codes.length > 0) {
                  amplify.publish(BaseEvents.VENN_ON_CHANGE,{values: {purposecode: codes}});
                } else {
                  amplify.publish(BaseEvents.VENN_NO_VALUES);
                }

            });
        },



        _unbindEventListeners: function () {
            // Remove listeners

        },

        dispose: function () {

            this._disposeDashboards();

            this._unbindEventListeners();

            View.prototype.dispose.call(this, arguments);
        }


    });

    return PrioritiesView;
});
