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
    'config/browse/config-browse',
    'config/browse/Events',
    'q',
    'handlebars',
    'amplify'
], function ($, _, View, template, i18nLabels, Filter/**, FilterConfCreator**/, FxUtils, Utils,  BaseConfig, BrowseConfig, BaseEvents, Q) {

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
        /*ids: {
            SECTORS: 'parentsector_code',
            SUB_SECTORS: 'purposecode',
            CHANNELS_SUBCATEGORY: 'channelsubcategory_code',
            CHANNELS: 'channelcode',
            COUNTRY: 'countrycode',
            DONOR: 'donorcode',
            RECIPIENT_COUNTRY: 'recipientcode',
            YEAR: 'year',
            YEAR_FROM: 'year-from',
            YEAR_TO: 'year-to',
            ODA: 'oda'
        },*/
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


            //console.log('render filter')

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






                // on Ready listeners
                this.filter.on('ready', function (payload) {
                   // console.log("========================= FilterView: ON READY ==============");
                   // console.log(self._getFilterValues().values);

                    if(self._getFilterValues().values[BrowseConfig.filter.RECIPIENT_COUNTRY]){
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

                            amplify.publish(BaseEvents.FILTER_ON_READY,  $.extend(self._getFilterValues(), {"props": additionalProperties}));
                        });

                    }
                    else if(self._getFilterValues().values[BrowseConfig.filter.ODA]) {

                        var additionalProperties = self._getPropertiesObject(BrowseConfig.filter.ODA, self._getFilterValues().values[BrowseConfig.filter.ODA].enumeration[0]);

                        amplify.publish(BaseEvents.FILTER_ON_READY, $.extend(self._getFilterValues(), {"props": additionalProperties}));
                    }
                    else {
                        amplify.publish(BaseEvents.FILTER_ON_READY, self._getFilterValues());
                    }


                  /*  if(filterItem){
                        Q.all([
                            self._onRecipientChange(filterItem)
                        ]).then(function (result) {
                            if (result) {
                                self._setRegionCode(filterItem, result[0][0].parents[0].code);
                            }
                        }).catch(function (error) {
                            self._regioncodeerror(error, filterItem)
                        }).done(function () {
                            console.log("RECIPIENT DONE ============ ", filterItem);
                        });
                    }
*/

                   // amplify.publish(BaseEvents.FILTER_ON_READY, self._getSelectedLabels());

                    //console.log("================ filter ==============");
                   // console.log(self._getFilterById('recipientcode'));




                });



            // Add List Change listeners
            this.filter.on('change', function (payload) {
                //console.log("========================= FilterView: ON CHANGE ==============");
                //console.log(payload);

                var fc =  self._getFilterConfigById(payload.id);
                var dependencies = [];
                if(fc && fc.dependencies) {
                    for(var id in fc.dependencies) {
                        dependencies.push(id);
                    }

                  payload["dependencies"] = dependencies;
                }

                if(payload.id === BrowseConfig.filter.YEAR_TO || payload.id === BrowseConfig.filter.YEAR_FROM) {
                    var newRange = self._getObject(BrowseConfig.filter.YEAR, self._getSelectedLabels());
                    if (newRange) {
                        payload.id = BrowseConfig.filter.YEAR;
                        payload.values.labels = self._getObject(BrowseConfig.filter.YEAR, self._getSelectedLabels());
                        payload.values.values = self._getObject(BrowseConfig.filter.YEAR, self._getSelectedValues());
                    }

                    amplify.publish(BaseEvents.FILTER_ON_CHANGE, payload);
                }
                if(payload.id === BrowseConfig.filter.ODA) {
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







                /*  Q.all([
                      self._onRecipientChange(payload.values.values)
                  ]).then(function (result) {
                      if (result) {
                          self._setRegionCode(payload, result[0][0].parents[0].code);
                      }
                  }).catch(function (error) {
                      self._regioncodeerror(error, payload)
                  }).done(function () {
                      console.log("RECIPIENT DONE ============ ", payload);
                      amplify.publish(BaseEvents.FILTER_ON_CHANGE, payload);
                  });
              } else {
                  amplify.publish(BaseEvents.FILTER_ON_CHANGE, payload);
              }*/



               //self._onChangeEvent2(payload);
            });

             // Filters are loaded
               // this.filter.on('ready', function () {

                  //  amplify.publish(BaseEvents.FILTER_ON_READY, self._getSelectedLabels());
             //});



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

            var updatedValuesWithYear = {}, updatedValuesWithODA = {}, extendedValues = $.extend(true, {}, this.filter.getValues(), timerange);

                updatedValuesWithYear = this._processTimeRange(extendedValues);

                updatedValuesWithODA = this._processODA(updatedValuesWithYear);


              //  console.log("========================= UPDATED VALUES ============");

              //  console.log(updatedValuesWithODA);

           return updatedValuesWithODA;

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


            _getFilterConfigById: function(id){
               var filter;

                $.each(this.config, function (key, obj) {
                     if(key === id){
                         return filter = obj;
                     }
                });

                return filter;
            },

            /**
             *
             * @returns {Object}
             */
        getFilterValues: function(){

          // console.log("FINAL getFilterValues ============ 1");
            var values = this._getFilterValues();

            //clear uid values
            values.values["uid"] = [];

            values.values[BrowseConfig.filter.YEAR_FROM] = [];
            values.values[BrowseConfig.filter.YEAR_TO] = [];


           // console.log(values);
            return values;
        },

            clearFilterValue: function(filterid, values){

                if(values.values[filterid]){
                    values.values[filterid] = [];
                }

                return values;
            },

            _processTimeRange: function(filter){

                var year_from =  filter.values[BrowseConfig.filter.YEAR_FROM], year_to =  filter.values[BrowseConfig.filter.YEAR_TO];

                //reformat to and from years
                filter.values.year[0].value = year_from[0];
                filter.values.year[1].value = year_to[0];

                filter.labels.year.range = year_from[0] + '-' + year_to[0];
                filter.labels[BrowseConfig.filter.YEAR_FROM] = [];
                filter.labels[BrowseConfig.filter.YEAR_TO] = [];

                return filter;
            },


            _processODA: function(filter){

                var enumeration = [], oda =  filter.values[BrowseConfig.filter.ODA][0];
                enumeration.push(oda);

                filter.values[BrowseConfig.filter.ODA] = {};
                filter.values[BrowseConfig.filter.ODA].enumeration = enumeration;


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


            hasValues: function (filterid) {
                var values = this._getSelectedValues();
                return this._hasSelections(filterid, values);
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
                    selectedValues =  values[filterId];
                 //var filterObj = this._getObject(filterId, values);
                 //selectedValues = this._getSelected(filterObj);
                }

            return selectedValues;
        },



            /**
             *
             *
             * @returns {*}
             */
            getIndicatorsValues: function () {

            var filterValues =  this._getFilterValues();
            var values = filterValues.values;
            var labels = filterValues.labels;

            var cloneObj, cloneLabelObj;

               // console.log("============================= VALUES =================== ");
               // console.log(values);

            var donorSelected = this._hasSelections(BrowseConfig.filter.RESOURCE_PARTNER, values);
            var recipientSelected = this._hasSelections(BrowseConfig.filter.RECIPIENT_COUNTRY, values);


            if(donorSelected){
                cloneObj = this._getObject(BrowseConfig.filter.RESOURCE_PARTNER, values);
                cloneLabelObj = this._getObject(BrowseConfig.filter.RESOURCE_PARTNER, labels);
            }
            if(recipientSelected) {
                cloneObj = this._getObject(BrowseConfig.filter.RECIPIENT_COUNTRY, values);
                cloneLabelObj = this._getObject(BrowseConfig.filter.RECIPIENT_COUNTRY, labels);
            }


           if(cloneObj) {
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
            var values = this.getSelectedValues(BrowseConfig.filter.SECTOR);

                //console.log(values);
            for(var i = 0; i < values.length; i++){
                if(values[i] === s.values.FAO_SECTORS){
                  return true;
                }
            }

            return false;
        },



            /*isFAOSectorsSelected: function () {
                var values = this._getSelectedValues();

                return this._containsValue(values, s.values.FAO_SECTORS);
            },*/

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


                if (item.id === BrowseConfig.filter.RECIPIENT_COUNTRY) {
                    Q.all([
                        self._onRecipientChange(item)
                    ]).then(function (result) {
                        //console.log("=========== ", result);

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
                else if (item.id === BrowseConfig.filter.CHANNELS_SUBCATEGORY) {
                    Q.all([
                        self._onParentChange(item, BrowseConfig.filter.CHANNEL)
                    ]).then(function (result) {
                            if (result) {
                                self._populateChildFilter(result[0], BrowseConfig.filter.CHANNEL);
                            }

                        })
                        .catch(this._error)
                        .done(function () {
                          //  console.log("_onChangeEvent2: DONE 2");
                            amplify.publish(s.events.FILTER_ON_CHANGE, item);
                           // amplify.publish(s.events.SUB_SECTORS_FILTERS_READY);
                        });

                }
                else if (item.id === BrowseConfig.filter.SECTOR) {
                    Q.all([
                        self._onParentChange(item, BrowseConfig.filter.SUB_SECTOR)
                       // self._onSectorChange2(item)
                    ]).then(function (result) {
                            if (result) {
                                self._populateChildFilter(result[0], BrowseConfig.filter.SUB_SECTOR);
                                //self._populateSubSectorFilter(result[0]);
                            }

                        })
                        .catch(this._error)
                        .done(function () {
                           // console.log("_onChangeEvent2: DONE 3");
                            amplify.publish(s.events.FILTER_ON_CHANGE, item);
                            amplify.publish(s.events.SUB_SECTORS_FILTER_READY);
                        });

                } else if (item.id === BrowseConfig.filter.YEAR) {
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



                if (item.id === BrowseConfig.filter.RECIPIENT_COUNTRY) {
                    Q.all([
                        self._onRecipientChange(item)
                    ]).then(function (result) {
                        //console.log("============= RESULT ", result);
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
                else if (item.id === BrowseConfig.filter.CHANNELS_SUBCATEGORY) {
                    Q.all([
                        self._onParentChange(item, BrowseConfig.filter.CHANNEL)
                    ]).then(function (result) {
                            if (result) {
                                self._populateChildFilter(result[0], BrowseConfig.filter.CHANNEL);
                            }

                        })
                        .catch(this._error)
                        .done(function () {
                            //  console.log("_onChangeEvent2: DONE 2");
                            amplify.publish(s.events.FILTER_ON_CHANGE, item);
                            // amplify.publish(s.events.SUB_SECTORS_FILTERS_READY);
                        });

                }
                else if (item.id === BrowseConfig.filter.SECTOR) {
                    Q.all([
                        self._onParentChange(item, BrowseConfig.filter.SUB_SECTOR)
                        // self._onSectorChange2(item)
                    ]).then(function (result) {
                            if (result) {
                                self._populateChildFilter(result[0], BrowseConfig.filter.SUB_SECTOR);
                                //self._populateSubSectorFilter(result[0]);
                            }

                        })
                        .catch(this._error)
                        .done(function () {
                            // console.log("_onChangeEvent2: DONE 3");
                            amplify.publish(s.events.FILTER_ON_CHANGE, item);
                            amplify.publish(s.events.SUB_SECTORS_FILTER_READY);
                        });

                } else if (item.id === BrowseConfig.filter.YEAR) {
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


            _setGaulCode: function (item, result) {
                item.gaulcode = parseInt(result);
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

            if(item.id === BrowseConfig.filter.SECTOR){
                this._onSectorChange(item);
            }

            if(item.id === BrowseConfig.filter.RECIPIENT_COUNTRY){
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
            if(sector.id === BrowseConfig.filter.SECTOR) {
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

        /*_onRecipientChange: function (recipient) {
            var self = this;
              //  console.log("IS RECIPIENT")
                if (recipient.values.values.length > 0) {
                  //  console.log("IS RECIPIENT value")
                   return Q.all([
                        self._createRegionPromiseData("crs_un_regions_recipients", "2016", "2", "up", recipient.values.values[0])
                    ]).then(function (c) {
                       return c;
                   }, function (r) {
                       console.error(r);
                   });
                }

        },*/


            _onRecipientChangeGetRegionCode: function (values) {
                var self = this;
                //  console.log("IS RECIPIENT")
                if (values.length > 0) {
                    //  console.log("IS RECIPIENT value")
                    return Q.all([
                        self._createRegionPromiseData("crs_un_regions_recipients", "2016", "2", "up", values[0])
                    ]).then(function (c) {
                        return c;
                    }, function (r) {
                        console.error(r);
                    });
                }

            },


            _onRecipientChangeGetGaulCode: function (values) {
                var self = this;
                var odaProps = self._getPropertiesObject(BrowseConfig.filter.ODA, self._getFilterValues().values[BrowseConfig.filter.ODA]);
                var filterConfig = self._getFilterConfigById(BrowseConfig.filter.RECIPIENT_COUNTRY);

                if (values.length > 0) {
                    //  console.log("IS RECIPIENT value")
                    return Q.all([
                        self._createGaulPromiseData(odaProps[BrowseConfig.filter.ODA].enumeration[0], Utils.getLocale(), filterConfig.cl.uid, filterConfig.cl.version, values)
                    ]).then(function (c) {
                        return c;
                    }, function (r) {
                        console.error(r);
                    });
                }

            },


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

    _createGaulPromiseData : function (dataset, lang, codelist, version, codes) {

        var baseUrl = BaseConfig.SERVER + BaseConfig.D3P_POSTFIX + dataset + "?dsd=true&full=true&language="+lang;
        var data =  [{"name":"filter","parameters":{"rows":{"recipientcode":{"codes":[{"uid":codelist,"version":version,"codes":codes}]}}}},{"name":"filter","parameters":{"columns":["gaul0"]}}, {"name":"page","parameters":{"perPage":1, "page": 1}}];



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

        _getPropertiesObject: function (id, value) {
            var additionalProperties = {};
            additionalProperties[id] = value;

            return additionalProperties;
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
