/*global define, amplify*/
define([
    'jquery',
    'views/base/view',
    'text!templates/home/home.hbs',
    'config/Events',
    'config/Config',
    'config/home/home-config',
    'config/home/test-data',
    'fx-m-c/start',
    'fx-dashboard/start',
    'amplify',
    'select2'
], function ($, View, template, E, C,

    DashboardConfig,
    DashboardTestData,

    MapCreator, Dashboard) {

    'use strict';

    var s = {
        MAP_CONTAINER : "#home-map",
        DROPDOWN_CONTAINER : "#factsheet-select",
        DASHBOARD_CONTENT: "#dashboard-content"
    };

    var HomeView = View.extend({

        autoRender: true,

        className: 'home',

        template: template,

        attach: function () {

            View.prototype.attach.call(this, arguments);

            //update State
            amplify.publish(E.STATE_CHANGE, {menu: 'home'});

            this._initVariables();

            this._renderComponents();

        },


        dispose: function () {

            this.unbindEventListeners();

            View.prototype.dispose.call(this, arguments);
        },

        unbindEventListeners: function () {

            this.$el.find(s.DROPDOWN_CONTAINER).select2().off('change');
        },

        _initVariables: function () {

            this.dashboards = [];

            this.environment = C.ENVIRONMENT;

        },

        _renderComponents: function () {

           this._renderDropdown();

           this._renderDashboard();
        },

        _renderDropdown : function () {

            this.$el.find(s.DROPDOWN_CONTAINER).select2().on('change', function () {

               window.open(this.value, '_blank');

            });

        },

        _renderDashboard: function () {

            var conf = DashboardConfig;

            //console.log(conf);
            if (conf && !_.isEmpty(conf) &&  conf.dashboard) {

            this._disposeDashboards();

               this.dashboards.push(new Dashboard($.extend(true, {
                    environment: this.environment,
                    el: $(s.DASHBOARD_CONTENT)
                }, conf.dashboard)));

                
               // this._createMap(s.MAP_CONTAINER);
            }
        },

        _disposeDashboards : function () {

            _.each( this.dashboards, _.bind(function (dashboard) {
                if (dashboard && $.isFunction(dashboard.dispose)) {
                    dashboard.dispose();
                }
            }, this));

            this.dashboards = [];
        },

         _createMap: function() {

            //console.log('DashboardTestData', DashboardTestData);

            var countries = [];
            
            var data = _.map(DashboardTestData, function(d) {
                
                var v = {};

                v[ d[0] ] = parseFloat(d[2]);

                countries.push( parseFloat(d[0]) );

                return v;
            });

            var m = new FM.Map(s.MAP_CONTAINER, {
                plugins: {
                    disclaimerfao: false,
                    geosearch: false,
                    mouseposition: false,
                    controlloading: false,
                    scalecontrol: false
                },
                guiController: {
                    overlay: false,
                    baselayer: false,
                    wmsLoader: false
                },
                boundaries: true,
                zoomToCountry: countries
            });
            
            m.createMap(0, 0, 1);

            var joincolumnlabel = 'adm0_name',
                joincolumn = 'adm0_code',
                mu = 'Tonnes';

            m.addLayer( new FM.layer({
                layers: 'fenix:gaul0_3857',
                layertitle: 'ODA 2014',
                joincolumn: joincolumn,
                joincolumnlabel: joincolumnlabel,
                joindata: data,
                mu: mu,
                measurementunit: mu,
                jointype: 'shaded',
                colorramp: 'Blues',
                layertype: 'JOIN',
                openlegend: true,
                defaultgfi: true,
                opacity: '0.7',
                lang: 'en',
                customgfi: {
                    content: {
                        en: "<div class='fm-popup'>{{" + joincolumnlabel + "}} <div class='fm-popup-join-content'>{{{" + joincolumn + "}}}</div></div>"
                    },
                    showpopup: true
                }
            }) );

            m.addLayer( new FM.layer({
                layers: 'fenix:gaul0_line_3857',
                layertitle: 'Country Boundaries',
                //urlWMS: 'http://fenixapps.fao.org/geoserver',
                opacity: '0.9',
                lang: 'en'
            }) );
        }
    });

    return HomeView;
});
