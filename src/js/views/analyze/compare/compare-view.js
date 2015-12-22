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
    'config/analyze/compare/Config',
    'views/analyze/compare/selectors-view',
    'views/analyze/compare/results-view',
    'handlebars',
    'q',
    'amplify'
], function ($, _, log, View, template, errorTemplate, i18nLabels, i18nErrors, E, GC, AC, Selectors, Results, Handlebars, Q) {

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

            this.recipientSelectorsId = Object.keys(this.recipientSelectors);

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

            amplify.subscribe(E.SELECTORS_READY, this, function () {

                this._unlockForm();

                //amplify.subscribe(E.SELECTORS_ITEM_SELECT, this, this._onSelectorSelect)

            });

        },

        _onSelectorSelect : function () {
            log.info("Listening to 'Item selected' event");

            var valid;

            this.currentRequest.selection = this.subview('selectors').getSelection();

            valid = this._validateSelection();

            this.currentRequest.valid = typeof valid === 'boolean' ? valid : false;

            if (valid === true) {

                this._createRequests();

                if (Array.isArray(this.currentRequest.combinations) && !isNaN(AC.maxCombinations) && this.currentRequest.combinations.length > AC.maxCombinations ) {
                    this._printErrors('too_many_combinations');
                }
            }
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

            var r = [];

            this._lockForm();

            this._createRequests();

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

            r.$el = this.subview('results').add(r);

            //TODO no multi language
            return Q($.ajax({
                url: GC.SERVER + GC.D3P_POSTFIX + this.currentRequest.selection.oda + "?language=EN",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(r.body),
                dataType: 'json'
            })).then(
                _.bind(this._onPromiseSuccess, this, r),
                _.bind(this._onPromiseError, this, r)
            );

        },

        _onAllSuccess: function () {

            log.info("All requests success");

            this._unlockForm();
        },

        _onAllError: function (request) {

            log.error("Requests error");
            log.error(request);

            this._printErrors('request_error');

            this._unlockForm();

        },

        _onPromiseSuccess: function (request, result) {

            log.info("Request success: [request/result]");
            log.info(request);
            log.info(result);

            this.subview('results').renderObj({
                model : result,
                request : request
            });

        },

        _onPromiseError: function (request, error) {

            log.error(error);
            log.error(request);

            this._printErrors('request_error');

            this.subview('results').errorObj(request);

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

            var m = $.extend(true, this.selectors[s].cl,
                {codes: '"' + values.join('","') + '"'});

            return JSON.parse(this._createFilterProcess(s, m));
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

            this._lockForm();

        },

        _printErrors: function (e) {

            var template = Handlebars.compile(errorTemplate),
                html = template({text: i18nErrors[e]});

            this.$error.html(html);
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

            } else {

                _.each(this.recipientSelectorsId, function (id) {

                    if (s.hasOwnProperty(id)) {
                        compare = id;
                        compareSelection = s[id];
                    }

                });

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

        _unbindEventListeners: function () {

            //Toggle the selectors panel
            this.$collapseBtn.off();

            //Search and compare data
            this.$compareBtn.off();

            //Reset page
            this.$resetBtn.off();

            amplify.unsubscribe(E.SELECTORS_READY, this._unlockForm);

            amplify.unsubscribe(E.SELECTORS_ITEM_SELECT, this._onSelectorSelect)

        },

        dispose: function () {

            this._unbindEventListeners();

            View.prototype.dispose.call(this, arguments);
        }

    });

    return CompareView;
});
