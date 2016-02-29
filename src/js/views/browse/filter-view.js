/*global define, amplify*/
define([
    'jquery',
    'underscore',
    'views/base/view',
    'text!templates/browse/filters.hbs',
    'fx-filter/start',
    'fx-filter/Fx-filter-configuration-creator',
    'lib/utils',
    'config/Config',
    'q',
    'handlebars',
    'amplify'
], function ($, _, View, template, Filter, FilterConfCreator, Utils,  BaseConfig, Q) {

    'use strict';

    var s = {
        css_classes: {
            FILTER_BROWSE: "filter-browse"
        },
        events: {
            SUB_SECTORS_FILTER_READY: 'fx.filters.list.subsectors.ready',
            TIMERANGE_FILTER_READY: 'fx.filters.list.timerange.ready',
            COUNTRY_FILTER_READY: 'fx.filters.list.recipients.ready',
            LIST_CHANGE: 'fx.filter.list.change.',
            LIST_RESET: 'fx.filter.list.reset.',
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
            YEAR: 'year'
        },
        values: {
            FAO_SECTORS: '9999'
        }
    };

    var FilterView = View.extend({

        // Automatically render after initialize
        autoRender: true,

        className: 'filter-browse',

        // Save the template string in a prototype property.
        // This is overwritten with the compiled template function.
        // In the end you might want to used precompiled templates.
        template: template,

        initialize: function (params) {
            this.config = params.config;

            // Change JQuery-UI plugin names to fix name collision with Bootstrap
            // $.widget.bridge('uitooltip', $.ui.tooltip);

            View.prototype.initialize.call(this, arguments);
        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            this._initVariables();

            this._bindEventListeners();

            this._buildFilters();
        },

        _initVariables: function () {
            this.filterConfCreator = new FilterConfCreator();
        },

        _buildFilters: function () {
            var self = this;

            this.filterConfCreator.getConfiguration(this.config)
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

            });
        },


        getOECDValues: function () {

            var values = this.filter.getValues();

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
                values['purposecode'].codes[0].uid = s.codeLists.SUB_SECTORS.uid;
            }

            // Set Channels to crs_channel
            //if (channelsSelected) {
             //   values['channelcode'].codes[0].uid = s.codeLists.CHANNELS.uid;
            //}

            //console.log(values);


            return this._updateValues(values, subSectorSelected);
        },

        getSelectedValues: function (filterId) {
            var values = this.filter.getValues();
            var selectedValues = {};
            var itemSelected = this._hasSelections(filterId, values);
            if (itemSelected) {
                var filterObj = this._getObject(filterId, values);
                selectedValues = this._getSelected(filterObj);
            }

            //console.log(selectedValues);
            return selectedValues;
        },

        getIndicatorsValues: function () {
            var values = this.filter.getValues();
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

        isFilterSelected: function (id) {
            var values = this.filter.getValues();
            return this._hasSelections(id, values);
        },

        isFAOSectorsSelected: function () {
            var values = this.filter.getValues();

            return this._containsValue(values, s.values.FAO_SECTORS);
        },

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

        _bindEventListeners: function () {
            // Add List Change listeners
            for (var idx in this.config) {
                //amplify.subscribe(s.events.LIST_CHANGE + this.config[idx].components[0].name, this, this._onChangeEvent);
                amplify.subscribe(s.events.LIST_CHANGE + this.config[idx].components[0].name, this, this._onChangeEvent2);
                amplify.subscribe(s.events.LIST_RESET + this.config[idx].components[0].name, this, this._onResetEvent);
            }




        },


        _onChangeEvent2: function (item) {
            var self = this;

            if (item.name === s.ids.RECIPIENT_COUNTRY) {
                Q.all([
                    self._onRecipientChange(item)
                ]).then(function (result) {
                    if (result) {
                        self._setRegionCode(item, result[0][0].parents[0].code);
                    }
                }).catch(function (error) {
                        self._regioncodeerror(error, item)
                }).done(function () {
                        amplify.publish(s.events.FILTER_ON_CHANGE, item);
                        amplify.publish(s.events.COUNTRY_FILTER_READY, item);
                    });
            }
            else if (item.name === s.ids.CHANNELS_SUBCATEGORY) {
                Q.all([
                    self._onParentChange(item, s.ids.CHANNELS)
                ]).then(function (result) {
                        if (result) {
                            self._populateChildFilter(result[0], s.ids.CHANNELS);
                        }

                    })
                    .catch(this._error)
                    .done(function () {
                        amplify.publish(s.events.FILTER_ON_CHANGE, item);
                       // amplify.publish(s.events.SUB_SECTORS_FILTERS_READY);
                    });

            }
            else if (item.name === s.ids.SECTORS) {
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
                        amplify.publish(s.events.FILTER_ON_CHANGE, item);
                        amplify.publish(s.events.SUB_SECTORS_FILTER_READY);
                    });

            } else if (item.name === s.ids.YEAR) {
                if(item.type === "to") {
                  amplify.publish(s.events.FILTER_ON_CHANGE, item);
                  amplify.publish(s.events.TIMERANGE_FILTER_READY, item);
                }
            } else {
                amplify.publish(s.events.FILTER_ON_CHANGE, item);
            }

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

        _onResetEvent: function (item) {
            amplify.publish(s.events.FILTER_ON_RESET, item.name);
        },

        _populateSubSectorFilter: function (result1) {

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


            this.filter.setDomain("purposecode", result);

        },


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

        _setRegionCode: function (item, result) {
            item.regioncode = result;
        },

        _regioncodeerror: function (error, item) {
            if (item.regioncode) {
                delete item['regioncode']
            }
        },

        _error: function (error) {
            console.log("error", error);
        },

        _onChangeEvent: function(item){

            if(item.name === s.ids.SECTORS){
                this._onSectorChange(item);
            }

            if(item.name === s.ids.RECIPIENT_COUNTRY){
              this._onRecipientChange(item);
            }

           // console.log(item);
            amplify.publish(s.events.FILTER_ON_CHANGE, item);

        },

        _onSectorChange: function (sector) {
            var self = this;
            if(sector.name === s.ids.SECTORS) {
                if (sector.value) {
                    var pcfilter = _.find(this.config, function (obj) {
                        return obj.components[0].name === 'purposecode';
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



        _onSectorChange2: function (sector) {
            var self = this;

                if (sector.value) {
                    var pcfilter = _.find(this.config, function (obj) {
                        return obj.components[0].name === 'purposecode';
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

        _onParentChange: function (parent, childfilterId) {
            var self = this;

            if (parent.value) {
                var pcfilter = _.find(this.config, function (obj) {
                    return obj.components[0].name === childfilterId;
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

        _hasSelections: function (id, data){
            if( _.has(data, id)){
                if (_.has(data[id], 'codes')) {
                    return true;
                }
            }
        },
        _getObject: function (id, data){
            if( _.has(data, id)){
                if (_.has(data[id], 'codes')) {
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
        },


        _getRegionPromise: function (codelist, version, depth, direction, findcode) {
            console.log(codelist, version, depth, direction, findcode);

            var baseUrl = BaseConfig.SERVER + BaseConfig.CODELIST_SERVICE + BaseConfig.HIERARCHY_CODES_POSTFIX;
            baseUrl+= "/"+ codelist + "/" +version+ "/" + findcode + "?depth="+depth+"&direction="+direction;
             console.log(baseUrl);

            return Q($.ajax({
                url: baseUrl,
                type: "GET",
                dataType: "json"
            }));
        },

        _getFilterConfig: function (id) {
            var filter = _.find(this.config, function (obj) {
                return obj.components[0].name === id;
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
            var filterValue;
            var filterItem = this._getFilterConfig(id);

            if(this._hasProp(filterItem, prop))
                filterValue = filterItem[prop] ;

            return filterValue;
        },

        _unbindEventListeners: function () {
            // Remove listeners
            for(var idx in this.config) {
                amplify.unsubscribe(s.events.LIST_CHANGE + this.config[idx].components[0].name, this._onChangeEvent);
            }
        },

        dispose: function () {
            this._unbindEventListeners();
            View.prototype.dispose.call(this, arguments);
        }

    });

    return FilterView;
});
