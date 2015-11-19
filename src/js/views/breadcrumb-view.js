/*global define, amplify*/
define([
    'views/base/view',
    'text!templates/breadcrumbs/breadcrumb.hbs',
    'models/breadcrumb',
    'i18n!nls/browse',
    'handlebars',
    'amplify'
], function (View, template, Model,  i18nLabels, Handlebars) {

    'use strict';

    var BreadcrumbView = View.extend({

        model: Model,

        // Automatically render after initialize
        autoRender: true,

        template: template,

        tagName : 'li',

        initialize: function (params) {
            View.prototype.initialize.call(this, arguments);
        }


        //getTemplateData: function () {
       //   return i18nLabels;
       //  },



    });

    return BreadcrumbView;
});
