/*global define, amplify*/
define([
    'jquery',
    'views/base/view',
    'text!templates/profiles/profiles.hbs',
    'config/Events',
    'config/profiles/profiles-config',
    'config/profiles/lateral-menu-config',
    'i18n!nls/profiles',
    'i18n!nls/filter',
    'fx-common/utils',
    'lib/utils',
    'fx-filter/start',
    'config/Config',
    'handlebars',
    'amplify',
    'jstree'
], function ($, View, template, E, DashboardConfig, LateralMenuConfig, i18nLabels, i18nFilterLabels, FxUtils, Utils, Filter, BaseConfig, Handlebars) {

    'use strict';

    var s = {
        DEFAULT_PROFILE: "netherlands",
        css_classes: {
            FILTER_HOLDER: "#profiles-filter-holder",
            LATERAL_MENU: '#lateral-menu',
            CONTENT: "#content"
        },
        paths: {
            PARTNER_TEMPLATE: 'text!templates/profiles/'
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

            var self = this;

            if (!DashboardConfig || !DashboardConfig.filter) {
                alert("Impossible to find Profiles filter configuration ");
                return;
            }

            // dispose of filter
            if (this.filter && $.isFunction(this.filter.dispose)) {
                this.filter.dispose();
            }

            var filterConfig = this._getUpdatedFilterConfig(DashboardConfig.filter);

            // instantiate filter
            this.filter = new Filter({
                el: this.$el.find(s.css_classes.FILTER_HOLDER),
                environment: BaseConfig.ENVIRONMENT,
                items: filterConfig,
                common: {
                    template: {
                        hideSwitch: true,
                        hideRemoveButton: true
                    }
                }
            });

            // Filter on Change: Load the partner profile template
            this.filter.on('change', function (payload) {
                var partnerName = payload.values.labels[payload.values.values[0]];
                self._loadPartnerProfileTemplate(partnerName.toLowerCase());
            });

            // Filter on Click: Clear the selectize component
            this.filter.on('click', function (payload) {
                var filterItem = self.$el.find("[data-selector="+payload.id+"]")[0];
                var selectize = $(filterItem).find("[data-role=dropdown]")[0].selectize;
                selectize.clear(true);

            });

            //Build lateral menu
            this.$lateralMenu = this.$el.find(s.css_classes.LATERAL_MENU);
            this.$lateralMenu.jstree(Utils.setI18nToJsTreeConfig(LateralMenuConfig, i18nLabels));

            // Menu Item on Click: Go to Anchor
            this.$lateralMenu.on("select_node.jstree", _.bind(function (e, data) {
                   self._goToAnchor(data.selected[0]);
            }, this));


            this._loadPartnerProfileTemplate(s.DEFAULT_PROFILE);
        },

        _goToAnchor: function (id) {
            $('html, body').animate({
                scrollTop: $('#'+id+'_section').offset().top - 100 + 'px'
            }, 1000);
            return this;
        },



        _loadPartnerProfileTemplate: function (item) {
            var self = this;

            require([s.paths.PARTNER_TEMPLATE + item+'.hbs'], function(PartnerTemplate){
               self._showProfile(PartnerTemplate)
            }, function (err) {
               self._showProfile(null)
            });
        },

        _showProfile: function (PartnerTemplate) {
            if(PartnerTemplate) {

            var temp = Handlebars.compile(PartnerTemplate);

            $(this.el).find(s.css_classes.CONTENT).html(temp);
            } else {
                $(this.el).find(s.css_classes.CONTENT).html('<span>'+i18nLabels.not_available+'</span>');
            }
        },

        _getUpdatedFilterConfig: function (config) {

            var conf = $.extend(true, {}, config),
                values = {},
                updatedConf = FxUtils.mergeConfigurations(conf, values);

            _.each(updatedConf, _.bind(function (obj, key) {

                if (!obj.template) {
                    obj.template = {};
                }
                //Add i18n label
                obj.template.title = Utils.getI18nLabel(key, i18nFilterLabels, "filter_");
                obj.template.headerIconTooltip = Utils.getI18nLabel(key, i18nFilterLabels, "filter_tooltip_");

            }, this));

            return updatedConf;
        },


        dispose: function () {
            if (this.$lateralMenu && this.$lateralMenu.length > 0) {
                this.$lateralMenu.jstree(true).destroy();
            }

            View.prototype.dispose.call(this, arguments);
        }

    });

    return ProfileView;
});
