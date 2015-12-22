/*global define, amplify*/
define([
    'jquery',
    'underscore',
    'loglevel',
    'views/base/view',
    'text!templates/analyze/compare/selectors.hbs',
    'i18n!nls/analyze',
    'config/Events',
    'config/Config',
    'config/analyze/compare/Config',
    'q',
    'amplify',
    'select2',
    'jstree'
], function ($, _, log, View, template, i18nLabels, E, GC, AC, Q) {

    'use strict';

    var s = {
        SELECTORS_CLASS: ".amis-selector",
        SELECTORS: "[data-selector]",
        TREE_CONTAINER: "[data-role='tree']",
        FILTER_CONTAINER: "[data-role='filter']",
        CLEAR_ALL_CONTAINER: "[data-role='clear']",
        COMPARE_RADIO_BTNS: "input:radio[name='compare']:checked",
        ACTIVE_TAB: "ul#country-ul li.active",
        SWITCH : "input[data-role='switch']"
    };

    var SelectorView = View.extend({

        // Automatically render after initialize
        autoRender: true,

        className: 'analyze-compare-selectors',

        template: template,

        initialize: function (params) {

            View.prototype.initialize.call(this, arguments);
        },

        getTemplateData: function () {
            return i18nLabels;
        },

        _bindEventListeners: function () {

            //TODO double event fired
            this.$switches.on("click", _.bind(function (e) {

                log.info("Switch clicked");

                var $this = $(e.currentTarget),
                    $selectors = $(e.currentTarget).closest(s.SELECTORS_CLASS).find(s.SELECTORS).andSelf();

                _.each($selectors, _.bind(function (s) {

                    var selector = $(s).data("selector");

                    if (_.contains(this.selectorsId, selector)){

                        // $this will contain a reference to the checkbox
                        if ($this.is(':checked')) {

                            // the checkbox was checked
                            this._enableSelector(selector);

                        } else {
                            // the checkbox was unchecked
                            this._disableSelector(selector);
                        }
                    }

                }, this));

            }, this));

        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            this._initVariables();

            this._bindEventListeners();

            this._preloadResources().then(
                _.bind(this._onPreloadResourceSuccess, this),
                _.bind(this._onPreloadResourceError, this)
            );

        },

        _initVariables: function () {

            this.selectors = AC.selectors;

            this.selectorsId = Object.keys(this.selectors);

            this.trees = [];
            this.dropdown = [];
            this.codelists = [];
            this.cachedCodelist = {};
            this.treeInstances = {};
            this.dropdownInstances = {};
            this.treeContainers = {};
            this.dropdownContainers = {};

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
                        this.codelists.push(k);
                    }

                }

            }, this));

            _.each(this.trees, _.bind(function (t) {
                this.treeContainers[t] = this._getSelectorContainer(t);
            }, this));

            _.each(this.dropdown, _.bind(function (t) {
                this.dropdownContainers[t] = this._getSelectorContainer(t);
            }, this));

            this.$switches = this.$el.find(s.SWITCH);

        },

        _getSelectorContainer: function (cl) {

            return this.$el.find('[data-selector="' + cl + '"]');
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

        _createPromise: function (cl) {

            var self = this,
                body = this.selectors[cl].cl;

            return Q($.ajax({
                url: GC.SERVER + GC.CODES_POSTFIX,
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(body),
                dataType: 'json'
            })).then(function (result) {

                if (typeof result === 'undefined') {
                    log.info("No Code List loaded for: " + cl);
                } else {
                    log.info("Code List loaded successfully for: " + cl);

                    amplify.store.sessionStorage(cl, result);
                }

                self.cachedCodelist[cl] = result;

            }, function (r) {

                log.error(r);
            });
        },

        _onPreloadResourceError: function () {
            log.error("Resources load: error");
        },

        _onPreloadResourceSuccess: function () {

            log.info("Resources loaded");

            this._renderSelectors();

            this._bindEventListeners();

            this.ready = true;

            amplify.publish(E.SELECTORS_READY);
        },

        _renderSelectors: function () {

            //render trees selectors
            _.each(this.trees, _.bind(function (cl) {

                var rawCl = amplify.store.sessionStorage(cl),
                    data = this._buildTreeModel(rawCl),
                    conf = this.selectors[cl];

                this._renderTree({id: cl, data: data, conf: conf});

            }, this));

            //render dropdown selectors
            _.each(this.dropdown, _.bind(function (cl) {

                var rawCl = amplify.store.sessionStorage(cl),
                    conf = this.selectors[cl];

                this._renderDropdown({
                    id: cl,
                    data: rawCl ? this._buildDropdownModel(rawCl) : null,
                    conf: conf
                });

            }, this));

        },

        _buildTreeModel: function (fxResource, parent) {

            var data = [];

            _.each(fxResource, _.bind(function (item) {

                data.push({
                    id: item.code,
                    //TODO no multi language
                    text: item.title.EN,
                    parent: parent || '#'
                });

                if (Array.isArray(item.children) && item.children.length > 0) {
                    data = _.union(data, this._buildTreeModel(item.children, item.code));
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

            var $container = this.treeContainers[o.id],
                tree;

            tree = $container.find(s.TREE_CONTAINER).jstree({
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
                })
                //Default selection
                .on('ready.jstree', function (e, data) {

                    if (o.conf.selector.default && Array.isArray(o.conf.selector.default)) {
                        _.each(o.conf.selector.default, function (k) {
                            data.instance.select_node(k)
                        });

                    }
                })
                //Limit selection e select only leafs for indicators
                .on("select_node.jstree", _.bind(function (e, data) {

                   if (!isNaN(this.selectors[o.id].selector.max) && data.selected.length > this.selectors[o.id].selector.max) {
                       data.instance.deselect_node(data.node);
                       log.warn("Max number of selectable item reached. Change 'selector.selector.max' config.");
                       return;
                    }

                    if (!data.instance.is_leaf(data.node)) {
                        data.instance.deselect_node(data.node, true);
                        data.instance.toggle_node(data.node);
                        return;
                    }

                    amplify.publish(E.SELECTORS_ITEM_SELECT)

                }, this));

            this.treeInstances[o.id] = tree;

            initFilter($container);

            initBtns($container);

            //check for dependencies
            if (o.conf.dependencies) {
                //TODO
            }

            function initFilter($container) {

                var to = false;
                $container.find(s.FILTER_CONTAINER).keyup(function () {
                    if (to) {
                        clearTimeout(to);
                    }
                    to = setTimeout(function () {
                        var v = $container.find(s.FILTER_CONTAINER).val();
                        $container.find(s.TREE_CONTAINER).jstree(true).search(v);
                    }, 250);
                });

            }

            function initBtns($container) {

                $container.find(s.CLEAR_ALL_CONTAINER).on('click', function () {
                    $container.find(s.TREE_CONTAINER).jstree("deselect_all", true);
                });
            }
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

            log.info("Selector disabled : " + t);

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

        _refreshTree: function () {
            console.log("Refresh")
        },

        _buildDropdownModel: function (fxResource) {

            return this._buildTreeModel(fxResource);
        },

        _renderDropdown: function (o) {

            var config = o.conf.selector,
                $container = this.dropdownContainers[o.id],
                select2conf = {
                    width: 'resolve'
                },
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

            //print default values
            dropdown.val(config.default ? config.default : data[0].id).trigger("change");

            this.dropdownInstances[o.id] = dropdown;
        },

        getSelection: function () {

            if (this.ready !== true) {
                return {};
            }

            this._disableSelector("country-country")

            var result = {
                labels: {}
            };

            //get trees selectors
            _.each(this.trees, _.bind(function (cl) {

                var instance = this.treeInstances[cl].jstree(true);

                result[cl] = instance.get_selected();

                result.labels[cl] = [];

                _.each(result[cl], function (c) {
                    result.labels[cl].push(instance.get_node(c).text);
                });

            }, this));

            //get dropdown selectors
            _.each(this.dropdown, _.bind(function (cl) {

                var instance = this.dropdownInstances[cl],
                    sel = instance.select2('data');

                if (sel) {

                    result[cl] = sel.id;

                    result.labels[cl] = sel.text;
                }

            }, this));

            //get compare
            result.compare = this.$el.find(s.COMPARE_RADIO_BTNS).val();

            //remove unused country selection
            var activeTab = this.$el.find(s.ACTIVE_TAB).data('sel'),
                sels = ['country-country', 'country-region', 'regional-aggregation'],
                final = _.without(sels, activeTab);

            _.each(final, function (f) {
                delete result[f];
                delete result.labels[f];
            });

            return result;

        },

        reset: function () {

            log.info("Selector View reset");
        }

    });

    return SelectorView;
});
