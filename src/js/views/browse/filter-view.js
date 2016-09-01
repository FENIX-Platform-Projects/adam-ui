define(
    [
        'jquery',
        'underscore',
        'views/base/view',
        'text!templates/browse/filters.hbs',
        'i18n!nls/filter',
        'fx-filter/start',
        'fx-common/utils',
        'lib/utils',
        'config/Config',
        'config/browse/config-browse',
        'config/browse/Events',
        'q',
        'handlebars',
        'amplify'
    ], function ($, _, View, template, i18nLabels, Filter, FxUtils, Utils, BaseConfig, BrowseConfig, BaseEvents, Q) {

        'use strict';

        var s = {
            css_classes: {
                FILTER_BROWSE: "#filter-browse"
            },
            codeLists: {
                SUB_SECTORS: {uid: 'crs_purposes', version: '2016'},
                RECIPIENT_DONORS: {uid: 'crs_recipientdonors', version: '2016'},
                REGIONS: {uid: 'crs_un_regions_recipients', version: '2016', level: "2", direction: "up"}
            },
            range: {
                FROM: 'from',
                TO: 'to'
            },
            values: {
                FAO_SECTORS: '9999'
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

            className: 'filter-browse',

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
                    this.$el.find(s.css_classes.FILTER_BROWSE).show();
                    this._renderFilter(filterConfig);
                } else {
                    this.$el.find(s.css_classes.FILTER_BROWSE).hide();
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

                // instantiate filter
                this.filter = new Filter({
                    el: this.$el.find(s.css_classes.FILTER_BROWSE),
                    environment: 'develop',
                    items: config,
                    common: {
                        template: {
                            hideSwitch: true,
                            hideRemoveButton: true
                        }
                    }
                });

                // Set filter event handlers
                // Filter on Ready: Set some base properties for Recipient and the ODA, then publish Filter Ready Event
                this.filter.on('ready', function (payload) {

                    // For the Recipient Country, get and set the GAUL Code and Region Code as attributes to the props object
                    if (self._getFilterValues().values[BrowseConfig.filter.RECIPIENT_COUNTRY]) {
                        var additionalProperties = self._getPropertiesObject(BrowseConfig.filter.RECIPIENT_COUNTRY, self._getFilterValues().values[BrowseConfig.filter.RECIPIENT_COUNTRY]);

                        Q.all([
                            self._onRecipientChangeGetRegionCode(self._getFilterValues().values[BrowseConfig.filter.RECIPIENT_COUNTRY]),
                            self._onRecipientChangeGetGaulCode(self._getFilterValues().values[BrowseConfig.filter.RECIPIENT_COUNTRY])
                        ]).then(function (result) {
                            if (result) {
                                self._setRecipientProperties(result, additionalProperties);
                            }
                        }).catch(function (error) {
                            self._regioncodeerror(error, additionalProperties)
                        }).done(function () {
                            // console.log("ONREADY: RECIPIENT PROPS UPDATE DONE ============ ", additionalProperties);

                            amplify.publish(BaseEvents.FILTER_ON_READY, $.extend(self._getFilterValues(), {"props": additionalProperties}));
                        });

                    }
                    // For ODA set its value to the props object
                    else if (self._getFilterValues().values[BrowseConfig.filter.ODA]) {
                        var additionalProperties = self._getPropertiesObject(BrowseConfig.filter.ODA, self._getFilterValues().values[BrowseConfig.filter.ODA].enumeration[0]);

                        amplify.publish(BaseEvents.FILTER_ON_READY, $.extend(self._getFilterValues(), {"props": additionalProperties}));
                    }
                    else {
                        amplify.publish(BaseEvents.FILTER_ON_READY, self._getFilterValues());
                    }

                });


                // Filter on Change: Set some base properties for Recipient and the ODA, then publish Filter On Change Event
                this.filter.on('change', function (payload) {
                    //console.log("========================= FilterView: ON CHANGE ==============");
                    //console.log(payload);

                    var fc = self._getFilterConfigById(payload.id);
                    var dependencies = [];
                    if (fc && fc.dependencies) {
                        for (var id in fc.dependencies) {
                            dependencies.push(id);
                        }

                        payload["dependencies"] = dependencies;
                    }

                    if (payload.id === BrowseConfig.filter.YEAR_TO || payload.id === BrowseConfig.filter.YEAR_FROM) {
                        var newRange = self._getObject(BrowseConfig.filter.YEAR, self._getSelectedLabels());
                        if (newRange) {
                            payload.id = BrowseConfig.filter.YEAR;
                            payload.values.labels = self._getObject(BrowseConfig.filter.YEAR, self._getSelectedLabels());
                            payload.values.values = self._getObject(BrowseConfig.filter.YEAR, self._getSelectedValues());
                        }

                        amplify.publish(BaseEvents.FILTER_ON_CHANGE, payload);
                    }
                    if (payload.id === BrowseConfig.filter.ODA) {
                        var additionalProperties = self._getPropertiesObject(BrowseConfig.filter.ODA, payload.values.values[0]);

                        amplify.publish(BaseEvents.FILTER_ON_CHANGE, $.extend(payload, {"props": additionalProperties}));
                    }
                    else if (payload.id === BrowseConfig.filter.RECIPIENT_COUNTRY) {
                        var additionalProperties = self._getPropertiesObject(BrowseConfig.filter.RECIPIENT_COUNTRY, payload.values.values);

                        Q.all([
                            self._onRecipientChangeGetRegionCode(payload.values.values),
                            self._onRecipientChangeGetGaulCode(payload.values.values)
                        ]).then(function (result) {
                            if (result) {
                                self._setRecipientProperties(result, additionalProperties);
                            }
                        }).catch(function (error) {
                            self._regioncodeerror(error, additionalProperties)
                        }).done(function () {
                            //  console.log("ONCHANGE: RECIPIENT PROPS UPDATE DONE ============ ", additionalProperties);

                            amplify.publish(BaseEvents.FILTER_ON_CHANGE, $.extend(payload, {"props": additionalProperties}));
                        });
                    }
                    else {
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

                updatedValuesWithODA = this._processODA(updatedValuesWithYear);

                return updatedValuesWithODA;

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

                // console.log("FINAL getFilterValues ============ 1");
                var values = this._getFilterValues();

                //clear uid values
                values.values["uid"] = [];

                values.values[BrowseConfig.filter.YEAR_FROM] = [];
                values.values[BrowseConfig.filter.YEAR_TO] = [];


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

                var year_from = filter.values[BrowseConfig.filter.YEAR_FROM], year_to = filter.values[BrowseConfig.filter.YEAR_TO];

                //reformat to and from years
                filter.values.year[0].value = year_from[0];
                filter.values.year[1].value = year_to[0];

                filter.labels.year.range = year_from[0] + '-' + year_to[0];
                filter.labels[BrowseConfig.filter.YEAR_FROM] = [];
                filter.labels[BrowseConfig.filter.YEAR_TO] = [];

                return filter;
            },


            /**
             *  Process the ODA so that it complies with the expected D3S format
             * @param filter
             * @returns {Object} filter
             */
            _processODA: function (filter) {

                var enumeration = [], oda = filter.values[BrowseConfig.filter.ODA][0];
                enumeration.push(oda);

                filter.values[BrowseConfig.filter.ODA] = {};
                filter.values[BrowseConfig.filter.ODA].enumeration = enumeration;


                return filter;
            },


            /**
             *  Process and get the filter values relevant to the OECD/ODA Dashboard
             * @returns {Object} values
             */

            getOECDValues: function () {

                var values = this._getSelectedValues();

                // console.log("getOECDValues ================");
                // console.log(values);
                //var sectorSelected = this._hasSelections(BrowseConfig.filter.SECTORS, values);
                var subSectorSelected = this._hasSelections(BrowseConfig.filter.SUB_SECTOR, values);
                // var channelsSelected = this._hasSelections(BrowseConfig.filter.CHANNELS, values);

                // Set the sector and sub sector code lists references
                // Updated to match the references as declared in the dataset metadata for the parentsector_code and purposecode fields
                //if (sectorSelected) {
                //   values['parentsector_code'].codes[0].uid = s.codeLists.SECTORS.uid;
                // }

                // Set Subsectors to crs_purposes
                if (subSectorSelected) {
                    //TEST  values['purposecode'].codes[0].uid = s.codeLists.SUB_SECTORS.uid;
                }

                // Set Channels to crs_channel
                //if (channelsSelected) {
                //   values['channelcode'].codes[0].uid = s.codeLists.CHANNELS.uid;
                //}

                //console.log(values);


                return this._updateValues(values, subSectorSelected);
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
             *  Process and get the filter values relevant to the Indicators Dashboard
             * @returns {Object} values
             */

            getIndicatorsValues: function () {

                var filterValues = this._getFilterValues();
                var values = filterValues.values;
                var labels = filterValues.labels;

                var cloneObj, cloneLabelObj;

                // console.log("============================= VALUES =================== ");
                // console.log(values);

                var donorSelected = this._hasSelections(BrowseConfig.filter.RESOURCE_PARTNER, values);
                var recipientSelected = this._hasSelections(BrowseConfig.filter.RECIPIENT_COUNTRY, values);


                if (donorSelected) {
                    cloneObj = this._getObject(BrowseConfig.filter.RESOURCE_PARTNER, values);
                    cloneLabelObj = this._getObject(BrowseConfig.filter.RESOURCE_PARTNER, labels);
                }
                if (recipientSelected) {
                    cloneObj = this._getObject(BrowseConfig.filter.RECIPIENT_COUNTRY, values);
                    cloneLabelObj = this._getObject(BrowseConfig.filter.RECIPIENT_COUNTRY, labels);
                }


                if (cloneObj) {
                    //======= UPDATE VALUES CONFIG
                    values[BrowseConfig.filter.COUNTRY] = cloneObj;
                    labels[BrowseConfig.filter.COUNTRY] = cloneLabelObj;

                    //======= Set everything in the values to be removed except the country
                    for (var filter in values) {
                        if (filter !== BrowseConfig.filter.COUNTRY) {
                            values[filter] = [];
                            labels[filter] = {};
                        }
                    }
                } else {
                    // reset all filter values to empty
                    for (var filter in values) {
                        values[filter] = [];
                        labels[filter] = {};
                    }

                }

                return filterValues;
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
             * Check if 'FAO Related Sectors' has been selected
             * @returns {*|boolean}
             */
            isFAOSectorsSelected: function () {
                var values = this.getSelectedValues(BrowseConfig.filter.SECTOR);

                //console.log(values);
                for (var i = 0; i < values.length; i++) {
                    if (values[i] === s.values.FAO_SECTORS) {
                        return true;
                    }
                }

                return false;
            },


            /**
             *
             * @param values
             * @param subSectorSelected
             * @returns {*}
             * @private
             */
            _updateValues: function (values, subSectorSelected) {
                switch (this.isFAOSectorsSelected()) {
                    case true:
                        values = this._updateValuesWithSubSectors(values, this._getObject(BrowseConfig.filter.SECTOR, values), subSectorSelected);
                        break;
                    case false:
                        values = values;
                        break;
                }

                return values;
            },
            /**
             *
             * @param values
             * @param sectorvaluesobj
             * @param subSectorSelected
             * @returns {*}
             * @private
             */
            _updateValuesWithSubSectors: function (values, sectorvaluesobj, subSectorSelected) {
                // console.log("_updateValuesWithSubSectors");
                // If no purposecodes have been selected
                if (!subSectorSelected) {
                    // Get the purposecode filter component, which will contain all
                    // the purposecodes (sub-sectors) associated with the selected 'FAO-related Sectors'
                    var purposeCodeComponent = this.filter.getDomain(BrowseConfig.filter.SUB_SECTOR);

                    if (purposeCodeComponent) {
                        var codes = [];

                        //======= UPDATE VALUES CONFIG
                        // Add purposecode to values
                        values[BrowseConfig.filter.SUB_SECTOR] = {};
                        values[BrowseConfig.filter.SUB_SECTOR].codes = [];
                        values[BrowseConfig.filter.SUB_SECTOR].codes[0] = $.extend(true, {}, sectorvaluesobj); // clone the codes configuration of sectorvaluesobj

                        // console.log( values['purposecode'].codes[0]);
                        // Get the source of the purposecode component
                        // and populate the codes array with the IDs of the source items
                        $.each(purposeCodeComponent.options.source, function (index, sourceItem) {
                            // console.log(sourceItem);
                            codes.push(sourceItem.id);
                        });

                        values[BrowseConfig.filter.SUB_SECTOR].codes[0].codes = codes;
                        values[BrowseConfig.filter.SUB_SECTOR].codes[0].uid = s.codeLists.SUB_SECTORS.uid;
                        values[BrowseConfig.filter.SUB_SECTOR].codes[0].version = s.codeLists.SUB_SECTORS.version;

                    }
                }

                // Set Values parentsector_code to be removed
                values[BrowseConfig.filter.SECTOR] = {};
                values[BrowseConfig.filter.SECTOR].removeFilter = true;

                return values;
            },


            /**
             * Set Recipient Region Code
             * @param item
             * @param result
             * @private
             */
            _setRegionCode: function (item, result) {
                item.regioncode = result;
            },

            /**
             * Set Recipient Gaul Code
             * @param item
             * @param result
             * @private
             */

            _setGaulCode: function (item, result) {
                item.gaulcode = parseInt(result);
            },

            /**
             * Region Code Error Handler
             * @param error
             * @param item
             * @private
             */
            _regioncodeerror: function (error, item) {
                if (item.regioncode) {
                    delete item['regioncode']
                }
            },
            /**
             * General Error Handler
             * @param error
             * @private
             */
            _error: function (error) {
                console.log("error", error);
            },


            /**
             * Get the Region Code associated with the Recipient code
             * @param recipientCodes
             * @private
             */
            _onRecipientChangeGetRegionCode: function (recipientCodes) {
                var self = this;
                //  console.log("IS RECIPIENT")
                if (recipientCodes.length > 0) {
                    //  console.log("IS RECIPIENT value")
                    return Q.all([
                        self._createRegionPromiseData(s.codeLists.REGIONS.uid, s.codeLists.REGIONS.version, s.codeLists.REGIONS.level, s.codeLists.REGIONS.direction, recipientCodes[0])
                    ]).then(function (c) {
                        return c;
                    }, function (r) {
                        console.error(r);
                    });
                }

            },


            /**
             * Get the Gaul Code associated with the Recipient code
             * @param recipientCodes
             * @private
             */
            _onRecipientChangeGetGaulCode: function (recipientCodes) {
                var self = this;
                var odaProps = self._getPropertiesObject(BrowseConfig.filter.ODA, self._getFilterValues().values[BrowseConfig.filter.ODA]);
                var filterConfig = self._getFilterConfigById(BrowseConfig.filter.RECIPIENT_COUNTRY);

                if (recipientCodes.length > 0) {
                    //  console.log("IS RECIPIENT value")
                    return Q.all([
                        self._createGaulPromiseData(odaProps[BrowseConfig.filter.ODA].enumeration[0], Utils.getLocale(), filterConfig.cl.uid, filterConfig.cl.version, recipientCodes)
                    ]).then(function (c) {
                        return c;
                    }, function (r) {
                        console.error(r);
                    });
                }

            },


            /**
             * Set Recipient properties
             * @param item
             * @param result
             * @private
             */
            _setRecipientProperties: function (result, props) {
                var self = this;

                if (result) {
                    var regionCodeResult = result[0][0];
                    var gaulCodeResult = result[1][0];

                    self._setRegionCode(props, regionCodeResult.parents[0].code);
                    self._setGaulCode(props, gaulCodeResult.data[0][0]);
                }
            },


            /**
             * Create GET Promise to get Region code
             * @param codelist
             * @param version
             * @param depth
             * @param direction
             * @param findcode
             * @returns {*}
             * @private
             */
            _createRegionPromiseData: function (codelist, version, depth, direction, findcode) {

                var baseUrl = BaseConfig.SERVER + BaseConfig.CODELIST_SERVICE + BaseConfig.HIERARCHY_CODES_POSTFIX;
                baseUrl += "/" + codelist + "/" + version + "/" + findcode + "?depth=" + depth + "&direction=" + direction;


                return Q($.ajax({
                    url: baseUrl,
                    type: "GET",
                    dataType: 'json'
                })).then(function (c) {
                    return c;
                }, function (r) {
                    console.error(r);
                });
            },

            /**
             * Create POST Promise to get Gaul code
             * @param dataset
             * @param lang
             * @param codelist
             * @param version
             * @param codes
             * @returns {*}
             * @private
             */

            _createGaulPromiseData: function (dataset, lang, codelist, version, codes) {

                var baseUrl = BaseConfig.SERVER + BaseConfig.D3P_POSTFIX + dataset + "?dsd=true&full=true&language=" + lang;
                var data = [{
                    "name": "filter",
                    "parameters": {
                        "rows": {
                            "recipientcode": {
                                "codes": [{
                                    "uid": codelist,
                                    "version": version,
                                    "codes": codes
                                }]
                            }
                        }
                    }
                }, {"name": "filter", "parameters": {"columns": ["gaul0"]}}, {
                    "name": "page",
                    "parameters": {"perPage": 1, "page": 1}
                }];


                return Q($.ajax({
                    url: baseUrl,
                    type: "POST",
                    data: JSON.stringify(data),
                    contentType: "application/json",
                    dataType: 'json'
                })).then(function (c) {
                    return c;
                }, function (r) {
                    console.error(r);
                });
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

            _unbindEventListeners: function () {

            },

            dispose: function () {
                this._unbindEventListeners();
                View.prototype.dispose.call(this, arguments);
            }

        });

        return FilterView;
    });
