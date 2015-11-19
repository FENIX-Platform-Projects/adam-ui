/*global define*/
define([
    'chaplin',
    'underscore',
    'config/Events',
    'controllers/base/controller',
    'views/login-view',
    'globals/AuthManager',
    'rsvp'
], function (Chaplin, _, E, Controller, View, AuthManager, RSVP) {
    'use strict';

    var ProtectedController = Controller.extend({

        beforeAction: function () {
            Controller.prototype.beforeAction.call(this, arguments);

            return this.performAccessControlChecks().then(_.bind(this.allowAccessControl, this), _.bind(this.denyAccessControl, this))
        },

        performAccessControlChecks: function () {

            return new RSVP.Promise(function (fulfilled, rejected) {

                if (!AuthManager.isLogged()) {
                    rejected();
                    return;
                }
                fulfilled();
            });
        },

        allowAccessControl: function () {
            this.authorized = true;
        },


        denyAccessControl: function () {
            this.authorized = false;
        },

        show: function (params) {

            if (this.authorized === true) {
                Chaplin.utils.redirectTo({controller: 'browse', action: 'show'});
                return;
            }

            this.view = new View({
                region: 'main'
            });
        }
    });

    return ProtectedController;
});
