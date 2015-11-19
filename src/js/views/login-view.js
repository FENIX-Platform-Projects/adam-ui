/*global define, amplify*/
define([
    'views/base/view',
    'text!templates/login/login.hbs',
    'i18n!nls/login',
    'config/Events',
    'amplify'
], function (View, template, i18nLabels, E) {

    'use strict';

    var s = {
        LOGIN_SUBMIT : "#login-submit",
        LOGIN_EMAIL : "#login-email",
        LOGIN_PASSWORD : "#login-password"
    };

    var ProtectedView = View.extend({

        // Automatically render after initialize
        autoRender: true,

        className: 'protected',

        // Save the template string in a prototype property.
        // This is overwritten with the compiled template function.
        // In the end you might want to used precompiled templates.
        template: template,

        getTemplateData: function () {
            return i18nLabels;
        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            //update State
            amplify.publish(E.STATE_CHANGE, {menu: 'login'});

            amplify.publish('fx.menu.login')

        },

        _initVariables : function () {

        },

        _bindEventListeners : function () {},

        _unbindEventListeners : function () {},


        dispose: function () {

            View.prototype.dispose.call(this, arguments);

            this._unbindEventListeners();

        }
    });

    return ProtectedView;
});