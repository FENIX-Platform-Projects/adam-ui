define(
    [
    'jquery',
    'underscore',
    'views/base/view',
    'text!templates/browse/filters.hbs',
    'i18n!nls/filter',
    'fx-filter/start',
  //  'fx-filter/Fx-filter-configuration-creator',
    'fx-common/utils',
    'lib/utils',
    'config/Config',
    'config/browse/Events',
    'q',
    'handlebars',
    'amplify'
], function ($, _, View, template, i18nLabels, Filter/**, FilterConfCreator**/, FxUtils, Utils,  BaseConfig, BaseEvents, Q) {

    'use strict';

    var s = {
        css_classes: {
            FILTER_BROWSE: "#filter-browse"
        },
        events: {
           /** SUB_SECTORS_FILTER_READY: 'fx.filters.list.subsectors.ready',
            TIMERANGE_FILTER_READY: 'fx.filters.list.timerange.ready',
            COUNTRY_FILTER_READY: 'fx.filters.list.recipients.ready',
            LIST_CHANGE: 'fx.filter.list.change.',
            LIST_RESET: 'fx.filter.list.reset.',
            FILTER_ON_CHANGE: 'fx.filter.list.onchange',
            FILTER_ON_RESET: 'fx.filter.list.onreset',
            REGION_FOUND: 'fx.filter.list.recipient.regionfound'
            **/

            SUB_SECTORS_FILTER_READY: 'fx.filters.list.subsectors.ready',
            TIMERANGE_FILTER_READY: 'fx.filters.list.timerange.ready',
            COUNTRY_FILTER_READY: 'fx.filters.list.recipients.ready',
            SELECTORS_READY: 'fx.filter.selectors.ready',
            LIST_CHANGE: 'fx.filter.selectors.select.',
            LIST_RESET: 'fx.filter.selectors.reset.',
            FILTER_ON_CHANGE: 'fx.filter.list.onchange',
            FILTER_ON_RESET: 'fx.filter.list.onreset',
            REGION_FOUND: 'fx.filter.list.recipient.regionfound'

        },
        codeLists: {
            //SECTORS: {uid: 'crs_sectors', version: '2016'},
            SUB_SECTORS: {uid: 'crs_purposes', version: '2016'},
            //CHANNELS: {uid: 'crs_channel', version: '2016'},
            RECIPIENT_DONORS: {uid: 'crs_recipientdonors', version: '2016'}
        },
        ids: {
            SECTORS: 'parentsector_code',
            SUB_SECTORS: 'purposecode',
            CHANNELS_SUBCATEGORY: 'channelsubcategory_code',
            CHANNELS: 'channelcode',
            COUNTRY: 'countrycode',
            DONOR: 'donorcode',
            RECIPIENT_COUNTRY: 'recipientcode',
            YEAR: 'year',
            YEAR_FROM: 'year-from',
            YEAR_TO: 'year-to'
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

            /**
             *
             * @param params
             */
        initialize: function (params) {
            this.config = params.config;

            // Change JQuery-UI plugin names to fix name collision with Bootstrap
            // $.widget.bridge('uitooltip', $.ui.tooltip);

            View.prototype.initialize.call(this, arguments);
        },

            /**
             *
             */
        attach: function () {

            View.prototype.attach.call(this, arguments);

            this._initVariables();

            this._bindEventListeners();

            this._buildFilters();
        },

            /**
             *
             * @private
             */
        _initVariables: function () {
           // this.filterConfCreator = new FilterConfCreator();
        },

            /**
             *
             * @private
             */
        _buildFilters: function () {
            var self = this;


            var filterConfig = this._getFilterConfig2();

          //  console.log('..... filterConfig .....')
  // console.log(filterConfig);

            if (!_.isEmpty(filterConfig)) {
                this.$el.find(s.css_classes.FILTER_BROWSE).show();
                this._renderFilter(filterConfig);
            } else {
                this.$el.find(s.css_classes.FILTER_BROWSE).hide();
            }







            /**  this.filterConfCreator.getConfiguration(this.config)
                .then(function (c) {

                    self.filter = new Filter();

                    self.filter.init({
                        container: s.css_classes.FILTER_BROWSE,
                        // layout: 'fluidGrid'
                        layout: 'bootstrapfluidGridSystem'
                    });

                    var adapterMap = {};

                    self.filter.add(c, adapterMap);

                }).then(function () {
                // initialize Bootstarp tooltip
                $('[data-toggle="tooltip"]').tooltip();

            });**/
        },
            /**
             *
             * @param config
             * @private
             */
        _renderFilter: function (config) {
            var self = this;

           // console.log('render filter')

            if (this.filter && $.isFunction(this.filter.dispose)) {
                this.filter.dispose();
            }
           // console.log('2 render filter')

          //  alert($(s.css_classes.FILTER_BROWSE).length)

          //  console.log('..... config .....');

          //  console.log(config);

            this.filter = new Filter({
                el: this.$el.find(s.css_classes.FILTER_BROWSE),
                environment : 'develop',
                items: config,
                common: {
                    template: {
                        hideSwitch: true,
                        hideRemoveButton: true
                    }
                }
            });

            // Add List Change listeners
            this.filter.on('change', function (payload) {
                if(payload.id === s.ids.YEAR_TO || payload.id === s.ids.YEAR_FROM) {
                    var newRange = self._getObject(s.ids.YEAR, self._getSelectedLabels());
                    if (newRange) {

                        payload.id = s.ids.YEAR;
                        payload.values.labels = self._getObject(s.ids.YEAR, self._getSelectedLabels());
                        payload.values.values = self._getObject(s.ids.YEAR, self._getSelectedValues());
                        //  payload = self..id = getFilterValues().year

                    }
                }

                amplify.publish(BaseEvents.FILTER_ON_CHANGE, payload);

               //self._onChangeEvent2(payload);
            });

             // Filters are loaded
                this.filter.on('ready', function () {

                    amplify.publish(BaseEvents.FILTER_ON_READY, self._getSelectedLabels());
             });



        },
            /**
             *
             * @returns {Object}
             * @private
             */
        _getFilterConfig2: function () {

            var conf = $.extend(true, {}, this.config),
                values = {},//this.filterValues[id] || {},
                result = FxUtils.mergeConfigurations(conf, values);

            _.each(result, _.bind(function (obj, key) {

                if (!obj.template) {
                    obj.template = {};
                }
                //Add i18n label
                obj.template.title = Utils.getI18nLabel( key, i18nLabels, "filter_");
                obj.template.headerIconTooltip = Utils.getI18nLabel( key, i18nLabels, "filter_tooltip_");

            }, this));

            return result;
        },

            /**
             *
             * @returns {*}
             * @private
             */


        _getFilterValues: function(){

            var timerange = {
                values: {year: [{value: '', parent: s.range.FROM}, {value: '', parent:  s.range.TO}]},
                labels: {year: {range: ''}}
            };

            var convertedValues = $.extend(true, {}, this.filter.getValues(), timerange);

            convertedValues = this._processTimeRange(convertedValues);

           return convertedValues;

        },

        _getSelectedValues: function(){
            return this._getFilterValues().values;
        },
            /**
             *
             * @returns {*}
             * @private
             */
        _getSelectedLabels: function(){
            return this._getFilterValues().labels;
        },

            /**
             *
             * @returns {Object}
             */
        getFilterValues: function(){

           console.log("FINAL getFilterValues ============ 1");
            var values = this._getFilterValues();

            //clear uid values
            values.values["uid"] = [];

            values.values[s.ids.YEAR_FROM] = [];
            values.values[s.ids.YEAR_TO] = [];


            console.log(values);
            return values;
        },

            _processTimeRange: function(filter){

                var year_from =  filter.values[s.ids.YEAR_FROM], year_to =  filter.values[s.ids.YEAR_TO];

                //reformat to and from years
                filter.values.year[0].value = year_from[0];
                filter.values.year[1].value = year_to[0];

                filter.labels.year.range = year_from[0] + '-' + year_to[0];
                filter.labels[s.ids.YEAR_FROM] = [];
                filter.labels[s.ids.YEAR_TO] = [];

                return filter;
            },


            /**
             *
             * @returns {*}
             */
        getOECDValues: function () {

            var values = this._getSelectedValues();

           // console.log("getOECDValues ================");
           // console.log(values);
            //var sectorSelected = this._hasSelections(s.ids.SECTORS, values);
            var subSectorSelected = this._hasSelections(s.ids.SUB_SECTORS, values);
           // var channelsSelected = this._hasSelections(s.ids.CHANNELS, values);

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
             *
             * @param filterId
             * @returns {{}}
             */
        getSelectedValues: function (filterId) {
            var values = this._getSelectedValues();
            var selectedValues = {};
            var itemSelected = this._hasSelections(filterId, values);
            if (itemSelected) {
                var filterObj = this._getObject(filterId, values);
                selectedValues = this._getSelected(filterObj);
            }

            //console.log(selectedValues);
            return selectedValues;
        },
            /**
             *
             *
             * @returns {*}
             */
        getIndicatorsValues: function () {
            var values = this._getSelectedValues();
            var cloneObj;

            var donorSelected = this._hasSelections(s.ids.DONOR, values);
            var recipientSelected = this._hasSelections(s.ids.RECIPIENT_COUNTRY, values);

            if(donorSelected)
                cloneObj = this._getObject(s.ids.DONOR, values);

            if(recipientSelected)
                cloneObj = this._getObject(s.ids.RECIPIENT_COUNTRY, values);

            if(cloneObj) {
                //======= UPDATE VALUES CONFIG
                values[s.ids.COUNTRY] = {};
                values[s.ids.COUNTRY].codes = [];
                values[s.ids.COUNTRY].codes[0] = $.extend(true, {}, cloneObj["codes"][0]); // clone the codes configuration
                values[s.ids.COUNTRY].codes[0].uid = s.codeLists.RECIPIENT_DONORS.uid;
                values[s.ids.COUNTRY].codes[0].version = s.codeLists.RECIPIENT_DONORS.version;

                //======= Set everything in the values to be removed except the country
                for (var filter in values) {
                    if (filter !== s.ids.COUNTRY) {
                        values[filter] = {};
                        values[filter].removeFilter = true;
                    }
                }
            }

            return values;
        },
            /**
             *
             * @param id
             * @returns {*|boolean}
             */
        isFilterSelected: function (id) {
            var values = this._getSelectedValues();



            return this._hasSelections(id, values);
        },
            /**
             *
             * @returns {*}
             */
        isFAOSectorsSelected: function () {
            var values = this._getSelectedValues();

            return this._containsValue(values, s.values.FAO_SECTORS);
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
                    values = this._updateValuesWithSubSectors(values, this._getObject(s.ids.SECTORS, values), subSectorSelected);
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
                var purposeCodeComponent = this.filter.getDomain(s.ids.SUB_SECTORS);

                if (purposeCodeComponent) {
                    var codes = [];

                    //======= UPDATE VALUES CONFIG
                    // Add purposecode to values
                    values[s.ids.SUB_SECTORS] = {};
                    values[s.ids.SUB_SECTORS].codes = [];
                    values[s.ids.SUB_SECTORS].codes[0] = $.extend(true, {}, sectorvaluesobj); // clone the codes configuration of sectorvaluesobj

                    // console.log( values['purposecode'].codes[0]);
                    // Get the source of the purposecode component
                    // and populate the codes array with the IDs of the source items
                    $.each(purposeCodeComponent.options.source, function (index, sourceItem) {
                        // console.log(sourceItem);
                        codes.push(sourceItem.id);
                    });

                    values[s.ids.SUB_SECTORS].codes[0].codes = codes;
                    values[s.ids.SUB_SECTORS].codes[0].uid = s.codeLists.SUB_SECTORS.uid;
                    values[s.ids.SUB_SECTORS].codes[0].version = s.codeLists.SUB_SECTORS.version;

                }
            }

            // Set Values parentsector_code to be removed
            values[s.ids.SECTORS] = {};
            values[s.ids.SECTORS].removeFilter = true;

            return values;
        },
            /**
             *
             * @private
             */
        _bindEventListeners: function () {

            for (var idx in this.config) {
           //     console.log(s.events.LIST_CHANGE + idx);
             //  amplify.subscribe('0'+s.events.LIST_CHANGE + idx, this, this._onChangeEvent2);
               // amplify.subscribe(s.events.LIST_RESET + this.config[idx].components[0].name, this, this._onResetEvent);
            }


           // fx.filter.selectors.select.uid
            //fx.filter.selectors.select.uid
        },
            /**
             *
             * @param selectedItems
             * @private
             */
        _onChangeTest: function (selectedItems) {
           // console.log("_onChangeTest");
            //console.log(selectedItems);

        },

            /**
             *
             * @param itemArr
             * @private
             */
        _onChangeEvent2: function (itemArr) {
          //  console.log("_onChangeEvent2");
           // console.log(itemArr);
            var self = this;
            var item = itemArr[0];


                if (item.id === s.ids.RECIPIENT_COUNTRY) {
                    Q.all([
                        self._onRecipientChange(item)
                    ]).then(function (result) {
                        if (result) {
                            self._setRegionCode(item, result[0][0].parents[0].code);
                        }
                    }).catch(function (error) {
                            self._regioncodeerror(error, item)
                    }).done(function () {
                      //  console.log("_onChangeEvent2: DONE 1");
                            amplify.publish(s.events.FILTER_ON_CHANGE, item);
                            amplify.publish(s.events.COUNTRY_FILTER_READY, item);
                        });
                }
                else if (item.id === s.ids.CHANNELS_SUBCATEGORY) {
                    Q.all([
                        self._onParentChange(item, s.ids.CHANNELS)
                    ]).then(function (result) {
                            if (result) {
                                self._populateChildFilter(result[0], s.ids.CHANNELS);
                            }

                        })
                        .catch(this._error)
                        .done(function () {
                          //  console.log("_onChangeEvent2: DONE 2");
                            amplify.publish(s.events.FILTER_ON_CHANGE, item);
                           // amplify.publish(s.events.SUB_SECTORS_FILTERS_READY);
                        });

                }
                else if (item.id === s.ids.SECTORS) {
                    Q.all([
                        self._onParentChange(item, s.ids.SUB_SECTORS)
                       // self._onSectorChange2(item)
                    ]).then(function (result) {
                            if (result) {
                                self._populateChildFilter(result[0], s.ids.SUB_SECTORS);
                                //self._populateSubSectorFilter(result[0]);
                            }

                        })
                        .catch(this._error)
                        .done(function () {
                           // console.log("_onChangeEvent2: DONE 3");
                            amplify.publish(s.events.FILTER_ON_CHANGE, item);
                            amplify.publish(s.events.SUB_SECTORS_FILTER_READY);
                        });

                } else if (item.id === s.ids.YEAR) {
                    if(item.type === "to" || item.type === "from") {
                       // console.log("_onChangeEvent2: DONE 4");
                      amplify.publish(s.events.FILTER_ON_CHANGE, item);
                      amplify.publish(s.events.TIMERANGE_FILTER_READY, item);
                    }
                } else {
                    //console.log("_onChangeEvent2: DONE 5");
                    //console.log(item);
                    amplify.publish(s.events.FILTER_ON_CHANGE, item);
                }
           // }
            /**   Q.all([
             this._onRecipientChange(item), this._onSectorChange2(item)
             ]).then(this._hiya)
             .catch(this._error)
             .done(function () {
                 console.log("PROMISE  DONE");
                   console.log(item);
                 amplify.publish(s.events.FILTER_ON_CHANGE, item);
             });**/

            /** var promise = Q.all([
             this._onRecipientChange(item), this._onSectorChange2(item)
             ]).spread(function (result1, result2) {
                if(result1){
                    item.region = result1;
                }
                if(result2){
                    var result = [];
                    var children = self._getPropByString(result2[0], "children");

                    _.each(children, function (d) {
                        result.push({"id": d.code, "text": d.title[Utils.getLocale()]});
                    });

                    result.sort(function (a, b) {
                        if (a.text < b.text)
                            return -1;
                        if (a.text > b.text)
                            return 1;
                        return 0;
                    });


                    self.filter.setDomain("purposecode", result);
                }

            }).done(function () {
                    console.log("PROMISE  DONE");
                   amplify.publish(s.events.FILTER_ON_CHANGE, item);
                }
             );
             **/
        },




            /**
             *
             * @param item
             * @private
             */
            _onChangeEvent3: function (item) {
                //  console.log("_onChangeEvent2");
                // console.log(itemArr);
                var self = this;
               // var item = itemArr[0];



                if (item.id === s.ids.RECIPIENT_COUNTRY) {
                    Q.all([
                        self._onRecipientChange(item)
                    ]).then(function (result) {
                        if (result) {
                            self._setRegionCode(item, result[0][0].parents[0].code);
                        }
                    }).catch(function (error) {
                        self._regioncodeerror(error, item)
                    }).done(function () {
                        //  console.log("_onChangeEvent2: DONE 1");
                        amplify.publish(s.events.FILTER_ON_CHANGE, item);
                        amplify.publish(s.events.COUNTRY_FILTER_READY, item);
                    });
                }
                else if (item.id === s.ids.CHANNELS_SUBCATEGORY) {
                    Q.all([
                        self._onParentChange(item, s.ids.CHANNELS)
                    ]).then(function (result) {
                            if (result) {
                                self._populateChildFilter(result[0], s.ids.CHANNELS);
                            }

                        })
                        .catch(this._error)
                        .done(function () {
                            //  console.log("_onChangeEvent2: DONE 2");
                            amplify.publish(s.events.FILTER_ON_CHANGE, item);
                            // amplify.publish(s.events.SUB_SECTORS_FILTERS_READY);
                        });

                }
                else if (item.id === s.ids.SECTORS) {
                    Q.all([
                        self._onParentChange(item, s.ids.SUB_SECTORS)
                        // self._onSectorChange2(item)
                    ]).then(function (result) {
                            if (result) {
                                self._populateChildFilter(result[0], s.ids.SUB_SECTORS);
                                //self._populateSubSectorFilter(result[0]);
                            }

                        })
                        .catch(this._error)
                        .done(function () {
                            // console.log("_onChangeEvent2: DONE 3");
                            amplify.publish(s.events.FILTER_ON_CHANGE, item);
                            amplify.publish(s.events.SUB_SECTORS_FILTER_READY);
                        });

                } else if (item.id === s.ids.YEAR) {
                    if(item.type === "to" || item.type === "from") {
                        // console.log("_onChangeEvent2: DONE 4");
                        amplify.publish(s.events.FILTER_ON_CHANGE, item);
                        amplify.publish(s.events.TIMERANGE_FILTER_READY, item);
                    }
                } else {
                    //console.log("_onChangeEvent2: DONE 5");
                    //console.log(item);
                    amplify.publish(s.events.FILTER_ON_CHANGE, item);
                }
                // }
                /**   Q.all([
                 this._onRecipientChange(item), this._onSectorChange2(item)
                 ]).then(this._hiya)
                 .catch(this._error)
                 .done(function () {
                 console.log("PROMISE  DONE");
                   console.log(item);
                 amplify.publish(s.events.FILTER_ON_CHANGE, item);
             });**/

                /** var promise = Q.all([
                 this._onRecipientChange(item), this._onSectorChange2(item)
                 ]).spread(function (result1, result2) {
                if(result1){
                    item.region = result1;
                }
                if(result2){
                    var result = [];
                    var children = self._getPropByString(result2[0], "children");

                    _.each(children, function (d) {
                        result.push({"id": d.code, "text": d.title[Utils.getLocale()]});
                    });

                    result.sort(function (a, b) {
                        if (a.text < b.text)
                            return -1;
                        if (a.text > b.text)
                            return 1;
                        return 0;
                    });


                    self.filter.setDomain("purposecode", result);
                }

            }).done(function () {
                    console.log("PROMISE  DONE");
                   amplify.publish(s.events.FILTER_ON_CHANGE, item);
                }
                 );
                 **/
            },

            /**
             *
             * @param item
             * @private
             */
        _onResetEvent: function (item) {
            amplify.publish(s.events.FILTER_ON_RESET, item.id);
        },
            /**
             *
             * @param result1
             * @private
             */
        _populateSubSectorFilter: function (result1) {

            var result = [];
           // var children = this._getPropByString(result1[0][0], "children");
            var children = result1[0][0]["children"];

            _.each(children, function (d) {
                result.push({"id": d.code, "text": d.title[Utils.getLocale()]});
            });

            result.sort(function (a, b) {
                if (a.text < b.text)
                    return -1;
                if (a.text > b.text)
                    return 1;
                return 0;
            });


            this.filter.setDomain("purposecode", result);

        },
            /**
             *
             * @param result1
             * @param filterId
             * @private
             */

        _populateChildFilter: function (result1, filterId) {

            var result = [];
            var children = this._getPropByString(result1[0][0], "children");

            _.each(children, function (d) {
                result.push({"id": d.code, "text": d.title[Utils.getLocale()]});
            });

            result.sort(function (a, b) {
                if (a.text < b.text)
                    return -1;
                if (a.text > b.text)
                    return 1;
                return 0;
            });


            this.filter.setDomain(filterId, result);

        },
            /**
             *
             * @param item
             * @param result
             * @private
             */
        _setRegionCode: function (item, result) {
            item.regioncode = result;
        },

            /**
             *
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
             *
             * @param error
             * @private
             */
        _error: function (error) {
            console.log("error", error);
        },
            /**
             *
             * @param item
             * @private
             */
        _onChangeEvent: function(item){

            if(item.id === s.ids.SECTORS){
                this._onSectorChange(item);
            }

            if(item.id === s.ids.RECIPIENT_COUNTRY){
              this._onRecipientChange(item);
            }

            //console.log("========================================");
            //console.log(item);
            amplify.publish(s.events.FILTER_ON_CHANGE, item);

        },
            /**
             *
             * @param sector
             * @returns {*}
             * @private
             */
        _onSectorChange: function (sector) {
            var self = this;
            if(sector.id === s.ids.SECTORS) {
                if (sector.value) {
                    var pcfilter = _.find(this.config, function (obj) {
                        return obj.components[0].id === 'purposecode';
                    });

                    if (pcfilter) {
                        var filter = pcfilter.components[0].config.filter;
                        filter.codes = [];
                        filter.codes.push(sector.value);
                        delete filter["level"];

                        pcfilter.components[0].config.filter = filter;

                       return Q.all([
                            self.filterConfCreator._createCodelistHierarchyPromiseData(pcfilter)
                        ]).spread(function (result1) {

                            var result = [];
                            var children = self._getPropByString(result1[0], "children");

                            _.each(children, function (d) {
                                result.push({"id": d.code, "text": d.title[Utils.getLocale()]});
                            });

                            result.sort(function (a, b) {
                                if (a.text < b.text)
                                    return -1;
                                if (a.text > b.text)
                                    return 1;
                                return 0;
                            });


                            self.filter.setDomain("purposecode", result);

                            //return "Sectors Done";

                        }).done(function () {
                                //console.log("SUBSECTORS  DONE");
                                amplify.publish(s.events.SUB_SECTORS_FILTERS_READY);
                            }
                        );
                    }
                }
            } //else {
              //  return null;
            //}
        },


            /**
             *
             * @param sector
             * @returns {*}
             * @private
             */
        _onSectorChange2: function (sector) {
            var self = this;

                if (sector.value) {
                    var pcfilter = _.find(this.config, function (obj) {
                        return obj.components[0].id === 'purposecode';
                    });

                    if (pcfilter) {
                        var filter = pcfilter.components[0].config.filter;
                        filter.codes = [];
                        filter.codes.push(sector.value);
                        delete filter["level"];

                        pcfilter.components[0].config.filter = filter;

                        return Q.all([
                            self.filterConfCreator._createCodelistHierarchyPromiseData(pcfilter)
                        ]).then(function (c) {
                            //console.log(c);
                            return c;
                        }, function (r) {
                            console.error(r);
                        });
                    }

            }
        },
            /**
             *
             * @param parent
             * @param childfilterId
             * @returns {*}
             * @private
             */
        _onParentChange: function (parent, childfilterId) {
            var self = this;

            if (parent.value) {
                var pcfilter = _.find(this.config, function (obj) {
                    return obj.components[0].id === childfilterId;
                });

                if (pcfilter) {
                    var filter = pcfilter.components[0].config.filter;
                    filter.codes = [];
                    filter.codes.push(parent.value);
                    delete filter["level"];

                    pcfilter.components[0].config.filter = filter;

                    return Q.all([
                        self.filterConfCreator._createCodelistHierarchyPromiseData(pcfilter)
                    ]).then(function (c) {
                        //console.log(c);
                        return c;
                    }, function (r) {
                        console.error(r);
                    });
                }

            }
        },
            /**
             *
             * @param recipient
             * @returns {*}
             * @private
             */

        _onRecipientChange: function (recipient) {
            var self = this;

              //  console.log("IS RECIPIENT")
                if (recipient.value) {
                  //  console.log("IS RECIPIENT value")
                   return Q.all([
                        self._createRegionPromiseData("crs_regions_countries", "2016", "2", "up", recipient.value)
                    ]).then(function (c) {
                       return c;
                   }, function (r) {
                       console.error(r);
                   });
                }

        },
            /**
             *
             * @param codelist
             * @param version
             * @param depth
             * @param direction
             * @param findcode
             * @returns {*}
             * @private
             */
        _createRegionPromiseData : function (codelist, version, depth, direction, findcode) {

            var baseUrl = BaseConfig.SERVER + BaseConfig.CODELIST_SERVICE + BaseConfig.HIERARCHY_CODES_POSTFIX;
            baseUrl+= "/"+ codelist + "/" +version+ "/" + findcode + "?depth="+depth+"&direction="+direction;

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

    /**  _onRecipientChange: function (recipient) {
            var self = this;

            if(sector.value){
                var pcfilter= _.find(this.config, function(obj){
                    return obj.components[0].name === 'recipientcode';
                });

                if(pcfilter){
                    var filter =   pcfilter.components[0].config.filter;
                    console.log(filter);
                    filter.codes = [];
                    filter.codes.push(recipient.value);
                    delete filter["level"];

                    pcfilter.components[0].config.filter = filter;

                    Q.all([
                        self.filterConfCreator._createCodelistHierarchyPromiseData(pcfilter)
                    ]).spread(function(result1) {

                       console.log(result1)

                    }).done(function() {

                        }
                    );
                }
            }
        },**/

            /**
             *
             * @param id
             * @param data
             * @returns {boolean}
             * @private
             */
        _hasSelections: function (id, data){
          //console.log(id);
            if( _.has(data, id)){
                if(data[id].length > 0) {
               // if (_.has(data[id], 'codes')) {
                    return true;
                }
            }
        },
            /**
             *
             * @param id
             * @param data
             * @returns {*}
             * @private
             */
        _getObject: function (id, data){
            if( _.has(data, id)){
                if(data[id].length > 0 || !_.isEmpty(data[id])) {
               // if (_.has(data[id], 'codes')) {
                    return data[id];
                }
            }
        },


        _getSelected: function (o) {
            var allChildren = _.flatten(_.pluck(o,'codes'));

            var values = _.find(allChildren,function(child){
                  if(child) {
                    return child.codes[0];
                }
            });

            return values;
        },

        _containsValue: function (o, value) {
            var hasValue = false;
            var allChildren = _.flatten(_.pluck(o,'codes'));

            var child = _.find(allChildren,function(child){
                if(child) {
                    if (child.codes[0] == value){
                        return child;
                    }
                }
            });

            if(child)
                hasValue = true;

            return hasValue;
        },

        _getPropByString: function(obj, propString) {
            if(!this._hasProp(obj, propString)){
                return null;
            } else {
                if (!propString)
                    return obj;

                var prop, candidate;

                prop = propString;
                candidate = obj[prop];

                if (candidate) {
                    obj = candidate;
                    if(obj.hasOwnProperty(prop)) {
                        this._getPropByString(obj, prop);
                    }
                }

                return obj;
            }

        },


        _getRegionPromise: function (codelist, version, depth, direction, findcode) {
            //console.log(codelist, version, depth, direction, findcode);

            var baseUrl = BaseConfig.SERVER + BaseConfig.CODELIST_SERVICE + BaseConfig.HIERARCHY_CODES_POSTFIX;
            baseUrl+= "/"+ codelist + "/" +version+ "/" + findcode + "?depth="+depth+"&direction="+direction;
           //  console.log(baseUrl);

            return Q($.ajax({
                url: baseUrl,
                type: "GET",
                dataType: "json"
            }));
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
                    if(filter[prop]) {
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

            if(this._hasProp(filterItem, prop))
                filterValue = filterItem[prop] ;

           // console.log(filterValue);
            return filterValue;
        },

        _unbindEventListeners: function () {



            // Remove listeners
            for(var idx in this.config) {
                //amplify.unsubscribe(s.events.LIST_CHANGE + this.config[idx].components[0].name, this._onChangeEvent);
            }
        },

        dispose: function () {
            this._unbindEventListeners();
            View.prototype.dispose.call(this, arguments);
        }

    });

    return FilterView;
});
