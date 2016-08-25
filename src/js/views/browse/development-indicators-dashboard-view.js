/*global define, amplify*/
define([
    'jquery',
    'underscore',
    'views/base/view',
    'text!templates/browse/indicators-dashboard.hbs',
    'config/browse/config-browse',
    'fx-dashboard/start',
    'lib/utils',
    'i18n!nls/browse',
    'handlebars',
    'lib/config-utils',
    'amplify'
], function ($, _, View, template, BaseDashboardProperties, Dashboard, Utils, i18nLabels, Handlebars, ConfigUtils) {

    'use strict';

    var s = {
        css_classes: {
            INDICATORS_DASHBOARD_BROWSE_CONTAINER: '#dashboard-indicators-container'
        }
    };

    var DashboardDevelopmentIndicatorsView = View.extend({

        // Automatically render after initialize
        autoRender: false,

        className: 'dashboard-indicators',

        // Save the template string in a prototype property.
        // This is overwritten with the compiled template function.
        // In the end you might want to used precompiled templates.
        template: template,

        events: {
            'click .anchor': 'anchor'
        },

        initialize: function (params) {
            this.topic = params.topic;
            this.model.on("change", this.render, this);

            this.source = $(this.template).find("[data-topic='" + this.topic + "']").prop('outerHTML');
            View.prototype.initialize.call(this, arguments);

        },

        getTemplateData: function () {
            return i18nLabels;
        },

       anchor: function(e) {
           e.preventDefault();
           e.stopPropagation();

          var nameLink = e.currentTarget.name;

          $('html, body').animate({
           scrollTop: $('#'+nameLink).offset().top
          }, 1000);

       },

        render: function () {
            this.setElement(this.container);

            $(this.el).hide();

            $(this.el).html(this.getTemplateFunction());
        },

        attach: function () {
            View.prototype.attach.call(this, arguments);

            this.configUtils = new ConfigUtils();
        },

        getTemplateFunction: function() {
            this.compiledTemplate = Handlebars.compile(this.source);

            var model = this.model.toJSON();
            var data = $.extend(true, model, i18nLabels);


            return this.compiledTemplate(data);
        },

        setDashboardConfig: function(config){
            this.config = config;
            this.config.baseItems = config.items;
            this.config.environment = BaseDashboardProperties.dashboard.ENVIRONMENT;
        },

        renderDashboard: function () {

            this.config.el = this.$el;
            this.config.items[0].topic = this.topic;

            this.config.itemsRegistry =  {
                custom: {
                    path: 'views/browse/development-indicators-item'
                }
            };

            this.dashboard = new Dashboard(this.config);

            this.dashboard.on('indicators_ready', function (payload) {

                 if(payload.data.size > 0){
                    $(this.el).show();
                }

           });

        },

        rebuildDashboard: function (filter) {

            if (this.dashboard && $.isFunction(this.dashboard.refresh)) {
                //console.log("REFRESH");
                this.dashboard.refresh(filter);
            }
        },

        _disposeDashboards : function () {
          if (this.dashboard && $.isFunction(this.dashboard.dispose)) {
               this.dashboard.dispose();
          }
        },

        dispose: function () {

            this._disposeDashboards();

            View.prototype.dispose.call(this, arguments);
        }

    });

    return DashboardDevelopmentIndicatorsView;
});
