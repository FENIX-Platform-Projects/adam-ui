/*global define, amplify*/
define([
    'jquery',
    'views/base/view',
    'text!templates/home/home.hbs',
    'config/Events',
    'config/Config',
    'config/home/home-config',
    'fx-m-c/start',
    'fx-dashboard/start',
    'amplify',
    'select2'
], function ($, View, template, E, C,  DashboardConfig, MapCreator, Dashboard) {

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

            console.log(conf);
            if (conf && !_.isEmpty(conf) &&  conf.dashboard) {

            this._disposeDashboards();

                this.dashboards.push(new Dashboard($.extend(true, {
                    environment: this.environment,
                    el: $(s.DASHBOARD_CONTENT)
                }, conf.dashboard)));

            }
        },

        _disposeDashboards : function () {

            _.each( this.dashboards, _.bind(function (dashboard) {
                if (dashboard && $.isFunction(dashboard.dispose)) {
                    dashboard.dispose();
                }
            }, this));

            this.dashboards = [];
        }
    });

    return HomeView;
});
