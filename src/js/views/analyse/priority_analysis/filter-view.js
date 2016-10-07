define(
    [
        'jquery',
        'underscore',
        'views/base/view',
        'text!templates/analyse/priority_analysis/filters.hbs',
        'fx-filter/start',
        'views/common/filter-validator',
        'lib/filter-utils',
        'config/Config',
        'config/analyse/priority_analysis/config-priority-analysis',
        'config/analyse/partner_matrix/Events',
        'amplify'
    ], function ($, _, View, template, Filter, FilterValidator, FilterUtils, BaseConfig, PriorityAnalysisConfig, BaseEvents, amplify) {

        'use strict';

        var s = {
            css_classes: {
                FILTER_ANALYSE_PRIORITY_ANALYSIS: "#filter-analyse-priority-analysis",
                FILTER_ERRORS_HOLDER: "#filter-analyse-priority-errors-holder"
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

                this.filterUtils = new FilterUtils();

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

                var filterConfig = this.filterUtils.getUpdatedFilterConfig(this.config);

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

                // instantiate new filter validator
                this.filterValidator = new FilterValidator({
                    el: this.$el.find(s.css_classes.FILTER_ERRORS_HOLDER)
                });

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
                this.filter.on('ready', function () {

                    // For the Recipient Country or resource Partner set the topic and properties
                    if (self._getFilterValues().values[BaseConfig.SELECTORS.RECIPIENT_COUNTRY] || self._getFilterValues().values[BaseConfig.SELECTORS.RESOURCE_PARTNER]) {

                        var recipientValue = self._getFilterValues().values[BaseConfig.SELECTORS.RECIPIENT_COUNTRY][0];
                        var partnerValue = self._getFilterValues().values[BaseConfig.SELECTORS.RESOURCE_PARTNER][0];
                        var selections = [], topic, topicProps, properties;

                        if (recipientValue === 'all') {
                            selections = [];

                            // FROM FILTER: ALL resource partners selected
                            if (partnerValue === 'all') {
                                // --> All partners + All recipients
                                selections = [];
                                topic = PriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED;
                                selections.push(self.filterUtils.getPropertiesObject(PriorityAnalysisConfig.topic.RESOURCE_PARTNER_SELECTED, PriorityAnalysisConfig.selections.ALL));
                                selections.push(self.filterUtils.getPropertiesObject(PriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED, PriorityAnalysisConfig.selections.ALL));
                            }
                            // FROM FILTER: 1 resource partner selected
                            else {
                                // --> 1 partner + All recipients
                                topic = PriorityAnalysisConfig.topic.RESOURCE_PARTNER_SELECTED;
                                selections.push(self.filterUtils.getPropertiesObject(PriorityAnalysisConfig.topic.RESOURCE_PARTNER_SELECTED, self._getLabel(BaseConfig.SELECTORS.RESOURCE_PARTNER_SELECTED)));
                                selections.push(self.filterUtils.getPropertiesObject(PriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED, PriorityAnalysisConfig.selections.ALL));
                            }
                        }
                        // FROM FILTER: 1 Recipient Country selected
                        else {
                            selections = [];

                            // All resource partners selected
                            if (partnerValue === 'all') {
                                // --> All partner + 1 recipient
                                topic = PriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED;
                                selections.push(self.filterUtils.getPropertiesObject(PriorityAnalysisConfig.topic.RESOURCE_PARTNER_SELECTED, PriorityAnalysisConfig.selections.ALL));
                                selections.push(self.filterUtils.getPropertiesObject(PriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED, self._getLabel(BaseConfig.SELECTORS.RECIPIENT_COUNTRY)));
                            }
                            // 1 resource partners selected
                            else {
                                // --> 1 partner + 1 recipient
                                topic = PriorityAnalysisConfig.topic.RECIPIENT_AND_PARTNER_SELECTED;
                                selections.push(self.filterUtils.getPropertiesObject(PriorityAnalysisConfig.topic.RESOURCE_PARTNER_SELECTED, self._getLabel(BaseConfig.SELECTORS.RESOURCE_PARTNER)));
                                selections.push(self.filterUtils.getPropertiesObject(PriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED, self._getLabel(BaseConfig.SELECTORS.RECIPIENT_COUNTRY)));
                            }
                        }

                        topicProps = self.filterUtils.getPropertiesObject(PriorityAnalysisConfig.topic.SELECTED_TOPIC, topic);
                        properties = [topicProps, {selections: selections}];

                        amplify.publish(BaseEvents.FILTER_ON_READY, $.extend(self._getFilterValues(), {"props": properties}));
                    }
                    // For ODA set its value to the props object
                    else if (self._getFilterValues().values[BaseConfig.SELECTORS.ODA]) {
                        var additionalProperties = self.filterUtils.getPropertiesObject(BaseConfig.SELECTORS.ODA, self._getFilterValues().values[BaseConfig.SELECTORS.ODA].enumeration[0]);
                        amplify.publish(BaseEvents.FILTER_ON_READY, $.extend(self._getFilterValues(), {"props": additionalProperties}));
                    }

                });



                this.filter.on('click', function (payload) {

                   // self.filterUtils.clearSelectize(self.$el, payload.id);

                });


                // Filter on Change: Set some base properties for Recipient and the ODA, then publish Filter On Change Event
                this.filter.on('change', function (payload) {

                    //console.log("FILTER ALL ==========");
                    //console.log(payload.values.values);

                    // validate filter
                    var valid = self.filterValidator.validateValues(self._getSelectedValues());

                    if (valid === true) {
                        self.filterValidator.hideErrorSection();

                        var topic, selections = [], topicProps, properties;

                        var fc = self.filterUtils.getFilterConfigById(self.config, payload.id);

                        var dependencies = [];
                        if (fc && fc.dependencies) {
                            for (var id in fc.dependencies) {
                                dependencies.push(id);
                            }

                            payload["dependencies"] = dependencies;
                        }

                        if (payload.id === BaseConfig.SELECTORS.YEAR_TO || payload.id === BaseConfig.SELECTORS.YEAR_FROM) {

                            // Check only for the To payload.
                            //--------------------------------
                            // When From is selected, the To is automatically re-populated and this in turn triggers its own 'on Change'.
                            // The result is that the 'BaseEvents.FILTER_ON_CHANGE' is published twice (1 for the From and then automatically again for the To).
                            // To avoid the double publish, only the last 'on Change' trigger is evaluated i.e. when payload = 'To'

                            if ( payload.id === BaseConfig.SELECTORS.YEAR_TO) {

                                var newRange = self.filterUtils.getObject(BaseConfig.SELECTORS.YEAR, self._getSelectedLabels());

                                if (newRange) {
                                    payload.id = BaseConfig.SELECTORS.YEAR;
                                    payload.values.labels = self.filterUtils.getObject(BaseConfig.SELECTORS.YEAR, self._getSelectedLabels());
                                    payload.values.values = self.filterUtils.getObject(BaseConfig.SELECTORS.YEAR, self._getSelectedValues());
                                }

                                amplify.publish(BaseEvents.FILTER_ON_CHANGE, payload);
                            }

                        }
                        else if (payload.id === BaseConfig.SELECTORS.ODA) {
                            var additionalProperties = self.filterUtils.getPropertiesObject(BaseConfig.SELECTORS.ODA, payload.values.values[0]);

                            amplify.publish(BaseEvents.FILTER_ON_CHANGE, $.extend(payload, {"props": additionalProperties}));
                        }
                        else if (payload.id === BaseConfig.SELECTORS.RECIPIENT_COUNTRY) {
                            if(payload.values.values.length > 0) {

                                var partnerValue = self._getFilterValues().values[BaseConfig.SELECTORS.RESOURCE_PARTNER][0];
                                var payloadRecipientValue = payload.values.values[0];

                                // FROM FILTER VALUES: ALL Resource Partners selected
                                if (partnerValue === 'all') {
                                    selections = [];

                                    // FROM PAYLOAD: ALL recipients are selected
                                    if (payloadRecipientValue === 'all') {
                                        // --> All recipient + All partners
                                        topic = PriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED;
                                        selections.push(self.filterUtils.getPropertiesObject(PriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED, PriorityAnalysisConfig.selections.ALL));
                                        selections.push(self.filterUtils.getPropertiesObject(PriorityAnalysisConfig.topic.RESOURCE_PARTNER_SELECTED,  PriorityAnalysisConfig.selections.ALL));

                                    }
                                    // FROM PAYLOAD: 1 recipients selected
                                    else {
                                        // --> 1 recipient + All partners
                                        topic = PriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED;
                                        selections.push(self.filterUtils.getPropertiesObject(PriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED, self._getLabel(BaseConfig.SELECTORS.RECIPIENT_COUNTRY)));
                                        selections.push(self.filterUtils.getPropertiesObject(PriorityAnalysisConfig.topic.RESOURCE_PARTNER_SELECTED,  PriorityAnalysisConfig.selections.ALL));
                                    }
                                }
                                // FROM FILTER VALUES: 1 Resource Partner selected
                                else {
                                    selections = [];

                                    // FROM PAYLOAD: All recipients are selected
                                    if (payloadRecipientValue === 'all') {
                                        // --> All recipient + 1 partner
                                        topic = PriorityAnalysisConfig.topic.RESOURCE_PARTNER_SELECTED;
                                        selections.push(self.filterUtils.getPropertiesObject(PriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED, PriorityAnalysisConfig.selections.ALL));
                                        selections.push(self.filterUtils.getPropertiesObject(PriorityAnalysisConfig.topic.RESOURCE_PARTNER_SELECTED,  self._getLabel(BaseConfig.SELECTORS.RESOURCE_PARTNER)));

                                    }
                                    // FROM PAYLOAD: 1 recipient selected
                                    else {
                                        // --> 1 recipient + 1 partner
                                        topic = PriorityAnalysisConfig.topic.RECIPIENT_AND_PARTNER_SELECTED;
                                        selections.push(self.filterUtils.getPropertiesObject(PriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED, self._getLabel(BaseConfig.SELECTORS.RECIPIENT_COUNTRY)));
                                        selections.push(self.filterUtils.getPropertiesObject(PriorityAnalysisConfig.topic.RESOURCE_PARTNER_SELECTED,  self._getLabel(BaseConfig.SELECTORS.RESOURCE_PARTNER)));
                                    }
                                }

                                topicProps = self.filterUtils.getPropertiesObject(PriorityAnalysisConfig.topic.SELECTED_TOPIC, topic);
                                properties = [topicProps, {selections: selections}];

                                //console.log("========================= FilterView: ON CHANGE COUNTRY ============== " + topic);
                                amplify.publish(BaseEvents.FILTER_ON_CHANGE, $.extend(payload, {"props": properties}));
                            }

                        }
                        else if (payload.id === BaseConfig.SELECTORS.RESOURCE_PARTNER) {

                            if(payload.values.values.length > 0) {

                                var recipientValue = self._getFilterValues().values[BaseConfig.SELECTORS.RECIPIENT_COUNTRY][0];
                                var payloadPartnerValue = payload.values.values[0];

                                // FROM FILTER: ALL Recipients selected
                                if (recipientValue === 'all') {
                                    selections = [];

                                    // FROM PAYLOAD: ALL resource partners selected
                                    if (payloadPartnerValue === 'all') {
                                        // --> All partners + All recipients
                                        selections = [];
                                        topic = PriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED;
                                        selections.push(self.filterUtils.getPropertiesObject(PriorityAnalysisConfig.topic.RESOURCE_PARTNER_SELECTED,  PriorityAnalysisConfig.selections.ALL));
                                        selections.push(self.filterUtils.getPropertiesObject(PriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED, PriorityAnalysisConfig.selections.ALL));
                                    }
                                    // FROM PAYLOAD: 1 resource partner selected
                                    else {
                                        // --> 1 partner + All recipients
                                        topic = PriorityAnalysisConfig.topic.RESOURCE_PARTNER_SELECTED;
                                        selections.push(self.filterUtils.getPropertiesObject(PriorityAnalysisConfig.topic.RESOURCE_PARTNER_SELECTED, self._getLabel(BaseConfig.SELECTORS.RESOURCE_PARTNER)));
                                        selections.push(self.filterUtils.getPropertiesObject(PriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED, PriorityAnalysisConfig.selections.ALL));
                                    }
                                }
                                // FROM FILTER: 1 Recipient Country selected
                                else {
                                    selections = [];

                                    // All resource partners selected
                                    if (payloadPartnerValue === 'all') {
                                        // --> All partner + 1 recipient
                                        topic = PriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED;
                                        selections.push(self.filterUtils.getPropertiesObject(PriorityAnalysisConfig.topic.RESOURCE_PARTNER_SELECTED,  PriorityAnalysisConfig.selections.ALL));
                                        selections.push(self.filterUtils.getPropertiesObject(PriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED, self._getLabel(BaseConfig.SELECTORS.RECIPIENT_COUNTRY)));
                                    }
                                    // 1 resource partners selected
                                    else {
                                        // --> 1 partner + 1 recipient
                                        topic = PriorityAnalysisConfig.topic.RECIPIENT_AND_PARTNER_SELECTED;
                                        selections.push(self.filterUtils.getPropertiesObject(PriorityAnalysisConfig.topic.RESOURCE_PARTNER_SELECTED,  self._getLabel(BaseConfig.SELECTORS.RESOURCE_PARTNER)));
                                        selections.push(self.filterUtils.getPropertiesObject(PriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED, self._getLabel(BaseConfig.SELECTORS.RECIPIENT_COUNTRY)));
                                    }
                                }

                                topicProps = self.filterUtils.getPropertiesObject(PriorityAnalysisConfig.topic.SELECTED_TOPIC, topic);
                                properties = [topicProps, {selections: selections}];

                                //console.log("========================= FilterView: ON PARTNER ============== " + topic);
                                amplify.publish(BaseEvents.FILTER_ON_CHANGE, $.extend(payload, {"props": properties}));

                            }

                        }
                        else {
                            //console.log("========================= FilterView: ELSE ============== "+topic);
                            amplify.publish(BaseEvents.FILTER_ON_CHANGE, payload);
                        }
                    } else {
                        self.filterValidator.displayErrorSection(valid);
                    }

                });


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

                var updatedValuesWithYear = {}, extendedValues = $.extend(true, {}, this.filter.getValues(), timerange);

                updatedValuesWithYear = this.filterUtils.processTimeRange(extendedValues);

                return updatedValuesWithYear;

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
