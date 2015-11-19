/*global define, amplify*/
define([
    'views/base/collection-view',
    'views/breadcrumb-view',
    'text!templates/breadcrumbs/breadcrumb-list.hbs',
    'models/breadcrumb-list',
    'i18n!nls/browse',
    'handlebars',
    'amplify'
], function (CollectionView, BreadcrumbView, template, BreadcrumbList, i18nLabels, Handlebars) {

    'use strict';

    var s = {
        BREADCRUMB_CONTAINER: "#breadcrumb-container"
    };

    var BreadcrumbListView = CollectionView.extend({

        // Automatically render after initialize
        autoRender: true,

        className: 'breadcrumbs',

        itemView: BreadcrumbView,

        //regions: {
          //  breadcrumb: s.BREADCRUMB_CONTAINER
       // },

        // Save the template string in a prototype property.
        // This is overwritten with the compiled template function.
        // In the end you might want to used precompiled templates.
        template: template,

        initialize: function (params) {
              CollectionView.prototype.initialize.call(this, arguments);
        },

        getTemplateData: function () {
           return i18nLabels;
         },

        attach: function () {

            CollectionView.prototype.attach.call(this, arguments);

            //update State
          //  amplify.publish(E.STATE_CHANGE, {menu: 'browse'});


        }
    });

    return BreadcrumbListView;
});
