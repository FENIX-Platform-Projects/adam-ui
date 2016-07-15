/*global define, amplify*/
define([
    'jquery',
    'views/base/view',
    'text!templates/home/home.hbs',
    'config/Events',
    'config/Config',
    'config/home/home-config',
    'config/home/test_data',
    'fx-m-c/start',
    'fx-dashboard/start',
    'amplify',
    'select2'
], function ($, View, template, E, C,  
    DashboardConfig,
    DashboardTestData,
    MapCreator,
    Dashboard) {

    'use strict';

    var s = {
        MAP_CONTAINER: "#home-map",
        DROPDOWN_CONTAINER: "#factsheet-select",
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

            console.log(conf);
            if (conf && !_.isEmpty(conf) &&  conf.dashboard) {

                /* this._disposeDashboards();

                this.dashboards.push(new Dashboard($.extend(true, {
                    environment: this.environment,
                    el: $(s.DASHBOARD_CONTENT)
                }, conf.dashboard)));*/

                this._createMap();
            }
        },

        _disposeDashboards: function () {

            _.each( this.dashboards, _.bind(function (dashboard) {
                if (dashboard && $.isFunction(dashboard.dispose)) {
                    dashboard.dispose();
                }
            }, this));

            this.dashboards = [];
        },

        _createMap: function() {

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
                }
            });
            
            m.createMap(0, 0, 1);

            var rawData = [["2","Afghanistan","512094.0","tonnes"],["4","Algeria","320.0","tonnes"],["7","Angola","37608.0","tonnes"],["9","Argentina","1563450.0","tonnes"],["10","Australia","1161115.0","tonnes"],["16","Bangladesh","5.15E7","tonnes"],["18","Bhutan","78730.0","tonnes"],["19","Bolivia (Plurinational State of)","426050.6009","tonnes"],["21","Brazil","1.1782549E7","tonnes"],["23","Belize","20505.0","tonnes"],["25","Solomon Islands","4200.0","tonnes"],["26","Brunei Darussalam","1850.0","tonnes"],["27","Bulgaria","54900.0","tonnes"],["28","Myanmar","2.8767E7","tonnes"],["29","Burundi","41454.0","tonnes"],["32","Cameroon","194094.0","tonnes"],["37","Central African Republic","42500.0","tonnes"],["38","Sri Lanka","4620730.0","tonnes"],["39","Chad","330000.0","tonnes"],["40","Chile","130307.0","tonnes"],["41","China, mainland","2.036122E8","tonnes"],["44","Colombia","2048938.0","tonnes"],["45","Comoros","29000.0","tonnes"],["46","Congo","1700.0","tonnes"],["48","Costa Rica","224570.0","tonnes"],["49","Cuba","672600.0","tonnes"],["52","Azerbaijan","4833.0","tonnes"],["53","Benin","206943.0","tonnes"],["56","Dominican Republic","824000.0","tonnes"],["58","Ecuador","1516045.0","tonnes"],["59","Egypt","6100000.0","tonnes"],["60","El Salvador","36254.0","tonnes"],["66","Fiji","5000.0","tonnes"],["68","France","82000.0","tonnes"],["69","French Guiana","2020.0","tonnes"],["74","Gabon","1700.0","tonnes"],["75","Gambia","69704.0","tonnes"],["81","Ghana","569524.0","tonnes"],["84","Greece","227000.0","tonnes"],["89","Guatemala","32051.0","tonnes"],["90","Guinea","2053000.0","tonnes"],["91","Guyana","823800.0","tonnes"],["93","Haiti","169299.66","tonnes"],["95","Honduras","49656.0","tonnes"],["97","Hungary","9800.0","tonnes"],["100","India","1.592E8","tonnes"],["101","Indonesia","7.1279709E7","tonnes"],["102","Iran (Islamic Republic of)","2900000.0","tonnes"],["103","Iraq","451849.0","tonnes"],["106","Italy","1339000.0","tonnes"],["107","Côte d\u0027Ivoire","1934154.0","tonnes"],["108","Kazakhstan","344300.0","tonnes"],["109","Jamaica","31.0","tonnes"],["110","Japan","1.0758E7","tonnes"],["113","Kyrgyzstan","27220.0","tonnes"],["114","Kenya","146696.0","tonnes"],["115","Cambodia","9390000.0","tonnes"],["116","Democratic People\u0027s Republic of Korea","2901000.0","tonnes"],["117","Republic of Korea","5631689.0","tonnes"],["120","Lao People\u0027s Democratic Republic","3415000.0","tonnes"],["123","Liberia","238000.0","tonnes"],["129","Madagascar","3610626.0","tonnes"],["130","Malawi","125156.0","tonnes"],["131","Malaysia","2626881.0","tonnes"],["133","Mali","2211920.0","tonnes"],["136","Mauritania","192000.0","tonnes"],["137","Mauritius","646.0","tonnes"],["138","Mexico","179776.0","tonnes"],["143","Morocco","37716.0","tonnes"],["144","Mozambique","351000.0","tonnes"],["145","Micronesia (Federated States of)","165.0","tonnes"],["149","Nepal","4504503.0","tonnes"],["154","The former Yugoslav Republic of Macedonia","27921.0","tonnes"],["157","Nicaragua","377470.0699","tonnes"],["158","Niger","40000.0","tonnes"],["159","Nigeria","4700000.0","tonnes"],["165","Pakistan","6798100.0","tonnes"],["166","Panama","287395.0","tonnes"],["168","Papua New Guinea","1300.0","tonnes"],["169","Paraguay","617397.0","tonnes"],["170","Peru","3050934.028","tonnes"],["171","Philippines","1.8439406E7","tonnes"],["174","Portugal","168300.0","tonnes"],["175","Guinea-Bissau","209717.0","tonnes"],["176","Timor-Leste","87000.0","tonnes"],["181","Zimbabwe","700.0","tonnes"],["182","Réunion","260.0","tonnes"],["183","Romania","54646.0","tonnes"],["184","Rwanda","93746.0","tonnes"],["185","Russian Federation","934943.0","tonnes"],["195","Senegal","423482.0","tonnes"],["197","Sierra Leone","1255559.0","tonnes"],["201","Somalia","1970.0","tonnes"],["202","South Africa","3000.0","tonnes"],["203","Spain","851500.0","tonnes"],["206","Sudan (former)","25000.0","tonnes"],["207","Suriname","262029.0","tonnes"],["208","Tajikistan","98000.0","tonnes"],["209","Swaziland","105.0","tonnes"],["213","Turkmenistan","130000.0","tonnes"],["214","China, Taiwan Province of","1594320.0","tonnes"],["215","United Republic of Tanzania","2194750.0","tonnes"],["216","Thailand","3.60626E7","tonnes"],["217","Togo","164998.0","tonnes"],["220","Trinidad and Tobago","2859.0","tonnes"],["223","Turkey","900000.0","tonnes"],["226","Uganda","214000.0","tonnes"],["230","Ukraine","145050.0","tonnes"],["231","United States of America","8613094.0","tonnes"],["233","Burkina Faso","305382.0","tonnes"],["234","Uruguay","1359000.0","tonnes"],["235","Uzbekistan","340219.0","tonnes"],["236","Venezuela (Bolivarian Republic of)","1005000.01","tonnes"],["237","Viet Nam","4.403929126E7","tonnes"],["238","Ethiopia","184210.0","tonnes"],["250","Democratic Republic of the Congo","355000.0","tonnes"],["251","Zambia","44747.0","tonnes"],["351","China","2.0520652E8","tonnes"]];

            var data = _.map(DashboardTestData, function(d) {
                
                var v = {};

                v[ d[0] ] = parseFloat(d[2]);

                return v;
            });

            console.log('data',data)

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
