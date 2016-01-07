/*global define, amplify*/
define([
    'jquery',
    'underscore',
    'loglevel',
    'lib/utils',
    'views/base/view',
    'text!templates/analyze/compare/compare.hbs',
    'text!templates/analyze/error.hbs',
    'i18n!nls/analyze',
    'i18n!nls/errors',
    'config/Events',
    'config/Config',
    'config/analyze/compare/Config',
    'views/analyze/compare/selectors-view',
    'views/analyze/compare/results-view',
    'handlebars',
    'q',
    'amplify'
], function ($, _, log, Utils, View, template, errorTemplate, i18nLabels, i18nErrors, E, GC, AC, Selectors, Results, Handlebars, Q) {

    'use strict';

    var s = {
        SUBVIEW_SELECTORS: "#analyze-compare-selectors",
        SUBVIEW_RESULTS: "#analyze-compare-results",
        COLLAPSE_BTN: "#compare-collapse-btn",
        COMPARE_BTN: "#compare-btn",
        RESET_BTN: "#reset-btn",
        BTNS: "[data-btn]",
        ERROR: "#error-container",
        EXPECTED_RESULTS: "#expected-results",
        SWITCH_ADVANCED_OPTION: "#advanced-options"
    };

    var CompareView = View.extend({

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

            this.selectors = AC.selectors;

            this.selectorsId = Object.keys(this.selectors);

            this.dynamicSelectors = {};

            this.recipientSelectors = {};

            _.each(this.selectorsId, _.bind(function (id) {

                var s = this.selectors[id] || {},
                    f = s.filter || {};

                if (f.type === 'dynamic') {
                    this.dynamicSelectors[id] = s;
                }

                //for recipient selectors
                if (s.subject === 'recipient') {
                    this.recipientSelectors[id] = s;
                }

            }, this));

            this.dynamicSelectorsId = Object.keys(this.dynamicSelectors);

            this.$compareBtn = this.$el.find(s.COMPARE_BTN);

            this.$resetBtn = this.$el.find(s.RESET_BTN);

            this.$collapseBtn = this.$el.find(s.COLLAPSE_BTN);

            this.$btns = this.$el.find(s.BTNS);

            this.$error = this.$el.find(s.ERROR);

            this.currentRequest = {};

            this.$expectedResults = this.$el.find(s.EXPECTED_RESULTS);

            this.$advancedOptions = this.$el.find(AC.advancedOptionsSelector);

            this.$switchAdvancedOptions = this.$el.find(s.SWITCH_ADVANCED_OPTION);

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

            amplify.subscribe(E.CHANGE_MODE, this, this._configureVisibilityAdvancedOptions);

            amplify.subscribe(E.SELECTORS_READY, this, function () {

                this._unlockForm();

                amplify.subscribe(E.SELECTORS_ITEM_SELECT, this, this._onSelectorSelect);

                amplify.subscribe(E.RELOAD_RESULT, this, this._onResultReload);

            });

            this.$switchAdvancedOptions.on("click", _.bind(function (e) {

                var isChecked = $(e.currentTarget).is(':checked');

                this._configureVisibilityAdvancedOptions(isChecked);

                amplify.publish(E.CHANGE_MODE, isChecked);

            }, this));

        },

        _onSelectorSelect: function () {
            log.info("Listening to 'Item selected' event");

            var valid;

            this.currentRequest.selection = this.subview('selectors').getSelection();

            valid = this._validateSelection();

            this.currentRequest.valid = typeof valid === 'boolean' ? valid : false;

            if (this.currentRequest.selection.valid === true && valid === true) {

                this._createRequests();
                this._updateAdvancedStats(this.currentRequest.combinations.length);

            } else {

                this._updateAdvancedStats();

                /*if (Array.isArray(this.currentRequest.combinations) && !isNaN(AC.maxCombinations) && this.currentRequest.combinations.length > AC.maxCombinations) {
                    this._printErrors({ code : 'too_many_combinations' });
                    this._lockForm();
                }*/
            }

            this._resetErrors();
            this._unlockForm();

        },

        _updateAdvancedStats: function (amount) {
            log.info("Update advanced stats");

            this.$expectedResults.html(amount || " - ");

        },

        _configureVisibilityAdvancedOptions: function (show) {

            log.info("Configure advanced mode visibility. Advanced mode? " + show);

            if (show) {

                this.$advancedOptions.show();

            } else {

                this.$advancedOptions.hide();
            }

            //subview configuration
            this.subview('selectors').configureVisibilityAdvancedOptions(show);
        },

        _onCompareClick: function () {

            log.info("Compare click");

            this._resetErrors();

            var selection = this.subview('selectors').getSelection(),
                valid;

            log.warn("Selection:");
            log.warn(selection);

            this.currentRequest = {
                selection: selection
            };

            valid = this._validateSelection();

            this.currentRequest.valid = typeof valid === 'boolean' ? valid : false;

            if (selection.valid === false || valid !== true ) {

                this.currentRequest.errors = valid;

                this._printErrors($.extend(true, {}, selection.errors, valid ));

            } else {

                this._compare();
            }

        },

        _onResultReload: function (obj) {

            log.info("Reloading resource id: " + obj.id);

            return this._getResource(obj);
        },

        _validateSelection: function () {

            var valid = true,
                errors = {},
                s = this.currentRequest.selection,
                compare;

            if (!s.hasOwnProperty('oda') || !s['oda']) {
                errors.code = 'oda_missing';
                return errors;
            }

            if (!s.hasOwnProperty('year-from') || !s.hasOwnProperty('year-to') || !s['year-from']  || !s['year-to']) {
                errors.code = 'year_missing';
                return errors;
            }

            compare = s.compare;

            if (!s[compare]) {
                errors.code = 'no_compare';
                return errors;
            }

            if (!compare) {
                errors.code = "compare_missing";
                return errors;
            }

            // for sure we have oda, year-from, year-to, and 'compare'
            //TODO make stronger
            if (Object.keys(s.labels).length <= 4) {
                errors.code = "at_least_one_more_dimension";
                return errors;
            }

            return _.isEmpty(errors) ? valid : errors;
        },

        _compare: function () {

            var r = [];

            this._createRequests();

            if (Array.isArray(this.currentRequest.combinations) && !isNaN(AC.maxCombinations) && this.currentRequest.combinations.length > AC.maxCombinations) {
                this._printErrors({code: 'too_many_combinations'});
                return;
            } else {
                this._resetErrors();
                this._lockForm();
            }

            _.each(this.currentRequest.requests, _.bind(function (b) {

                this.currentRequest.body = [b];

                r.push(this._createPromise($.extend(true, {}, this.currentRequest)));

            }, this));

            Q.all(r).then(
                _.bind(this._onAllSuccess, this),
                _.bind(this._onAllError, this)
            );

        },

        _createPromise: function (r) {

            var obj = {
                model: null,
                ready: false,
                request: r,
                id: Math.floor(100000 + Math.random() * 900000)
            };

            obj.$el = this.subview('results').add(obj);

            return this._getResource(obj);

        },

        _getResource: function (obj) {

            return Q($.ajax({
                url: GC.SERVER + GC.D3P_POSTFIX + this.currentRequest.selection.oda + "?language=" + Utils.getLocale().toUpperCase(),
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(obj.request.body),
                dataType: 'json'
            })).then(
                _.bind(this._onPromiseSuccess, this, obj),
                _.bind(this._onPromiseError, this, obj)
            );
        },

        _onAllSuccess: function () {

            log.info("All requests returned successfully");

            this._unlockForm();
        },

        _onAllError: function (request) {

            log.error("Requests error:");
            log.error(request);

            this._printErrors({code: 'request_error'});

            this._unlockForm();

        },

        _onPromiseSuccess: function (obj, result) {

            log.info("Request success: [obj/result]");
            log.info(obj);
            log.info(result);

            obj.model = result;

            this.subview('results').renderObj(obj);

        },

        _onPromiseError: function (obj, error) {

            log.error(error);
            log.error(obj);

            this._printErrors({code: 'request_error'});

            this.subview('results').errorObj(obj);

        },

        _createRequests: function () {

            this.currentRequest.requests = [];

            this.currentRequest.staticFilter = this._createStaticFilter();

            log.info("Static filter: ");
            log.info(this.currentRequest.staticFilter);

            this.currentRequest.combinations = this._createCombinations();

            log.info("Combination: [length=" + this.currentRequest.combinations.length + "]");
            log.info(this.currentRequest.combinations);

            this.currentRequest.requests = this._createRequestBodies() || [];

            log.info("Requests: [length=" + this.currentRequest.requests.length + "]");
            log.info(JSON.stringify(this.currentRequest.requests));

        },

        _createStaticFilter: function () {

            return this._createFilterProcess('year-from', this.currentRequest.selection);

        },

        _createRequestBodies: function () {

            var bodies = [],
                base = AC.filter;

            _.each(this.currentRequest.combinations, _.bind(function (c) {

                var b = {},
                    compare = this.currentRequest.compareField,
                    compareValues = this.currentRequest.compareFilter;

                //Static filter (parse string)
                $.extend(true, b, JSON.parse(this.currentRequest.staticFilter));

                //Compare filter
                $.extend(true, b, this._compileFilter(compare, compareValues));

                //Dynamic filter
                _.each(Object.keys(c), _.bind(function (k) {

                    $.extend(true, b, this._compileFilter(k, c[k]));

                }, this));

                //create body
                var x = $.extend(true, {}, base);
                x.parameters.rows = this._orderProcesses($.extend(true, x.parameters.rows, b));

                bodies.push(x);

            }, this));

            return bodies;

        },

        _orderProcesses: function (obj) {

            var ordered = {},
                order = AC.processesOrder.slice(0); // clone array

            if (!order) {
                log.warn("Impossible to find the 'processesOrder' configuration. Filter not ordered.");
                return obj;
            }

            _.each(order, function (o) {

                if (obj.hasOwnProperty(o)) {
                    ordered[o] = obj[o];
                }

            });

            return ordered;

        },

        _createFilterProcess: function (s, values) {

            var config = this.selectors[s].filter || {},
                process = config.process || {};

            if (!process) {
                log.error("Impossible to find '" + s + "' process template. Check your '" + s + "'.filter.process configuration.")
            }

            var template = Handlebars.compile(process);

            return template(values);

        },

        _compileFilter: function (s, values) {

            var id = this._getSelectorIdsBySubject(s),
                sel = Array.isArray(id) ? id[0] : id,
                m = $.extend(true, this.selectors[sel].cl,
                    {codes: '"' + values.join('","') + '"'});

            return JSON.parse(this._createFilterProcess(sel, m));
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

            this.subview('results').reset();

            this._resetErrors();
        },

        _initComponents: function () {

            this.$switchAdvancedOptions.prop('checked', AC.showAdvancedOptions);

            this._configureVisibilityAdvancedOptions(this.$switchAdvancedOptions.is(':checked'));

            this._lockForm();

        },

        _printErrors: function (e) {

            var template = Handlebars.compile(errorTemplate),
                html = template({text: i18nErrors[e.code], details: i18nLabels[e.details]});

            this.$error.html(html);

            if (!this.$error.is(':animated')) {
                this.$error.fadeTo(0, 0).fadeTo("slow", 1);
            }
        },

        _resetErrors: function () {

            this.$error.empty();
        },

        _createCombinations: function () {

            var selectionOrder = [],
                selectionValues = [],
                s = $.extend(true, {}, this.currentRequest.selection),
                compare, compareSelection;

            //remove the 'compare' field from selection
            if (s.hasOwnProperty(s.compare)) {

                compare = s.compare;
                compareSelection = s[compare];

            }

            this.currentRequest.compareField = compare;

            this.currentRequest.compareFilter = compareSelection.slice(0); // clone array

            delete s[compare];

            //push only the selector that are 'dynamic'

            _.each(Object.keys(s), _.bind(function (id) {

                if (_.contains(this.dynamicSelectorsId, id)) {
                    selectionValues.push(this.currentRequest.selection[id]);
                    selectionOrder.push(id);
                }

            }, this));

            this.currentRequest.selectionOrder = selectionOrder;

            this.currentRequest.selectionValues = selectionValues;

            //create combination of the dynamic values

            //TODO check that selectionValues is Array of Array
            this.currentRequest.valuesCombinations = this._cartesian(this.currentRequest.selectionValues);

            this.dynamicFiltersModels = [];

            _.each(this.currentRequest.valuesCombinations, _.bind(function (c) {

                var m = {};

                _.map(c, _.bind(function (value, index) {

                        var key = this.currentRequest.selectionOrder[index];
                        m[key] = [value];

                    }, this)
                );

                this.dynamicFiltersModels.push(m);

            }, this));

            return this.dynamicFiltersModels;

        },

        _cartesian: function (arg) {

            var r = [],
                max = arg.length - 1;

            function helper(arr, i) {
                for (var j = 0, l = arg[i].length; j < l; j++) {
                    var a = arr.slice(0); // clone arr
                    a.push(arg[i][j]);
                    if (i == max)
                        r.push(a);
                    else
                        helper(a, i + 1);
                }
            }

            helper([], 0);

            return r;
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

        },

        _getSubjectBySelectorId: function (id) {

            return (this.selectors[id] && this.selectors[id].hasOwnProperty("subject")) ?
                this.selectors[id].subject : id;
        },

        _unbindEventListeners: function () {

            //Toggle the selectors panel
            this.$collapseBtn.off();

            //Search and compare data
            this.$compareBtn.off();

            //Reset page
            this.$resetBtn.off();

            //Advance mode switcher
            this.$switchAdvancedOptions.off();

            amplify.unsubscribe(E.SELECTORS_READY, this._unlockForm);

            amplify.unsubscribe(E.SELECTORS_ITEM_SELECT, this._onSelectorSelect);

            amplify.unsubscribe(E.RELOAD_RESULT, this._onResultReload);

            amplify.unsubscribe(E.CHANGE_MODE, this._configureVisibilityAdvancedOptions);

        },

        dispose: function () {

            this._unbindEventListeners();

            View.prototype.dispose.call(this, arguments);
        }

    });

    return CompareView;
});
