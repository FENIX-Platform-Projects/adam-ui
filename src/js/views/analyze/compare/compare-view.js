/*global define, amplify*/
define([
    'underscore',
    'loglevel',
    'views/base/view',
    'text!templates/analyze/compare/compare.hbs',
    'i18n!nls/analyze',
    'config/Events',
    'config/Config',
    'config/browse/Config',
    'views/analyze/compare/selectors-view',
    'views/analyze/compare/results-view',
    'amplify'

], function (_, log, View, template, i18nLabels, E, GC, BC, Selectors, Results) {

    'use strict';

    var s = {
        SUBVIEW_SELECTORS : "#analyze-compare-selectors",
        SUBVIEW_RESULTS: "#analyze-compare-results",
        COLLAPSE_BTN : "#compare-collapse-btn",
        COMPARE_BTN : "#compare-btn",
        RESET_BTN : "#reset-btn"

    };

    var BrowseView = View.extend({

        // Automatically render after initialize
        autoRender: true,

        className: 'analysis-compare',

        template: template,

        initialize: function (params) {

            log.setLevel('info');

            View.prototype.initialize.call(this, arguments);
        },

        getTemplateData: function () {
          return i18nLabels;
         },

        render: function() {

            View.prototype.render.apply(this, arguments);

            this._initSubviews();
        },

        _initSubviews: function() {

            View.prototype.render.apply(this, arguments);

            var selectors = new Selectors({autoRender: true, container: this.$el.find(s.SUBVIEW_SELECTORS)});
            this.subview('selectors', selectors);

            var results = new Results({autoRender: true, container: this.$el.find(s.SUBVIEW_RESULTS)});
            this.subview('results', results);

        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            //update State
            amplify.publish(E.STATE_CHANGE, {menu: 'compare' });

            this._initVariables();

            this._initComponents();

            this._bindEventListeners();

            log.info("Page attached successfully");
        },

        _initVariables: function () {

            this.$compareBtn = this.$el.find(s.COMPARE_BTN);

            this.$resetBtn = this.$el.find(s.RESET_BTN);

            this.$collapseBtn = this.$el.find(s.COLLAPSE_BTN);

        },

        _bindEventListeners: function () {

            var self = this;

            //Toggle the selectors panel
            this.$collapseBtn.on('click', function() {

                log.info("Toggling selectors panel");

                self.subview('selectors').$el.slideToggle();
            });

            //Search and compare data
            this.$compareBtn.on('click', _.bind(this._onCompareClick, this));

                //Reset page
            this.$resetBtn.on('click', _.bind(this._onResetClick, this));

        },

        _onCompareClick: function () {
            log.info("Compare click");
        },
        _onResetClick: function () {
            log.info("Reset click");
        },

        _initComponents: function () {}

   });

    return BrowseView;
});
