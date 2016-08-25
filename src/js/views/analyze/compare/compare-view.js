/*global define, amplify*/
define([
    'jquery',
    'underscore',
    'loglevel',
    'lib/utils',
    'fx-common/utils',
    'views/base/view',
    'text!templates/analyze/compare/compare.hbs',
    'text!templates/analyze/error.hbs',
    'i18n!nls/analyze-compare',
    'i18n!nls/errors',
    'i18n!nls/filter',
    'config/Events',
    'config/Config',
    'config/analyze/compare/Config',
    'fx-analysis/start',
    'fx-filter/start',
    'amplify'
], function ($, _, log, Utils, FxUtils, View, template, errorTemplate, i18nLabels, i18nErrors, i18nFilter, E, GC, AC, Analysis, Filter) {

    'use strict';

    var s = {
        FILTER: "#compare-filter",
        ANALYSIS: "#compare-analysis",
        ADD_BTN: "#add-btn"
    };

    var CompareView = View.extend({

        // Automatically render after initialize
        autoRender: true,

        className: 'analysis-compare',

        template: template,

        getTemplateData: function () {
            return i18nLabels;
        },

        _initMenuBreadcrumbItem: function () {
            var label = "";
            var self = this;

            if (typeof self.analyze_type !== 'undefined') {
                label = i18nLabels[self.analyze_type];
            }

            return Utils.createMenuBreadcrumbItem(label, self.analyze_type, self.page);
        },

        _initVariables: function () {

            this.$addBnt = this.$el.find(s.ADD_BTN);

            this.readyComponents = 0;
        },

        _bindEventListeners: function () {

            this.$addBnt.on("click", _.bind(this._onAddBtnClick, this));

            this.analysis.on("ready", _.bind(this._onComponentReady, this));

            this.filter.on("ready", _.bind(this._onComponentReady, this));
        },

        _onComponentReady: function () {

            this.readyComponents++;

            if (this.readyComponents === 2) {
                this.$addBnt.prop('disabled', false);
            }
        },

        _onAddBtnClick: function () {
            var config = this._getBoxModelFromFilter();

            this.analysis.add(config);
        },

        _getBoxModelFromFilter: function () {

            var config = {},
                values = this.filter.getValues(),
                from = FxUtils.getNestedProperty("values.year-from", values)[0],
                to = FxUtils.getNestedProperty("values.year-to", values)[0],
                process = this.filter.getValues("fenix", ["recipientcode", "donorcode", "parentsector_code", "purposecode"]);

            config.uid = FxUtils.getNestedProperty("values.oda", values)[0];

            process["year"] = {
                time: [{
                    from: from,
                    to: to
                }]
            };

            config.process = [{
                name: "filter",
                parameters: {
                    rows: process
                }
            }];

            return config;
        },

        _initComponents: function () {

            var filterConfig = $.extend(true, {}, AC.filter, {
                el: this.$el.find(s.FILTER),
                environment: GC.ENVIRONMENT,
                cache: GC.cache,
            });

            _.each(filterConfig.items, function (value, key) {
                if (!value.template) {
                    value.template = {};
                }
                value.template.title = i18nFilter["filter_" + key];
            });

            this.filter = new Filter(filterConfig);

            this.analysis = new Analysis($.extend(true, {}, AC.analysis, {
                el: this.$el.find(s.ANALYSIS),
                environment: GC.ENVIRONMENT,
                catalog: false,
                cache: GC.cache,
            }));

        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            //update State
            amplify.publish(E.STATE_CHANGE, {menu: 'analyze', breadcrumb: this._initMenuBreadcrumbItem()});

            this._initVariables();

            this._initComponents();

            this._bindEventListeners();

            log.info("Page attached successfully");
        },

        _unbindEventListeners: function () {

            this.$addBnt.off();

        },

        dispose: function () {

            this._unbindEventListeners();

            this.filter.dispose();

            this.analysis.dispose();

            View.prototype.dispose.call(this, arguments);
        }

    });

    return CompareView;
});
