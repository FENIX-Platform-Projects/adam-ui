/*global define, amplify*/
define([
    'jquery',
    'underscore',
    'loglevel',
    'lib/utils',
    'views/base/view',
    'text!templates/analyze/compare/selectors.hbs',
    'i18n!nls/analyze-compare',
    'config/Events',
    'config/Config',
    'config/analyze/compare/Config',
    'q',
    'amplify',
    'select2',
    'jstree'
], function ($, _, log, Utils, View, template, i18nLabels, E, GC, AC, Q) {

    'use strict';

    var s = {
        SELECTORS_CLASS: ".fx-selector",
        SELECTOR_DISABLED_CLASS: "fx-selector-disabled",
        SELECTORS: "[data-selector]",
        TREE_CONTAINER: "[data-role='tree']",
        FILTER_CONTAINER: "[data-role='filter']",
        CLEAR_ALL_CONTAINER: "[data-role='clear']",
        AMOUNT_CONTAINER: "[data-role='amount']",
        COMPARE_RADIO_BTNS: "input:radio[name='compare']",
        COMPARE_RADIO_BTNS_CHECKED: "input:radio[name='compare']:checked",
        ACTIVE_TAB: "ul#country-ul li.active",
        RECIPIENT_TABS: "ul#country-ul a[data-toggle='tab']",
        SWITCH: "input[data-role='switch'][name='disable-selector']"
    };

    var SelectorView = View.extend({

        // Automatically render after initialize
        autoRender: true,

        className: 'analyze-compare-selectors',

        template: template,

        getTemplateData: function () {
            return i18nLabels;
        },

        // API

        /**
         * Return the current selection
         * @return {Object} Selection
         */
        getSelection: function () {

            return this._getSelection();
        },

        /**
         * Enable advance mode
         * @param {Boolean} show
         * @return {null}
         */
        configureVisibilityAdvancedOptions: function (show) {

            return this._configureVisibilityAdvancedOptions(show)
        },

        /**
         * Reset the view content
         * @return {null}
         */
        reset: function () {

            this._destroyDependencies();

            //reset trees
            _.each(this.trees, this._printTreeDefaultSelection, this);

            //reset dropdown
            _.each(this.dropdown, this._printDropdownDefaultSelection, this);

            this._initDependencies();

            //reset checkbox
            this._printCheckboxDefaultSelection();

            log.info("Selector View reset");

        },

        // end API

        _initVariables: function () {

            this.selectors = AC.selectors;

            this.selectorsId = Object.keys(this.selectors);

            this.trees = [];
            this.dropdown = [];
            this.codelists = [];
            this.cachedCodelist = {};
            this.treeInstances = {};
            this.dropdownInstances = {};
            this.dropdownData = {};
            this.treeContainers = {};
            this.dropdownContainers = {};
            this.disabledSelectors = [];
            this.dependeciesToDestory = [];
            this.mandatorySelectorIds = [];
            this.mandatorySelectors = [];

            //used for "ready" event
            this.treesReady = 0;

            _.each(this.selectorsId, _.bind(function (k) {

                if (this.selectors.hasOwnProperty(k)) {

                    var s = this.selectors[k];

                    if (!s.hasOwnProperty('selector')) {
                        alert(k + "does not have a valid configuration");
                    }

                    //Selector type
                    switch (s.selector.type.toLowerCase()) {
                        case 'dropdown' :
                            this.dropdown.push(k);
                            break;
                        case 'tree' :
                            this.trees.push(k);
                            break;
                        default:
                            log.warn("Impossible to find the selector.type of " + k);
                    }

                    //get set of codelists
                    if (s.hasOwnProperty("cl")) {
                        //TODO remove duplication
                        this.codelists.push(k);
                    }

                    //get initially disabled selectors
                    if (s.selector.hasOwnProperty("disabled") && s.selector.disabled === true) {
                        this.disabledSelectors.push(k);
                    }

                    //get mandatory selectors id
                    if (s.hasOwnProperty("validation") && s.validation.mandatory === true) {
                        this.mandatorySelectorIds.push(k);
                        this.mandatorySelectors.push(this._getSubjectBySelectorId(k));
                    }
                    this.mandatorySelectors = _.uniq(this.mandatorySelectors);

                }

            }, this));

            _.each(this.trees, _.bind(function (t) {
                this.treeContainers[t] = this._getSelectorContainer(t);
            }, this));

            _.each(this.dropdown, _.bind(function (t) {
                this.dropdownContainers[t] = this._getSelectorContainer(t);
            }, this));

            this.$switches = this.$el.find(s.SWITCH);

            this.$radios = this.$el.find(s.COMPARE_RADIO_BTNS);

            this.$advancedOptions = this.$el.find(AC.advancedOptionsSelector);

            this.$recipientTabs = this.$el.find(s.RECIPIENT_TABS);

            //mandatory selectors
            if (s.hasOwnProperty("validation") && s.validation.mandatory === true) {
                this.mandatorySelectors.push(this._getSubjectBySelectorId(id));
            }
            this.mandatorySelectors = _.uniq(this.mandatorySelectors);

        },

        _bindEventListeners: function () {

            amplify.subscribe(E.TREE_READY, this, this._onTreeReady);

            this.$recipientTabs.on('shown.bs.tab', _.bind(function () {

                var id = this.$el.find(s.ACTIVE_TAB).data('sel');

                this._notifyTreeSelectionChange({
                    instance: this.treeInstances[id].jstree(true),
                    id: id
                });

            }, this));

        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            this._initVariables();

            this._bindEventListeners();

            this._initPage();

            this._preloadResources().then(
                _.bind(this._onPreloadResourceSuccess, this),
                _.bind(this._onPreloadResourceError, this)
            );

        },

        _initPage: function () {

            //add attribute to mandatory selectors
            _.each(this.mandatorySelectorIds, _.bind(function (id) {

                this._getSemanticContainer(id).addClass(AC.mandatorySelectorClass);

            }, this));

        },

        _preloadResources: function () {

            var promises = [];

            log.info("Preloading codelist");

            _.each(this.codelists, _.bind(function (cd) {

                //Check if codelist is cached otherwise query
                var stored = amplify.store.sessionStorage(cd);

                if (stored === undefined || stored.length < 2) {

                    log.info(cd + " not in session storage.");

                    promises.push(this._createPromise(cd));

                } else {

                    log.info(cd + " read from session storage.");

                    this.cachedCodelist[cd] = stored;
                }

            }, this));

            return Q.all(promises);

        },

        _createPromise: function (id) {

            var self = this,
                body = this.selectors[id].cl;

            return this._getPromise(body).then(function (result) {

                if (typeof result === 'undefined') {
                    log.info("No Code List loaded for: " + id);
                } else {
                    log.info("Code List loaded successfully for: " + id);

                    amplify.store.sessionStorage(id, result);
                }

                self.cachedCodelist[id] = result;

            }, function (r) {

                log.error(r);
            });
        },

        _getPromise: function (body) {

            return Q($.ajax({
                url: GC.SERVER + GC.CODELIST_SERVICE + GC.CODES_POSTFIX,
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(body),
                dataType: 'json'
            }));

        },

        _onPreloadResourceError: function () {
            log.error("Resources load: error");
        },

        _onPreloadResourceSuccess: function () {

            log.info("Resources loaded");

            this._renderSelectors();

        },

        _renderSelectors: function () {

            //render trees selectors
            _.each(this.trees, _.bind(function (cl) {

                var rawCl = amplify.store.sessionStorage(cl),
                    data = this._buildTreeModel(rawCl, null, cl),
                    conf = this.selectors[cl];

                this._renderTree({id: cl, data: data, conf: conf});

            }, this));

            //render dropdown selectors
            _.each(this.dropdown, _.bind(function (cl) {

                var rawCl = amplify.store.sessionStorage(cl),
                    conf = this.selectors[cl];

                this._renderDropdown({
                    id: cl,
                    data: rawCl ? this._buildDropdownModel(rawCl, null, cl) : null,
                    conf: conf
                });

            }, this));

        },

        _getSelection: function () {

            var result = {
                valid: false
            };

            if (this.ready !== true) {
                return result;
            }

            result.labels = {};

            //get trees selectors
            var en = this._getEnablesSelectors(),
                enabled = [];

            _.each(en, _.bind(function (e) {
                enabled = enabled.concat(this._getSelectorIdsBySubject(e))
            }, this));

            enabled = _.unique(enabled);

            _.each(this.trees, _.bind(function (cl) {

                if (_.contains(enabled, cl)) {

                    var instance = this.treeInstances[cl].jstree(true),
                        selection = instance.get_selected();

                    //remove empty selection
                    if (Array.isArray(selection) && selection.length > 0) {

                        result[cl] = selection;

                        result.labels[cl] = {};

                        _.each(result[cl], function (c) {
                            result.labels[cl][c] = instance.get_node(c).text;
                        });

                    }

                }

            }, this));

            //get dropdown selectors
            _.each(this.dropdown, _.bind(function (cl) {

                var instance = this.dropdownInstances[cl],
                    sel = instance.select2('data');

                if (sel) {

                    result[cl] = sel.id;

                    result.labels[cl] = {};

                    result.labels[cl][sel.id] = sel.text;
                }

            }, this));

            //get compare
            result.compare = this.$el.find(s.COMPARE_RADIO_BTNS_CHECKED).val();

            //harmonize country selection
            var activeTab = this.$el.find(s.ACTIVE_TAB).data('sel'),
                sels = ['country-country', 'country-region', 'regional-aggregation'],
                recipientValues,
                recipientsLabels;

            if (result[activeTab] && Array.isArray(result[activeTab])) {
                recipientValues = result[activeTab].slice(0);
                recipientsLabels = $.extend(true, {}, result.labels[activeTab]);
            }

            _.each(sels, function (f) {
                delete result[f];
                delete result.labels[f];
            });

            result["recipient"] = recipientValues;
            result.labels["recipient"] = recipientsLabels;

            //validate result but return it in any case
            var valid = this._validateSelection(result);

            if (valid === true) {

                result.valid = true;

            } else {
                result.errors = valid;
            }

            return result;

        },

        _configureVisibilityAdvancedOptions: function (show) {

            if (show) {

                this.$advancedOptions.show();

            } else {

                this.$advancedOptions.hide();
            }
        },

        _initDependencies: function () {

            var self = this;

            _.each(this.selectors, _.bind(function (sel, id) {

                if (sel.hasOwnProperty("dependencies")) {

                    var deps = sel.dependencies,
                        objs = Object.keys(deps);

                    _.each(objs, _.bind(function (obj) {

                        var d = {
                            event: E.SELECTORS_ITEM_SELECT + "." + obj,
                            callback: function (payload) {

                                var call = self["_dep_" + deps[obj]];

                                if (call) {
                                    call.call(self, payload, {src: obj, target: id});
                                }
                            }
                        };

                        this.dependeciesToDestory.push(d);

                        amplify.subscribe(d.event, this, d.callback);

                    }, this));

                }

            }, this));
        },

        _destroyDependencies: function () {

            _.each(this.dependeciesToDestory, function (d) {
                amplify.unsubscribe(d.event, d.callback);
            });
        },

        _checkCompareValue: function (d) {

            var compareBy = this.$el.find(s.COMPARE_RADIO_BTNS_CHECKED).val(),
                subject = this._getSubjectBySelectorId(d),
                enabled = this._getEnablesSelectors();

            if (subject === compareBy) {
                var sel = enabled.length > 0 ? enabled[0] : this.selectorsId[0];
                this.$el.find(s.COMPARE_RADIO_BTNS).filter("[value='" + this._getSubjectBySelectorId(sel) + "']").prop('checked', true).trigger("change");
            }

        },

        _getEnablesSelectors: function () {

            var cks = this.$switches.filter(':checked'),
                res = [];

            _.each(cks, function (el) {
                res.push($(el).attr("data-target"))
            });

            return res;

        },

        _validateSelection: function (s) {

            var valid = true,
                errors = {};

            //mandatory fields
            _.each(this.mandatorySelectors, _.bind(function (id) {

                if (!s.hasOwnProperty(id) || !s[id]) {

                    errors.code = 'missing_mandatory_field';
                    errors.details = this._getSubjectBySelectorId(id);

                    return errors;

                }

            }, this));

            return _.isEmpty(errors) ? valid : errors;
        },

        //tree

        _buildTreeModel: function (fxResource, parent, cl) {

            var data = [],
                selector = this.selectors[cl],
                selectorConfig = selector.selector || {},
                blacklist = selectorConfig.blacklist || [],
                bl = blacklist.map(function (item) { return item.toString()});

            _.each(fxResource, _.bind(function (item) {

                if (!_.contains(bl, item.code.toString())) {

                    data.push({
                        id: item.code,
                        text: item.title[Utils.getLocale()],
                        parent: parent || '#'
                    });

                    if (Array.isArray(item.children) && item.children.length > 0) {
                        data = _.union(data, this._buildTreeModel(item.children, item.code, cl));
                    }

                } else {

                    log.warn("code [" + item.code + "] excluded from " + cl);
                }

            }, this));

            //order alphabetically
            data = data.sort(function (a, b) {
                if (a.text < b.text) return -1;
                if (a.text > b.text) return 1;
                return 0;
            });

            return data;

        },

        _renderTree: function (o) {

            var config = this.selectors[o.id].selector,
                $container = this.treeContainers[o.id],
                tree,
                self = this;

            tree = $container.find(s.TREE_CONTAINER).jstree($.extend(true, {}, {
                    core: {
                        multiple: true,
                        data: o.data,
                        themes: {
                            icons: false,
                            stripes: true
                        }
                    },
                    plugins: ['search', 'wholerow', 'checkbox'],
                    search: {
                        show_only_matches: true
                    }
                }, config.config))

                //Default selection
                .on('ready.jstree', _.bind(function (e, data) {

                    this._printTreeDefaultSelection(o.id, data.instance);

                    amplify.publish(E.TREE_READY, o);

                }, this))

                .on("select_node.jstree ", _.bind(function (e, data) {

                    if (!isNaN(this.selectors[o.id].selector.max) && data.selected.length > this.selectors[o.id].selector.max) {
                        data.instance.deselect_node(data.node);
                        log.warn("Max number of selectable item reached. Change 'selector.selector.max' config.");
                        return;
                    }

                    if (!data.instance.is_leaf(data.node)) {
                        data.instance.toggle_node(data.node);
                        data.instance.deselect_node(data.node, true);
                        return;
                    }

                    this._notifyTreeSelectionChange({
                        instance: data.instance,
                        id: o.id
                    })

                }, this))

                .on("deselect_node.jstree ", _.bind(function (e, data) {

                    this._notifyTreeSelectionChange({
                        instance: data.instance,
                        id: o.id
                    })


                }, this));

            this.treeInstances[o.id] = tree;

            initFilter($container);

            initBtns($container, o.id);

            function initFilter($container) {

                var to = false;
                $container.find(s.FILTER_CONTAINER).on("keyup", function () {
                    if (to) {
                        clearTimeout(to);
                    }
                    to = setTimeout(function () {
                        var v = $container.find(s.FILTER_CONTAINER).val();
                        $container.find(s.TREE_CONTAINER).jstree(true).search(v);
                    }, 250);
                });

            }

            function initBtns($container, id) {

                $container.find(s.CLEAR_ALL_CONTAINER).on('click', function () {
                    $container.find(s.TREE_CONTAINER).jstree("deselect_all", true);
                    self._updateTreeAmount(id);
                });
            }

        },

        _notifyTreeSelectionChange: function (o) {

            var payload = [],
                selected = o.instance.get_selected();

            _.each(selected, function (sel) {
                var node = o.instance.get_node(sel),
                    label = {};

                label[Utils.getLocale()] = node.text;

                payload.push({code: node.id, label: label, parent: node.parent})
            });

            this._updateTreeAmount(o.id);

            amplify.publish(E.SELECTORS_ITEM_SELECT + "." + o.id, payload);
            amplify.publish(E.SELECTORS_ITEM_SELECT);
        },

        _updateTreeAmount: function (id) {

            var $container = this.treeContainers[id],
                amount = $container.find(s.TREE_CONTAINER).jstree().get_selected().length;

            $container.closest(s.SELECTORS_CLASS).find(s.AMOUNT_CONTAINER).html(amount);

        },

        _refreshTree: function (o, data) {
            log.info("Refresh tree");
            log.info(o);

            var model = [],
                $container = this.treeContainers[o.target],
                tree;

            _.each(data, function (item) {
                model = _.unique(model.concat(item.children));
            });

            if ($container.length > 0 && Array.isArray(model)) {

                tree = $container.find(s.TREE_CONTAINER).jstree(true);
                tree.settings.core.data = this._buildTreeModel(model, null, o.target);
                tree.refresh(true);
                tree.redraw(true);

            } else {
                log.warn("Impossible to find container for: " + o.target);
            }
        },

        _printTreeDefaultSelection: function (id) {

            var config = this.selectors[id].selector,
                tree = this.treeInstances[id].jstree(true);

            if (config.default && Array.isArray(config.default) && $.isFunction(tree.select_node) && $.isFunction(tree.deselect_all)) {

                //clear current selection
                tree.deselect_all(true);

                _.each(config.default, function (k) {
                    tree.select_node(k)
                });
            }

        },

        _destroyTree: function (id) {

            var $container = this.treeContainers[id];

            $container.find(s.TREE_CONTAINER).jstree("destroy");

            $container.find(s.FILTER_CONTAINER).off();

            $container.find(s.CLEAR_ALL_CONTAINER).off();

            log.info("Destroyed tree: " + id);
        },

        //dropdown

        _buildDropdownModel: function (fxResource, parent, cl) {

            return this._buildTreeModel(fxResource, parent, cl);
        },

        _renderDropdown: function (o) {

            var config = o.conf.selector,
                $container = this.dropdownContainers[o.id],
                select2conf = $.extend(true, {
                    width: '99%'
                }, config.config),
                dropdown,
                data;

            switch (config.source.toLowerCase()) {
                case "codelist":

                    data = o.data;

                    dropdown = $container.select2($.extend(true, {}, select2conf, {
                        data: data
                    }));

                    break;

                default :

                    data = [];

                    for (var i = config.from; i <= config.to; i++) {
                        data.push({id: i.toString(), text: i.toString()});
                    }

                    dropdown = $container.select2($.extend(true, {}, select2conf, {
                        data: data
                    }));
            }

            this.dropdownInstances[o.id] = dropdown;
            this.dropdownData[o.id] = data;

            this._printDropdownDefaultSelection(o.id);

            dropdown.on('change', function () {

                var data = dropdown.select2('data') || {},
                    label = {};

                label[Utils.getLocale()] = data.text;

                amplify.publish(E.SELECTORS_ITEM_SELECT + '.' + o.id, [{
                    code: data.id,
                    label: label,
                    parent: data.parent
                }]);
                amplify.publish(E.SELECTORS_ITEM_SELECT);
            });

        },

        _printDropdownDefaultSelection: function (id) {

            var config = this.selectors[id].selector,
                dropdown = this.dropdownInstances[id];

            //print default values
            dropdown.val(config.default ? config.default : this.dropdownData[id][0].id).trigger("change");
        },

        _destroyDropdown: function (id) {

            this.dropdownContainers[id].select2('destroy');

            log.info("Destroyed dropdown: " + id);
        },

        //checkbox

        _printCheckboxDefaultSelection: function () {

            if (AC.compareBy && this.$radios.filter("[value='" + AC.compareBy + "']").length > 0) {

                this.$radios.filter("[value='" + AC.compareBy + "']").prop('checked', true).trigger("change");

            } else {

                this.$radios.first().prop('checked', true).trigger("change");

            }

        },

        // dependencies fns

        _dep_min: function (payload, o) {

            log.info("_dep_min invokation");
            log.info(o);

            var config = this.selectors[o.target].selector;

            switch (config.type.toLowerCase()) {

                case "dropdown" :

                    var from = payload[0].code,
                        $container = this.dropdownContainers[o.target],
                        originalValue = $container.select2('data').id,
                        data = [];

                    for (var i = from; i <= config.to; i++) {
                        data.push({
                            id: i,
                            text: i.toString()
                        })
                    }

                    $container.select2({
                        data: data
                    });

                    //Set selected value
                    var v = from > originalValue ? from : originalValue;

                    $container.val(v.toString()).trigger("change");

                    break;
            }

        },

        _dep_parent: function (payload, o) {

            log.info("_dep_min _dep_parent");
            log.info(o);

            var config = this.selectors[o.target].selector;

            switch (config.type.toLowerCase()) {

                case "tree" :

                    var c = this.selectors[o.target].cl;

                    if (c) {

                        //delete c.levels;
                        c.levels = 2;
                        delete c.level;

                        c.codes = [];

                        _.each(payload, function (item) {
                            c.codes.push(item.code);
                        });

                        this._getPromise(c).then(
                            _.bind(this._refreshTree, this, o),
                            function (r) {
                                log.error(r);
                            }
                        )
                    }

                    break;
            }
        },

        _dep_focus: function (payload, o) {

            if (payload.code === this._getSubjectBySelectorId(o.target)) {

                var d = payload.code,
                    selectors = this._getSelectorIdsBySubject(d);

                //highlight compare-by selector background
                this.$el.find("." + AC.selectorFocusedClass).removeClass(AC.selectorFocusedClass);
                this._getSelectorContainer(selectors[0]).closest(s.SELECTORS_CLASS).parent().addClass(AC.selectorFocusedClass);

                _.each(selectors, _.bind(function (sel) {

                    this._enableSelectorAndSwitch(sel);

                }, this));
            }

        },

        //utils for selectors

        _getSelectorContainer: function (cl) {

            return this.$el.find('[data-selector="' + cl + '"]');
        },

        _getSemanticContainer: function (cl) {

            return this._getSelectorContainer(cl).closest(s.SELECTORS_CLASS);

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

        _disableSelector: function (t) {

            var nodes,
                $container = this.treeContainers[t];

            nodes = $container.find(s.TREE_CONTAINER).jstree(true).get_json(null, {flat: true});

            _.each(nodes, function (n) {
                $container.find(s.TREE_CONTAINER).jstree(true).disable_node(n);
            });

            //disable filter
            $container.find(s.CLEAR_ALL_CONTAINER).attr("disabled", true);

            //disable filter
            $container.find(s.FILTER_CONTAINER).attr("disabled", true);

            //add class
            $container.closest(s.SELECTORS_CLASS).addClass(s.SELECTOR_DISABLED_CLASS);

            log.info("Selector disabled : " + t);

        },

        _disableSelectorAndSwitch: function (d) {

            this.$el.find("[data-selector='" + d + "']").find(s.SWITCH).prop('checked', false);
            this.$el.find("[data-selector='" + d + "']").closest(s.SELECTORS_CLASS).find(s.SWITCH).prop('checked', false);
            this._disableSelector(d);

        },

        _enableSelector: function (t) {

            var nodes,
                $container = this.treeContainers[t];

            nodes = $container.find(s.TREE_CONTAINER).jstree(true).get_json(null, {flat: true});

            _.each(nodes, function (n) {
                $container.find(s.TREE_CONTAINER).jstree(true).enable_node(n);
            });

            //enable filter
            $container.find(s.CLEAR_ALL_CONTAINER).removeAttr("disabled");

            //enable filter
            $container.find(s.FILTER_CONTAINER).removeAttr("disabled");

            log.info("Selector enabled : " + t);

        },

        _enableSelectorAndSwitch: function (d) {

            this.$el.find("[data-selector='" + d + "']").find(s.SWITCH).prop('checked', true);
            this.$el.find("[data-selector='" + d + "']").closest(s.SELECTORS_CLASS).find(s.SWITCH).prop('checked', true);
            this._enableSelector(d);
        },

        // Handlers

        _onTreeReady: function () {

            this.treesReady++;

            if (this.treesReady === this.trees.length) {

                log.info("All trees are ready");

                this.ready = true;

                this._onReady();
            }
        },

        _onReady: function () {

            this.$switches.on("click", _.bind(function (e) {

                log.info("Switch clicked");

                var $this = $(e.currentTarget),
                    $selectors = this._getSelectorIdsBySubject($(e.currentTarget).attr("data-target"));

                _.each($selectors, _.bind(function (sel) {

                    if (_.contains(this.selectorsId, sel)) {

                        // $this will contain a reference to the checkbox
                        if ($this.is(':checked')) {

                            // the checkbox was checked
                            this._enableSelector(sel);

                        } else {
                            // the checkbox was unchecked
                            this._disableSelector(sel);

                            this._checkCompareValue(sel);
                        }
                    }

                    this._checkCompareValue(sel);

                }, this));


            }, this));

            //default disabled selectors
            _.each(this.disabledSelectors, _.bind(function (d) {

                if (_.contains(this.selectorsId, d)) {
                    this._disableSelectorAndSwitch(d);
                }

            }, this));

            //compare btns and enable selector

            this.$radios.on('change', _.bind(this._onRadioChange, this));

            this._initDependencies();

            this._printCheckboxDefaultSelection();

            amplify.publish(E.SELECTORS_READY);

        },

        _onRadioChange: function () {

            var code = this.$el.find(s.COMPARE_RADIO_BTNS_CHECKED).val();

            amplify.publish(E.SELECTORS_ITEM_SELECT + ".compare", {code: code, label: i18nLabels[code], parent: null});

        },

        //disposition

        _unbindEventListeners: function () {

            amplify.unsubscribe(E.TREE_READY, this._onTreeReady);

            //destroy selectors dependencies
            this._destroyDependencies();

            //advanced mode selectors switches
            this.$switches.off();

        },

        dispose: function () {

            View.prototype.dispose.call(this, arguments);

            //destroy trees
            _.each(this.trees, _.bind(this._destroyTree, this));

            //destroy dropdown
            _.each(this.dropdown, _.bind(this._destroyDropdown, this));

            //unbind event listeners
            this._unbindEventListeners();

        }

    });

    return SelectorView;
});