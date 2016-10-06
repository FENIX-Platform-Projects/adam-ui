define(
    [
        'jquery',
        'underscore',
        'views/base/view',
        'text!templates/analyse/partner_matrix/filters.hbs',
        'fx-filter/start',
        'views/common/filter-validator',
        'lib/filter-utils',
        'config/Config',
        'config/analyse/partner_matrix/config-partner-matrix',
        'config/analyse/partner_matrix/Events',
        'amplify'
    ], function ($, _, View, template, Filter, FilterValidator, FilterUtils, BaseConfig, PartnerMatrixConfig, BaseEvents, amplify) {

        'use strict';

        var s = {
            css_classes: {
                FILTER_ANALYSE_PARTNER_MATRIX: "#filter-analyse-partner-matrix",
                FILTER_ERRORS_HOLDER: "#filter-analyse-partner-matrix-errors-holder"
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

            className: 'filter-analyse-partner-matrix',

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
                    this.$el.find(s.css_classes.FILTER_ANALYSE_PARTNER_MATRIX).show();
                    this._renderFilter(filterConfig);
                } else {
                    this.$el.find(s.css_classes.FILTER_ANALYSE_PARTNER_MATRIX).hide();
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
                    el: this.$el.find(s.css_classes.FILTER_ANALYSE_PARTNER_MATRIX),
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
                    if (self._getFilterValues().values[BaseConfig.SELECTORS.RECIPIENT_COUNTRY] || self._getFilterValues().values[BaseConfig.SELECTORS.RESOURCE_PARTNER]) {

                        var partnerValues = self._getFilterValues().values[BaseConfig.SELECTORS.RESOURCE_PARTNER][0];
                        var recipientValues = self._getFilterValues().values[BaseConfig.SELECTORS.RECIPIENT_COUNTRY][0];

                        var topic;

                        //FROM FILTER: All Resource Partners selected
                        if (partnerValues === 'all') {
                            // FROM FILTER: All recipients are selected
                            // --> All Recipients + All Partners
                            if (recipientValues === 'all') {
                                topic = PartnerMatrixConfig.topic.RECIPIENT_COUNTRY_SELECTED;
                            }
                            // FROM PAYLOAD: 1 recipients selected
                            // --> 1 Recipient + All Partners
                            else {
                                topic = PartnerMatrixConfig.topic.RECIPIENT_COUNTRY_SELECTED;
                            }
                        }
                        //FROM FILTER: 1 Resource Partners selected
                        else {
                            // FROM PAYLOAD: All recipients are selected
                            // --> All Recipients + 1 Partner
                            if (recipientValues === 'all') {
                                topic = PartnerMatrixConfig.topic.RESOURCE_PARTNER_SELECTED;
                            }
                            // FROM PAYLOAD: 1 recipients selected
                            // --> 1 Recipients + 1 Partner
                            else {
                                topic = PartnerMatrixConfig.topic.RECIPIENT_AND_PARTNER_SELECTED;
                            }
                        }

                        var additionalProperties = self.filterUtils.getPropertiesObject(PartnerMatrixConfig.topic.SELECTED_TOPIC, topic);


                        amplify.publish(BaseEvents.FILTER_ON_READY, $.extend(self._getFilterValues(), {"props": additionalProperties}));

                    }

                    // For ODA set its value to the props object
                    else if (self._getFilterValues().values[BaseConfig.SELECTORS.ODA]) {
                        var additionalProperties = self.filterUtils.getPropertiesObject(BaseConfig.SELECTORS.ODA, self._getFilterValues().values[BaseConfig.SELECTORS.ODA].enumeration[0]);

                        amplify.publish(BaseEvents.FILTER_ON_READY, $.extend(self._getFilterValues(), {"props": additionalProperties}));
                    }
                    else {
                       amplify.publish(BaseEvents.FILTER_ON_READY, self._getFilterValues());
                    }

                });


                this.filter.on('click', function (payload) {

                   // self.filterUtils.clearSelectize(self.$el, payload.id);

                });


                // Filter on Change: Set some base properties for Recipient and the ODA, then publish Filter On Change Event
                this.filter.on('change', function (payload) {

                   // console.log("FILTER ALL ==========");
                  //  console.log(payload.values.values);

                    // validate filter
                    var valid = self.filterValidator.validateValues(self._getSelectedValues());

                    if (valid === true) {
                        self.filterValidator.hideErrorSection();

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

                                var recipientPayloadValue = payload.values.values[0];
                                var partnerValues = self._getFilterValues().values[BaseConfig.SELECTORS.RESOURCE_PARTNER][0];
                                var topic;
                                //FROM FILTER: All Resource Partners selected
                                if (partnerValues === 'all') {
                                    // FROM PAYLOAD: All recipients are selected
                                    // --> All Recipients + All Partners
                                    if (recipientPayloadValue === 'all') {
                                        topic = PartnerMatrixConfig.topic.RECIPIENT_COUNTRY_SELECTED;
                                    }
                                    // FROM PAYLOAD: 1 recipients selected
                                    // --> 1 Recipient + All Partners
                                    else {
                                        topic = PartnerMatrixConfig.topic.RECIPIENT_COUNTRY_SELECTED;
                                    }
                                }
                                //FROM FILTER: 1 Resource Partners selected
                                else {
                                    // FROM PAYLOAD: All recipients are selected
                                    // --> All Recipients + 1 Partner
                                    if (recipientPayloadValue === 'all') {
                                        topic = PartnerMatrixConfig.topic.RESOURCE_PARTNER_SELECTED;
                                    }
                                    // FROM PAYLOAD: 1 recipients selected
                                    // --> 1 Recipients + 1 Partner
                                    else {
                                        topic = PartnerMatrixConfig.topic.RECIPIENT_AND_PARTNER_SELECTED;
                                    }
                                }

                                var additionalProperties = self.filterUtils.getPropertiesObject(PartnerMatrixConfig.topic.SELECTED_TOPIC, topic);

                                //console.log("========================= FilterView: ON CHANGE COUNTRY ============== " + topic);
                                amplify.publish(BaseEvents.FILTER_ON_CHANGE, $.extend(payload, {"props": additionalProperties}));
                            }

                        }
                        else if (payload.id === BaseConfig.SELECTORS.RESOURCE_PARTNER) {

                            if(payload.values.values.length > 0) {

                                var partnerPayloadValue = payload.values.values[0];
                                var recipientValues = self._getFilterValues().values[BaseConfig.SELECTORS.RECIPIENT_COUNTRY][0];
                                var selectedTopic;

                                //FROM FILTER: All Recipients selected
                                if (recipientValues === 'all') {
                                    // FROM PAYLOAD: All partners are selected
                                    // --> All Partners + All Recipients
                                    if (partnerPayloadValue === 'all') {
                                        selectedTopic = PartnerMatrixConfig.topic.RECIPIENT_COUNTRY_SELECTED;
                                    }
                                    // FROM PAYLOAD: 1 partner selected
                                    // --> 1 Partner + All Recipients
                                    else {
                                        selectedTopic = PartnerMatrixConfig.topic.RESOURCE_PARTNER_SELECTED;
                                    }
                                }
                                //FROM FILTER: 1 Recipient selected
                                else {
                                    // FROM PAYLOAD: All partners are selected
                                    // --> All Partners + 1 Recipient
                                    if (partnerPayloadValue === 'all') {
                                        selectedTopic = PartnerMatrixConfig.topic.RECIPIENT_COUNTRY_SELECTED;
                                    }
                                    // FROM PAYLOAD: 1 partner selected
                                    // --> 1 Partner + 1 Recipient
                                    else {
                                        selectedTopic = PartnerMatrixConfig.topic.RECIPIENT_AND_PARTNER_SELECTED;
                                    }
                                }

                                var additionalProperties = self.filterUtils.getPropertiesObject(PartnerMatrixConfig.topic.SELECTED_TOPIC, selectedTopic);

                                amplify.publish(BaseEvents.FILTER_ON_CHANGE, $.extend(payload, {"props": additionalProperties}));

                            }

                        }
                        else {
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

                var updatedValuesWithYear = {}, updatedValuesWithODA = {}, extendedValues = $.extend(true, {}, this.filter.getValues(), timerange);

                updatedValuesWithYear = this.filterUtils.processTimeRange(extendedValues);

                updatedValuesWithODA = this.filterUtils.processODA(updatedValuesWithYear);

                return updatedValuesWithODA;

            },



            /**
             *  Get the full filter values object (consists of labels and values)
             * @returns {Object} filterValues
             */
            getFilterValues: function () {

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
                //console.log(values);
                return values;
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
             *
             * @param values
             * @returns {*}
             * @private
             */
            _updateValues: function (values) {
                return values;
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
