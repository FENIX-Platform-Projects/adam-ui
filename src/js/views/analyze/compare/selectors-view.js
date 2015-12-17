/*global define, amplify*/
define([
    'underscore',
    'loglevel',
    'views/base/view',
    'text!templates/analyze/compare/selectors.hbs',
    'i18n!nls/analyze',
    'config/Events',
    'config/Config',
    'config/browse/Config',
    'amplify'

], function (_, log, View, template, i18nLabels, E, GC, BC) {

    'use strict';

    var s = {

    };

    var BrowseView = View.extend({

        // Automatically render after initialize
        autoRender: true,

        className: 'analyze-compare-selectors',

        template: template,

        initialize: function (params) {

            View.prototype.initialize.call(this, arguments);
        },

        getTemplateData: function () {
            return i18nLabels;
        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            this._initVariables();

            this._initComponents();

            this._bindEventListeners();
        },

        _initVariables: function () {

        },

        _bindEventListeners: function () {

        },

        _initComponents : function (){}


    });

    return BrowseView;
});
