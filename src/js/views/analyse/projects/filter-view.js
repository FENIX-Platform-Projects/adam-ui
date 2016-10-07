define(
    [
        'jquery',
        'underscore',
        'views/base/view',
        'text!templates/analyse/projects/filters.hbs',
        'fx-filter/start',
        'views/common/filter-validator',
        'lib/filter-utils',
        'config/Config',
        'config/analyse/projects/Events',
        'amplify'
    ], function ($, _, View, template, Filter, FilterValidator, FilterUtils, BaseConfig, BaseEvents, amplify) {

        'use strict';

        var s = {
            css_classes: {
                FILTER_ANALYSE_PROJECTS: "#filter-analyse-projects",
                FILTER_ERRORS_HOLDER: "#filter-analyse-projects-errors-holder"
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

            className: 'filter-projects',

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
                    this.$el.find(s.css_classes.FILTER_ANALYSE_PROJECTS).show();
                    this._renderFilter(filterConfig);
                } else {
                    this.$el.find(s.css_classes.FILTER_ANALYSE_PROJECTS).hide();
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
                    el: this.$el.find(s.css_classes.FILTER_ANALYSE_PROJECTS),
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

                    amplify.publish(BaseEvents.FILTER_ON_READY, self._getFilterValues());

                });


                this.filter.on('click', function (payload) {

                   // self.filterUtils.clearSelectize(self.$el, payload.id);

                });


                // Filter on Change: Set some base properties for Recipient and the ODA, then publish Filter On Change Event
                this.filter.on('change', function (payload) {

                   // console.log("FILTER ALL ==========");
                   // console.log(payload.values.values);

                    // validate filter
                    var valid = self.filterValidator.validateValues(self._getSelectedValues());

                    if (valid === true) {
                        // set primary Payload
                        var payloads = [];
                        payload.primary = true;

                        self.filterValidator.hideErrorSection();

                        var fc = self.filterUtils.getFilterConfigById(self.config, payload.id);

                        var dependencies = [];
                        if (fc && fc.dependencies) {
                            for (var id in fc.dependencies) {
                                dependencies.push(id);
                            }

                            payload["dependencies"] = dependencies;
                        }

                        if (payload.id === BaseConfig.SELECTORS.SECTOR || payload.id === BaseConfig.SELECTORS.SUB_SECTOR) {

                            // Check only for the Sub Sector payload but add the sector details to the payload.
                            //-------------------------------------------------------------------------------
                            // When Sector is selected, the Sub Sector is automatically re-populated and this in turn triggers its own 'on Change'.
                            // The result is that the 'BaseEvents.FILTER_ON_CHANGE' is published twice (1 for the sector and then automatically again for the Sub Sector).
                            // To avoid the double publish, only the last 'on Change' trigger is evaluated i.e. when payload = 'Sub Sector'

                            if ( payload.id === BaseConfig.SELECTORS.SUB_SECTOR) {
                                // Payload contains subsector and sector information
                                var payloadsUpdated = self._processSectorSubSectorPayload(payloads, payload);
                                amplify.publish(BaseEvents.FILTER_ON_CHANGE, payloadsUpdated);
                            }

                        }
                        else if (payload.id === BaseConfig.SELECTORS.YEAR_TO || payload.id === BaseConfig.SELECTORS.YEAR_FROM) {

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

                                payloads.push(payload);

                                amplify.publish(BaseEvents.FILTER_ON_CHANGE, payloads);
                            }

                        }
                        else {
                            payloads.push(payload);
                            amplify.publish(BaseEvents.FILTER_ON_CHANGE, payloads);
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

               //  console.log("FINAL getFilterValues ============ 1");

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

                // if all values selected clear
                if(values.values[BaseConfig.SELECTORS.SECTOR][0] === s.exclusions.ALL) {
                    values.values[BaseConfig.SELECTORS.SECTOR] = [];
                }

                // if all values selected clear
                if(values.values[BaseConfig.SELECTORS.SUB_SECTOR][0] === s.exclusions.ALL) {
                    values.values[BaseConfig.SELECTORS.SUB_SECTOR] = [];
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

            /**
             * Add the sector to payloads array and set primary payload
             * @param payloads array
             * @returns Array filters
             */
            _processSectorSubSectorPayload: function (payloads, subsectorpayload) {
                var values = this._getSelectedValues();
                var labels = this._getSelectedLabels();

                var sector = {};
                sector.id = BaseConfig.SELECTORS.SECTOR;
                sector.values = {};
                sector.values.labels =  labels[BaseConfig.SELECTORS.SECTOR];
                sector.values.values =  values[BaseConfig.SELECTORS.SECTOR];


                // primary indicates the selection type which takes precedence
                if(subsectorpayload.values.values[0] === 'all'){
                    sector.primary = true;
                    subsectorpayload.primary = false;
                } else {
                    sector.primary = false;
                    subsectorpayload.primary = true;
                }

                payloads.push(sector);
                payloads.push(subsectorpayload);

                return payloads;
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
