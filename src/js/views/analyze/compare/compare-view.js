/*global define, amplify*/
define([
    'jquery',
    'underscore',
    'loglevel',
    'views/base/view',
    'text!templates/analyze/compare/compare.hbs',
    'text!templates/analyze/error.hbs',
    'i18n!nls/analyze',
    'i18n!nls/errors',
    'config/Events',
    'config/Config',
    'config/browse/Config',
    'views/analyze/compare/selectors-view',
    'views/analyze/compare/results-view',
    'handlebars',
    'q',
    'amplify'
], function ($, _, log, View, template, errorTemplate, i18nLabels, i18nErrors, E, GC, BC, Selectors, Results, Handlebars, Q) {

    'use strict';

    var s = {
        SUBVIEW_SELECTORS: "#analyze-compare-selectors",
        SUBVIEW_RESULTS: "#analyze-compare-results",
        COLLAPSE_BTN: "#compare-collapse-btn",
        COMPARE_BTN: "#compare-btn",
        RESET_BTN: "#reset-btn",
        BTNS: "[data-btn]",
        ERROR: "#error-container"

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

        render: function () {

            View.prototype.render.apply(this, arguments);

            this._initSubviews();
        },

        _initSubviews: function () {

            View.prototype.render.apply(this, arguments);

            var selectors = new Selectors({autoRender: true, container: this.$el.find(s.SUBVIEW_SELECTORS)});
            this.subview('selectors', selectors);

            var results = new Results({autoRender: true, container: this.$el.find(s.SUBVIEW_RESULTS)});
            this.subview('results', results);

        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            //update State
            amplify.publish(E.STATE_CHANGE, {menu: 'compare'});

            this._initVariables();

            this._initComponents();

            this._bindEventListeners();

            log.info("Page attached successfully");
        },

        _initVariables: function () {

            this.$compareBtn = this.$el.find(s.COMPARE_BTN);

            this.$resetBtn = this.$el.find(s.RESET_BTN);

            this.$collapseBtn = this.$el.find(s.COLLAPSE_BTN);

            this.$btns = this.$el.find(s.BTNS);

            this.$error = this.$el.find(s.ERROR);

        },

        _bindEventListeners: function () {

            var self = this;

            //Toggle the selectors panel
            this.$collapseBtn.on('click', function () {

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

            var selection = this.subview('selectors').getSelection(),
                valid;

            log.info("Selection: " + JSON.stringify(selection));

            this.currentRequest = {
                selection: selection
            };

            valid = this._validateSelection();

            this.currentRequest.valid = typeof valid === 'boolean' ? valid : false;

            if (valid === true) {

                this._compare();

            } else {

                this.currentRequest.errors = valid;

                this._printErrors(valid[0]);
            }

        },

        _validateSelection: function () {

            var valid = true,
                errors = [],
                s = this.currentRequest.selection;

            if (!s.hasOwnProperty('oda')) {
                errors.push('fill_all_fields');
                return errors;
            }

            return valid;
        },

        _compare: function () {

            this._lockForm();

            this._createRequestBodies();

            return;

            _.each(this.currentRequest.bodies, _.bind(function (b) {

                this._query(b).then(
                    _.bind(this._onQuerySuccess, this),
                    _.bind(this._onQueryError, this)
                ).always(this._unlockForm)

            }, this));

        },

        _query: function (body) {

            return Q($.ajax({
                url: GC.SERVER + GC.D3P_POSTFIX,
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(body),
                dataType: 'json'
            }))

        },

        _onQuerySuccess: function (result) {
            log.info("query success")
        },

        _onQueryError: function () {
             this._printErrors('request_error')
        },

        _createRequestBodies: function () {

            this.currentRequest.bodies = [];

            var base = this._createBaseFilter();

            console.log( this.currentRequest)
        },

        _createBaseFilter: function () {

            var s = this.currentRequest.selection,
                b = {
                    uid : s.oda
                };

        },

        _lockForm: function () {

            this.$btns.prop('disabled', true);
        },

        _unlockForm: function () {

            this.$btns.prop('disabled', false);
        },

        _onResetClick: function () {
            log.info("Reset click");

            this.subview('selectors').reset();

            //this.subview('results').reset();
        },

        _initComponents: function () {
        },

        _printErrors: function (e) {

            var template = Handlebars.compile(errorTemplate),
                html = template({text: i18nErrors[e]});

            this.$error.html(html)
        }

    });

    return BrowseView;
});
