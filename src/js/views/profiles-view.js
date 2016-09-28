/*global define, amplify*/
define([
    'jquery',
    'views/base/view',
    'text!templates/profiles/profiles.hbs',
    'config/Events',
    'config/profiles/profiles-config',
    'i18n!nls/browse',
    'fx-filter/start',
    'config/Config',
    'amplify'
], function ($, View, template, E, DashboardConfig, i18nLabels, Filter, BaseConfig) {

    'use strict';

    var s = {
        css_classes: {
            FILTER_HOLDER: "#profiles-filter-holder",
        }
    };

    var ProfileView = View.extend({

        autoRender: true,

        className: 'profiles',

        template: template,

        initialize: function (params) {
            this.page = params.page;

            View.prototype.initialize.call(this, arguments);
        },

        getTemplateData: function () {
            return i18nLabels;
        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            //remove Breadcrumbs
            amplify.publish(E.MENU_RESET_BREADCRUMB);

            //update State
            amplify.publish(E.STATE_CHANGE, {menu: 'profiles'});

        },


        render: function () {
            View.prototype.render.apply(this, arguments);

            if (!DashboardConfig || !DashboardConfig.dashboard || !DashboardConfig.filter) {
                alert("Impossible to find default ODA dashboard/filter configuration for the topic: ");
                return;
            }

            // dispose of filter
            if (this.filter && $.isFunction(this.filter.dispose)) {
                this.filter.dispose();
            }

            // instantiate filter
            this.filter = new Filter({
                el: this.$el.find(s.css_classes.FILTER_HOLDER),
                environment: BaseConfig.ENVIRONMENT,
                items: DashboardConfig.filter,
                common: {
                    template: {
                        hideSwitch: true,
                        hideRemoveButton: true
                    }
                }
            });

            // Filter on Change: Set some base properties for Recipient and the ODA, then publish Filter On Change Event
            this.filter.on('change', function (payload) {
                console.log("========================= FilterView: ON CHANGE ==============");
                console.log(payload);

            });

        },

        dispose: function () {
            View.prototype.dispose.call(this, arguments);
        }



    });

    return ProfileView;
});
