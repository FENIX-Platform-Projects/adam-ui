define(
    [
        'jquery',
        'underscore',
        'views/base/view',
        'text!templates/analyse/priority_analysis/filters.hbs',
        'i18n!nls/filter',
        'fx-filter/start',
        'fx-common/utils',
        'lib/utils',
        'config/Config',
        'config/analyse/priority_analysis/config-priority-analysis',
        'config/analyse/partner_matrix/Events',
        'amplify'
    ], function ($, _, View, template, i18nLabels, Filter, FxUtils, Utils, BaseConfig, PriorityAnalysisConfig, BaseEvents, amplify) {

        'use strict';

        var s = {
            css_classes: {
                FILTER_ANALYSE_PRIORITY_ANALYSIS: "#filter-analyse-priority-analysis"
            },
            exclusions: {
                ALL: 'all'
            },
            range: {
                FROM: 'from',
                TO: 'to'
            }
        };


        /**
         * Creates a new Filter View.
         * Instantiates the FENIX filter submodule and responsible for all filter related functionality.
         * @class FilterView
         * @extends View
         */
        var FilterView = View.extend({
            /**  @lends FilterView */

            // Automatically render after initialize
            autoRender: true,

            className: 'filter-analyse-priority-analysis',

            // Save the template string in a prototype property.
            // This is overwritten with the compiled template function.
            // In the end you might want to used precompiled templates.
            template: template,


            initialize: function (params) {
                this.config = params.config;

                View.prototype.initialize.call(this, arguments);
            },


            attach: function () {

                View.prototype.attach.call(this, arguments);

                this.$el = $(this.el);

                this._buildFilters();
            },


            /**
             * Updates filter configuration and renders the filter.
             * @private
             */
            _buildFilters: function () {
                var self = this;


                var filterConfig = this._getUpdatedFilterConfig();

                if (!_.isEmpty(filterConfig)) {
                    this.$el.find(s.css_classes.FILTER_ANALYSE_PRIORITY_ANALYSIS).show();
                    this._renderFilter(filterConfig);
                } else {
                    this.$el.find(s.css_classes.FILTER_ANALYSE_PRIORITY_ANALYSIS).hide();
                }
            },

            /**
             *
             * Instantiates the FENIX Filter Sub Module with the configuration and sets the Filter Event Handlers
             * @param config
             * @private
             */
            _renderFilter: function (config) {
                var self = this;

                // dispose of filter
                if (this.filter && $.isFunction(this.filter.dispose)) {
                    this.filter.dispose();
                }

                // instantiate new filter
                this.filter = new Filter({
                    el: this.$el.find(s.css_classes.FILTER_ANALYSE_PRIORITY_ANALYSIS),
                    environment: BaseConfig.ENVIRONMENT,
                    items: config,
                    common: {
                        template: {
                            hideSwitch: true,
                            hideRemoveButton: true
                        }
                    }
                });



                // Set filter event handlers
                // Filter on Ready: Set some additional properties based on the current selections then publish Filter Ready Event
                // SELECTED_TOPIC Property -  based on the Recipient Country and Resource Partner selections
                // ODA Property - based on the ODA selection, then publish Filter Ready Event
                this.filter.on('ready', function (payload) {


                    // For the Recipient Country, set the topic as RECIPIENT_COUNTRY_SELECTED
                    if (self._getFilterValues().values[BaseConfig.SELECTORS.RECIPIENT_COUNTRY]) {
                        var selected = [];
                        selected.push(self._getPropertiesObject(PriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED, self._getLabel(BaseConfig.SELECTORS.RECIPIENT_COUNTRY)));
                        var selectedTopic = self._getPropertiesObject(PriorityAnalysisConfig.topic.SELECTED_TOPIC, PriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED);

                        // If both the Recipient Country and Resource Partner selected, set the topic as RECIPIENT_AND_PARTNER_SELECTED
                        if (self._getFilterValues().values[BaseConfig.SELECTORS.RESOURCE_PARTNER]) {
                            selectedTopic = self._getPropertiesObject(PriorityAnalysisConfig.topic.SELECTED_TOPIC, PriorityAnalysisConfig.topic.RECIPIENT_AND_PARTNER_SELECTED);
                            selected.push(self._getPropertiesObject(PriorityAnalysisConfig.topic.RESOURCE_PARTNER_SELECTED, self._getLabel(BaseConfig.SELECTORS.RESOURCE_PARTNER)));
                        }

                        var additionalProps = [selectedTopic, {selections: selected}];
                        amplify.publish(BaseEvents.FILTER_ON_READY, $.extend(self._getFilterValues(), {"props": additionalProps}));

                    }
                    // If Resource Partner selected, set the topic as RESOURCE_PARTNER_SELECTED
                    else if (self._getFilterValues().values[BaseConfig.SELECTORS.RESOURCE_PARTNER]) {

                        var selected = [];
                        selected.push(self._getPropertiesObject(PriorityAnalysisConfig.topic.RESOURCE_PARTNER_SELECTED, self._getLabel(BaseConfig.SELECTORS.RESOURCE_PARTNER)));
                        var selectedTopic = self._getPropertiesObject(PriorityAnalysisConfig.topic.SELECTED_TOPIC, PriorityAnalysisConfig.topic.RESOURCE_PARTNER_SELECTED);

                        // If both the Recipient Country and Resource Partner selected, set the topic as RECIPIENT_AND_PARTNER_SELECTED
                        if (self._getFilterValues().values[BaseConfig.SELECTORS.RECIPIENT_COUNTRY]) {
                            selectedTopic = self._getPropertiesObject(PriorityAnalysisConfig.topic.SELECTED_TOPIC, PriorityAnalysisConfig.topic.RECIPIENT_AND_PARTNER_SELECTED);
                            selected.push(self._getPropertiesObject(PriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED, self._getLabel(BaseConfig.SELECTORS.RECIPIENT_COUNTRY)));

                        }

                        var additionalProps = [selectedTopic, {selections: selected}];

                        amplify.publish(BaseEvents.FILTER_ON_READY, $.extend(self._getFilterValues(), {"props": additionalProperties}));

                    }
                    // For ODA set its value to the props object
                    else if (self._getFilterValues().values[BaseConfig.SELECTORS.ODA]) {
                        var additionalProperties = self._getPropertiesObject(BaseConfig.SELECTORS.ODA, self._getFilterValues().values[BaseConfig.SELECTORS.ODA].enumeration[0]);

                        amplify.publish(BaseEvents.FILTER_ON_READY, $.extend(self._getFilterValues(), {"props": additionalProperties}));
                    }
                    else {
                       amplify.publish(BaseEvents.FILTER_ON_READY, self._getFilterValues());
                    }

                });



                this.filter.on('click', function (payload) {

                    var filterItem = self.$el.find("[data-selector="+payload.id+"]")[0];
                    var selectize = $(filterItem).find("[data-role=dropdown]")[0].selectize;
                    selectize.clear(true);

                });


                // Filter on Change: Set some base properties for Recipient and the ODA, then publish Filter On Change Event
                this.filter.on('change', function (payload) {

                    //console.log("FILTER ALL ==========");
                    //console.log(payload.values.values);

                    var fc = self._getFilterConfigById(payload.id);
                    var dependencies = [];
                    if (fc && fc.dependencies) {
                        for (var id in fc.dependencies) {
                            dependencies.push(id);
                        }

                        payload["dependencies"] = dependencies;
                    }

                    if (payload.id === BaseConfig.SELECTORS.YEAR_TO || payload.id === BaseConfig.SELECTORS.YEAR_FROM) {
                        var newRange = self._getObject(BaseConfig.SELECTORS.YEAR, self._getSelectedLabels());
                        if (newRange) {
                            payload.id = BaseConfig.SELECTORS.YEAR;
                            payload.values.labels = self._getObject(BaseConfig.SELECTORS.YEAR, self._getSelectedLabels());
                            payload.values.values = self._getObject(BaseConfig.SELECTORS.YEAR, self._getSelectedValues());
                        }


                        amplify.publish(BaseEvents.FILTER_ON_CHANGE, payload);
                    }
                    else if (payload.id === BaseConfig.SELECTORS.ODA) {
                        var additionalProperties = self._getPropertiesObject(BaseConfig.SELECTORS.ODA, payload.values.values[0]);

                        amplify.publish(BaseEvents.FILTER_ON_CHANGE, $.extend(payload, {"props": additionalProperties}));
                    }
                    else if (payload.id === BaseConfig.SELECTORS.RECIPIENT_COUNTRY) {
                        if(payload.values.values.length > 0) {

                            var selected = [];
                            var selectedTopic = PriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED;
                            var partnerValues = self._getFilterValues().values[BaseConfig.SELECTORS.RESOURCE_PARTNER];

                            if (partnerValues[0] !== 'all') { //A Resource Partner IS selected
                                selected = [];
                                selected.push(self._getPropertiesObject(PriorityAnalysisConfig.topic.RESOURCE_PARTNER_SELECTED,  self._getLabel(BaseConfig.SELECTORS.RESOURCE_PARTNER)));

                                if (payload.values.values[0] === 'all') { // All recipients are selected
                                    selectedTopic = PriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED;
                                    selected.push(self._getPropertiesObject(PriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED, PriorityAnalysisConfig.selections.ALL));
                                } else { // 1 recipient and 1 partners
                                    selectedTopic = PriorityAnalysisConfig.topic.RECIPIENT_AND_PARTNER_SELECTED;
                                    selected.push(self._getPropertiesObject(PriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED, self._getLabel(BaseConfig.SELECTORS.RECIPIENT_COUNTRY)));
                                }
                            } else { //ALL Resource Partners selected
                                selected = [];
                                selected.push(self._getPropertiesObject(PriorityAnalysisConfig.topic.RESOURCE_PARTNER_SELECTED,  PriorityAnalysisConfig.selections.ALL));
                                if (payload.values.values[0] === 'all') { // All recipients are selected
                                    selectedTopic = PriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED;
                                    selected.push(self._getPropertiesObject(PriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED, PriorityAnalysisConfig.selections.ALL));
                                } else {
                                    selected.push(self._getPropertiesObject(PriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED, self._getLabel(BaseConfig.SELECTORS.RECIPIENT_COUNTRY)));
                                }
                            }


                            var selectedTopicProps = self._getPropertiesObject(PriorityAnalysisConfig.topic.SELECTED_TOPIC, selectedTopic);
                            var additionalProperties = [selectedTopicProps, {selections: selected}];

                            //var additionalProperties = self._getPropertiesObject(PriorityAnalysisConfig.topic.SELECTED_TOPIC, selectedTopic);

                            /*  // If both the Recipient Country and Resource Partner selected, set the topic as an attribute of the props object
                             if(payload.values.values.length > 0) {
                             // If both the Recipient Country and Resource Partner selected, set the topic as an attribute of the props object
                             if (self._getFilterValues().values[BaseConfig.SELECTORS.RESOURCE_PARTNER]) {
                             additionalProperties = self._getPropertiesObject(PriorityAnalysisConfig.topic.SELECTED_TOPIC, PriorityAnalysisConfig.topic.RECIPIENT_AND_PARTNER_SELECTED);
                             }
                             } else {
                             if (self._getFilterValues().values[BaseConfig.SELECTORS.RESOURCE_PARTNER]) {
                             additionalProperties = self._getPropertiesObject(PriorityAnalysisConfig.topic.SELECTED_TOPIC, PriorityAnalysisConfig.topic.RESOURCE_PARTNER_SELECTED);
                             }
                             }*/

                            //console.log("========================= FilterView: ON CHANGE COUNTRY ============== " + selectedTopic);
                            amplify.publish(BaseEvents.FILTER_ON_CHANGE, $.extend(payload, {"props": additionalProperties}));
                        }

                    }
                    else if (payload.id === BaseConfig.SELECTORS.RESOURCE_PARTNER) {

                        if(payload.values.values.length > 0) {
                            var selected = [];
                            var selectedTopic = PriorityAnalysisConfig.topic.RESOURCE_PARTNER_SELECTED;
                            var recipientValues = self._getFilterValues().values[BaseConfig.SELECTORS.RECIPIENT_COUNTRY];

                            if (recipientValues[0] !== 'all') { //A Recipient Country IS selected
                                selected = [];
                                selected.push(self._getPropertiesObject(PriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED, self._getLabel(BaseConfig.SELECTORS.RECIPIENT_COUNTRY)));

                                if (payload.values.values[0] === 'all') { // All resource partners selected
                                    selectedTopic = PriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED;
                                    selected.push(self._getPropertiesObject(PriorityAnalysisConfig.topic.RESOURCE_PARTNER_SELECTED,  PriorityAnalysisConfig.selections.ALL));
                                } else {
                                    selectedTopic = PriorityAnalysisConfig.topic.RECIPIENT_AND_PARTNER_SELECTED;
                                    selected.push(self._getPropertiesObject(PriorityAnalysisConfig.topic.RESOURCE_PARTNER_SELECTED,  self._getLabel(BaseConfig.SELECTORS.RESOURCE_PARTNER)));
                                }
                            } else { //All  Recipients selected
                                selected = [];
                                selected.push(self._getPropertiesObject(PriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED, PriorityAnalysisConfig.selections.ALL));

                                if (payload.values.values[0] === 'all') { // All resource partners are selected
                                    selected = [];
                                    selectedTopic = PriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED;
                                    selected.push(self._getPropertiesObject(PriorityAnalysisConfig.topic.RESOURCE_PARTNER_SELECTED,  PriorityAnalysisConfig.selections.ALL));
                                } else {
                                    selected.push(self._getPropertiesObject(PriorityAnalysisConfig.topic.RESOURCE_PARTNER_SELECTED, self._getLabel(BaseConfig.SELECTORS.RESOURCE_PARTNER_SELECTED)));
                                }
                            }

                            var selectedTopicProps = self._getPropertiesObject(PriorityAnalysisConfig.topic.SELECTED_TOPIC, selectedTopic);
                            var additionalProperties = [selectedTopicProps, {selections: selected}];

                            //var additionalProperties = self._getPropertiesObject(PriorityAnalysisConfig.topic.SELECTED_TOPIC, selectedTopic);

                            /* var additionalProperties = self._getPropertiesObject(PriorityAnalysisConfig.topic.SELECTED_TOPIC, PriorityAnalysisConfig.topic.RESOURCE_PARTNER_SELECTED);

                             if(payload.values.values[0] === 'all') {
                             if (self._getFilterValues().values[BaseConfig.SELECTORS.RECIPIENT_COUNTRY]) {
                             additionalProperties = self._getPropertiesObject(PriorityAnalysisConfig.topic.SELECTED_TOPIC, PriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED);
                             }
                             } else {
                             // If both the Recipient Country and Resource Partner selected, set the topic as an attribute of the props object
                             if (self._getFilterValues().values[BaseConfig.SELECTORS.RECIPIENT_COUNTRY]) {
                             additionalProperties = self._getPropertiesObject(PriorityAnalysisConfig.topic.SELECTED_TOPIC, PriorityAnalysisConfig.topic.RECIPIENT_AND_PARTNER_SELECTED);
                             }
                             }*/

                            //console.log("========================= FilterView: ON PARTNER ============== " + selectedTopic);
                            amplify.publish(BaseEvents.FILTER_ON_CHANGE, $.extend(payload, {"props": additionalProperties}));

                        }

                    }
                    else {
                        //console.log("========================= FilterView: ELSE ============== "+selectedTopic);
                        amplify.publish(BaseEvents.FILTER_ON_CHANGE, payload);
                    }

                });


            },
            /**
             * Updates the filter configuration including setting the language related labels in the filter template
             * Returns: Updated Configuration
             * @returns {Object} updatedConf
             * @private
             */
            _getUpdatedFilterConfig: function () {

                var conf = $.extend(true, {}, this.config),
                    values = {},
                    updatedConf = FxUtils.mergeConfigurations(conf, values);

                _.each(updatedConf, _.bind(function (obj, key) {

                    if (!obj.template) {
                        obj.template = {};
                    }
                    //Add i18n label
                    obj.template.title = Utils.getI18nLabel(key, i18nLabels, "filter_");
                    obj.template.headerIconTooltip = Utils.getI18nLabel(key, i18nLabels, "filter_tooltip_");

                }, this));

                return updatedConf;
            },

            /**
             * Format the time range and ODA values
             * @returns {Object}
             * @private
             */



            _getFilterValues: function () {

                var timerange = {
                    values: {year: [{value: '', parent: s.range.FROM}, {value: '', parent: s.range.TO}]},
                    labels: {year: {range: ''}}
                };

                var updatedValuesWithYear = {}, updatedValuesWithODA = {}, extendedValues = $.extend(true, {}, this.filter.getValues(), timerange);

                updatedValuesWithYear = this._processTimeRange(extendedValues);

                //updatedValuesWithODA = this._processODA(updatedValuesWithYear);

                return updatedValuesWithYear;

            },

            /**
             * Get the selected filter values
             * @returns {Object} values
             * @private
             */

            _getSelectedValues: function () {
                return this._getFilterValues().values;
            },


            /**
             *  Get the selected filter labels
             * @returns {Object} labels
             * @private
             */
            _getSelectedLabels: function () {
                return this._getFilterValues().labels;
            },


            /**
             *  Get the filter configuration associated to the ID
             * @param id
             * @returns {Object} values
             * @private
             */

            _getFilterConfigById: function (id) {
                var filter;

                $.each(this.config, function (key, obj) {
                    if (key === id) {
                        return filter = obj;
                    }
                });

                return filter;
            },

            /**
             *  Get the full filter values object (consists of labels and values)
             * @returns {Object} filterValues
             */
            getFilterValues: function () {

                 //console.log("FINAL getFilterValues ============ 1");


                var values = this._getFilterValues();


                //clear uid values
                values.values["uid"] = [];

                values.values[BaseConfig.SELECTORS.YEAR_FROM] = [];
                values.values[BaseConfig.SELECTORS.YEAR_TO] = [];


                // if all values selected clear
                if(values.values[BaseConfig.SELECTORS.RECIPIENT_COUNTRY][0] === s.exclusions.ALL) {
                    values.values[BaseConfig.SELECTORS.RECIPIENT_COUNTRY] = [];
                }

                // if all values selected clear
                if(values.values[BaseConfig.SELECTORS.RESOURCE_PARTNER][0] === s.exclusions.ALL) {
                    values.values[BaseConfig.SELECTORS.RESOURCE_PARTNER] = [];
                }

                //console.log("FINAL getFilterValues ============ END");
               // console.log(values);

                return values;
            },

            /**
             *  Clear Values for the filter id
             * @param filterid
             * @param values
             * @returns {Object} values
             */

            clearFilterValue: function (filterid, values) {

                if (values.values[filterid]) {
                    values.values[filterid] = [];
                }

                return values;
            },

            /**
             *  Process the time range so that it complies with the expected D3S format
             * @param filter
             * @returns {Object} filter
             */
            _processTimeRange: function (filter) {

                var year_from = filter.values[BaseConfig.SELECTORS.YEAR_FROM], year_to = filter.values[BaseConfig.SELECTORS.YEAR_TO];

                //reformat to and from years
                filter.values.year[0].value = year_from[0];
                filter.values.year[1].value = year_to[0];

                filter.labels.year.range = year_from[0] + '-' + year_to[0];
                filter.labels[BaseConfig.SELECTORS.YEAR_FROM] = [];
                filter.labels[BaseConfig.SELECTORS.YEAR_TO] = [];

                return filter;
            },


            /**
             *  Process the ODA so that it complies with the expected D3S format
             * @param filter
             * @returns {Object} filter
             */
            _processODA: function (filter) {

                var enumeration = [], oda = filter.values[BaseConfig.SELECTORS.ODA][0];
                enumeration.push(oda);

                filter.values[BaseConfig.SELECTORS.ODA] = {};
                filter.values[BaseConfig.SELECTORS.ODA].enumeration = enumeration;


                return filter;
            },


            /**
             *  Process and get the filter values relevant to the OECD/ODA Dashboard
             * @returns {Object} values
             */

            getOECDValues: function () {

                var values = this._getSelectedValues();

                return this._updateValues(values);
            },


            /**
             *  Check if values exist for the filter id
             *  @param filterid
             * @returns {boolean}
             */

            hasValues: function (filterid) {
                var values = this._getSelectedValues();
                return this._hasSelections(filterid, values);
            },


            /**
             *  Get the values for the filter id
             * @returns {Object} values
             */
            getSelectedValues: function (filterId) {
                var values = this._getSelectedValues();

                var selectedValues = {};
                var itemSelected = this._hasSelections(filterId, values);

                if (itemSelected) {
                    selectedValues = values[filterId];
                    //var filterObj = this._getObject(filterId, values);
                    //selectedValues = this._getSelected(filterObj);
                }

                return selectedValues;
            },


            /**
             * Check if a filter has selections
             * @param id
             * @returns {*|boolean}
             */
            isFilterSelected: function (id) {
                var values = this._getSelectedValues();


                return this._hasSelections(id, values);
            },



            /**
             *
             * @param values
             * @returns {*}
             * @private
             */
            _updateValues: function (values) {

                return values;
            },

            /**
             * Check if filter id has selections
             * @param id
             * @param data
             * @returns {boolean}
             * @private
             */
            _hasSelections: function (id, data) {
                //console.log(id);
                if (_.has(data, id)) {
                    if (data[id].length > 0) {
                        // if (_.has(data[id], 'codes')) {
                        return true;
                    }
                }
            },
            /**
             * Get the Object from the data based on the id (key)
             * @param id
             * @param data
             * @returns {*}
             * @private
             */
            _getObject: function (id, data) {
                if (_.has(data, id)) {
                    if (data[id].length > 0 || !_.isEmpty(data[id])) {
                        // if (_.has(data[id], 'codes')) {
                        return data[id];
                    }
                }
            },


            _getFilterConfig: function (id) {
                //console.log(this.config);

                var filter = _.find(this.config, function (obj, key) {

                    return key === id;
                    // return obj.components[0].id === id;
                });


                return filter;
            },

            _hasProp: function (filter, prop) {
                var hasProp = _.find(filter, function (obj) {
                    if (filter[prop]) {
                        return true;
                    }
                });
                return hasProp;
            },

            getConfigPropValue: function (id, prop) {

                // console.log("===============getConfigPropValue "+id + ' | '+prop);
                var filterValue;
                var filterItem = this._getFilterConfig(id);

                // console.log(filterItem);

                if (this._hasProp(filterItem, prop))
                    filterValue = filterItem[prop];

                // console.log(filterValue);
                return filterValue;
            },

            _getPropertiesObject: function (id, value) {
                var additionalProperties = {};
                additionalProperties[id] = value;

                return additionalProperties;
            },


            _getLabel: function (filterid) {
                var code = this._getFilterValues().values[filterid][0];
                var label = this._getFilterValues().labels[filterid][code];

                return label;
            },


            _unbindEventListeners: function () {

            },

            dispose: function () {
                this._unbindEventListeners();
                View.prototype.dispose.call(this, arguments);
            }

        });

        return FilterView;
    });
