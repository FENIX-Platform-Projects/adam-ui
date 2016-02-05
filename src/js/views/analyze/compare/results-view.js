/*global define, amplify*/
define([
    'jquery',
    'underscore',
    'fx-c-c/start',
    'views/base/view',
    'text!templates/analyze/compare/results.hbs',
    'text!templates/analyze/compare/result.hbs',
    'i18n!nls/analyze-compare',
    'config/Events',
    'config/Config',
    'config/analyze/compare/Config',
    'handlebars',
    'loglevel',
    /*OLAP*/
    'pivot',
    'pivotRenderers',
    'pivotAggregators',
    'text!pivotDataTest',
    'pivotDataConfig',
    /*END OF OLAP*/
    'amplify'
], function ($, _, ChartCreator, View, template, resultTemplate, i18nLabels, E, GC, AC, Handlebars, log, Pivot, pivotRenderers, pivotAggregators, pivotDataTest, pivotDataConfig) {

    'use strict';

    var s = {
        LIST: "#results-list",
        TABS_CONTROLLERS: "a[data-toggle='tab']",
        TAB: ".tab-container [data-visualization]",
        REMOVE_BTN: "[data-control='remove']",
        RELOAD_BTN: "[data-control='reload']",
        DOWNLOAD_BTN: "[data-control='download']",
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

            this.selectors = AC.selectors;

            this.selectorsId = Object.keys(this.selectors);

            this.currentObjs = [];
        },

        _initObj: function (obj) {

            obj.tabs = {};

        },

        _getInfoLabels: function (selection) {

            var result = {},
                labels = $.extend(true, {}, selection.labels);

            for (var k in labels) {
                if (labels.hasOwnProperty(k)) {
                    result['info_' + k] = Array.isArray(labels[k]) ? labels[k].join(", ") : labels[k]

                }
            }

            return result;
        },

        add: function (obj) {
            log.info("Add result:");
            log.info(obj);

            var template = Handlebars.compile(resultTemplate),
                $li = $(template($.extend(true, {}, i18nLabels, obj.request.selection.labels, obj, this._getInfoLabels(obj.request.selection)))),
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

            if (!obj.model || !obj.model.data) {

                this._setStatus(obj, "empty");

            } else {

                this._setStatus(obj, "ready");

                this._renderObj(obj);

            }
        },

        _renderObj: function (obj) {

            //show default tab
            var $tabs = obj.$el.find(s.TABS_CONTROLLERS),
                $candidate = $tabs.filter("[data-visualization='" + AC.resultDefaultTab + "']");

            if ($candidate.length < 1) {
                $candidate = $tabs.first();

                log.warn("Impossible to find default tab '" + AC.resultDefaultTab + "'. Showing first tab instead")
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

            $el.find(s.DOWNLOAD_BTN).on('click', _.bind(this._onDownloadClick, this, obj));

        },

        _setStatus: function (obj, status) {
            log.info("Set '" + status + "' for result id: " + obj.id);

            obj.status = status;

            obj.$el.attr("data-status", obj.status);
        },

        _onSwitchChange: function (obj, e) {
            log.info("Change visualization for result id: " + obj.id);

            var currentTab = $(e.target).attr("data-visualization"), // newly activated tab
                previousTab = $(e.relatedTarget).attr("data-visualization"); // previous active tab

            this._onTabChange(obj, currentTab, previousTab);
        },

        _onRemoveItem: function (obj) {
            log.info("Remove event for result id: " + obj.id);

            this.removeItem(obj);
        },

        _onReloadClick: function (obj) {
            log.info("Requesting reload result id: " + obj.id);

            amplify.publish(E.RELOAD_RESULT, obj);
        },

        _onDownloadClick: function (obj) {
            log.info("Downloading result id: " + obj.id);

            if (obj.ready === true && obj.model && obj.model.metadata && obj.model.metadata.uid) {

                var fileName = "adma_download_"+ obj.id ;

                fileName = fileName.replace(/[^a-z0-9]/gi, '_').toLowerCase();

                log.info("File name: " + fileName);

                log.info("Check if 'table' tab is ready");

                if (!obj.tabs.hasOwnProperty('table') || obj.tabs.table.ready !== true) {
                    log.info("'table' tab was not ready.");

                    this._initTab(obj, 'table');
                }

                var tableObj = obj.tabs.table;

                if (tableObj.hasOwnProperty('creator') && $.isFunction(tableObj.creator.exportCSV)) {

                    log.info("Start download: " + fileName);

                    tableObj.creator.exportCSV(fileName);
                    //pivot.exportCSV(fileName);
                } else {
                    log.warn("Impossible to download the file: export function not found")
                }

            } else {
                log.warn('Impossible to download: resource is not in "ready" state or resource does not contain the model.uid.');
            }

        },

        _unbindObjEventListeners: function (obj) {

            var $el = obj.$el;

            $el.find(s.TABS_CONTROLLERS).off();

            $el.find(s.REMOVE_BTN).off();

            $el.find(s.DOWNLOAD_BTN).off();

        },

        _onTabChange: function (obj, currentTab, previousTab) {

            obj.tab = currentTab;
            obj.previousTab = previousTab;

            log.info("Show tab: " + obj.tab);

            if (obj.ready !== true && obj.ready !== 'ready') {
                log.warn("Obj does not have a 'ready' state. State found: '" + obj.status + "'");
                return;
            }

            if (obj.ready === true && obj.status === 'ready' && obj.tabs.hasOwnProperty(obj.tab) && obj.tabs[obj.tab].ready === true) {
                log.info("Tab '" + obj.tab + "' already initialized");
                return;
            }

            this._initTab(obj, obj.tab);

        },

        _initTab: function (obj, tab) {

            //tab callback
            if ($.isFunction(this["_tab_" + tab])) {

                log.info("Initializing tab '" + tab + "'");

                obj.tabs[tab] = {};

                log.info("Invoking '" + tab + "' tab callback");

                this["_tab_" + tab].call(this, obj);

                //Init tab status
                obj.tabs[tab] = $.extend(true, obj.tabs[tab], {
                    ready: true
                });

                log.info("Initialized tab '" + tab + "'");

            } else {

                log.info("Callback for '" + tab + "' tab not found");
            }

        },

        //Tab callback

        _tab_chart: function (obj) {
            log.info("'Chart' callback");

            var status = obj.tabs['chart'];

            status.creator = new ChartCreator();

            status.instances = [];

            status.configuration = this._getChartConfiguration(obj);

            $.when(status.creator.init($.extend(true,
                {
                    model: obj.model

                }, status.configuration))
            ).then(function (creator) {

                var instance = creator.render({
                    container: obj.$el.find(s.CHART_CONTAINER),
                    creator: {
                        chartObj: {
                            chart: {
                                type: 'line'
                            },
                            title: {
                                text: '' //Edit title here
                            },
                            subtitle: {
                                text: '' //
                            },
                            plotOptions: {
                                column: {
                                    stacking: 'normal'
                                }
                            }
                        }
                    }
                });

                status.instances.push(instance);

            });

        },

        _tab_table: function (obj) {
            log.info("'Table' callback");

            var status = obj.tabs['table'];

            status.creator = new Pivot();

            status.configuration = _.extend(pivotDataConfig, {
                rendererDisplay: pivotRenderers,
                aggregatorDisplay: pivotAggregators,
                onDataLoaded: function () {
                    //log.info('OLAP: data loaded')
                }
            });

            status.creator.renderD3S({
                container: "fx-tab-table-container-" + obj.id,
                model: obj.model,
                inputOpts: status.configuration
            });

        },

        _tab_info: function (obj) {
            log.info("'Info' callback");
        },

        // end tab callback

        removeItem: function (obj) {

            this._unbindObjEventListeners(obj);

            //destroy creators
            _.each(obj.tabs, function (status, tab) {

                if (status.instances && Array.isArray(status.instances)) {

                    _.each(status.instances, function (inst) {

                        if ($.isFunction(inst.destroy)) {
                            inst.destroy();
                            log.warn("Visualization instance destroyed.");
                        }
                    });
                }

            });

            this._remove(obj.$el);

            this.currentObjs = _.without(this.currentObjs, obj);

        },

        _remove: function ($el) {

            $el.remove();
        },

        _emptyResults: function () {

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
        },

        // utils

        _getChartConfiguration: function (obj) {

            var id = this._getSelectorIdsBySubject(obj.request.selection.compare)[0],
                sel = this.selectors[id] || {},
                filter = sel.filter || {},
                series = filter.dimension || "";

            return {
                adapter: {
                    type: "timeserie",
                    xDimensions: 'year',
                    yDimensions: 'unitcode',
                    valueDimensions: 'value',
                    seriesDimensions: [series]
                },
                template: {},
                creator: {}
            }

        },

        _getSelectorIdsBySubject: function (sub) {

            var sels = [];

            if (_.contains(this.selectorsId, sub)) {

                sels.push(sub);

            } else {

                _.each(this.selectors, _.bind(function (sel, id) {

                    if (sel.hasOwnProperty("subject") && sel.subject === sub) {
                        sels.push(id);
                    }

                }, this));

            }

            return sels;

        }

    });

    return ResultsView;
});
