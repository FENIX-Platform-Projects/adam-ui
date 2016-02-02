/*global define, amplify*/
define([
    'jquery',
    'underscore',
    'views/base/view',
    'text!templates/browse/filters.hbs',
    'fx-filter/start',
    'fx-filter/Fx-filter-configuration-creator',
    'lib/utils',
    'q',
    'handlebars',
    'amplify'
], function ($, _, View, template, Filter, FilterConfCreator, Utils,  Q) {

    'use strict';

    var s = {
        css_classes: {
            FILTER_BROWSE: "filter-browse"
        },
        events: {
            SUB_SECTORS_FILTERS_READY: 'fx.filters.list.subsectors.ready',
            LIST_CHANGE: 'fx.filter.list.change.',
            FILTER_ON_CHANGE: 'fx.filter.list.onchange'
        },
        listTypes: {
            SECTOR_LIST: 'sectorcode'
        },
        codeLists: {
            SECTORS: {uid: 'crs_sectors', version: '2015'},
            SUB_SECTORS: {uid: 'crs_purposes', version: '2015'},
            CHANNELS: {uid: 'crs_channel', version: '2015'}
        },
        ids: {
            SECTORS: 'sectorcode',
            SUB_SECTORS: 'purposecode',
            CHANNELS: 'channelcode'
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

        getValues: function(){
            var values = this.filter.getValues();

            var sectorSelected= this._hasSelections(s.ids.SECTORS, values);
            var subSectorSelected = this._hasSelections(s.ids.SUB_SECTORS, values);
            var channelsSelected = this._hasSelections(s.ids.CHANNELS, values);

            // Set the sector and sub sector code lists references
            // Updated to match the references as declared in the dataset metadata for the sectorcode and purposecode fields
            if(sectorSelected){
                values['sectorcode'].codes[0].uid = s.codeLists.SECTORS.uid;
            }

            // Set Subsectors to crs_purposes
            if(subSectorSelected) {
                values['purposecode'].codes[0].uid = s.codeLists.SUB_SECTORS.uid;
            }

            // Set Channels to crs_channel
            if(channelsSelected) {
                values['channelcode'].codes[0].uid = s.codeLists.CHANNELS.uid;
            }

           return this._updateValues(values, subSectorSelected);
        },

        isFilterSelected: function(id){
            var values = this.filter.getValues();
            return this._hasSelections(id, values);
        },

        isFAOSectorsSelected: function(){
            var values = this.filter.getValues();

            return this._containsValue(values, s.values.FAO_SECTORS);
        },

        _updateValues: function(values, subSectorSelected){
            switch(this.isFAOSectorsSelected()){
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
            // If no purposecodes have been selected
            if(!subSectorSelected){
                // Get the purposecode filter component, which will contain all
                // the purposecodes (sub-sectors) associated with the selected 'FAO-related Sectors'
                var purposeCodeComponent = this.filter.getDomain(s.ids.SUB_SECTORS);

                if(purposeCodeComponent){
                    var codes = [];

                    //======= UPDATE VALUES CONFIG
                    // Add purposecode to values
                    values[s.ids.SUB_SECTORS] = {};
                    values[s.ids.SUB_SECTORS].codes = [];
                    values[s.ids.SUB_SECTORS].codes[0] = $.extend(true, {}, sectorvaluesobj); // clone the codes configuration of sectorvaluesobj

                    // console.log( values['purposecode'].codes[0]);
                    // Get the source of the purposecode component
                    // and populate the codes array with the IDs of the source items
                    $.each(purposeCodeComponent.options.source, function( index, sourceItem ) {
                        codes.push(sourceItem.id);
                    });

                    values[s.ids.SUB_SECTORS].codes[0].codes = codes;
                    values[s.ids.SUB_SECTORS].codes[0].uid = s.codeLists.SUB_SECTORS.uid;
                    values[s.ids.SUB_SECTORS].codes[0].version = s.codeLists.SUB_SECTORS.version;

                }
            }

            // Set Values sectorcode to be removed
            values[s.ids.SECTORS] = {};
            values[s.ids.SECTORS].removeFilter = true;

            return values;
        },

        _bindEventListeners: function () {
            // Add List Change listeners
            for(var idx in this.config) {
                amplify.subscribe(s.events.LIST_CHANGE + this.config[idx].components[0].name, this, this._onChangeEvent);
            }
        },

        _onChangeEvent: function(item){

            if(item.name === s.listTypes.SECTOR_LIST){
                this._onSectorChange(item);
            }

            amplify.publish(s.events.FILTER_ON_CHANGE, item);

        },

        _onSectorChange: function (sector) {
            var self = this;

            if(sector.value){
                var pcfilter= _.find(this.config, function(obj){
                    return obj.components[0].name === 'purposecode';
                });

                if(pcfilter){
                    var filter =   pcfilter.components[0].config.filter;
                    filter.codes = [];
                    filter.codes.push(sector.value);
                    delete filter["level"];

                    pcfilter.components[0].config.filter = filter;

                    Q.all([
                        self.filterConfCreator._createCodelistHierarchyPromiseData(pcfilter)
                    ]).spread(function(result1) {

                        var result = [];
                        var children = self._getPropByString(result1[0], "children");

                        _.each(children, function (d) {
                            result.push({"id": d.code, "text": d.title[Utils.getLocale()]});
                        });

                        result.sort(function(a, b){
                            if (a.text < b.text)
                                return -1;
                            if (a.text > b.text)
                                return 1;
                            return 0;
                        });


                        self.filter.setDomain("purposecode", result);

                    }).done(function() {
                           amplify.publish(s.events.SUB_SECTORS_FILTERS_READY);
                        }
                    );
                }
            }
        },

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
