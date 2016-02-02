/*global define*/
define([
    'chaplin',
    'controllers/base/controller',
    'views/browse-view',
    //'views/browse/browse-by-view',
    'views/browse/browseby-view',
    'rsvp',
    'globals/AuthManager'
], function (Chaplin, Controller, View, BrowseByView2, RSVP, AuthManager) {
    'use strict';

    var BrowseController = Controller.extend({


/*        beforeAction: function () {
            Controller.prototype.beforeAction.call(this, arguments);

            return this.performAccessControlChecks().then(undefined, _.bind(this.denyAccessControl, this))
        },

        performAccessControlChecks: function () {

            return new RSVP.Promise(function (fulfilled, rejected) {

                if (!AuthManager.isLogged()) {
                fulfilled();
            });
        },

        denyAccessControl: function () {
            this.authorized = false;
        },*/

        show: function (params) {

            /*            if (this.authorized === false) {
             Chaplin.utils.redirectTo({controller: 'login', action: 'show'});
             return;
             }*/

            this.view = new View({
                region: 'main',
                page: Backbone.history.fragment
            });
        },

        browseby: function (params) {
            //this.view = new BrowseByView({
            this.view = new BrowseByView2({
                region: 'main',
                filter: params.filter,
                recipientcode: params.recipientcode,
                page: Backbone.history.fragment
            });
        }

    });

    return BrowseController;
});
